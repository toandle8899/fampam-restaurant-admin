const fs = require('fs');
const path = require('path');

const categories = [
  { key: 'khai_vi', prefix: 'K', name: 'Starters' },
  { key: 'mon_chinh', prefix: 'M', name: 'Mains' },
  { key: 'libations', prefix: 'L', name: 'Drinks' }
];

const adjectives = ["Spicy", "Crispy", "Sweet", "Savory", "Smoky", "Tangy", "Zesty", "Rich", "Aromatic", "Classic", "Modern", "Fresh", "Roasted", "Grilled", "Steamed", "Fried", "Glazed", "Signature", "Tender", "Juicy"];
const nouns = {
  'khai_vi': ["Rolls", "Dumplings", "Bites", "Salad", "Soup", "Skewers", "Wings", "Pancakes", "Fritters", "Edamame"],
  'mon_chinh': ["Noodles", "Curry", "Rice", "Stir-fry", "Bowl", "Stew", "Roast", "Hotpot", "Pho", "Banh Mi"],
  'libations': ["Tea", "Coffee", "Smoothie", "Juice", "Soda", "Cocktail", "Mocktail", "Latte", "Matcha", "Lemonade"]
};

let sql = `\n\n-- Seed 60 dummy dishes (20 per category)\nwith c as (select id, key from public.collections)\ninsert into public.dishes (collection_id, code, name, description, price_cents, is_published, sort_order, spice_level, translations)\nvalues\n`;

const values = [];
categories.forEach(cat => {
  for (let i = 1; i <= 20; i++) {
    const code = `${cat.prefix}${i.toString().padStart(3, '0')}`;
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const nounList = nouns[cat.key];
    const noun = nounList[Math.floor(Math.random() * nounList.length)];
    const name = `${adj} ${noun} ${i}`;
    const desc = `A delightful serving of ${name.toLowerCase()} prepared with authentic spices and fresh ingredients.`;
    const price = Math.floor(Math.random() * 2000) + 500;
    const spice = Math.floor(Math.random() * 4);
    
    const translations = JSON.stringify({
      vi: { name: `${name} (VI)`, description: `${desc} (Vietnamese)` },
      de: { name: `${name} (DE)`, description: `${desc} (German)` },
      pl: { name: `${name} (PL)`, description: `${desc} (Polish)` }
    }).replace(/'/g, "''"); // Escape single quotes

    values.push(`  ((select id from c where key='${cat.key}'), '${code}', '${name}', '${desc}', ${price}, true, ${i + 10}, ${spice}, '${translations}'::jsonb)`);
  }
});

sql += values.join(',\n') + '\non conflict (code) do nothing;\n';

const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20260522141500_admin_cms_reservations.sql');
fs.appendFileSync(migrationPath, sql);
console.log('Appended 60 dishes to migration.');
