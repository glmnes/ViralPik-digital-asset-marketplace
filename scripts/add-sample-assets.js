// Script to add sample assets to your database for testing
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addSampleAssets() {
  console.log('Adding sample assets...\n');

  // Get the first user to use as creator
  const { data: users, error: userError } = await supabase
    .from('profiles')
    .select('id, username')
    .limit(1);

  if (userError || !users || users.length === 0) {
    console.error('No users found. Please create a user first.');
    return;
  }

  const creatorId = users[0].id;
  console.log(`Using ${users[0].username} as creator\n`);

  // Sample assets data
  const sampleAssets = [
    {
      title: 'Viral TikTok Dance Template',
      description: 'High-energy dance video template that went viral with 10M+ views',
      category: 'video',
      tags: ['tiktok', 'dance', 'viral', 'template'],
      creator_id: creatorId,
      file_url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800',
      thumbnail_url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400',
      file_size: 5242880,
      file_type: 'video',
      platform: 'tiktok',
      price: 0,
      is_free: true,
      is_approved: true,
      download_count: 1543,
      view_count: 8923,
      like_count: 892
    },
    {
      title: 'Instagram Reel Transitions Pack',
      description: '25 smooth transitions for Instagram Reels that boost engagement',
      category: 'video',
      tags: ['instagram', 'reels', 'transitions', 'effects'],
      creator_id: creatorId,
      file_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
      thumbnail_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',
      file_size: 10485760,
      file_type: 'video',
      platform: 'instagram',
      price: 0,
      is_free: true,
      is_approved: true,
      download_count: 2341,
      view_count: 12453,
      like_count: 1823
    },
    {
      title: 'Viral Meme Template Collection',
      description: 'Top 50 meme templates that are trending right now',
      category: 'image',
      tags: ['meme', 'template', 'funny', 'viral'],
      creator_id: creatorId,
      file_url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800',
      thumbnail_url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400',
      file_size: 2097152,
      file_type: 'image',
      platform: 'twitter',
      price: 0,
      is_free: true,
      is_approved: true,
      download_count: 5632,
      view_count: 28934,
      like_count: 3421
    },
    {
      title: 'YouTube Shorts Sound Effects Pack',
      description: 'Professional sound effects optimized for YouTube Shorts',
      category: 'audio',
      tags: ['youtube', 'shorts', 'sfx', 'audio'],
      creator_id: creatorId,
      file_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      thumbnail_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
      file_size: 3145728,
      file_type: 'audio',
      platform: 'youtube',
      price: 0,
      is_free: true,
      is_approved: true,
      download_count: 892,
      view_count: 4521,
      like_count: 423
    },
    {
      title: 'Aesthetic Instagram Story Templates',
      description: 'Minimalist story templates with pastel colors',
      category: 'template',
      tags: ['instagram', 'stories', 'aesthetic', 'pastel'],
      creator_id: creatorId,
      file_url: 'https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=800',
      thumbnail_url: 'https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=400',
      file_size: 1572864,
      file_type: 'image',
      platform: 'instagram',
      price: 0,
      is_free: true,
      is_approved: true,
      download_count: 3421,
      view_count: 15234,
      like_count: 2134
    },
    {
      title: 'TikTok Green Screen Effects',
      description: 'Creative green screen backgrounds for TikTok videos',
      category: 'effect',
      tags: ['tiktok', 'greenscreen', 'effects', 'background'],
      creator_id: creatorId,
      file_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
      thumbnail_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400',
      file_size: 4194304,
      file_type: 'video',
      platform: 'tiktok',
      price: 0,
      is_free: true,
      is_approved: true,
      download_count: 1823,
      view_count: 9234,
      like_count: 923
    }
  ];

  // Insert sample assets
  const { data, error } = await supabase
    .from('assets')
    .insert(sampleAssets)
    .select();

  if (error) {
    console.error('Error adding assets:', error);
  } else {
    console.log(`✅ Successfully added ${data.length} sample assets!`);
    console.log('\nYou can now:');
    console.log('- View them on the homepage');
    console.log('- Click on them to see details');
    console.log('- Test the download functionality');
    console.log('- Search and filter them');
  }
}

addSampleAssets().catch(console.error);
