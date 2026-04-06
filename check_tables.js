import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

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

async function checkTables() {
  const { data, error } = await supabase.rpc('get_tables'); // Won't work if no RPC
  if (error) {
     // Try direct query if allowed (usually not for anon key)
     console.log('Trying direct query for tables...');
     const { data: tables, error: tableError } = await supabase.from('information_schema.tables').select('table_name');
     if (tableError) console.error('Error fetching tables:', tableError);
     else console.log('Tables:', tables);
  } else {
     console.log('Tables:', data);
  }
}

checkTables();
