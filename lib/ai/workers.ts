// Cloudflare Workers AI helper (scaffold)
// Reads configuration from env; callers should handle absence of creds gracefully.

export interface WorkersAIConfig {
  accountId: string;
  apiToken: string;
  baseUrl?: string; // optional override
}

export function getWorkersAIConfig(): WorkersAIConfig | null {
  const accountId = process.env.NEXT_PUBLIC_CF_ACCOUNT_ID || process.env.CF_ACCOUNT_ID;
  const apiToken = process.env.CF_WORKERS_AI_TOKEN || process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) return null;
  return { accountId, apiToken };
}

// Helper to fetch image and convert to base64 data URI
async function imageUrlToBase64(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = response.headers.get('content-type') || 'image/jpeg';
    // Cloudflare expects data URI format
    return `data:${mimeType};base64,${base64}`;
  } catch (e) {
    console.error('[imageUrlToBase64] Failed to fetch/convert:', e);
    throw e;
  }
}

async function cfFetch(path: string, body: any) {
  const cfg = getWorkersAIConfig();
  if (!cfg) throw new Error('Cloudflare Workers AI not configured');
  const url = cfg.baseUrl || `https://api.cloudflare.com/client/v4/accounts/${cfg.accountId}/ai/run/${path}`;
  console.log('[Workers AI] Calling:', url.substring(0, 100) + '...');
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${cfg.apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`[Workers AI] Error ${res.status}:`, text);
    throw new Error(`Workers AI error ${res.status}: ${text}`);
  }
  const data = await res.json();
  console.log('[Workers AI] Response:', JSON.stringify(data).substring(0, 200) + '...');
  return data;
}

// Image embeddings via CLIP-like model
export async function embedImage(imageUrl: string): Promise<number[] | null> {
  try {
    const base64DataUri = await imageUrlToBase64(imageUrl);
    const out = await cfFetch('@cf/unum/uform-gen2-qwen-500m', { image: base64DataUri });
    // Extract embedding from response
    return out?.result?.vector || out?.result?.data?.[0] || null;
  } catch (e) {
    console.error('[embedImage] Failed:', e);
    return null;
  }
}

// Basic NSFW score - using image classification model
export async function nsfwScore(imageUrl: string): Promise<number | null> {
  try {
    const base64DataUri = await imageUrlToBase64(imageUrl);
    const out = await cfFetch('@cf/microsoft/resnet-50', { image: base64DataUri });
    // Get classification results
    const items = out?.result || [];
    if (Array.isArray(items) && items.length > 0) {
      // Check for NSFW-related labels in top results
      const nsfwKeywords = ['bikini', 'swimsuit', 'lingerie', 'nude', 'explicit'];
      for (const item of items.slice(0, 5)) {
        const label = (item.label || '').toLowerCase();
        if (nsfwKeywords.some(keyword => label.includes(keyword))) {
          return item.score || 0.8;
        }
      }
    }
    return 0.1; // Default low score
  } catch (e) {
    console.error('[nsfwScore] Failed:', e);
    return null;
  }
}

// Captioning (image-to-text)
export async function captionImage(imageUrl: string): Promise<string | null> {
  try {
    const base64DataUri = await imageUrlToBase64(imageUrl);
    const out = await cfFetch('@cf/llava-hf/llava-1.5-7b-hf', { 
      image: base64DataUri,
      prompt: 'What is in this image? Describe it briefly.',
      max_tokens: 100
    });
    return out?.result?.response || out?.result?.description || null;
  } catch (e) {
    console.error('[captionImage] Failed:', e);
    return null;
  }
}
