import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import fs from 'fs';
import path from 'path';

/**
 * Feature: astro-migration, Property 1: Post Content Preservation
 * 
 * Property 1: Post Content Preservation
 * For any migrated blog post in the Astro content directory, the post SHALL have 
 * valid frontmatter, proper structure, and all required metadata fields.
 * 
 * Validates: Requirements 1.1, 1.2
 */

describe('Content Migration Property Tests', () => {
  // Helper function to validate required frontmatter fields
  function validateRequiredFields(post: any) {
    const requiredFields = ['title', 'date'];
    return requiredFields.every(field => post[field] && post[field].trim() !== '');
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

  test('Property 1: All migrated posts have valid structure and required metadata', () => {
    const astroPosts = getAstroPosts();
    
    // Ensure we have posts to test
    expect(astroPosts.length).toBeGreaterThan(0);
    
    // Property-based test: For all Astro posts, verify they have valid structure
    fc.assert(
      fc.property(
        fc.constantFrom(...astroPosts),
        (astroPost) => {
          // Verify required fields exist
          expect(validateRequiredFields(astroPost)).toBe(true);
          
          // Verify title is non-empty string
          expect(astroPost.title).toBeTruthy();
          expect(typeof astroPost.title).toBe('string');
          
          // Verify date is valid
          expect(astroPost.date).toBeTruthy();
          const parsedDate = new Date(astroPost.date);
          expect(parsedDate.toString()).not.toBe('Invalid Date');
          
          // Verify tags are array if present
          if (astroPost.tags) {
            expect(Array.isArray(astroPost.tags)).toBe(true);
            astroPost.tags.forEach((tag: any) => {
              expect(typeof tag).toBe('string');
              expect(tag.trim()).toBeTruthy();
            });
          }
          
          // Verify series_part is number if present
          if (astroPost.series_part !== undefined) {
            expect(typeof astroPost.series_part).toBe('number');
            expect(astroPost.series_part).toBeGreaterThan(0);
          }
          
          // Verify slug is valid (no spaces, special chars)
          expect(astroPost.slug).toMatch(/^[a-z0-9-]+$/);
          
          return true;
        }
      ),
      { numRuns: Math.min(100, astroPosts.length) }
    );
  });

  test('Property 1 Verification: All posts have consistent frontmatter structure', () => {
    const astroPosts = getAstroPosts();
    
    expect(astroPosts.length).toBeGreaterThan(0);
    
    // Verify all posts have required fields
    astroPosts.forEach(post => {
      expect(post.title).toBeTruthy();
      expect(post.date).toBeTruthy();
      expect(post.slug).toBeTruthy();
    });
    
    // Verify posts with series have consistent series_part numbering
    const seriesPosts = astroPosts.filter(post => post.series);
    const seriesGroups = seriesPosts.reduce((groups: any, post) => {
      if (!groups[post.series]) {
        groups[post.series] = [];
      }
      groups[post.series].push(post);
      return groups;
    }, {});
    
    Object.values(seriesGroups).forEach((posts: any) => {
      if (posts.length > 1) {
        const parts = posts.map((p: any) => p.series_part).filter((p: any) => p !== undefined);
        if (parts.length > 0) {
          // Verify series parts are sequential starting from 1
          parts.sort((a: number, b: number) => a - b);
          expect(parts[0]).toBe(1);
          for (let i = 1; i < parts.length; i++) {
            expect(parts[i]).toBe(parts[i-1] + 1);
          }
        }
      }
    });
  });
});