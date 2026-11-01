#!/usr/bin/env node

/**
 * Series Link Updater
 *
 * Replaces "What's Next" placeholders in published posts with a link once the
 * post they point to is published:
 *
 *   <!-- NEXT_PART: next-post-slug.md -->
 *   **Coming Next:** Part 2: Title (Publishing January 15, 2026)
 *   ...
 *   <!-- END_NEXT_PART -->
 *
 * becomes
 *
 *   **Next in Series:** [Next Post Title →](/next-post-slug/)
 *
 * Sweeps every published post on each run, so links are fixed no matter how
 * the next part was published (scheduled workflow, manual publish, or by hand).
 *
 * Usage:
 *   node scripts/update-series-links.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, '..', 'src', 'content', 'posts');

const PLACEHOLDER = /<!-- NEXT_PART: (\S+) -->[\s\S]*?<!-- END_NEXT_PART -->/g;

function getTitle(content) {
  const match = content.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  return match ? match[1] : 'Next Part';
}

export function updateSeriesLinks(postsDir = POSTS_DIR) {
  const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
  const published = new Set(files);
  const updated = [];

  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    const newContent = content.replace(PLACEHOLDER, (block, target) => {
      if (target === file || !published.has(target)) {
        return block;
      }
      const title = getTitle(fs.readFileSync(path.join(postsDir, target), 'utf8'));
      const slug = path.parse(target).name;
      return `**Next in Series:** [${title} →](/${slug}/)`;
    });

    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent);
      updated.push(file);
      console.log(`🔗 Updated series link in: ${file}`);
    }
  }

  return updated;
}

// Run directly
if (process.argv[1] === __filename) {
  const updated = updateSeriesLinks();
  console.log(updated.length > 0
    ? `✅ Updated series links in ${updated.length} post(s)`
    : 'No series links to update');
}
