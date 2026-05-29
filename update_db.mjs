import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bvbedxnrfopbvhzozxvv.supabase.co';
const supabaseKey = 'sb_publishable_v4LJqBkMnY6YJH64av5xYw_P9y5Oyl2';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: auth, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@fampam.de',
    password: 'Leductoan123!',
  });

  if (authError) {
    console.error('Auth error:', authError);
    return;
  }

  // Update existing collections labels
  await supabase.from('collections').update({ label: 'APPETIZERS', sort_order: 2 }).eq('key', 'khai_vi');
  await supabase.from('collections').update({ label: 'MAIN DISH', sort_order: 3 }).eq('key', 'mon_chinh');
  await supabase.from('collections').update({ label: 'DRINK', sort_order: 5 }).eq('key', 'libations');

  // Insert new collections: soup (sort 1), fampam_specialty (sort 4)
  const { data: cols } = await supabase.from('collections').upsert([
    { key: 'soup', label: 'SOUP', subtitle: 'warm bowls', sort_order: 1 },
    { key: 'fampam_specialty', label: 'FAMPAM SPECIALTY', subtitle: 'house signatures', sort_order: 4 }
  ]).select();

  const soupCol = cols.find(c => c.key === 'soup');
  const fampamCol = cols.find(c => c.key === 'fampam_specialty');

  // Add 6 placeholders for each new category
  const placeholders = [];
  for (let i = 1; i <= 6; i++) {
    placeholders.push({
      collection_id: soupCol.id,
      code: `S0${i}`,
      name: `Soup Placeholder ${i}`,
      description: 'A delicious placeholder soup.',
      price_cents: 900 + i * 100,
      dietary: [],
      tags: [],
      spice_level: 0,
      seasonal: false,
      shared_grill: false,
      raw_warning: false,
      is_published: true,
      sort_order: i
    });
    placeholders.push({
      collection_id: fampamCol.id,
      code: `F0${i}`,
      name: `Specialty Placeholder ${i}`,
      description: 'A delicious placeholder specialty.',
      price_cents: 1900 + i * 100,
      dietary: [],
      tags: [],
      spice_level: 0,
      seasonal: false,
      shared_grill: false,
      raw_warning: false,
      is_published: true,
      sort_order: i
    });
  }

  const { error: insertError } = await supabase.from('dishes').upsert(placeholders);
  if (insertError) {
    console.error('Insert error:', insertError);
  } else {
    console.log('Successfully updated DB!');
  }
}
main();
