import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bvbedxnrfopbvhzozxvv.supabase.co';
const supabaseKey = 'sb_publishable_v4LJqBkMnY6YJH64av5xYw_P9y5Oyl2';
const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@fampam.de',
    password: 'Leductoan123!',
  });

  if (error) {
    console.error('Error creating admin:', error.message);
  } else {
    console.log('Successfully created admin:', data.user?.email);
  }
}

createAdmin();
