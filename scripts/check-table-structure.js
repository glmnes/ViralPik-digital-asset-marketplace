const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableStructure() {
  console.log('🔍 Checking assets table structure...\n');
  
  try {
    // Get one row to see what columns exist
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('Error fetching from assets table:', error.message);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('✅ Assets table columns:');
      Object.keys(data[0]).forEach(col => {
        console.log(`  - ${col}: ${typeof data[0][col]}`);
      });
    } else {
      // Try to insert a test row to understand the structure
      console.log('No data in assets table. Attempting to understand structure...');
      
      const testAsset = {
        title: 'Test Asset',
        preview_url: 'https://example.com/preview.jpg',
        file_url: 'https://example.com/file.zip',
        format: 'PNG',
        platform: 'youtube',
        asset_type: 'thumbnails',
        tags: ['test'],
        download_count: 0,
        view_count: 0
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('assets')
        .insert([testAsset])
        .select();
      
      if (insertError) {
        console.log('❌ Insert error (this reveals what columns are missing):', insertError.message);
        console.log('\nThe app expects these columns that might be missing:');
        console.log('  - status (for approval workflow)');
        console.log('  - creator_id (for linking to profiles)');
        console.log('  - description');
        console.log('  - like_count');
        console.log('  - rejection_reason');
      } else {
        console.log('✅ Successfully inserted test asset');
        if (insertData && insertData.length > 0) {
          console.log('\nActual columns in assets table:');
          Object.keys(insertData[0]).forEach(col => {
            console.log(`  - ${col}`);
          });
          
          // Clean up test data
          await supabase.from('assets').delete().eq('id', insertData[0].id);
        }
      }
    }
    
    // Check profiles table structure too
    console.log('\n🔍 Checking profiles table structure...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profileError) {
      console.log('Error fetching from profiles table:', profileError.message);
    } else if (profileData && profileData.length > 0) {
      console.log('✅ Profiles table columns:');
      Object.keys(profileData[0]).forEach(col => {
        console.log(`  - ${col}`);
      });
    } else {
      console.log('Profiles table exists but is empty');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkTableStructure().then(() => {
  console.log('\n✨ Structure check complete!');
  process.exit(0);
});
