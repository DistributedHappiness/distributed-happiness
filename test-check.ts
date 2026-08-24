import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../admin/.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function run() {
  const { data, error } = await supabase.from('products').select('*');
  console.log('Error:', error);
  console.log('Total Products:', data?.length);
  if (data?.length) {
    console.log('First Product:', JSON.stringify(data[0], null, 2));
  }
}
run();
