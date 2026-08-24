import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: '/Users/faqrealam149/Desktop/distribute happiness/website/.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function processImage(url: string): Promise<string | null> {
  try {
    // 1. Download
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Crop
    const metadata = await sharp(buffer).metadata();
    if (!metadata.width || !metadata.height) return url; // skip if can't read

    const w = metadata.width;
    const h = metadata.height;
    
    // Crop percentages: 10% from top, 5% from sides/bottom
    const cropLeft = Math.floor(w * 0.05);
    const cropTop = Math.floor(h * 0.10);
    const cropWidth = Math.floor(w * 0.90);
    const cropHeight = Math.floor(h * 0.85);

    const croppedBuffer = await sharp(buffer)
      .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
      .webp({ quality: 80 })
      .toBuffer();

    // 3. Upload
    const fileName = `cropped-${uuidv4()}.webp`;
    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from('products')
      .upload(fileName, croppedBuffer, { contentType: 'image/webp' });

    if (uploadErr) {
      console.error(`Failed to upload ${fileName}:`, uploadErr);
      return url; // fallback to original
    }

    // 4. Get URL
    const { data: pubData } = supabase.storage.from('products').getPublicUrl(fileName);
    return pubData.publicUrl;
  } catch (err) {
    console.error(`Error processing image ${url}:`, err);
    return url; // fallback to original
  }
}

async function run() {
  console.log('Fetching products...');
  const { data: products, error } = await supabase.from('products').select('id, title, images');
  if (error) {
    console.error(error);
    return;
  }
  
  console.log(`Found ${products.length} products to process.`);
  
  let count = 0;
  for (const product of products) {
    console.log(`Processing [${++count}/${products.length}]: ${product.title}`);
    
    if (!product.images || product.images.length === 0) {
      console.log('  -> No images, skipping.');
      continue;
    }

    const newImages = [];
    for (const imgUrl of product.images) {
      // Don't re-crop if it's already a cropped image we uploaded just now
      if (imgUrl.includes('cropped-')) {
        newImages.push(imgUrl);
        continue;
      }
      
      const newUrl = await processImage(imgUrl);
      if (newUrl) {
        newImages.push(newUrl);
      }
    }
    
    // Update product
    const { error: updateErr } = await supabase.from('products').update({ images: newImages }).eq('id', product.id);
    if (updateErr) {
      console.error(`  -> Failed to update product ${product.id}:`, updateErr);
    } else {
      console.log(`  -> Successfully updated ${newImages.length} images.`);
    }
  }
  
  console.log('All products processed!');
}

run().catch(console.error);
