const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function approveAssets() {
  console.log('🔍 Approving pending assets...\n');
  
  // Approve all pending assets
  const { data, error } = await supabase
    .from('assets')
    .update({ status: 'approved' })
    .eq('status', 'pending')
    .select();
  
  if (error) {
    console.error('Error approving assets:', error);
  } else {
    console.log(`✅ Approved ${data?.length || 0} assets`);
    if (data && data.length > 0) {
      data.forEach(asset => {
        console.log(`  - ${asset.title}`);
      });
    }
  }
  
  // Check total approved assets
  const { data: approved, error: countError } = await supabase
    .from('assets')
    .select('*')
    .eq('status', 'approved');
  
  console.log(`\n📊 Total approved assets now: ${approved?.length || 0}`);
}

approveAssets().then(() => {
  console.log('\n✨ Done!');
  process.exit(0);
});
