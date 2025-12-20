#!/usr/bin/env node

/**
 * Fix Backlog Posts for Astro Compatibility
 * 
 * This script:
 * 1. Removes Jekyll-specific frontmatter (layout: post)
 * 2. Renames files to remove date prefixes
 * 3. Fixes date format (removes time/timezone)
 * 4. Updates NEXT_PART placeholders to match new filenames
 * 5. Standardizes series_part to series_order
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKLOG_DIR = path.join(__dirname, '..', 'src', 'content', 'posts', 'backlog');

function fixPost(filepath) {
  const filename = path.basename(filepath);
  
  if (filename === '.gitkeep') {
    return;
  }
  
  console.log(`\n📝 Processing: ${filename}`);
  
  let content = fs.readFileSync(filepath, 'utf8');
  let changes = [];
  
  // 1. Remove layout: post
  if (content.includes('layout: post')) {
    content = content.replace(/^layout:\s*post\s*$/m, '');
    changes.push('Removed layout: post');
  }
  
  // 2. Fix date format (remove time and timezone)
  const dateMatch = content.match(/^date:\s*(\d{4}-\d{2}-\d{2})\s+\d{2}:\d{2}.*$/m);
  if (dateMatch) {
    content = content.replace(/^date:\s*(\d{4}-\d{2}-\d{2})\s+\d{2}:\d{2}.*$/m, 'date: $1');
    changes.push('Fixed date format');
  }
  
  // 3. Standardize series_part to series_order
  if (content.includes('series_part:')) {
    content = content.replace(/^series_part:/m, 'series_order:');
    changes.push('Changed series_part to series_order');
  }
  
  // 4. Clean up extra blank lines in frontmatter
  content = content.replace(/---\n\n+/g, '---\n');
  
  // 5. Update NEXT_PART placeholders to remove date prefixes
  const nextPartMatch = content.match(/<!-- NEXT_PART: (\d{4}-\d{2}-\d{2}-)(.+?) -->/g);
  if (nextPartMatch) {
    nextPartMatch.forEach(match => {
      const newMatch = match.replace(/(\d{4}-\d{2}-\d{2}-)/g, '');
      content = content.replace(match, newMatch);
    });
    changes.push('Updated NEXT_PART placeholders');
  }
  
  // Write the fixed content
  fs.writeFileSync(filepath, content);
  
  // 6. Rename file to remove date prefix
  const newFilename = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  if (newFilename !== filename) {
    const newFilepath = path.join(BACKLOG_DIR, newFilename);
    fs.renameSync(filepath, newFilepath);
    changes.push(`Renamed to: ${newFilename}`);
  }
  
  if (changes.length > 0) {
    console.log(`   ✅ ${changes.join(', ')}`);
  } else {
    console.log(`   ℹ️  No changes needed`);
  }
}

console.log('🔧 Fixing backlog posts for Astro compatibility...\n');

const files = fs.readdirSync(BACKLOG_DIR)
  .filter(file => file.endsWith('.md'))
  .map(file => path.join(BACKLOG_DIR, file));

files.forEach(fixPost);

console.log('\n✅ All posts processed!');
console.log('\n📋 Next steps:');
console.log('1. Review the changes with: git diff');
console.log('2. Test locally with: npm run dev');
console.log('3. Commit the changes');
