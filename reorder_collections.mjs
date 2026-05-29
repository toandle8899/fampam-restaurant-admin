import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

let supabaseUrl = '';
let supabaseKey = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1].trim();
  }
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
    supabaseKey = line.split('=')[1].trim();
  }
});

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const updates = [
    { key: "fampam_specialty", sort_order: 1 },
    { key: "mon_chinh", sort_order: 2 },
    { key: "khai_vi", sort_order: 3 },
    { key: "soup", sort_order: 4 },
    { key: "libations", sort_order: 5 }
  ];

  for (const update of updates) {
    const { error } = await supabase
      .from('collections')
      .update({ sort_order: update.sort_order })
      .eq('key', update.key);
      
    if (error) {
      console.error(`Failed to update ${update.key}:`, error.message);
    } else {
      console.log(`Updated ${update.key} to sort_order ${update.sort_order}`);
    }
  }
}

run();
