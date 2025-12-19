import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

/**
 * Feature: astro-migration, Task 11.2: Run automated link checker
 * 
 * This test suite validates that all internal links resolve correctly
 * and that no broken image references exist in the built site.
 * 
 * Validates: Requirements 6.2, 6.3
 */

describe('Automated Link Checker', () => {
  const distDir = path.join(process.cwd(), 'dist');
  
  // Helper function to get all HTML files in the dist directory
  function getAllHtmlFiles(): Array<{ filePath: string; url: string }> {
    const htmlFiles: Array<{ filePath: string; url: string }> = [];
    
    function scanDirectory(dir: string, basePath = '') {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip _astro directory (contains build assets)
          if (item !== '_astro') {
            scanDirectory(fullPath, path.join(basePath, item));
          }
        } else if (item.endsWith('.html')) {
          const url = basePath ? `/${basePath}/${item}` : `/${item}`;
          // Normalize index.html URLs
          const normalizedUrl = url.replace('/index.html', '/').replace(/^\/\//, '/');
          
          htmlFiles.push({
            filePath: fullPath,
            url: normalizedUrl
          });
        }
      }
    }
    
    if (!fs.existsSync(distDir)) {
      throw new Error('Dist directory not found. Run "npm run build" first.');
    }
    
    scanDirectory(distDir);
    return htmlFiles;
  }

  // Helper function to extract links from HTML content
  function extractLinks(htmlContent: string, baseUrl: string): Array<{ href: string; type: 'internal' | 'external'; element: string }> {
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;
    const links: Array<{ href: string; type: 'internal' | 'external'; element: string }> = [];
    
    // Extract anchor links
    const anchors = document.querySelectorAll('a[href]');
    anchors.forEach(anchor => {
      const href = anchor.getAttribute('href');
      if (href) {
        const isInternal = href.startsWith('/') || href.startsWith('./') || href.startsWith('../') || 
                          (!href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('#'));
        
        links.push({
          href,
          type: isInternal ? 'internal' : 'external',
          element: 'a'
        });
      }
    });
    
    return links;
  }

  // Helper function to extract image sources from HTML content
  function extractImageSources(htmlContent: string): Array<{ src: string; type: 'internal' | 'external'; element: string }> {
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;
    const images: Array<{ src: string; type: 'internal' | 'external'; element: string }> = [];
    
    // Extract img src attributes
    const imgElements = document.querySelectorAll('img[src]');
    imgElements.forEach(img => {
      const src = img.getAttribute('src');
      if (src) {
        const isInternal = src.startsWith('/') || src.startsWith('./') || src.startsWith('../') || 
                          (!src.startsWith('http') && !src.startsWith('data:'));
        
        images.push({
          src,
          type: isInternal ? 'internal' : 'external',
          element: 'img'
        });
      }
    });
    
    return images;
  }

  // Helper function to resolve internal path to file system path
  function resolveInternalPath(href: string): string {
    let resolvedPath = href;
    
    // Remove query parameters and fragments
    resolvedPath = resolvedPath.split('?')[0].split('#')[0];
    
    // Handle relative paths
    if (resolvedPath.startsWith('./')) {
      resolvedPath = resolvedPath.substring(2);
    } else if (resolvedPath.startsWith('../')) {
      // For this test, we'll treat ../ as going to root
      resolvedPath = resolvedPath.replace(/\.\.\//g, '');
    }
    
    // Ensure it starts with /
    if (!resolvedPath.startsWith('/')) {
      resolvedPath = '/' + resolvedPath;
    }
    
    // Convert URL path to file system path
    let fsPath = path.join(distDir, resolvedPath);
    
    // If path ends with /, look for index.html
    if (resolvedPath.endsWith('/')) {
      fsPath = path.join(fsPath, 'index.html');
    }
    
    return fsPath;
  }

  // Helper function to check if a file exists
  function fileExists(filePath: string): boolean {
    try {
      return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
    } catch {
      return false;
    }
  }

  test('All internal links resolve to existing pages', () => {
    const htmlFiles = getAllHtmlFiles();
    const brokenLinks: Array<{ page: string; link: string; resolvedPath: string }> = [];
    
    expect(htmlFiles.length).toBeGreaterThan(0);
    
    for (const file of htmlFiles) {
      const htmlContent = fs.readFileSync(file.filePath, 'utf-8');
      const links = extractLinks(htmlContent, file.url);
      
      const internalLinks = links.filter(link => link.type === 'internal');
      
      for (const link of internalLinks) {
        // Skip anchor links (fragments)
        if (link.href.startsWith('#')) {
          continue;
        }
        
        const resolvedPath = resolveInternalPath(link.href);
        
        if (!fileExists(resolvedPath)) {
          brokenLinks.push({
            page: file.url,
            link: link.href,
            resolvedPath
          });
        }
      }
    }
    
    if (brokenLinks.length > 0) {
      const errorMessage = `Found ${brokenLinks.length} broken internal links:\n` +
        brokenLinks.map(broken => 
          `  - Page: ${broken.page}\n    Link: ${broken.link}\n    Resolved to: ${broken.resolvedPath}`
        ).join('\n');
      
      console.error(errorMessage);
    }
    
    expect(brokenLinks).toHaveLength(0);
  });

  test('All image references resolve to existing files', () => {
    const htmlFiles = getAllHtmlFiles();
    const brokenImages: Array<{ page: string; image: string; resolvedPath: string }> = [];
    
    expect(htmlFiles.length).toBeGreaterThan(0);
    
    for (const file of htmlFiles) {
      const htmlContent = fs.readFileSync(file.filePath, 'utf-8');
      const images = extractImageSources(htmlContent);
      
      const internalImages = images.filter(img => img.type === 'internal');
      
      for (const image of internalImages) {
        const resolvedPath = resolveInternalPath(image.src);
        
        if (!fileExists(resolvedPath)) {
          brokenImages.push({
            page: file.url,
            image: image.src,
            resolvedPath
          });
        }
      }
    }
    
    if (brokenImages.length > 0) {
      const errorMessage = `Found ${brokenImages.length} broken image references:\n` +
        brokenImages.map(broken => 
          `  - Page: ${broken.page}\n    Image: ${broken.image}\n    Resolved to: ${broken.resolvedPath}`
        ).join('\n');
      
      console.error(errorMessage);
    }
    
    expect(brokenImages).toHaveLength(0);
  });

  test('Link checker coverage report', () => {
    const htmlFiles = getAllHtmlFiles();
    let totalInternalLinks = 0;
    let totalInternalImages = 0;
    let totalPages = htmlFiles.length;
    
    const linksByPage: Array<{ page: string; internalLinks: number; internalImages: number }> = [];
    
    for (const file of htmlFiles) {
      const htmlContent = fs.readFileSync(file.filePath, 'utf-8');
      const links = extractLinks(htmlContent, file.url);
      const images = extractImageSources(htmlContent);
      
      const internalLinks = links.filter(link => link.type === 'internal' && !link.href.startsWith('#'));
      const internalImages = images.filter(img => img.type === 'internal');
      
      totalInternalLinks += internalLinks.length;
      totalInternalImages += internalImages.length;
      
      linksByPage.push({
        page: file.url,
        internalLinks: internalLinks.length,
        internalImages: internalImages.length
      });
    }
    
    console.log(`Link Checker Coverage Report:
      - Total pages scanned: ${totalPages}
      - Total internal links checked: ${totalInternalLinks}
      - Total internal images checked: ${totalInternalImages}
      - Average links per page: ${(totalInternalLinks / totalPages).toFixed(1)}
      - Average images per page: ${(totalInternalImages / totalPages).toFixed(1)}`);
    
    // Verify we have content to check
    expect(totalPages).toBeGreaterThan(0);
    expect(totalInternalLinks).toBeGreaterThan(0);
    expect(totalInternalImages).toBeGreaterThan(0);
    
    // Log pages with most links for debugging
    const topLinkPages = linksByPage
      .sort((a, b) => (b.internalLinks + b.internalImages) - (a.internalLinks + a.internalImages))
      .slice(0, 5);
    
    console.log('Pages with most internal links/images:');
    topLinkPages.forEach(page => {
      console.log(`  - ${page.page}: ${page.internalLinks} links, ${page.internalImages} images`);
    });
  });

  test('Verify critical navigation links work', () => {
    const htmlFiles = getAllHtmlFiles();
    const homePage = htmlFiles.find(f => f.url === '/' || f.url === '/index.html');
    
    expect(homePage).toBeDefined();
    
    if (homePage) {
      const htmlContent = fs.readFileSync(homePage.filePath, 'utf-8');
      const links = extractLinks(htmlContent, homePage.url);
      
      // Check for common navigation links
      const navigationLinks = links.filter(link => 
        link.href.includes('/about') || 
        link.href.includes('/archive') || 
        link.href.includes('/tags') ||
        link.href.includes('/search')
      );
      
      expect(navigationLinks.length).toBeGreaterThan(0);
      
      // Verify each navigation link resolves
      for (const navLink of navigationLinks) {
        if (navLink.type === 'internal' && !navLink.href.startsWith('#')) {
          const resolvedPath = resolveInternalPath(navLink.href);
          expect(fileExists(resolvedPath)).toBe(true);
        }
      }
    }
  });

  test('Verify RSS and sitemap files exist and are linked', () => {
    // Check that RSS and sitemap files exist
    const rssPath = path.join(distDir, 'rss.xml');
    const sitemapPath = path.join(distDir, 'sitemap-index.xml');
    
    expect(fileExists(rssPath)).toBe(true);
    expect(fileExists(sitemapPath)).toBe(true);
    
    // Check that RSS is linked in HTML head
    const htmlFiles = getAllHtmlFiles();
    let rssLinked = false;
    
    for (const file of htmlFiles) {
      const htmlContent = fs.readFileSync(file.filePath, 'utf-8');
      if (htmlContent.includes('application/rss+xml') || htmlContent.includes('/rss.xml')) {
        rssLinked = true;
        break;
      }
    }
    
    expect(rssLinked).toBe(true);
  });
});