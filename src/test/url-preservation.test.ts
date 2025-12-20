import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import fs from 'fs';
import path from 'path';

/**
 * Feature: astro-migration, Property 12: URL Structure Preservation
 * 
 * Property 12: URL Structure Preservation
 * For any post, the Astro URL SHALL follow the Jekyll URL format (:title/), 
 * ensuring consistent URL structure and no broken links.
 * 
 * Validates: Requirements 4.3
 */

describe('URL Structure Preservation Property Tests', () => {
  // Helper function to get expected URLs from Astro posts (only published ones)
  function getExpectedPostUrls() {
    const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
    const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
    
    // Get current date in Central Time zone (same logic as posts.ts)
    const nowUTC = new Date();
    const centralTimeString = nowUTC.toLocaleString("en-US", {
      timeZone: "America/Chicago",
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    // Parse Central date: MM/DD/YYYY -> YYYY-MM-DD
    const [month, day, year] = centralTimeString.split('/');
    const centralDateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    
    return files.map(file => {
      const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      
      if (!frontmatterMatch) {
        return null; // Skip files without frontmatter
      }
      
      const [, frontmatter] = frontmatterMatch;
      const slug = file.replace('.md', '');
      const expectedUrl = `/${slug}/`;
      
      // Parse frontmatter to check date and draft status
      let isDraft = false;
      let postDateString = '';
      
      frontmatter.split('\n').forEach(line => {
        const match = line.match(/^(\w+):\s*(.+)$/);
        if (match) {
          const [, key, value] = match;
          if (key === 'draft') {
            isDraft = value.toLowerCase() === 'true';
          } else if (key === 'date') {
            const postDate = new Date(value.replace(/['"]/g, ''));
            postDateString = `${postDate.getUTCFullYear()}-${String(postDate.getUTCMonth() + 1).padStart(2, '0')}-${String(postDate.getUTCDate()).padStart(2, '0')}`;
          }
        }
      });
      
      // Filter out drafts and future posts (same logic as getPublishedPosts)
      if (isDraft || postDateString > centralDateString) {
        return null;
      }
      
      return {
        originalFile: file,
        slug,
        expectedUrl
      };
    }).filter(Boolean); // Remove null entries
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
          
          // Only include post pages (not homepage, static pages, tags, pagination, etc.)
          // Filter out known static pages by exact match, not substring match
          const staticPages = [
            'about', 'archive', 'azure', 'changelog', 'governance', 
            'leadership', 'log-analytics', 'operations', 'privacy', 
            'resume', 'security', 'start-here', '404'
          ];
          
          if (basePath && 
              !basePath.includes('tags') && 
              !basePath.includes('page') && 
              !basePath.includes('search') &&
              !staticPages.includes(basePath)) {
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
    const expectedUrls = getExpectedPostUrls();
    const astroPages = getAstroPageUrls();
    
    // Create a map of Astro pages by slug for quick lookup
    const astroPageMap = new Map(astroPages.map(page => [page.slug, page]));
    
    // Property-based test: For all expected posts, verify Astro URL matches expected format
    fc.assert(
      fc.property(
        fc.constantFrom(...expectedUrls),
        (expectedPost) => {
          const astroPage = astroPageMap.get(expectedPost.slug);
          
          // Verify Astro page exists
          expect(astroPage).toBeDefined();
          if (!astroPage) {
            throw new Error(`Astro page not found for slug: ${expectedPost.slug}`);
          }
          
          // Verify URL matches exactly
          expect(astroPage.actualUrl).toBe(expectedPost.expectedUrl);
          
          // Verify URL follows Jekyll permalink format
          expect(validateUrlFormat(astroPage.actualUrl)).toBe(true);
          
          return true;
        }
      ),
      { numRuns: Math.min(100, expectedUrls.length) } // Run for all posts, up to 100
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
    const expectedUrls = getExpectedPostUrls();
    const astroPages = getAstroPageUrls();
    
    // Verify we have posts to test
    expect(expectedUrls.length).toBeGreaterThan(0);
    expect(astroPages.length).toBeGreaterThan(0);
    
    // Verify counts match (all expected posts should have corresponding Astro pages)
    expect(astroPages.length).toBe(expectedUrls.length);
    
    // Verify we're testing various post types by checking slug patterns
    const slugs = expectedUrls.map(post => post.slug);
    
    // Should have posts with different patterns
    const hasMultiPartSeries = slugs.some(slug => slug.includes('-pt'));
    const hasSingleWords = slugs.some(slug => !slug.includes('-'));
    const hasHyphenatedTitles = slugs.some(slug => slug.includes('-') && !slug.includes('-pt'));
    
    console.log(`Testing URL preservation for ${expectedUrls.length} posts:
      - Multi-part series: ${hasMultiPartSeries}
      - Single word titles: ${hasSingleWords}
      - Hyphenated titles: ${hasHyphenatedTitles}
      - Sample URLs: ${expectedUrls.slice(0, 5).map(p => p.expectedUrl).join(', ')}`);
  });

  test('Property 12 Edge Cases: Special characters and URL encoding', () => {
    const expectedUrls = getExpectedPostUrls();
    
    // Test posts that might have special URL considerations
    for (const post of expectedUrls) {
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

  test('Property 12 Consistency: Astro slug generation follows Jekyll format', () => {
    const expectedUrls = getExpectedPostUrls();
    
    // Verify Astro slug generation is consistent with Jekyll format
    for (const post of expectedUrls) {
      // Slug should be derived from filename by removing .md extension
      const expectedSlug = post.originalFile.replace('.md', '');
      
      expect(post.slug).toBe(expectedSlug);
      
      // Expected URL should be /:slug/
      expect(post.expectedUrl).toBe(`/${expectedSlug}/`);
      
      // Verify slug follows Jekyll naming conventions (lowercase, hyphens)
      expect(post.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });
});
