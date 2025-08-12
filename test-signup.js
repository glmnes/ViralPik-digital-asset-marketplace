const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key exists:', !!supabaseAnonKey);
console.log('Supabase Service Key exists:', !!supabaseServiceKey);

// Try with service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testSignup() {
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  
  console.log('\nTesting signup with:', testEmail);
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          username: `testuser${Date.now()}`
        }
      }
    });
    
    if (error) {
      console.error('Signup error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
    } else {
      console.log('Signup successful!');
      console.log('User:', data.user?.id);
      console.log('Session:', !!data.session);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testSignup();
