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

async function checkBuckets() {
  console.log('--- Storage Verification ---');
  
  const { data, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error('Error listing buckets:', error);
    return;
  }

  console.log('Buckets:', data.map(b => b.name));
  
  const hasProdBucket = data.find(b => b.name === 'product-images');
  if (hasProdBucket) {
     console.log('Bucket "product-images" FOUND!');
     console.log('Is Public:', hasProdBucket.public);
  } else {
     console.error('Bucket "product-images" NOT FOUND!');
  }
}

checkBuckets();
