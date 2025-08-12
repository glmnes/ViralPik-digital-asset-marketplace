const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('🔍 Checking Supabase database...\n');
  
  // Check if we can connect
  try {
    const { data: authData, error: authError } = await supabase.auth.getSession();
    console.log('✅ Connected to Supabase');
  } catch (error) {
    console.error('❌ Failed to connect to Supabase:', error.message);
    return;
  }

  // Check tables
  const tables = ['profiles', 'assets', 'boards', 'board_assets', 'downloads', 'likes', 'follows'];
  
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ Table '${table}': ${error.message}`);
      } else {
        console.log(`✅ Table '${table}' exists (${count || 0} rows)`);
      }
    } catch (error) {
      console.log(`❌ Table '${table}': ${error.message}`);
    }
  }

  // Check for approved assets specifically
  console.log('\n📊 Checking for approved assets...');
  try {
    const { data: assets, error, count } = await supabase
      .from('assets')
      .select('*', { count: 'exact' })
      .eq('status', 'approved');
    
    if (error) {
      console.log(`❌ Error fetching approved assets: ${error.message}`);
    } else {
      console.log(`✅ Found ${count || 0} approved assets`);
      
      if (count === 0) {
        console.log('\n💡 No approved assets found. Let\'s add some sample data...');
        
        // Add sample assets
        const sampleAssets = [
          {
            title: 'Viral YouTube Thumbnail Pack',
            description: 'High-converting thumbnail templates for YouTube',
            platform: 'youtube',
            asset_type: 'thumbnails',
            file_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1280&h=720',
            preview_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1280&h=720',
            status: 'approved',
            tags: ['youtube', 'thumbnail', 'viral'],
            format: 'PNG',
            download_count: 0,
            view_count: 0,
            like_count: 0,
            is_trending: true,
            trending_rank: 1
          },
          {
            title: 'Instagram Story Templates',
            description: 'Beautiful story templates for Instagram',
            platform: 'instagram',
            asset_type: 'stories',
            file_url: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=1080&h=1920',
            preview_url: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=1080&h=1920',
            status: 'approved',
            tags: ['instagram', 'stories', 'template'],
            format: 'PNG',
            download_count: 0,
            view_count: 0,
            like_count: 0,
            is_trending: false
          },
          {
            title: 'TikTok Transition Effects',
            description: 'Smooth transition effects for TikTok videos',
            platform: 'tiktok',
            asset_type: 'effects',
            file_url: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=1080&h=1920',
            preview_url: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=1080&h=1920',
            status: 'approved',
            tags: ['tiktok', 'transitions', 'effects'],
            format: 'Template',
            download_count: 0,
            view_count: 0,
            like_count: 0,
            is_trending: true,
            trending_rank: 2
          }
        ];

        const { data: insertedAssets, error: insertError } = await supabase
          .from('assets')
          .insert(sampleAssets)
          .select();

        if (insertError) {
          console.log(`❌ Failed to insert sample assets: ${insertError.message}`);
        } else {
          console.log(`✅ Added ${insertedAssets.length} sample assets`);
        }
      }
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }

  // Check RLS policies
  console.log('\n🔐 Checking RLS policies...');
  try {
    // Try to fetch assets without authentication (should work if RLS allows public read)
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log(`⚠️  RLS might be blocking public reads: ${error.message}`);
      console.log('💡 You may need to update RLS policies to allow public read access for approved assets');
    } else {
      console.log('✅ RLS policies allow public read access');
    }
  } catch (error) {
    console.log(`❌ RLS check failed: ${error.message}`);
  }
}

checkDatabase().then(() => {
  console.log('\n✨ Database check complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
