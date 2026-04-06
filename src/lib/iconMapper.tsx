import { 
  Laptop, 
  Smartphone, 
  Shirt, 
  Home, 
  Watch, 
  Baby, 
  Armchair, 
  HeartPulse, 
  Sparkles,
  ShoppingBag,
  Gem,
  Palette,
  Camera,
  Utensils,
  Headphones,
  Gamepad,
  CarFront,
  Zap,
  Gift,
  Clock,
  Monitor,
  Heart,
  Percent,
  Gamepad2,
  Clapperboard,
  ShoppingBasket
} from 'lucide-react';

const icons: Record<string, any> = {
  Laptop, Smartphone, Shirt, Home, Watch, Baby, Armchair, HeartPulse, 
  Sparkles, ShoppingBag, Gem, Palette, Camera, Utensils, Headphones, 
  Gamepad, CarFront, Zap, Gift, Clock, Monitor, Heart, Percent, 
  Gamepad2, Clapperboard, ShoppingBasket
};

export const getIconByName = (name: string) => {
  if (!name) return ShoppingBag;
  
  // Clean string
  const cleanName = name.trim();
  
  // 1. Direct exact match
  if (icons[cleanName]) return icons[cleanName];
  
  // 2. Case-insensitive search
  const key = Object.keys(icons).find(k => k.toLowerCase() === cleanName.toLowerCase());
  if (key) return icons[key];
  
  // 3. Common Alias Mapping
  const alias: Record<string, any> = {
    'fashion': Shirt,
    'mobiles': Smartphone,
    'electronics': Monitor,
    'beauty': Sparkles,
    'watch': Clock,
    'home': Home,
    'furniture': Armchair,
    'topoffers': Percent,
    'top-offers': Percent,
    'dresses': Clapperboard,
    'jewelry': Gem
  };
  
  if (alias[cleanName.toLowerCase()]) return alias[cleanName.toLowerCase()];

  // Final fallback
  return ShoppingBag;
};
