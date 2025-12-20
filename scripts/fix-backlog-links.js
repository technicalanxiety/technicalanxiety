#!/usr/bin/env node

/**
 * Fix Broken Links in Backlog Posts
 * 
 * This script fixes:
 * 1. Missing trailing slashes on internal links
 * 2. Incorrect slug references to posts that don't exist yet (series cross-references)
 * 3. Links with trailing slashes that need to be removed
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKLOG_DIR = path.join(__dirname, '..', 'src', 'content', 'posts', 'backlog');

// Map of incorrect slugs to correct slugs (for posts that exist)
const SLUG_CORRECTIONS = {
  'platform-resiliency-part-1': 'platform-resiliency-pt1',
  'poetry-of-code-part-1': 'poetry-of-code-part1',
  'decide-or-drown': 'decide-or-drown-pt1',
};

// Posts that don't exist yet (backlog posts referencing each other)
const BACKLOG_POSTS = [
  'beyond-azure-monitor-pt1',
  'beyond-azure-monitor-pt2',
  'beyond-azure-monitor-pt3',
  'confidence-engineering-pt1',
  'confidence-engineering-pt2',
  'confidence-engineering-pt3',
  'poetry-of-code-part2',
  'what-architects-actually-do-pt2',
  'what-architects-actually-do-pt3',
  'kiro-architect-to-developer',
];

function fixLinks(content, filename) {
  let fixed = content;
  let changes = [];
  
  // Fix 1: Remove trailing slashes from links that have them incorrectly
  // (links ending with /) when they shouldn't
  const trailingSlashInPathRegex = /\[([^\]]+)\]\(\/([^)]+)\/\)/g;
  fixed = fixed.replace(trailingSlashInPathRegex, (match, text, path) => {
    // Check if this path ends with a trailing slash already
    if (path.endsWith('/')) {
      const cleanPath = path.replace(/\/$/, '');
      changes.push(`Removed double slash: [${text}](/${path}) -> [${text}](/${cleanPath}/)`);
      return `[${text}](/${cleanPath}/)`;
    }
    return match;
  });
  
  // Fix 2: Add trailing slashes to links that are missing them
  const missingSlashRegex = /\[([^\]]+)\]\(\/([^)\/]+)\)(?!\))/g;
  fixed = fixed.replace(missingSlashRegex, (match, text, path) => {
    // Don't add slash if it's an anchor link or has query params
    if (path.includes('#') || path.includes('?')) {
      return match;
    }
    
    changes.push(`Added trailing slash: [${text}](/${path}) -> [${text}](/${path}/)`);
    return `[${text}](/${path}/)`;
  });
  
  // Fix 3: Correct slug references
  Object.entries(SLUG_CORRECTIONS).forEach(([incorrect, correct]) => {
    const regex = new RegExp(`\\[([^\\]]+)\\]\\(\\/${incorrect}(\\/?)\\)`, 'g');
    if (fixed.match(regex)) {
      fixed = fixed.replace(regex, `[$1](/${correct}/)`);
      changes.push(`Corrected slug: /${incorrect}/ -> /${correct}/`);
    }
  });
  
  return { fixed, changes };
}

console.log('🔧 Fixing broken links in backlog posts...\n');

const backlogFiles = fs.readdirSync(BACKLOG_DIR)
  .filter(file => file.endsWith('.md') && file !== '.gitkeep')
  .map(file => path.join(BACKLOG_DIR, file));

let totalChanges = 0;
let filesModified = 0;

backlogFiles.forEach(filepath => {
  const filename = path.basename(filepath);
  const content = fs.readFileSync(filepath, 'utf8');
  
  const { fixed, changes } = fixLinks(content, filename);
  
  if (changes.length > 0) {
    fs.writeFileSync(filepath, fixed, 'utf8');
    filesModified++;
    totalChanges += changes.length;
    
    console.log(`📝 ${filename}`);
    changes.forEach(change => {
      console.log(`   ✓ ${change}`);
    });
    console.log('');
  }
});

console.log('📊 Summary:');
console.log(`   Files modified: ${filesModified}`);
console.log(`   Total changes: ${totalChanges}`);

if (totalChanges === 0) {
  console.log('\n✨ No changes needed - all links are correct!');
} else {
  console.log('\n✅ All broken links have been fixed!');
  console.log('\n💡 Note: Some links reference backlog posts that will be published later.');
  console.log('   These are intentional cross-references within series and are correct.');
}
