import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

/**
 * Feature: astro-migration, Property 11: Meta Tag Completeness
 * 
 * Property 11: Meta Tag Completeness
 * For any page, the HTML head SHALL contain title, description, og:title, 
 * og:description, og:image, twitter:card, and canonical URL meta tags.
 * 
 * Validates: Requirements 4.1, 4.2
 */

describe('Meta Tag Completeness Property Tests', () => {
  // Helper function to get all built HTML pages
  function getBuiltPages() {
    const distDir = path.join(process.cwd(), 'dist');
    
    if (!fs.existsSync(distDir)) {
      throw new Error('Dist directory not found. Run "npm run build" first.');
    }
    
    const pages: Array<{ path: string; content: string }> = [];
    
    function scanDirectory(dir: string, basePath = '') {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip certain directories
          if (!['_astro', 'img'].includes(item)) {
            scanDirectory(fullPath, path.join(basePath, item));
          }
        } else if (item === 'index.html' || item.endsWith('.html')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const pagePath = item === 'index.html' 
            ? (basePath || '/') 
            : path.join(basePath, item).replace(/\.html$/, '/');
          
          pages.push({
            path: pagePath,
            content
          });
        }
      }
    }
    
    scanDirectory(distDir);
    return pages;
  }

  // Helper function to extract meta tags from HTML
  function extractMetaTags(html: string) {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    const metaTags = {
      title: document.querySelector('title')?.textContent || '',
      description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '',
      ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '',
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
      ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content') || '',
      twitterCard: document.querySelector('meta[property="twitter:card"]')?.getAttribute('content') || '',
      twitterTitle: document.querySelector('meta[property="twitter:title"]')?.getAttribute('content') || '',
      twitterDescription: document.querySelector('meta[property="twitter:description"]')?.getAttribute('content') || '',
      twitterImage: document.querySelector('meta[property="twitter:image"]')?.getAttribute('content') || '',
    };
    
    return metaTags;
  }

  // Helper function to validate required meta tags
  function validateRequiredMetaTags(metaTags: ReturnType<typeof extractMetaTags>, pagePath: string) {
    const errors: string[] = [];
    
    // Title is required and should not be empty
    if (!metaTags.title.trim()) {
      errors.push(`Missing or empty title tag for page: ${pagePath}`);
    }
    
    // Description is required and should not be empty
    if (!metaTags.description.trim()) {
      errors.push(`Missing or empty description meta tag for page: ${pagePath}`);
    }
    
    // Canonical URL is required
    if (!metaTags.canonical.trim()) {
      errors.push(`Missing canonical URL for page: ${pagePath}`);
    }
    
    // Open Graph tags are required
    if (!metaTags.ogTitle.trim()) {
      errors.push(`Missing og:title for page: ${pagePath}`);
    }
    
    if (!metaTags.ogDescription.trim()) {
      errors.push(`Missing og:description for page: ${pagePath}`);
    }
    
    if (!metaTags.ogImage.trim()) {
      errors.push(`Missing og:image for page: ${pagePath}`);
    }
    
    if (!metaTags.ogUrl.trim()) {
      errors.push(`Missing og:url for page: ${pagePath}`);
    }
    
    // Twitter Card tags are required
    if (!metaTags.twitterCard.trim()) {
      errors.push(`Missing twitter:card for page: ${pagePath}`);
    }
    
    if (!metaTags.twitterTitle.trim()) {
      errors.push(`Missing twitter:title for page: ${pagePath}`);
    }
    
    if (!metaTags.twitterDescription.trim()) {
      errors.push(`Missing twitter:description for page: ${pagePath}`);
    }
    
    if (!metaTags.twitterImage.trim()) {
      errors.push(`Missing twitter:image for page: ${pagePath}`);
    }
    
    return errors;
  }

  test('Property 11: All pages have required meta tags', () => {
    const pages = getBuiltPages();
    
    // Ensure we have pages to test
    expect(pages.length).toBeGreaterThan(0);
    
    // Property-based test: For all pages, verify required meta tags exist
    fc.assert(
      fc.property(
        fc.constantFrom(...pages),
        (page) => {
          const metaTags = extractMetaTags(page.content);
          const errors = validateRequiredMetaTags(metaTags, page.path);
          
          // If there are errors, fail with detailed message
          if (errors.length > 0) {
            throw new Error(`Meta tag validation failed for ${page.path}:\n${errors.join('\n')}`);
          }
          
          return true;
        }
      ),
      { numRuns: Math.min(100, pages.length) } // Run for all pages, up to 100
    );
  });

  test('Property 11 Verification: Meta tag consistency across pages', () => {
    const pages = getBuiltPages();
    
    // Verify that all pages have consistent meta tag structure
    for (const page of pages) {
      const metaTags = extractMetaTags(page.content);
      
      // Verify Open Graph and Twitter meta tags are consistent
      if (metaTags.ogTitle && metaTags.twitterTitle) {
        expect(metaTags.twitterTitle).toBe(metaTags.ogTitle);
      }
      
      if (metaTags.ogDescription && metaTags.twitterDescription) {
        expect(metaTags.twitterDescription).toBe(metaTags.ogDescription);
      }
      
      if (metaTags.ogImage && metaTags.twitterImage) {
        expect(metaTags.twitterImage).toBe(metaTags.ogImage);
      }
      
      // Verify canonical URL format
      if (metaTags.canonical) {
        expect(metaTags.canonical).toMatch(/^https:\/\/(www\.)?technicalanxiety\.com/);
        expect(metaTags.canonical).toMatch(/\/$/); // Should end with /
      }
      
      // Verify og:image and twitter:image are absolute URLs
      if (metaTags.ogImage) {
        expect(metaTags.ogImage).toMatch(/^https:\/\//);
      }
      
      if (metaTags.twitterImage) {
        expect(metaTags.twitterImage).toMatch(/^https:\/\//);
      }
    }
  });

  test('Property 11 Coverage: Verify test covers all page types', () => {
    const pages = getBuiltPages();
    const pagePaths = pages.map(p => p.path);
    
    // Verify we're testing different types of pages
    const hasHomepage = pagePaths.some(path => path === '/' || path === '');
    const hasPostPages = pagePaths.some(path => {
      const normalized = path.startsWith('/') ? path : '/' + path;
      return normalized !== '/' && 
             !normalized.includes('/search') && 
             !normalized.includes('/tags') && 
             !normalized.includes('/page/') &&
             !normalized.includes('/404');
    });
    const hasTagPages = pagePaths.some(path => path.includes('tags'));
    const hasPaginationPages = pagePaths.some(path => path.includes('page/'));
    const hasSearchPage = pagePaths.some(path => path.includes('search'));
    const has404Page = pagePaths.some(path => path.includes('404'));
    
    expect(hasHomepage).toBe(true);
    expect(hasPostPages).toBe(true);
    expect(hasTagPages).toBe(true);
    expect(hasPaginationPages).toBe(true);
    expect(hasSearchPage).toBe(true);
    expect(has404Page).toBe(true);
    
    console.log(`Testing meta tags on ${pages.length} pages including:
      - Homepage: ${hasHomepage}
      - Post pages: ${hasPostPages}
      - Tag pages: ${hasTagPages}
      - Pagination pages: ${hasPaginationPages}
      - Search page: ${hasSearchPage}
      - 404 page: ${has404Page}`);
  });
});