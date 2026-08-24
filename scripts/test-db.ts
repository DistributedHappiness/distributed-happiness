import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../../admin/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  console.log("Testing DB permissions for products...");
  const { data, error } = await supabase.from('categories').select('id').limit(1);
  if (error) {
    console.error("Select categories error:", error);
  } else {
    console.log("Select categories success:", data);
  }
}
run();
