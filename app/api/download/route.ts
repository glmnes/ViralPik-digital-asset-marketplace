import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { assetId, isPackage = false, packageId = null } = await req.json();
    
    if (!assetId) {
      return NextResponse.json({ error: 'Asset ID required' }, { status: 400 });
    }

    // Get user's profile with subscription tier
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    // If it's a package download, check if user owns it or it's free
    if (isPackage && packageId) {
      const { data: collection } = await supabase
        .from('collections')
        .select('price, creator_id')
        .eq('id', packageId)
        .single();

      if (collection?.price && collection.price > 0 && collection.creator_id !== user.id) {
        // Check if user has purchased this package
        // (You'll need to implement purchase tracking)
        return NextResponse.json({ 
          error: 'Package purchase required',
          price: collection.price 
        }, { status: 402 });
      }
    }

    // Check download limits for non-package downloads
    if (!isPackage) {
      const { data: canDownload } = await supabase
        .rpc('can_user_download', { p_user_id: user.id });

      if (!canDownload) {
        // Get user's current count and limit
        const { data: dailyCount } = await supabase
          .rpc('get_daily_download_count', { p_user_id: user.id });

        const limits: Record<string, number> = {
          free: 1,
          pro: 10,
          premium: 30
        };

        const userLimit = limits[profile?.subscription_tier || 'free'];

        return NextResponse.json({
          error: 'Download limit reached',
          dailyCount,
          limit: userLimit,
          tier: profile?.subscription_tier || 'free',
          message: `You've reached your daily limit of ${userLimit} downloads. Upgrade to increase your limit.`
        }, { status: 429 });
      }
    }

    // Record the download
    const { data: recorded } = await supabase
      .rpc('record_download', {
        p_user_id: user.id,
        p_asset_id: assetId,
        p_is_package: isPackage,
        p_package_id: packageId
      });

    if (!recorded) {
      return NextResponse.json({ 
        error: 'Failed to record download' 
      }, { status: 500 });
    }

    // Get the asset's download URL
    const { data: asset } = await supabase
      .from('assets')
      .select('file_url, title, downloads')
      .eq('id', assetId)
      .single();

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    // Get remaining downloads for the day
    const { data: newCount } = await supabase
      .rpc('get_daily_download_count', { p_user_id: user.id });

    const limits: Record<string, number> = {
      free: 1,
      pro: 10,
      premium: 30
    };

    const userLimit = limits[profile?.subscription_tier || 'free'];
    const remaining = userLimit - (newCount || 0);

    // Update asset download count
    await supabase
      .from('assets')
      .update({ downloads: asset.downloads + 1 })
      .eq('id', assetId);

    return NextResponse.json({
      success: true,
      downloadUrl: asset.file_url,
      assetTitle: asset.title,
      remaining,
      limit: userLimit,
      tier: profile?.subscription_tier || 'free'
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ 
      error: 'Download failed',
      details: (error as Error).message 
    }, { status: 500 });
  }
}

// GET endpoint to check download status
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get user's profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    // Get daily download count
    const { data: dailyCount } = await supabase
      .rpc('get_daily_download_count', { p_user_id: user.id });

    const limits: Record<string, number> = {
      free: 1,
      pro: 10,
      premium: 30
    };

    const userLimit = limits[profile?.subscription_tier || 'free'];
    const remaining = userLimit - (dailyCount || 0);

    return NextResponse.json({
      tier: profile?.subscription_tier || 'free',
      dailyCount: dailyCount || 0,
      limit: userLimit,
      remaining,
      canDownload: remaining > 0
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ 
      error: 'Failed to check status' 
    }, { status: 500 });
  }
}
