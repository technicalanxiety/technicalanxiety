#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, 'public', 'img');
const OUTPUT_DIR = path.join(__dirname, 'public', 'img', 'optimized');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Critical images that need immediate optimization
const criticalImages = [
  'me.jpg',
  'about.jpg', 
  'platform-layer-3.jpg',
  'bicep-terraform-vhs.jpg',
  'kiro-brain.jpg',
  'JasonRinehart_TI.png',
  'TI_award.png'
];

// Image optimization settings
const optimizationSettings = {
  jpeg: {
    quality: 85,
    progressive: true,
    mozjpeg: true
  },
  webp: {
    quality: 85,
    effort: 6
  },
  avif: {
    quality: 80,
    effort: 6
  },
  png: {
    quality: 90,
    compressionLevel: 9
  }
};

async function optimizeImage(inputPath, filename) {
  const baseName = path.parse(filename).name;
  const ext = path.parse(filename).ext.toLowerCase();
  
  console.log(`🖼️  Optimizing ${filename}...`);
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`   Original: ${metadata.width}x${metadata.height}, ${Math.round(metadata.size / 1024)}KB`);
    
    // Generate WebP version (best compression, wide support)
    const webpPath = path.join(OUTPUT_DIR, `${baseName}.webp`);
    await image
      .webp(optimizationSettings.webp)
      .toFile(webpPath);
    
    const webpStats = fs.statSync(webpPath);
    console.log(`   WebP: ${Math.round(webpStats.size / 1024)}KB (${Math.round((1 - webpStats.size / metadata.size) * 100)}% smaller)`);
    
    // Generate AVIF version (best compression, newer browsers)
    const avifPath = path.join(OUTPUT_DIR, `${baseName}.avif`);
    await image
      .avif(optimizationSettings.avif)
      .toFile(avifPath);
    
    const avifStats = fs.statSync(avifPath);
    console.log(`   AVIF: ${Math.round(avifStats.size / 1024)}KB (${Math.round((1 - avifStats.size / metadata.size) * 100)}% smaller)`);
    
    // Generate optimized original format as fallback
    let optimizedPath;
    if (ext === '.jpg' || ext === '.jpeg') {
      optimizedPath = path.join(OUTPUT_DIR, `${baseName}.jpg`);
      await image
        .jpeg(optimizationSettings.jpeg)
        .toFile(optimizedPath);
    } else if (ext === '.png') {
      optimizedPath = path.join(OUTPUT_DIR, `${baseName}.png`);
      await image
        .png(optimizationSettings.png)
        .toFile(optimizedPath);
    }
    
    if (optimizedPath) {
      const optimizedStats = fs.statSync(optimizedPath);
      console.log(`   Optimized ${ext}: ${Math.round(optimizedStats.size / 1024)}KB (${Math.round((1 - optimizedStats.size / metadata.size) * 100)}% smaller)`);
    }
    
    // Generate responsive sizes for critical images
    if (criticalImages.includes(filename)) {
      console.log(`   Generating responsive sizes...`);
      
      const sizes = [
        { width: 400, suffix: '-400w' },
        { width: 800, suffix: '-800w' },
        { width: 1200, suffix: '-1200w' }
      ];
      
      for (const size of sizes) {
        if (size.width < metadata.width) {
          // WebP responsive
          await image
            .resize(size.width, null, { withoutEnlargement: true })
            .webp(optimizationSettings.webp)
            .toFile(path.join(OUTPUT_DIR, `${baseName}${size.suffix}.webp`));
          
          // AVIF responsive
          await image
            .resize(size.width, null, { withoutEnlargement: true })
            .avif(optimizationSettings.avif)
            .toFile(path.join(OUTPUT_DIR, `${baseName}${size.suffix}.avif`));
          
          // Original format responsive
          if (ext === '.jpg' || ext === '.jpeg') {
            await image
              .resize(size.width, null, { withoutEnlargement: true })
              .jpeg(optimizationSettings.jpeg)
              .toFile(path.join(OUTPUT_DIR, `${baseName}${size.suffix}.jpg`));
          }
        }
      }
    }
    
    console.log(`   ✅ Complete\n`);
    
  } catch (error) {
    console.error(`   ❌ Error optimizing ${filename}:`, error.message);
  }
}

async function optimizeAllImages() {
  console.log('🚀 Starting image optimization...\n');
  
  const files = fs.readdirSync(INPUT_DIR);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|webp)$/i.test(file) && 
    !file.startsWith('.') &&
    fs.statSync(path.join(INPUT_DIR, file)).isFile()
  );
  
  console.log(`Found ${imageFiles.length} images to optimize\n`);
  
  // Optimize critical images first
  const criticalFiles = imageFiles.filter(file => criticalImages.includes(file));
  const otherFiles = imageFiles.filter(file => !criticalImages.includes(file));
  
  console.log('📌 Optimizing critical images first...\n');
  for (const file of criticalFiles) {
    await optimizeImage(path.join(INPUT_DIR, file), file);
  }
  
  console.log('📷 Optimizing remaining images...\n');
  for (const file of otherFiles.slice(0, 10)) { // Limit to first 10 for now
    await optimizeImage(path.join(INPUT_DIR, file), file);
  }
  
  console.log('✅ Image optimization complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Update image references to use optimized versions');
  console.log('2. Implement responsive images with <picture> elements');
  console.log('3. Add width/height attributes to prevent layout shifts');
}

// Check if Sharp is installed
try {
  await optimizeAllImages();
} catch (error) {
  if (error.code === 'MODULE_NOT_FOUND' && error.message.includes('sharp')) {
    console.log('📦 Installing Sharp for image optimization...');
    console.log('Run: npm install --save-dev sharp');
    console.log('Then run this script again.');
  } else {
    console.error('Error:', error.message);
  }
}