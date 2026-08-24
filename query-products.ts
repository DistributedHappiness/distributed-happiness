import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../admin/.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function run() {
  const { data: products, error } = await supabase.from('products').select('title, category_id, categories(name)');
  if (error) {
    console.error(error);
    return;
  }
  // Group by category
  const groups: Record<string, string[]> = {};
  for (const p of products!) {
    const catName = (p.categories as any).name;
    if (!groups[catName]) groups[catName] = [];
    groups[catName].push(p.title);
  }
  for (const cat of Object.keys(groups)) {
    console.log(`\n### ${cat} (${groups[cat].length})`);
    console.log(groups[cat].slice(0, 3).map(t => `- ${t}`).join('\n'));
    if (groups[cat].length > 3) console.log(`...and ${groups[cat].length - 3} more`);
  }
}
run();
