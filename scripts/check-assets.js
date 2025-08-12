const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAssets() {
  console.log('🔍 Checking assets in database...\n');
  
  // Get all assets
  const { data: allAssets, error: allError } = await supabase
    .from('assets')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (allError) {
    console.error('Error fetching all assets:', allError);
    return;
  }
  
  console.log(`📊 Total assets in database: ${allAssets?.length || 0}`);
  
  if (allAssets && allAssets.length > 0) {
    console.log('\nAsset details:');
    allAssets.forEach(asset => {
      console.log(`\n- ${asset.title}`);
      console.log(`  ID: ${asset.id}`);
      console.log(`  Status: ${asset.status || 'NO STATUS'}`);
      console.log(`  Platform: ${asset.platform}`);
      console.log(`  File URL: ${asset.file_url?.substring(0, 50)}...`);
      console.log(`  Preview URL: ${asset.preview_url?.substring(0, 50)}...`);
      console.log(`  Created: ${asset.created_at}`);
    });
  }
  
  // Get approved assets specifically
  console.log('\n\n📊 Checking approved assets...');
  const { data: approvedAssets, error: approvedError } = await supabase
    .from('assets')
    .select('*')
    .eq('status', 'approved');
  
  if (approvedError) {
    console.error('Error fetching approved assets:', approvedError);
  } else {
    console.log(`✅ Approved assets: ${approvedAssets?.length || 0}`);
  }
  
  // Test the exact query the home page uses
  console.log('\n\n📊 Testing home page query...');
  const { data: homeAssets, error: homeError } = await supabase
    .from('assets')
    .select(`
      *,
      creator:profiles!creator_id(*)
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(100);
  
  if (homeError) {
    console.error('❌ Home page query error:', homeError);
  } else {
    console.log(`✅ Home page would show: ${homeAssets?.length || 0} assets`);
    if (homeAssets && homeAssets.length > 0) {
      console.log('First asset:', {
        title: homeAssets[0].title,
        status: homeAssets[0].status,
        hasCreator: !!homeAssets[0].creator
      });
    }
  }
  
  // Check if profiles exist for creators
  console.log('\n\n📊 Checking creator profiles...');
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*');
  
  console.log(`Profiles in database: ${profiles?.length || 0}`);
  if (profiles && profiles.length > 0) {
    profiles.forEach(profile => {
      console.log(`- ${profile.username || profile.email} (ID: ${profile.id})`);
    });
  }
}

checkAssets().then(() => {
  console.log('\n✨ Check complete!');
  process.exit(0);
});
