import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bvbedxnrfopbvhzozxvv.supabase.co';
const supabaseAnonKey = 'sb_publishable_v4LJqBkMnY6YJH64av5xYw_P9y5Oyl2';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const collectionId = '49eb5540-c4d9-435c-8c3f-4b1165276091';

function parseCSV(text) {
    var p = '', row = [''], ret = [row], i = 0, r = 0, s = !0, l;
    for (l of text) {
        if ('"' === l) {
            if (s && l === p) row[i] += l;
            s = !s;
        } else if (',' === l && s) l = row[++i] = '';
        else if ('\n' === l && s) {
            if ('\r' === p) row[i] = row[i].slice(0, -1);
            row = ret[++r] = [l = '']; i = 0;
        } else row[i] += l;
        p = l;
    }
    // clean up empty last row
    if (ret.length > 0 && ret[ret.length-1].length === 1 && ret[ret.length-1][0] === '') ret.pop();
    return ret;
}

const csvData = fs.readFileSync('extracted_menu_items (1).csv', 'utf8');
const rows = parseCSV(csvData);

const headers = rows[0];
const items = rows.slice(1).filter(r => r.length > 1 && r[0].trim() !== '').map(row => {
  const obj = {};
  headers.forEach((h, i) => {
    let val = row[i];
    if (val === 'True') val = true;
    else if (val === 'False') val = false;
    else if (val === '') val = null;
    
    if (val !== null && (h === 'price_cents' || h === 'spice_level' || h === 'sort_order')) val = Number(val);
    if (val !== null && (h === 'translations' || h === 'variants' || h === 'dietary' || h === 'tags')) {
        try {
            val = JSON.parse(val);
        } catch(e) {
            console.error('Failed to parse JSON for ' + h, e, val);
        }
    }
    obj[h] = val;
  });
  obj.collection_id = collectionId;
  return obj;
});

console.log(JSON.stringify(items[0], null, 2));

async function run() {
  const { data: auth, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@fampam.de',
    password: 'Leductoan123!',
  });

  if (authError) {
    console.error('Auth error:', authError);
    return;
  }

  console.log('Deleting existing Fampam Special items...');
  const { error: delError } = await supabase.from('dishes').delete().eq('collection_id', collectionId);
  if (delError) {
    console.error('Error deleting:', delError);
    return;
  }
  console.log('Inserting new items...', items.length);
  const { error: insertError } = await supabase.from('dishes').insert(items);
  if (insertError) {
    console.error('Error inserting:', insertError);
  } else {
    console.log('Successfully updated dishes!');
  }
}
run();
