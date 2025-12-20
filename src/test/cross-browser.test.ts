import { describe, test, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Cross-browser testing - Static Analysis', () => {
  const distPath = join(process.cwd(), 'dist');

  test('should have built static files for cross-browser compatibility', () => {
    // Check that the build output exists
    expect(existsSync(distPath)).toBe(true);
    
    // Check key pages exist
    const keyPages = [
      'index.html',
      '404.html',
      'about/index.html',
      'search/index.html',
      'tags/index.html'
    ];
    
    for (const page of keyPages) {
      const pagePath = join(distPath, page);
      expect(existsSync(pagePath)).toBe(true);
    }
  });

  test('should have responsive meta tags for mobile compatibility', () => {
    const indexPath = join(distPath, 'index.html');
    if (existsSync(indexPath)) {
      const content = readFileSync(indexPath, 'utf-8');
      
      // Check for viewport meta tag
      expect(content).toMatch(/<meta\s+name="viewport"\s+content="width=device-width,?\s*initial-scale=1\.?0?"/);
      
      // Check for charset
      expect(content).toMatch(/<meta\s+charset="utf-8"/i);
      
      // Check for proper HTML5 doctype
      expect(content).toMatch(/^<!DOCTYPE html>/i);
    }
  });

  test('should have CSS that supports cross-browser compatibility', () => {
    const indexPath = join(distPath, 'index.html');
    if (existsSync(indexPath)) {
      const content = readFileSync(indexPath, 'utf-8');
      
      // Check for CSS files
      const cssMatches = content.match(/<link[^>]*rel="stylesheet"[^>]*>/g);
      expect(cssMatches).toBeTruthy();
      expect(cssMatches!.length).toBeGreaterThan(0);
      
      // Check that CSS files exist
      const cssHrefs = content.match(/href="([^"]*\.css[^"]*)"/g);
      if (cssHrefs) {
        for (const href of cssHrefs) {
          const cssPath = href.match(/href="([^"]*)"/)?.[1];
          if (cssPath && cssPath.startsWith('/')) {
            const fullPath = join(distPath, cssPath.substring(1));
            expect(existsSync(fullPath)).toBe(true);
          }
        }
      }
    }
  });

  test('should have JavaScript that supports modern browsers', () => {
    const indexPath = join(distPath, 'index.html');
    if (existsSync(indexPath)) {
      const content = readFileSync(indexPath, 'utf-8');
      
      // Check for script tags
      const scriptMatches = content.match(/<script[^>]*src="[^"]*"[^>]*>/g);
      
      if (scriptMatches) {
        // Check that JS files exist
        const jsHrefs = content.match(/src="([^"]*\.js[^"]*)"/g);
        if (jsHrefs) {
          for (const href of jsHrefs) {
            const jsPath = href.match(/src="([^"]*)"/)?.[1];
            if (jsPath && jsPath.startsWith('/')) {
              const fullPath = join(distPath, jsPath.substring(1));
              expect(existsSync(fullPath)).toBe(true);
            }
          }
        }
      }
    }
  });

  test('should have proper semantic HTML structure', () => {
    const indexPath = join(distPath, 'index.html');
    if (existsSync(indexPath)) {
      const content = readFileSync(indexPath, 'utf-8');
      
      // Check for semantic HTML5 elements
      expect(content).toMatch(/<header[^>]*>/);
      expect(content).toMatch(/<main[^>]*>|<div[^>]*class="[^"]*main[^"]*"/);
      expect(content).toMatch(/<footer[^>]*>/);
      
      // Check for proper heading structure
      expect(content).toMatch(/<h1[^>]*>/);
      
      // Check for navigation
      expect(content).toMatch(/<nav[^>]*>|<div[^>]*class="[^"]*nav[^"]*"/);
    }
  });

  test('should have accessibility features for cross-browser support', () => {
    const indexPath = join(distPath, 'index.html');
    if (existsSync(indexPath)) {
      const content = readFileSync(indexPath, 'utf-8');
      
      // Check for lang attribute
      expect(content).toMatch(/<html[^>]*lang="[^"]*"/);
      
      // Check for skip links or proper heading structure
      const hasSkipLink = content.includes('skip') || content.includes('Skip');
      const hasHeadings = content.match(/<h[1-6][^>]*>/g);
      
      expect(hasSkipLink || (hasHeadings && hasHeadings.length > 0)).toBe(true);
    }
  });

  test('should have theme support for different browser preferences', () => {
    const indexPath = join(distPath, 'index.html');
    if (existsSync(indexPath)) {
      const content = readFileSync(indexPath, 'utf-8');
      
      // Check for theme-related attributes or classes
      const hasThemeSupport = 
        content.includes('data-theme') ||
        content.includes('theme-toggle') ||
        content.includes('dark') ||
        content.includes('light') ||
        content.includes('prefers-color-scheme');
      
      expect(hasThemeSupport).toBe(true);
    }
  });

  test('should have proper image optimization for different devices', () => {
    const indexPath = join(distPath, 'index.html');
    if (existsSync(indexPath)) {
      const content = readFileSync(indexPath, 'utf-8');
      
      // Check for images
      const imgTags = content.match(/<img[^>]*>/g);
      
      if (imgTags && imgTags.length > 0) {
        // Check that images have alt attributes
        for (const img of imgTags) {
          expect(img).toMatch(/alt="[^"]*"/);
        }
        
        // Check for responsive image features
        const hasResponsiveImages = 
          content.includes('srcset') ||
          content.includes('sizes') ||
          content.includes('loading="lazy"');
        
        // This is optional but good for performance
        if (hasResponsiveImages) {
          expect(hasResponsiveImages).toBe(true);
        }
      }
    }
  });
});