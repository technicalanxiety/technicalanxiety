#!/usr/bin/env node

/**
 * Backlog Management Script for Astro
 * 
 * Usage:
 *   node scripts/manage-backlog.js list                    # List all backlog posts
 *   node scripts/manage-backlog.js add "Post Title"        # Create new backlog post
 *   node scripts/manage-backlog.js publish post-slug.md    # Manually publish a post
 *   node scripts/manage-backlog.js check                   # Check which posts are ready
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKLOG_DIR = path.join(__dirname, '..', 'src', 'content', 'backlog');
const POSTS_DIR = path.join(__dirname, '..', 'src', 'content', 'posts');

// Ensure directories exist
if (!fs.existsSync(BACKLOG_DIR)) {
  fs.mkdirSync(BACKLOG_DIR, { recursive: true });
}

function listBacklogPosts() {
  console.log('📋 Backlog Posts:\n');
  
  const files = fs.readdirSync(BACKLOG_DIR)
    .filter(file => file.endsWith('.md') && file !== '.gitkeep')
    .sort();
  
  if (files.length === 0) {
    console.log('No posts in backlog.');
    return;
  }
  
  files.forEach(file => {
    const content = fs.readFileSync(path.join(BACKLOG_DIR, file), 'utf8');
    const dateMatch = content.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m);
    const titleMatch = content.match(/^title:\s*["']?(.+?)["']?\s*$/m);
    
    const date = dateMatch ? dateMatch[1] : 'No date';
    const title = titleMatch ? titleMatch[1] : 'No title';
    const isReady = dateMatch && new Date(dateMatch[1]) <= new Date();
    
    console.log(`${isReady ? '✅' : '⏳'} ${file}`);
    console.log(`   Title: ${title}`);
    console.log(`   Date: ${date}`);
    console.log('');
  });
}

function checkReadyPosts() {
  console.log('🔍 Posts Ready to Publish:\n');
  
  const files = fs.readdirSync(BACKLOG_DIR)
    .filter(file => file.endsWith('.md') && file !== '.gitkeep');
  
  const readyPosts = files.filter(file => {
    const content = fs.readFileSync(path.join(BACKLOG_DIR, file), 'utf8');
    const dateMatch = content.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m);
    return dateMatch && new Date(dateMatch[1]) <= new Date();
  });
  
  if (readyPosts.length === 0) {
    console.log('No posts ready to publish.');
    return;
  }
  
  readyPosts.forEach(file => {
    const content = fs.readFileSync(path.join(BACKLOG_DIR, file), 'utf8');
    const titleMatch = content.match(/^title:\s*["']?(.+?)["']?\s*$/m);
    const dateMatch = content.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m);
    
    console.log(`✅ ${file}`);
    console.log(`   Title: ${titleMatch ? titleMatch[1] : 'No title'}`);
    console.log(`   Date: ${dateMatch[1]}`);
    console.log('');
  });
}

function createBacklogPost(title) {
  const slug = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  const filename = `${slug}.md`;
  const filepath = path.join(BACKLOG_DIR, filename);
  
  if (fs.existsSync(filepath)) {
    console.log(`❌ Post already exists: ${filename}`);
    return;
  }
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split('T')[0];
  
  const template = `---
title: "${title}"
date: ${dateStr}
tags: []
description: ""
image: ""
---

# ${title}

Your content here...
`;
  
  fs.writeFileSync(filepath, template);
  console.log(`✅ Created backlog post: ${filename}`);
  console.log(`📅 Scheduled for: ${dateStr}`);
  console.log(`📝 Edit: src/content/backlog/${filename}`);
}

function publishPost(filename) {
  const backlogPath = path.join(BACKLOG_DIR, filename);
  const postsPath = path.join(POSTS_DIR, filename);
  
  if (!fs.existsSync(backlogPath)) {
    console.log(`❌ Post not found in backlog: ${filename}`);
    return;
  }
  
  if (fs.existsSync(postsPath)) {
    console.log(`❌ Post already exists in posts: ${filename}`);
    return;
  }
  
  fs.renameSync(backlogPath, postsPath);
  console.log(`✅ Published: ${filename}`);
  console.log(`📍 Moved to: src/content/posts/${filename}`);
}

// Main script logic
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'list':
    listBacklogPosts();
    break;
  case 'check':
    checkReadyPosts();
    break;
  case 'add':
    if (!arg) {
      console.log('❌ Please provide a post title');
      console.log('Usage: node scripts/manage-backlog.js add "Post Title"');
      process.exit(1);
    }
    createBacklogPost(arg);
    break;
  case 'publish':
    if (!arg) {
      console.log('❌ Please provide a filename');
      console.log('Usage: node scripts/manage-backlog.js publish post-slug.md');
      process.exit(1);
    }
    publishPost(arg);
    break;
  default:
    console.log('📚 Backlog Management Script\n');
    console.log('Usage:');
    console.log('  node scripts/manage-backlog.js list                    # List all backlog posts');
    console.log('  node scripts/manage-backlog.js add "Post Title"        # Create new backlog post');
    console.log('  node scripts/manage-backlog.js publish post-slug.md    # Manually publish a post');
    console.log('  node scripts/manage-backlog.js check                   # Check which posts are ready');
    break;
}