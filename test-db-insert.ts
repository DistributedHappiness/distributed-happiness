import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../admin/.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function run() {
  const { data, error: insertError } = await supabase.from('categories').insert({ name: 'TestCat2', slug: 'test-cat-2', is_active: true }).select();
  console.log('Insert data:', data);
  console.log('Insert error:', insertError);
}
run();
