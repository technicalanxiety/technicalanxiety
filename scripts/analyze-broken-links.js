#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const distDir = path.join(process.cwd(), 'dist');

// Helper function to get all HTML files
function getAllHtmlFiles() {
  const htmlFiles = [];
  
  function scanDirectory(dir, basePath = '') {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (item !== '_astro') {
          scanDirectory(fullPath, path.join(basePath, item));
        }
      } else if (item.endsWith('.html')) {
        const url = basePath ? `/${basePath}/${item}` : `/${item}`;
        const normalizedUrl = url.replace('/index.html', '/').replace(/^\/\//, '/');
        
        htmlFiles.push({
          filePath: fullPath,
          url: normalizedUrl
        });
      }
    }
  }
  
  scanDirectory(distDir);
  return htmlFiles;
}

// Helper function to extract links
function extractLinks(htmlContent) {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  const links = [];
  
  const anchors = document.querySelectorAll('a[href]');
  anchors.forEach(anchor => {
    const href = anchor.getAttribute('href');
    if (href) {
      const isInternal = href.startsWith('/') || href.startsWith('./') || href.startsWith('../') || 
                        (!href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('#'));
      
      if (isInternal && !href.startsWith('#')) {
        links.push(href);
      }
    }
  });
  
  return links;
}

// Helper function to resolve path
function resolveInternalPath(href) {
  let resolvedPath = href.split('?')[0].split('#')[0];
  
  if (resolvedPath.startsWith('./')) {
    resolvedPath = resolvedPath.substring(2);
  } else if (resolvedPath.startsWith('../')) {
    resolvedPath = resolvedPath.replace(/\.\.\//g, '');
  }
  
  if (!resolvedPath.startsWith('/')) {
    resolvedPath = '/' + resolvedPath;
  }
  
  let fsPath = path.join(distDir, resolvedPath);
  
  if (resolvedPath.endsWith('/')) {
    fsPath = path.join(fsPath, 'index.html');
  }
  
  return fsPath;
}

// Main analysis
console.log('🔍 Analyzing broken links...\n');

const htmlFiles = getAllHtmlFiles();
const brokenLinks = new Map(); // href -> array of pages that link to it
const allInternalLinks = new Set();

for (const file of htmlFiles) {
  const htmlContent = fs.readFileSync(file.filePath, 'utf-8');
  const links = extractLinks(htmlContent);
  
  for (const link of links) {
    allInternalLinks.add(link);
    
    const resolvedPath = resolveInternalPath(link);
    
    if (!fs.existsSync(resolvedPath)) {
      if (!brokenLinks.has(link)) {
        brokenLinks.set(link, []);
      }
      brokenLinks.get(link).push(file.url);
    }
  }
}

console.log(`📊 Summary:
- Total pages: ${htmlFiles.length}
- Total unique internal links: ${allInternalLinks.size}
- Broken links: ${brokenLinks.size}
`);

if (brokenLinks.size > 0) {
  console.log('🚨 Broken Links Analysis:\n');
  
  // Group by type
  const missingPosts = [];
  const missingTrailingSlash = [];
  const missingTagPages = [];
  const missingCategoryPages = [];
  const other = [];
  
  for (const [link, pages] of brokenLinks.entries()) {
    if (link.startsWith('/tags/') && link.endsWith('/')) {
      missingTagPages.push({ link, pages });
    } else if (link.match(/^\/[a-z-]+\/$/) && !link.includes('/')) {
      missingCategoryPages.push({ link, pages });
    } else if (link.match(/^\/[a-z0-9-]+$/) && !link.endsWith('/')) {
      // Check if adding trailing slash would fix it
      const withSlash = link + '/';
      const resolvedWithSlash = resolveInternalPath(withSlash);
      if (fs.existsSync(resolvedWithSlash)) {
        missingTrailingSlash.push({ link, pages, fixedLink: withSlash });
      } else {
        missingPosts.push({ link, pages });
      }
    } else {
      other.push({ link, pages });
    }
  }
  
  if (missingTrailingSlash.length > 0) {
    console.log('🔧 Links missing trailing slash (easy fix):');
    missingTrailingSlash.forEach(({ link, pages, fixedLink }) => {
      console.log(`  ${link} → ${fixedLink}`);
      console.log(`    Referenced by: ${pages.join(', ')}`);
    });
    console.log();
  }
  
  if (missingPosts.length > 0) {
    console.log('📝 Missing blog posts:');
    missingPosts.forEach(({ link, pages }) => {
      console.log(`  ${link}`);
      console.log(`    Referenced by: ${pages.join(', ')}`);
    });
    console.log();
  }
  
  if (missingTagPages.length > 0) {
    console.log('🏷️  Missing tag pages:');
    missingTagPages.forEach(({ link, pages }) => {
      console.log(`  ${link}`);
      console.log(`    Referenced by: ${pages.join(', ')}`);
    });
    console.log();
  }
  
  if (missingCategoryPages.length > 0) {
    console.log('📂 Missing category pages:');
    missingCategoryPages.forEach(({ link, pages }) => {
      console.log(`  ${link}`);
      console.log(`    Referenced by: ${pages.join(', ')}`);
    });
    console.log();
  }
  
  if (other.length > 0) {
    console.log('❓ Other broken links:');
    other.forEach(({ link, pages }) => {
      console.log(`  ${link}`);
      console.log(`    Referenced by: ${pages.join(', ')}`);
    });
    console.log();
  }
  
  console.log('💡 Recommendations:');
  console.log('1. Fix trailing slash issues by updating links in content');
  console.log('2. Create missing blog posts or remove references');
  console.log('3. Verify tag page generation is working correctly');
  console.log('4. Consider creating category landing pages or removing category links');
  
} else {
  console.log('✅ No broken links found!');
}