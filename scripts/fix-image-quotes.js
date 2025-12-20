#!/usr/bin/env node

/**
 * Fix Image Quotes in Astro Posts
 * 
 * This script removes quotes from image field values in frontmatter
 * to match Jekyll format: image: filename.jpg (not image: "filename.jpg")
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, '..', 'src', 'content', 'posts');

function fixImageQuotes(content, filename) {
  // Fix image field with quotes: image: "filename.jpg" -> image: filename.jpg
  const fixedContent = content.replace(/^image:\s*"([^"]+)"/gm, 'image: $1');
  
  const changed = content !== fixedContent;
  return { content: fixedContent, changed };
}

function processFile(filepath) {
  const filename = path.basename(filepath);
  
  if (!filename.endsWith('.md') || filename === '.gitkeep') {
    return false;
  }
  
  const content = fs.readFileSync(filepath, 'utf8');
  const { content: fixedContent, changed } = fixImageQuotes(content, filename);
  
  if (changed) {
    fs.writeFileSync(filepath, fixedContent, 'utf8');
    console.log(`✓ Fixed: ${filename}`);
    return true;
  }
  
  return false;
}

function processDirectory(dirPath) {
  let totalFixed = 0;
  
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      totalFixed += processDirectory(itemPath);
    } else if (stat.isFile()) {
      if (processFile(itemPath)) {
        totalFixed++;
      }
    }
  }
  
  return totalFixed;
}

console.log('🔧 Fixing image quotes in Astro posts...\n');

const totalFixed = processDirectory(POSTS_DIR);

console.log(`\n📊 Summary:`);
console.log(`   Files fixed: ${totalFixed}`);

if (totalFixed === 0) {
  console.log('\n✨ No changes needed - all image fields are correct!');
} else {
  console.log('\n✅ All image quotes have been removed!');
  console.log('   Images should now load correctly in the site.');
}