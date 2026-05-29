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
  // First, get the collection id for fampam_specialty
  const { data: collections } = await supabase.from("collections").select("*").eq("key", "fampam_specialty");
  if (!collections || collections.length === 0) {
    console.error("fampam_specialty collection not found");
    return;
  }
  const fampamId = collections[0].id;

  // Get the first two dishes in this collection
  const { data: dishes } = await supabase.from("dishes").select("*").eq("collection_id", fampamId).limit(2);
  
  if (dishes && dishes.length > 0) {
    for (const dish of dishes) {
      const variants = [
        {
          id: crypto.randomUUID(),
          name: "Small Portion",
          name_vi: "Phần Nhỏ",
          name_pl: "Mała Porcja",
          name_de: "Kleine Portion",
          price_cents: Math.round(dish.price_cents * 0.7)
        },
        {
          id: crypto.randomUUID(),
          name: "Large Portion",
          name_vi: "Phần Lớn",
          name_pl: "Duża Porcja",
          name_de: "Große Portion",
          price_cents: Math.round(dish.price_cents * 1.3)
        }
      ];

      const { error } = await supabase.from("dishes").update({
        has_variants: true,
        variants: variants
      }).eq("id", dish.id);

      if (error) {
        console.error("Error updating dish", dish.name, error);
      } else {
        console.log("Successfully added variants to", dish.name);
      }
    }
  } else {
    console.log("No dishes found in fampam_specialty");
  }
}

run();
