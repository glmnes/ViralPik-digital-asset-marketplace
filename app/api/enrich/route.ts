import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { embedImage, nsfwScore, captionImage, getWorkersAIConfig } from '@/lib/ai/workers';

// Minimal enrichment endpoint (safe no-op if CF not configured)
// POST body: { assetId: string, imageUrl?: string }
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const { assetId, imageUrl } = await req.json();
    if (!assetId) return NextResponse.json({ error: 'assetId required' }, { status: 400 });

    // Load asset to get image URL if not provided
    let assetUrl = imageUrl as string | undefined;
    if (!assetUrl) {
      const { data: asset, error } = await supabase
        .from('assets')
        .select('id, preview_url')
        .eq('id', assetId)
        .single();
      if (error || !asset) return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
      assetUrl = asset.preview_url;
    }

    // If Workers AI not configured, exit gracefully
    const hasAI = !!getWorkersAIConfig();
    if (!hasAI) {
      return NextResponse.json({ ok: true, message: 'AI not configured; enrichment skipped.' });
    }

    // Debug: log the URL we're trying to process
    console.log('[Enrich] Processing image URL:', assetUrl);
    
    // Run lightweight tasks
    const [embedding, score, caption] = await Promise.all([
      embedImage(assetUrl!),
      nsfwScore(assetUrl!),
      captionImage(assetUrl!),
    ]);

    // Persist minimal fields if columns exist. Use best-effort update.
    await supabase
      .from('assets')
      .update({
        // @ts-ignore – columns may not exist yet; best-effort
        embedding: embedding || null,
        // @ts-ignore
        nsfw_score: typeof score === 'number' ? score : null,
        // Only set description if empty
      })
      .eq('id', assetId);

    if (caption) {
      // Only update description if it is empty
      try {
        await supabase.rpc('set_description_if_empty', { p_asset_id: assetId, p_text: caption });
      } catch (error) {
        // Ignore errors for missing RPC function
        console.log('RPC function not available or failed:', error);
      }
    }

    return NextResponse.json({ ok: true, embedding: !!embedding, nsfw_scored: typeof score === 'number', captioned: !!caption });
  } catch (e) {
    return NextResponse.json({ error: 'enrichment_failed', details: (e as Error).message }, { status: 500 });
  }
}
