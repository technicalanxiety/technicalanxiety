#!/usr/bin/env node

/**
 * Check Backlog Posts for Broken Links
 * 
 * This script:
 * 1. Scans all backlog posts for internal links
 * 2. Checks if referenced posts exist in the main posts directory
 * 3. Validates link formats for Astro compatibility
 * 4. Reports any issues found
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKLOG_DIR = path.join(__dirname, '..', 'src', 'content', 'posts', 'backlog');
const POSTS_DIR = path.join(__dirname, '..', 'src', 'content', 'posts');

// Get list of existing published posts (without .md extension)
function getPublishedPosts() {
  return fs.readdirSync(POSTS_DIR)
    .filter(file => file.endsWith('.md'))
    .map(file => file.replace('.md', ''));
}

// Extract internal links from markdown content
function extractInternalLinks(content, filename) {
  const links = [];
  
  // Match markdown links: [text](/path/)
  const markdownLinkRegex = /\[([^\]]+)\]\(\/([^)]+)\/?\)/g;
  let match;
  
  while ((match = markdownLinkRegex.exec(content)) !== null) {
    const linkText = match[1];
    const linkPath = match[2];
    
    links.push({
      type: 'markdown',
      text: linkText,
      path: linkPath,
      fullMatch: match[0],
      line: content.substring(0, match.index).split('\n').length
    });
  }
  
  // Match HTML links: <a href="/path/">
  const htmlLinkRegex = /<a\s+href=["']\/([^"']+)\/?["'][^>]*>/g;
  
  while ((match = htmlLinkRegex.exec(content)) !== null) {
    const linkPath = match[1];
    
    links.push({
      type: 'html',
      text: 'HTML link',
      path: linkPath,
      fullMatch: match[0],
      line: content.substring(0, match.index).split('\n').length
    });
  }
  
  return links;
}

// Check if a link path corresponds to an existing post
function validateLink(linkPath, publishedPosts) {
  // Remove trailing slash and any fragments
  const cleanPath = linkPath.replace(/\/$/, '').split('#')[0];
  
  // Check if it's a post link (not a page like /about/, /tags/, etc.)
  const isPostLink = !['about', 'tags', 'archive', 'search', 'privacy', 'security', 'start-here', 'resume', 'changelog', 'azure', 'governance', 'leadership', 'log-analytics', 'operations'].includes(cleanPath);
  
  if (isPostLink) {
    return publishedPosts.includes(cleanPath);
  }
  
  // For non-post links, assume they're valid (pages, external, etc.)
  return true;
}

function checkPost(filepath, publishedPosts) {
  const filename = path.basename(filepath);
  
  if (filename === '.gitkeep') {
    return { filename, issues: [] };
  }
  
  const content = fs.readFileSync(filepath, 'utf8');
  const links = extractInternalLinks(content, filename);
  const issues = [];
  
  links.forEach(link => {
    const isValid = validateLink(link.path, publishedPosts);
    
    if (!isValid) {
      issues.push({
        type: 'broken_link',
        line: link.line,
        linkType: link.type,
        text: link.text,
        path: link.path,
        fullMatch: link.fullMatch,
        suggestion: `Post "${link.path}" not found. Check if slug is correct or if post exists.`
      });
    }
    
    // Check for Jekyll-style date prefixes in links
    if (link.path.match(/^\d{4}-\d{2}-\d{2}-/)) {
      issues.push({
        type: 'jekyll_format',
        line: link.line,
        linkType: link.type,
        text: link.text,
        path: link.path,
        fullMatch: link.fullMatch,
        suggestion: `Remove date prefix from link: /${link.path.replace(/^\d{4}-\d{2}-\d{2}-/, '')}/`
      });
    }
    
    // Check for missing trailing slash (Astro convention)
    if (link.type === 'markdown' && !link.fullMatch.endsWith('/)')) {
      issues.push({
        type: 'missing_slash',
        line: link.line,
        linkType: link.type,
        text: link.text,
        path: link.path,
        fullMatch: link.fullMatch,
        suggestion: `Add trailing slash: [${link.text}](/${link.path}/)`
      });
    }
  });
  
  return { filename, links, issues };
}

console.log('🔍 Checking backlog posts for broken links...\n');

const publishedPosts = getPublishedPosts();
console.log(`📚 Found ${publishedPosts.length} published posts to validate against\n`);

const backlogFiles = fs.readdirSync(BACKLOG_DIR)
  .filter(file => file.endsWith('.md'))
  .map(file => path.join(BACKLOG_DIR, file));

let totalIssues = 0;
let totalLinks = 0;

backlogFiles.forEach(filepath => {
  const result = checkPost(filepath, publishedPosts);
  
  if (result.filename === '.gitkeep') return;
  
  console.log(`📄 ${result.filename}`);
  
  if (result.links && result.links.length > 0) {
    console.log(`   🔗 Found ${result.links.length} internal link(s)`);
    totalLinks += result.links.length;
  }
  
  if (result.issues.length > 0) {
    console.log(`   ❌ ${result.issues.length} issue(s) found:`);
    
    result.issues.forEach(issue => {
      console.log(`      Line ${issue.line}: ${issue.type.toUpperCase()}`);
      console.log(`      Link: ${issue.fullMatch}`);
      console.log(`      Issue: ${issue.suggestion}`);
      console.log('');
    });
    
    totalIssues += result.issues.length;
  } else if (result.links && result.links.length > 0) {
    console.log(`   ✅ All links look good`);
  } else {
    console.log(`   ℹ️  No internal links found`);
  }
  
  console.log('');
});

console.log('📊 Summary:');
console.log(`   Total internal links: ${totalLinks}`);
console.log(`   Total issues: ${totalIssues}`);

if (totalIssues === 0) {
  console.log('\n🎉 All links look good! No issues found.');
} else {
  console.log(`\n⚠️  Found ${totalIssues} issue(s) that should be fixed.`);
  console.log('\n💡 Tips:');
  console.log('   - Internal post links should use format: [Text](/post-slug/)');
  console.log('   - Remove date prefixes from Jekyll-era links');
  console.log('   - Ensure referenced posts exist in src/content/posts/');
}