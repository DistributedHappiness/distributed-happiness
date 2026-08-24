import fs from 'fs';
import { parse } from 'pgsql-ast-parser';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../admin/.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function run() {
  console.log("Parsing seed_products.sql...");
  const sql = fs.readFileSync('../seed_products.sql', 'utf8');
  
  const ast = parse(sql);
  
  let successCount = 0;
  let failCount = 0;

  for (const stmt of ast) {
    if (stmt.type === 'insert') {
      const tableName = stmt.into.name;
      const columns = stmt.columns?.map((c: any) => c.name) || [];
      
      for (const valueSet of (stmt.insert as any).values) {
        const rowData: Record<string, any> = {};
        columns.forEach((col: string, idx: number) => {
          let valExpr = valueSet[idx];
          if (valExpr.type === 'string') {
            rowData[col] = valExpr.value;
          } else if (valExpr.type === 'numeric' || valExpr.type === 'integer') {
            rowData[col] = valExpr.value;
          } else if (valExpr.type === 'boolean') {
            rowData[col] = valExpr.value;
          } else if (valExpr.type === 'null') {
            rowData[col] = null;
          } else if (valExpr.type === 'cast') {
            // For images ARRAY[...]::text[]
            if (valExpr.operand && valExpr.operand.type === 'array') {
              rowData[col] = valExpr.operand.expressions.map((e: any) => e.value);
            }
          } else if (valExpr.type === 'array') {
            rowData[col] = valExpr.expressions.map((e: any) => e.value);
          }
        });

        // Insert using JS client
        const { error } = await supabase.from(tableName).upsert(rowData);
        if (error) {
          console.error(`Error inserting into ${tableName}:`, error.message);
          failCount++;
        } else {
          successCount++;
        }
      }
    }
  }

  console.log(`Finished! Successfully inserted ${successCount} rows. Failed: ${failCount}`);
}

run().catch(console.error);
