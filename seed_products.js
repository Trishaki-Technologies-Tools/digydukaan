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

async function seedProducts() {
  console.log('Fetching Categories...');
  const { data: categories, error: catError } = await supabase.from('categories').select('id, name');
  
  if (catError || !categories) {
    console.error('Error fetching categories:', catError);
    return;
  }

  const findCatId = (name) => categories.find(c => c.name === name)?.id;

  const products = [
    // Dresses
    { name: "Floral Summer Dress", price: 1299, category_id: findCatId("Dresses"), img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1983&auto=format&fit=crop", is_recommended: true },
    { name: "Evening Party Gown", price: 3499, category_id: findCatId("Dresses"), img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2000&auto=format&fit=crop" },
    { name: "Polka Dot Midi", price: 1599, category_id: findCatId("Dresses"), img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1888&auto=format&fit=crop" },
    
    // Tops & Blouses
    { name: "Silk Wrap Top", price: 899, category_id: findCatId("Tops & Blouses"), img: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=1974&auto=format&fit=crop" },
    { name: "Cotton Casual Blouse", price: 699, category_id: findCatId("Tops & Blouses"), img: "https://images.unsplash.com/photo-1604176354204-926873ff34b0?q=80&w=2000&auto=format&fit=crop" },
    { name: "Lace Detail Top", price: 1199, category_id: findCatId("Tops & Blouses"), img: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?q=80&w=2000&auto=format&fit=crop" },

    // T-Shirts
    { name: "Graphic Cotton Tee", price: 499, category_id: findCatId("T-Shirts"), img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1960&auto=format&fit=crop" },
    { name: "V-Neck Basic T-Shirt", price: 399, category_id: findCatId("T-Shirts"), img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=2000&auto=format&fit=crop" },
    { name: "Oversized Streetwear Tee", price: 799, category_id: findCatId("T-Shirts"), img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2000&auto=format&fit=crop" },

    // Co-ords
    { name: "Linen Co-ord Set", price: 2499, category_id: findCatId("Co-ords"), img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop" },
    { name: "Floral Print Lounge Set", price: 1899, category_id: findCatId("Co-ords"), img: "https://images.unsplash.com/photo-1560362614-89027598847b?q=80&w=2000&auto=format&fit=crop" },
    { name: "Velvet Evening Set", price: 4299, category_id: findCatId("Co-ords"), img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=2000&auto=format&fit=crop" },

    // Accessories
    { name: "Vintage Leather Belt", price: 999, category_id: findCatId("Accessories"), img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2070&auto=format&fit=crop" },
    { name: "Gold Plated Necklace", price: 1499, category_id: findCatId("Accessories"), img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2000&auto=format&fit=crop", is_recommended: true },
    { name: "Cat Eye Sunglasses", price: 799, category_id: findCatId("Accessories"), img: "https://images.unsplash.com/photo-1511499767390-90342f568952?q=80&w=2000&auto=format&fit=crop" },

    // Phones
    { name: "Smart Phone Ultra", price: 54999, category_id: findCatId("Phones"), img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2080&auto=format&fit=crop", badge: "NEW" },
    { name: "Compact Phone Pro", price: 32999, category_id: findCatId("Phones"), img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2000&auto=format&fit=crop" },
    { name: "Budget Smart Phone", price: 14999, category_id: findCatId("Phones"), img: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=2000&auto=format&fit=crop" }
  ];

  console.log('Inserting Products...');
  const { data: insertedProducts, error: prodError } = await supabase.from('products').insert(products);

  if (prodError) {
    console.error('Error inserting products:', prodError);
  } else {
    console.log('Successfully seeded all products!');
  }
}

seedProducts();
