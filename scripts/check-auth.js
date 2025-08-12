// Test script to check Supabase auth configuration
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Using service role for admin access
);

async function checkAuthSettings() {
  console.log('Checking Supabase Auth Settings...\n');
  
  // Test creating a user
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'testPassword123!';
  
  console.log('Testing user creation...');
  const { data, error } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true, // Auto-confirm email
    user_metadata: {
      username: 'testuser'
    }
  });

  if (error) {
    console.error('Error creating test user:', error);
  } else {
    console.log('✓ Test user created successfully:', data.user?.email);
    
    // Clean up - delete test user
    if (data.user) {
      const { error: deleteError } = await supabase.auth.admin.deleteUser(data.user.id);
      if (deleteError) {
        console.error('Error deleting test user:', deleteError);
      } else {
        console.log('✓ Test user cleaned up');
      }
    }
  }

  console.log('\n=== IMPORTANT ===');
  console.log('To disable email confirmation in Supabase:');
  console.log('1. Go to your Supabase dashboard');
  console.log('2. Navigate to Authentication > Settings');
  console.log('3. Under "Email Auth", disable "Enable email confirmations"');
  console.log('4. Save changes');
  console.log('\nThis will allow users to sign in immediately after registration.');
}

checkAuthSettings().catch(console.error);
