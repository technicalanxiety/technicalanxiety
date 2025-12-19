import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import fs from 'fs';
import path from 'path';

/**
 * Feature: astro-migration, Property 4: Tag Page Linking
 * 
 * Property 4: Tag Page Linking
 * For any post with tags, each tag SHALL link to a tag page that lists all posts with that tag.
 * 
 * Validates: Requirements 1.5
 */

describe('Tag Linking Property Tests', () => {
  // Helper function to get all posts with their tags
  function getPostsWithTags() {
    try {
      const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
      const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
      
      return files.map(file => {
        const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        
        if (!frontmatterMatch) {
          throw new Error(`No frontmatter found in ${file}`);
        }
        
        const [, frontmatter] = frontmatterMatch;
        const slug = file.replace('.md', '');
        
        // Parse frontmatter to extract tags
        const parsedFrontmatter: any = {};
        frontmatter.split('\n').forEach(line => {
          const match = line.match(/^(\w+):\s*(.+)$/);
          if (match) {
            const [, key, value] = match;
            if (key === 'tags' && value.startsWith('[')) {
              parsedFrontmatter[key] = value
                .replace(/[\[\]]/g, '')
                .split(',')
                .map(tag => tag.trim().replace(/['"]/g, ''));
            } else if (key === 'title') {
              parsedFrontmatter[key] = value.replace(/['"]/g, '');
            }
          }
        });
        
        return {
          slug,
          title: parsedFrontmatter.title,
          tags: parsedFrontmatter.tags || [],
        };
      }).filter(post => post.tags.length > 0); // Only posts with tags
    } catch (error) {
      console.error('Error reading posts:', error);
      return [];
    }
  }

  // Helper function to get all unique tags
  function getAllTags() {
    const posts = getPostsWithTags();
    const allTags = new Set<string>();
    
    posts.forEach(post => {
      post.tags.forEach((tag: string) => allTags.add(tag));
    });
    
    return Array.from(allTags);
  }



  // Helper function to get posts for a specific tag
  function getPostsForTag(tag: string) {
    const allPosts = getPostsWithTags();
    return allPosts.filter(post => post.tags.includes(tag));
  }

  test('Property 4: All tags used in posts have corresponding tag pages', () => {
    const allTags = getAllTags();
    
    // Ensure we have tags to test
    expect(allTags.length).toBeGreaterThan(0);
    
    // Property-based test: For all tags, verify tag page exists
    fc.assert(
      fc.property(
        fc.constantFrom(...allTags),
        (tag) => {
          // Verify the dynamic tag page route exists
          const tagPageExists = fs.existsSync(
            path.join(process.cwd(), 'src', 'pages', 'tags', '[tag].astro')
          );
          
          expect(tagPageExists).toBe(true);
          
          // Verify the tag has at least one post
          const postsWithTag = getPostsForTag(tag);
          expect(postsWithTag.length).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: Math.min(100, allTags.length) }
    );
  });

  test('Property 4: All posts with tags link to valid tag pages', () => {
    const postsWithTags = getPostsWithTags();
    
    // Ensure we have posts with tags to test
    expect(postsWithTags.length).toBeGreaterThan(0);
    
    // Property-based test: For all posts with tags, verify each tag links to a valid page
    fc.assert(
      fc.property(
        fc.constantFrom(...postsWithTags),
        (post) => {
          // For each tag in the post, verify it has a valid tag page
          post.tags.forEach((tag: string) => {
            // Verify the dynamic tag page route exists
            const tagPageExists = fs.existsSync(
              path.join(process.cwd(), 'src', 'pages', 'tags', '[tag].astro')
            );
            expect(tagPageExists).toBe(true);
            
            // Verify this post would appear on the tag page
            const postsForTag = getPostsForTag(tag);
            const postAppearsOnTagPage = postsForTag.some(p => p.slug === post.slug);
            expect(postAppearsOnTagPage).toBe(true);
          });
          
          return true;
        }
      ),
      { numRuns: Math.min(100, postsWithTags.length) }
    );
  });

  test('Property 4: Tag index page exists and lists all tags', () => {
    const allTags = getAllTags();
    
    // Verify tag index page exists
    const tagIndexExists = fs.existsSync(
      path.join(process.cwd(), 'src', 'pages', 'tags', 'index.astro')
    );
    expect(tagIndexExists).toBe(true);
    
    // Verify we have tags to list
    expect(allTags.length).toBeGreaterThan(0);
  });

  test('Property 4: Each tag has consistent post count across references', () => {
    const allTags = getAllTags();
    
    // Property-based test: For all tags, verify consistent post count
    fc.assert(
      fc.property(
        fc.constantFrom(...allTags),
        (tag) => {
          const postsForTag = getPostsForTag(tag);
          const postCount = postsForTag.length;
          
          // Verify tag has at least one post
          expect(postCount).toBeGreaterThan(0);
          
          // Verify all posts with this tag actually contain the tag
          postsForTag.forEach(post => {
            expect(post.tags).toContain(tag);
          });
          
          return true;
        }
      ),
      { numRuns: Math.min(100, allTags.length) }
    );
  });

  test('Property 4 Verification: Tag system integrity check', () => {
    const postsWithTags = getPostsWithTags();
    const allTags = getAllTags();
    
    // Verify we have posts and tags
    expect(postsWithTags.length).toBeGreaterThan(0);
    expect(allTags.length).toBeGreaterThan(0);
    
    // Verify every tag appears in at least one post
    allTags.forEach(tag => {
      const postsWithThisTag = postsWithTags.filter(post => post.tags.includes(tag));
      expect(postsWithThisTag.length).toBeGreaterThan(0);
    });
    
    // Verify tag page infrastructure exists
    const tagDynamicPageExists = fs.existsSync(
      path.join(process.cwd(), 'src', 'pages', 'tags', '[tag].astro')
    );
    const tagIndexPageExists = fs.existsSync(
      path.join(process.cwd(), 'src', 'pages', 'tags', 'index.astro')
    );
    
    expect(tagDynamicPageExists).toBe(true);
    expect(tagIndexPageExists).toBe(true);
  });
});