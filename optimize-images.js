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

// Critical images that need responsive sizes
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

function isAlreadyOptimized(filename) {
  const baseName = path.parse(filename).name;
  const webpPath = path.join(OUTPUT_DIR, `${baseName}.webp`);
  const avifPath = path.join(OUTPUT_DIR, `${baseName}.avif`);
  
  // Check if optimized versions exist
  if (!fs.existsSync(webpPath) || !fs.existsSync(avifPath)) {
    return false;
  }
  
  // Check if source is newer than optimized versions
  const sourceStat = fs.statSync(path.join(INPUT_DIR, filename));
  const webpStat = fs.statSync(webpPath);
  
  return sourceStat.mtime <= webpStat.mtime;
}

// Maximum width for article images (per blog standards: 1200x630 featured)
const MAX_WIDTH = 1200;

async function optimizeImage(inputPath, filename) {
  const baseName = path.parse(filename).name;
  const ext = path.parse(filename).ext.toLowerCase();
  
  console.log(`🖼️  Optimizing ${filename}...`);
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const inputStats = fs.statSync(inputPath);
    
    console.log(`   Original: ${metadata.width}x${metadata.height}, ${Math.round(inputStats.size / 1024)}KB`);
    
    // Resize if wider than MAX_WIDTH (preserves aspect ratio)
    const needsResize = metadata.width > MAX_WIDTH && !criticalImages.includes(filename);
    const pipeline = needsResize 
      ? image.resize(MAX_WIDTH, null, { withoutEnlargement: true })
      : image;
    
    if (needsResize) {
      console.log(`   Resizing to ${MAX_WIDTH}px wide...`);
    }
    
    // Generate WebP version (best compression, wide support)
    const webpPath = path.join(OUTPUT_DIR, `${baseName}.webp`);
    await pipeline.clone()
      .webp(optimizationSettings.webp)
      .toFile(webpPath);
    
    const webpStats = fs.statSync(webpPath);
    console.log(`   WebP: ${Math.round(webpStats.size / 1024)}KB (${Math.round((1 - webpStats.size / inputStats.size) * 100)}% smaller)`);
    
    // Generate AVIF version (best compression, newer browsers)
    const avifPath = path.join(OUTPUT_DIR, `${baseName}.avif`);
    await pipeline.clone()
      .avif(optimizationSettings.avif)
      .toFile(avifPath);
    
    const avifStats = fs.statSync(avifPath);
    console.log(`   AVIF: ${Math.round(avifStats.size / 1024)}KB (${Math.round((1 - avifStats.size / inputStats.size) * 100)}% smaller)`);
    
    // Generate optimized original format as fallback
    let optimizedPath;
    if (ext === '.jpg' || ext === '.jpeg') {
      optimizedPath = path.join(OUTPUT_DIR, `${baseName}.jpg`);
      await pipeline.clone()
        .jpeg(optimizationSettings.jpeg)
        .toFile(optimizedPath);
    } else if (ext === '.png') {
      optimizedPath = path.join(OUTPUT_DIR, `${baseName}.png`);
      await pipeline.clone()
        .png(optimizationSettings.png)
        .toFile(optimizedPath);
    }
    
    if (optimizedPath) {
      const optimizedStats = fs.statSync(optimizedPath);
      console.log(`   Optimized ${ext}: ${Math.round(optimizedStats.size / 1024)}KB (${Math.round((1 - optimizedStats.size / inputStats.size) * 100)}% smaller)`);
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
          await sharp(inputPath)
            .resize(size.width, null, { withoutEnlargement: true })
            .webp(optimizationSettings.webp)
            .toFile(path.join(OUTPUT_DIR, `${baseName}${size.suffix}.webp`));
          
          // AVIF responsive
          await sharp(inputPath)
            .resize(size.width, null, { withoutEnlargement: true })
            .avif(optimizationSettings.avif)
            .toFile(path.join(OUTPUT_DIR, `${baseName}${size.suffix}.avif`));
          
          // Original format responsive
          if (ext === '.jpg' || ext === '.jpeg') {
            await sharp(inputPath)
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
  
  // Filter to only new/modified images
  const newImages = imageFiles.filter(file => !isAlreadyOptimized(file));
  const skippedCount = imageFiles.length - newImages.length;
  
  console.log(`Found ${imageFiles.length} images total`);
  console.log(`Skipping ${skippedCount} already optimized images`);
  console.log(`Processing ${newImages.length} new/modified images\n`);
  
  if (newImages.length === 0) {
    console.log('✅ All images are already optimized!');
    return;
  }
  
  // Optimize critical images first
  const criticalFiles = newImages.filter(file => criticalImages.includes(file));
  const otherFiles = newImages.filter(file => !criticalImages.includes(file));
  
  if (criticalFiles.length > 0) {
    console.log('📌 Optimizing critical images first...\n');
    for (const file of criticalFiles) {
      await optimizeImage(path.join(INPUT_DIR, file), file);
    }
  }
  
  if (otherFiles.length > 0) {
    console.log('📷 Optimizing remaining images...\n');
    for (const file of otherFiles) {
      await optimizeImage(path.join(INPUT_DIR, file), file);
    }
  }
  
  console.log('✅ Image optimization complete!');
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
