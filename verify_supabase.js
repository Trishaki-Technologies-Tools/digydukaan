import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').filter(Boolean).forEach(line => {
  const [key, ...value] = line.split('=');
  const k = key?.trim();
  const v = value?.join('=')?.trim().replace(/^"|"$/g, '');
  if (k) env[k] = v;
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
  console.log('--- Database Verification ---');
  
  const { count: prodCount, error: prodErr } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: catCount, error: catErr } = await supabase.from('categories').select('*', { count: 'exact', head: true });
  
  if (prodErr || catErr) {
    console.error('Error fetching counts:', prodErr || catErr);
    return;
  }

  console.log('Total Products in Supabase:', prodCount);
  console.log('Total Categories in Supabase:', catCount);
  
  const { data: prods } = await supabase.from('products').select('name, categories(name)').limit(5);
  console.log('\nSample Products:');
  prods.forEach(p => console.log(`- ${p.name} (${p.categories?.name || 'No Category'})`));
}

checkProducts();
