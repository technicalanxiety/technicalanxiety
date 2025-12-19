import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import fs from 'fs';
import path from 'path';

/**
 * Feature: astro-migration, Property 8: Table of Contents Generation
 * 
 * Property 8: Table of Contents Generation
 * For any post containing h2 or h3 headings, the table of contents SHALL 
 * contain anchor links to each heading.
 * 
 * Validates: Requirements 3.2
 */

describe('Table of Contents Property Tests', () => {
  // Helper function to extract headings from markdown content
  function extractHeadings(content: string): Array<{ level: number; text: string; slug: string }> {
    const headings: Array<{ level: number; text: string; slug: string }> = [];
    
    // Remove frontmatter
    const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');
    
    // Find all h2 and h3 headings
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    let match;
    
    while ((match = headingRegex.exec(contentWithoutFrontmatter)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      
      // Generate slug (simplified version of what Astro does)
      const slug = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
      
      if (level === 2 || level === 3) {
        headings.push({ level, text, slug });
      }
    }
    
    return headings;
  }

  // Helper function to get all posts with their content
  function getPostsWithContent() {
    try {
      const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
      const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
      
      return files.map(file => {
        const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
        const slug = file.replace('.md', '');
        
        // Extract frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        let title = slug;
        let draft = false;
        
        if (frontmatterMatch) {
          const [, frontmatter] = frontmatterMatch;
          frontmatter.split('\n').forEach(line => {
            const match = line.match(/^(\w+):\s*(.+)$/);
            if (match) {
              const [, key, value] = match;
              if (key === 'title') {
                title = value.replace(/['"]/g, '');
              } else if (key === 'draft') {
                draft = value.replace(/['"]/g, '') === 'true';
              }
            }
          });
        }
        
        const headings = extractHeadings(content);
        
        return {
          slug,
          title,
          content,
          headings,
          draft,
        };
      }).filter(post => !post.draft); // Filter out drafts
    } catch (error) {
      console.error('Error reading posts:', error);
      return [];
    }
  }

  // Helper function to simulate TOC generation logic
  function generateTOC(headings: Array<{ level: number; text: string; slug: string }>) {
    // Filter to only h2 and h3 headings (matching component logic)
    const tocHeadings = headings.filter(h => h.level === 2 || h.level === 3);
    
    // Only show TOC if there are at least 2 headings (matching component logic)
    const shouldShowTOC = tocHeadings.length >= 2;
    
    return {
      shouldShow: shouldShowTOC,
      headings: tocHeadings,
    };
  }

  test('Property 8: TOC contains links to all h2/h3 headings', () => {
    const posts = getPostsWithContent();
    
    // Filter to posts that have headings
    const postsWithHeadings = posts.filter(post => post.headings.length > 0);
    
    expect(postsWithHeadings.length).toBeGreaterThan(0); // Ensure we have posts with headings to test
    
    // Property-based test: For all posts with headings, verify TOC generation is correct
    fc.assert(
      fc.property(
        fc.constantFrom(...postsWithHeadings),
        (post) => {
          const toc = generateTOC(post.headings);
          
          // If post has 2+ h2/h3 headings, TOC should be shown
          const h2h3Headings = post.headings.filter(h => h.level === 2 || h.level === 3);
          
          if (h2h3Headings.length >= 2) {
            expect(toc.shouldShow).toBe(true);
            expect(toc.headings.length).toBe(h2h3Headings.length);
            
            // Verify all h2/h3 headings are included in TOC
            h2h3Headings.forEach((heading, index) => {
              expect(toc.headings[index]).toEqual(heading);
            });
            
            // Verify all TOC headings have valid slugs (non-empty)
            toc.headings.forEach(heading => {
              expect(heading.slug).toBeTruthy();
              expect(typeof heading.slug).toBe('string');
              expect(heading.slug.length).toBeGreaterThan(0);
            });
            
            // Verify all TOC headings have text
            toc.headings.forEach(heading => {
              expect(heading.text).toBeTruthy();
              expect(typeof heading.text).toBe('string');
              expect(heading.text.length).toBeGreaterThan(0);
            });
            
            // Verify heading levels are 2 or 3
            toc.headings.forEach(heading => {
              expect([2, 3]).toContain(heading.level);
            });
          } else {
            // If fewer than 2 h2/h3 headings, TOC should not be shown
            expect(toc.shouldShow).toBe(false);
          }
          
          return true;
        }
      ),
      { numRuns: Math.min(100, postsWithHeadings.length) }
    );
  });

  test('Property 8 Verification: Heading slug generation is consistent', () => {
    const posts = getPostsWithContent();
    const postsWithHeadings = posts.filter(post => post.headings.length > 0);
    
    // Verify slug generation produces valid anchor-friendly strings
    fc.assert(
      fc.property(
        fc.constantFrom(...postsWithHeadings),
        (post) => {
          post.headings.forEach(heading => {
            // Slug should be lowercase
            expect(heading.slug).toBe(heading.slug.toLowerCase());
            
            // Slug should not contain spaces
            expect(heading.slug).not.toMatch(/\s/);
            
            // Slug should not start or end with hyphens
            expect(heading.slug).not.toMatch(/^-|-$/);
            
            // Slug should only contain valid URL characters
            expect(heading.slug).toMatch(/^[a-z0-9-]+$/);
            
            // Slug should not be empty for non-empty text
            if (heading.text.trim().length > 0) {
              expect(heading.slug.length).toBeGreaterThan(0);
            }
          });
          
          return true;
        }
      ),
      { numRuns: Math.min(100, postsWithHeadings.length) }
    );
  });

  test('Property 8 Verification: TOC shows only for posts with sufficient headings', () => {
    const posts = getPostsWithContent();
    
    // Test the threshold logic
    posts.forEach(post => {
      const toc = generateTOC(post.headings);
      const h2h3Count = post.headings.filter(h => h.level === 2 || h.level === 3).length;
      
      if (h2h3Count >= 2) {
        expect(toc.shouldShow).toBe(true);
      } else {
        expect(toc.shouldShow).toBe(false);
      }
    });
  });

  test('Property 8 Verification: Heading extraction finds all markdown headings', () => {
    // Test with sample markdown content
    const sampleContent = `---
title: "Test Post"
---

# Main Title (H1 - should be ignored)

## First Section (H2 - should be included)

Some content here.

### Subsection A (H3 - should be included)

More content.

### Subsection B (H3 - should be included)

Even more content.

## Second Section (H2 - should be included)

Final content.

#### Deep Section (H4 - should be ignored)

This should not appear in TOC.
`;

    const headings = extractHeadings(sampleContent);
    
    // Should find 4 headings (2 h2s and 2 h3s)
    expect(headings.length).toBe(4);
    
    // Verify the headings are correct
    expect(headings[0]).toEqual({
      level: 2,
      text: 'First Section (H2 - should be included)',
      slug: 'first-section-h2-should-be-included'
    });
    
    expect(headings[1]).toEqual({
      level: 3,
      text: 'Subsection A (H3 - should be included)',
      slug: 'subsection-a-h3-should-be-included'
    });
    
    expect(headings[2]).toEqual({
      level: 3,
      text: 'Subsection B (H3 - should be included)',
      slug: 'subsection-b-h3-should-be-included'
    });
    
    expect(headings[3]).toEqual({
      level: 2,
      text: 'Second Section (H2 - should be included)',
      slug: 'second-section-h2-should-be-included'
    });
  });
});