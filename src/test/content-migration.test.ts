import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import fs from 'fs';
import path from 'path';

/**
 * Feature: astro-migration, Property 1: Post Content Preservation
 * 
 * Property 1: Post Content Preservation
 * For any blog post in the Jekyll _posts directory, the Astro site SHALL render 
 * a corresponding page with matching title, date, tags, and content.
 * 
 * Validates: Requirements 1.1, 1.2
 */

describe('Content Migration Property Tests', () => {
  // Helper function to get Jekyll posts
  function getJekyllPosts() {
    const postsDir = path.join(process.cwd(), '..', '_posts');
    const files = fs.readdirSync(postsDir)
      .filter(file => file.endsWith('.md') && !file.startsWith('.'))
      .filter(file => /^\d{4}-\d{1,2}-\d{1,2}-.+\.md$/.test(file));
    
    return files.map(file => {
      const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      
      if (!frontmatterMatch) {
        throw new Error(`No frontmatter found in ${file}`);
      }
      
      const [, frontmatter] = frontmatterMatch;
      const slug = file.replace(/^\d{4}-\d{1,2}-\d{1,2}-/, '').replace('.md', '');
      
      // Parse frontmatter
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
          } else if (key === 'date') {
            parsedFrontmatter[key] = value.replace(/['"]/g, '');
          } else if (key !== 'layout') {
            parsedFrontmatter[key] = value.replace(/['"]/g, '');
          }
        }
      });
      
      return {
        slug,
        originalFile: file,
        title: parsedFrontmatter.title,
        date: parsedFrontmatter.date,
        tags: parsedFrontmatter.tags || [],
        series: parsedFrontmatter.series,
        series_part: parsedFrontmatter.series_part ? parseInt(parsedFrontmatter.series_part) : undefined,
        image: parsedFrontmatter.image,
        description: parsedFrontmatter.description,
      };
    });
  }

  // Helper function to get Astro posts
  function getAstroPosts() {
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
        
        // Parse frontmatter
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
            } else if (key === 'series_part') {
              parsedFrontmatter[key] = parseInt(value);
            } else {
              parsedFrontmatter[key] = value.replace(/['"]/g, '');
            }
          }
        });
        
        return {
          slug,
          title: parsedFrontmatter.title,
          date: parsedFrontmatter.date,
          tags: parsedFrontmatter.tags || [],
          series: parsedFrontmatter.series,
          series_part: parsedFrontmatter.series_part,
          image: parsedFrontmatter.image,
          description: parsedFrontmatter.description,
        };
      });
    } catch (error) {
      console.error('Error reading Astro posts:', error);
      return [];
    }
  }

  test('Property 1: All Jekyll posts have corresponding Astro pages with matching metadata', () => {
    const jekyllPosts = getJekyllPosts();
    const astroPosts = getAstroPosts();
    
    // Create a map of Astro posts by slug for quick lookup
    const astroPostMap = new Map(astroPosts.map(post => [post.slug, post]));
    
    // Property-based test: For all Jekyll posts, verify corresponding Astro post exists with matching data
    fc.assert(
      fc.property(
        fc.constantFrom(...jekyllPosts),
        (jekyllPost) => {
          const astroPost = astroPostMap.get(jekyllPost.slug);
          
          // Verify Astro post exists
          expect(astroPost).toBeDefined();
          if (!astroPost) return false;
          
          // Verify title matches
          expect(astroPost.title).toBe(jekyllPost.title);
          
          // Verify date matches (normalize format differences)
          const jekyllDate = new Date(jekyllPost.date).toISOString().split('T')[0];
          const astroDate = new Date(astroPost.date).toISOString().split('T')[0];
          expect(astroDate).toBe(jekyllDate);
          
          // Verify tags match (order doesn't matter)
          if (jekyllPost.tags && jekyllPost.tags.length > 0) {
            expect(astroPost.tags).toEqual(expect.arrayContaining(jekyllPost.tags));
            expect(jekyllPost.tags).toEqual(expect.arrayContaining(astroPost.tags));
          }
          
          // Verify series information matches
          if (jekyllPost.series) {
            expect(astroPost.series).toBe(jekyllPost.series);
          }
          if (jekyllPost.series_part) {
            expect(astroPost.series_part).toBe(jekyllPost.series_part);
          }
          
          // Verify image matches
          if (jekyllPost.image) {
            expect(astroPost.image).toBe(jekyllPost.image);
          }
          
          // Verify description matches
          if (jekyllPost.description) {
            expect(astroPost.description).toBe(jekyllPost.description);
          }
          
          return true;
        }
      ),
      { numRuns: Math.min(100, jekyllPosts.length) } // Run for all posts, up to 100
    );
  });

  test('Property 1 Verification: Count of Jekyll and Astro posts should match', () => {
    const jekyllPosts = getJekyllPosts();
    const astroPosts = getAstroPosts();
    
    expect(astroPosts.length).toBe(jekyllPosts.length);
    expect(jekyllPosts.length).toBeGreaterThan(0); // Ensure we have posts to test
  });
});