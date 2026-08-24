import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: '/Users/faqrealam149/Desktop/distribute happiness/website/.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const NEW_CATEGORIES = [
  {
    name: 'Corporate & Premium Gifts',
    slug: 'corporate-premium-gifts',
    desc: 'Diaries, Trophies, Mementos, Badges, Hampers',
    imagePath: '/Users/faqrealam149/.gemini/antigravity-ide/brain/495c0340-a25e-42fb-8468-e67a4ac0121c/cat_corporate_1787561691277.jpg',
    keywords: ['diary', 'diaries', 'trophy', 'memento', 'badge', 'hamper', 'mementos', 'badges', 'paperweight']
  },
  {
    name: 'Desk & Office Accessories',
    slug: 'desk-office-accessories',
    desc: 'Organizers, Laptop/Mobile Stands, Pen Holders',
    imagePath: '/Users/faqrealam149/.gemini/antigravity-ide/brain/495c0340-a25e-42fb-8468-e67a4ac0121c/cat_desk_1787561704151.jpg',
    keywords: ['desk', 'laptop', 'mobile stand', 'pen', 'mousepad', 'coaster']
  },
  {
    name: 'Home Décor & Keepsakes',
    slug: 'home-decor-keepsakes',
    desc: 'Showpieces, Mandir, Serving Trays, Photo Frames',
    imagePath: '/Users/faqrealam149/.gemini/antigravity-ide/brain/495c0340-a25e-42fb-8468-e67a4ac0121c/cat_home_1787561717540.jpg',
    keywords: ['show piece', 'mandir', 'serving tray', 'photo frame', 'fridge magnet', 'magnet', 'basket']
  },
  {
    name: 'Calendars & Planners',
    slug: 'calendars-planners',
    desc: 'Desk Calendars, Infinite Calendars, Wall Calendars',
    imagePath: '/Users/faqrealam149/.gemini/antigravity-ide/brain/495c0340-a25e-42fb-8468-e67a4ac0121c/cat_calendar_1787561863909.jpg',
    keywords: ['calendar', 'calender', 'planner']
  },
  {
    name: 'Drinkware & Mugs',
    slug: 'drinkware-mugs',
    desc: 'Bamboo Bottles, Glass Bottles, Custom Mugs',
    imagePath: '/Users/faqrealam149/.gemini/antigravity-ide/brain/495c0340-a25e-42fb-8468-e67a4ac0121c/cat_drinkware_1787561876866.jpg',
    keywords: ['bottle', 'mug', 'cup', 'drinkware', 'bamboo bottle', 'water bottle']
  },
  {
    name: 'Keychains & Accessories',
    slug: 'keychains-accessories',
    desc: 'Keyrings, Bookmarks, Piggy Banks, Games',
    imagePath: '/Users/faqrealam149/.gemini/antigravity-ide/brain/495c0340-a25e-42fb-8468-e67a4ac0121c/cat_keychain_1787561893319.jpg',
    keywords: ['keychain', 'keyring', 'bookmark', 'piggy bank', 'game', 'puzzle']
  }
];

async function run() {
  console.log('Fetching old categories...');
  const { data: oldCats, error: oldCatErr } = await supabase.from('categories').select('id, name');
  if (oldCatErr) throw oldCatErr;
  
  const oldCatMap = new Map(oldCats.map(c => [c.id, c.name.toLowerCase()]));
  
  console.log('Fetching products...');
  const { data: products, error: prodErr } = await supabase.from('products').select('id, title, category_id');
  if (prodErr) throw prodErr;

  console.log('Inserting new categories & uploading images...');
  const newCatIds = new Map();
  for (const cat of NEW_CATEGORIES) {
    // Read and upload image
    const fileData = fs.readFileSync(cat.imagePath);
    const fileName = `category-${cat.slug}-${Date.now()}.jpg`;
    
    console.log(`Uploading ${fileName}...`);
    const { data: uploadData, error: uploadErr } = await supabase.storage.from('products').upload(fileName, fileData, {
      contentType: 'image/jpeg'
    });
    
    if (uploadErr) {
      console.error(`Failed to upload ${fileName}:`, uploadErr);
      continue;
    }
    
    const { data: pubData } = supabase.storage.from('products').getPublicUrl(fileName);
    const imageUrl = pubData.publicUrl;
    
    // Insert category
    const catId = uuidv4();
    const { error: insertErr } = await supabase.from('categories').insert({
      id: catId,
      name: cat.name,
      slug: cat.slug,
      description: cat.desc,
      image_url: imageUrl,
      is_active: true
    });
    
    if (insertErr) {
      console.error(`Failed to insert category ${cat.name}:`, insertErr);
      continue;
    }
    
    newCatIds.set(cat.slug, catId);
    console.log(`✅ Category inserted: ${cat.name}`);
  }

  console.log('Remapping products...');
  for (const p of products) {
    const title = p.title.toLowerCase();
    const oldCatName = oldCatMap.get(p.category_id) || '';
    
    // Determine new category
    let newSlug = 'home-decor-keepsakes'; // fallback
    
    const searchString = title + ' ' + oldCatName;
    for (const cat of NEW_CATEGORIES) {
      if (cat.keywords.some(kw => searchString.includes(kw))) {
        newSlug = cat.slug;
        break;
      }
    }
    
    // Update product
    const newCatId = newCatIds.get(newSlug);
    if (newCatId) {
      await supabase.from('products').update({ category_id: newCatId }).eq('id', p.id);
    }
  }

  console.log('Deleting old categories...');
  const newIds = Array.from(newCatIds.values());
  const { error: delErr } = await supabase.from('categories').delete().not('id', 'in', `(${newIds.join(',')})`);
  if (delErr) {
    console.error('Failed to delete old categories:', delErr);
  } else {
    console.log('✅ Deleted old categories successfully');
  }
  
  console.log('Done!');
}

run().catch(console.error);
