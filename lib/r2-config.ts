import { S3Client } from '@aws-sdk/client-s3';

// Cloudflare R2 configuration
export const R2_CONFIG = {
  accountId: process.env.NEXT_PUBLIC_R2_ACCOUNT_ID!,
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  bucketName: process.env.NEXT_PUBLIC_R2_BUCKET_NAME || 'ViralPik-assets',
  publicUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL!, // Your R2 public URL
};

// Create S3 client configured for R2
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_CONFIG.accessKeyId,
    secretAccessKey: R2_CONFIG.secretAccessKey,
  },
});

// Helper to generate public URL for an asset
export const getR2PublicUrl = (key: string) => {
  // If using custom domain
  if (R2_CONFIG.publicUrl) {
    return `${R2_CONFIG.publicUrl}/${key}`;
  }
  // Otherwise use R2 dev URL (update with your actual R2 URL)
  return `https://pub-${R2_CONFIG.accountId}.r2.dev/${key}`;
};

// Helper to generate a unique key for uploads
export const generateAssetKey = (userId: string, filename: string) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = filename.split('.').pop();
  return `assets/${userId}/${timestamp}-${randomString}.${extension}`;
};

// Helper to generate thumbnail key
export const generateThumbnailKey = (assetKey: string) => {
  return assetKey.replace('assets/', 'thumbnails/').replace(/\.[^/.]+$/, '-thumb.jpg');
};
