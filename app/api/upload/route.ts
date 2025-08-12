import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createClient } from '@/lib/supabaseServer';
import { r2Client, R2_CONFIG, generateAssetKey, generateThumbnailKey, getR2PublicUrl } from '@/lib/r2-config';

// Configure max file size (50MB for assets)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Allowed file types
const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  document: ['application/pdf', 'application/zip'],
  design: ['application/vnd.adobe.photoshop', 'application/octet-stream'], // PSD files and fallback
};

// Get presigned URL for direct upload from client
export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called');
    console.log('R2 Config:', {
      hasAccountId: !!process.env.NEXT_PUBLIC_R2_ACCOUNT_ID,
      hasAccessKey: !!process.env.R2_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.R2_SECRET_ACCESS_KEY,
      hasBucket: !!process.env.NEXT_PUBLIC_R2_BUCKET_NAME,
      hasPublicUrl: !!process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
    });
    console.log('Cookies:', request.cookies.getAll().map(c => c.name));
    
    const supabase = await createClient();
    
    // First check session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Session check:', { 
      hasSession: !!session, 
      sessionError: sessionError?.message,
      userId: session?.user?.id 
    });
    
    // Then check user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('User check:', { 
      hasUser: !!user, 
      userId: user?.id, 
      error: authError?.message 
    });
    
    if (authError || !user) {
      console.error('Auth failed - Details:', {
        authError: authError?.message,
        hasUser: !!user,
        cookies: request.cookies.getAll().length
      });
      return NextResponse.json({ 
        error: 'Unauthorized - No user session found',
        details: {
          hasSession: !!session,
          hasCookies: request.cookies.getAll().length > 0,
          sessionError: sessionError?.message,
          authError: authError?.message
        }
      }, { status: 401 });
    }

    const body = await request.json();
    const { filename, contentType, fileSize } = body;
    
    console.log('Upload request:', { filename, contentType, fileSize });

    // Validate input - contentType can be empty string for unrecognized files
    if (!filename || !fileSize) {
      console.error('Missing required fields:', { filename, fileSize });
      return NextResponse.json({ 
        error: 'Missing required fields',
        details: { filename: !!filename, fileSize: !!fileSize }
      }, { status: 400 });
    }
    
    // Use a fallback content type if not provided
    const finalContentType = contentType || 'application/octet-stream';
    
    // Validate file size
    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `File too large. Max size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        details: { fileSize, maxSize: MAX_FILE_SIZE }
      }, { status: 400 });
    }

    // Validate content type
    const isAllowed = Object.values(ALLOWED_TYPES).flat().includes(finalContentType);
    if (!isAllowed) {
      console.error('File type not allowed:', finalContentType);
      return NextResponse.json({ 
        error: 'File type not allowed',
        details: { 
          contentType: finalContentType,
          allowedTypes: Object.values(ALLOWED_TYPES).flat()
        }
      }, { status: 400 });
    }

    // Generate unique keys for asset and thumbnail
    const assetKey = generateAssetKey(user.id, filename);
    const thumbnailKey = generateThumbnailKey(assetKey);

    // Create presigned URL for upload
    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: assetKey,
      ContentType: finalContentType,
    });

    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 }); // 1 hour expiry

    // Return URLs
    return NextResponse.json({
      uploadUrl,
      assetKey,
      thumbnailKey,
      assetUrl: getR2PublicUrl(assetKey),
      thumbnailUrl: getR2PublicUrl(thumbnailKey),
    });

  } catch (error) {
    console.error('Upload API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json({ 
      error: 'Upload failed',
      details: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
    }, { status: 500 });
  }
}

// Delete asset from R2
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { assetKey, thumbnailKey } = await request.json();

    // Verify user owns this asset
    const { data: asset } = await supabase
      .from('assets')
      .select('creator_id')
      .eq('file_url', getR2PublicUrl(assetKey))
      .single();

    if (!asset || asset.creator_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete from R2
    const deleteAsset = new DeleteObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: assetKey,
    });

    const deleteThumbnail = new DeleteObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: thumbnailKey,
    });

    await Promise.all([
      r2Client.send(deleteAsset),
      thumbnailKey ? r2Client.send(deleteThumbnail) : Promise.resolve(),
    ]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
