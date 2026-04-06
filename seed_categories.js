import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Manual .env parser
const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').filter(Boolean).forEach(line => {
  const [key, ...value] = line.split('=');
  const k = key.trim();
  const v = value.join('=').trim().replace(/^"|"$/g, '');
  if (k) env[k] = v;
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const categories = [
  { name: "Dresses", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1983&auto=format&fit=crop" },
  { name: "Tops & Blouses", img: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=1974&auto=format&fit=crop" },
  { name: "T-Shirts", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1960&auto=format&fit=crop" },
  { name: "Co-ords", img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop" },
  { name: "Accessories", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2070&auto=format&fit=crop" },
  { name: "Phones", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2080&auto=format&fit=crop" }
];

async function seed() {
  console.log('Seeding categories...');
  const { data, error } = await supabase.from('categories').insert(categories);
  if (error) {
     console.error('Error seeding categories:', error);
     process.exit(1);
  }
  console.log('Successfully seeded categories!');
  process.exit(0);
}

seed();
