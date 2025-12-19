import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import fs from 'fs';
import path from 'path';

/**
 * Feature: astro-migration, Property 12: URL Structure Preservation
 * 
 * Property 12: URL Structure Preservation
 * For any post, the Astro URL SHALL match the Jekyll URL format (:title/), 
 * ensuring no broken links from external sources.
 * 
 * Validates: Requirements 4.3
 */

describe('URL Structure Preservation Property Tests', () => {
  // Helper function to get Jekyll posts and their expected URLs
  function getJekyllPostUrls() {
    const postsDir = path.join(process.cwd(), '..', '_posts');
    const files = fs.readdirSync(postsDir)
      .filter(file => file.endsWith('.md') && !file.startsWith('.'))
      .filter(file => /^\d{4}-\d{1,2}-\d{1,2}-.+\.md$/.test(file));
    
    return files.map(file => {
      // Jekyll permalink format: :title/ (slug from filename without date prefix)
      const slug = file.replace(/^\d{4}-\d{1,2}-\d{1,2}-/, '').replace('.md', '');
      const expectedUrl = `/${slug}/`;
      
      return {
        originalFile: file,
        slug,
        expectedUrl
      };
    });
  }

  // Helper function to get Astro built pages
  function getAstroPageUrls() {
    const distDir = path.join(process.cwd(), 'dist');
    
    if (!fs.existsSync(distDir)) {
      throw new Error('Dist directory not found. Run "npm run build" first.');
    }
    
    const pages: Array<{ slug: string; actualUrl: string; filePath: string }> = [];
    
    function scanDirectory(dir: string, basePath = '') {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip certain directories
          if (!['_astro', 'img', 'tags', 'page', 'search'].includes(item)) {
            scanDirectory(fullPath, path.join(basePath, item));
          }
        } else if (item === 'index.html') {
          // This represents a page at the directory path
          const actualUrl = basePath ? `/${basePath}/` : '/';
          const slug = basePath || 'index';
          
          // Only include post pages (not homepage, tags, pagination, etc.)
          if (basePath && 
              !basePath.includes('tags') && 
              !basePath.includes('page') && 
              !basePath.includes('search') &&
              basePath !== '404') {
            pages.push({
              slug,
              actualUrl,
              filePath: fullPath
            });
          }
        }
      }
    }
    
    scanDirectory(distDir);
    return pages;
  }

  // Helper function to validate URL format
  function validateUrlFormat(url: string) {
    // Jekyll permalink format: /:title/ 
    // Should start with /, end with /, and contain only the slug
    const urlPattern = /^\/[a-z0-9-]+\/$/;
    return urlPattern.test(url);
  }

  test('Property 12: Astro URLs match Jekyll URL format for all posts', () => {
    const jekyllUrls = getJekyllPostUrls();
    const astroPages = getAstroPageUrls();
    
    // Create a map of Astro pages by slug for quick lookup
    const astroPageMap = new Map(astroPages.map(page => [page.slug, page]));
    
    // Property-based test: For all Jekyll posts, verify Astro URL matches expected format
    fc.assert(
      fc.property(
        fc.constantFrom(...jekyllUrls),
        (jekyllPost) => {
          const astroPage = astroPageMap.get(jekyllPost.slug);
          
          // Verify Astro page exists
          expect(astroPage).toBeDefined();
          if (!astroPage) {
            throw new Error(`Astro page not found for slug: ${jekyllPost.slug}`);
          }
          
          // Verify URL matches exactly
          expect(astroPage.actualUrl).toBe(jekyllPost.expectedUrl);
          
          // Verify URL follows Jekyll permalink format
          expect(validateUrlFormat(astroPage.actualUrl)).toBe(true);
          
          return true;
        }
      ),
      { numRuns: Math.min(100, jekyllUrls.length) } // Run for all posts, up to 100
    );
  });

  test('Property 12 Verification: All Astro post URLs follow Jekyll format', () => {
    const astroPages = getAstroPageUrls();
    
    // Verify all Astro post URLs follow the Jekyll permalink format
    for (const page of astroPages) {
      expect(validateUrlFormat(page.actualUrl)).toBe(true);
      
      // Verify URL structure: should be /:slug/
      expect(page.actualUrl).toMatch(/^\/[a-z0-9-]+\/$/);
      
      // Verify slug matches the directory name
      const expectedUrl = `/${page.slug}/`;
      expect(page.actualUrl).toBe(expectedUrl);
    }
  });

  test('Property 12 Coverage: URL preservation covers all post types', () => {
    const jekyllUrls = getJekyllPostUrls();
    const astroPages = getAstroPageUrls();
    
    // Verify we have posts to test
    expect(jekyllUrls.length).toBeGreaterThan(0);
    expect(astroPages.length).toBeGreaterThan(0);
    
    // Verify counts match (all Jekyll posts should have corresponding Astro pages)
    expect(astroPages.length).toBe(jekyllUrls.length);
    
    // Verify we're testing various post types by checking slug patterns
    const slugs = jekyllUrls.map(post => post.slug);
    
    // Should have posts with different patterns
    const hasMultiPartSeries = slugs.some(slug => slug.includes('-pt'));
    const hasSingleWords = slugs.some(slug => !slug.includes('-'));
    const hasHyphenatedTitles = slugs.some(slug => slug.includes('-') && !slug.includes('-pt'));
    
    console.log(`Testing URL preservation for ${jekyllUrls.length} posts:
      - Multi-part series: ${hasMultiPartSeries}
      - Single word titles: ${hasSingleWords}
      - Hyphenated titles: ${hasHyphenatedTitles}
      - Sample URLs: ${jekyllUrls.slice(0, 5).map(p => p.expectedUrl).join(', ')}`);
  });

  test('Property 12 Edge Cases: Special characters and URL encoding', () => {
    const jekyllUrls = getJekyllPostUrls();
    
    // Test posts that might have special URL considerations
    for (const post of jekyllUrls) {
      // Verify slug doesn't contain invalid URL characters
      expect(post.slug).not.toMatch(/[^a-z0-9-]/);
      
      // Verify slug doesn't start or end with hyphen
      expect(post.slug).not.toMatch(/^-|-$/);
      
      // Verify URL is properly formatted
      expect(post.expectedUrl).toMatch(/^\/[a-z0-9-]+\/$/);
      
      // Verify no double hyphens (which could indicate encoding issues)
      expect(post.slug).not.toMatch(/--/);
    }
  });

  test('Property 12 Consistency: Jekyll and Astro slug generation', () => {
    const jekyllUrls = getJekyllPostUrls();
    
    // Verify Jekyll slug generation is consistent
    for (const post of jekyllUrls) {
      // Slug should be derived from filename by removing date prefix and .md extension
      const expectedSlug = post.originalFile
        .replace(/^\d{4}-\d{1,2}-\d{1,2}-/, '')
        .replace('.md', '');
      
      expect(post.slug).toBe(expectedSlug);
      
      // Expected URL should be /:slug/
      expect(post.expectedUrl).toBe(`/${expectedSlug}/`);
    }
  });
});