import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../admin/.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function run() {
  const { data: categories, error: cErr } = await supabase.from('categories').select('id, name, slug, image_url');
  const { data: products, error: pErr } = await supabase.from('products').select('id, category_id, title');
  
  if (cErr || pErr) {
    console.error('Error fetching data:', cErr || pErr);
    return;
  }
  
  const categoryCounts: Record<string, number> = {};
  for (const p of products!) {
    categoryCounts[p.category_id] = (categoryCounts[p.category_id] || 0) + 1;
  }
  
  const result = categories!.map(c => ({
    name: c.name,
    slug: c.slug,
    image_url: c.image_url,
    count: categoryCounts[c.id] || 0
  })).sort((a, b) => b.count - a.count);
  
  console.table(result);
}
run();
