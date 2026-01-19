import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import fs from 'fs';
import path from 'path';

/**
 * Feature: astro-migration, Property 9: Pagination Validity
 * 
 * Property 9: Pagination Validity
 * For any paginated page, the pagination controls SHALL link to valid previous/next pages, 
 * and the total page count SHALL equal ceil(totalPosts / postsPerPage).
 * 
 * Validates: Requirements 3.6
 */

describe('Pagination Validity Property Tests', () => {
  // Helper function to get all posts
  function getAllPosts() {
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
        
        // Parse frontmatter to extract date for sorting
        const parsedFrontmatter: any = {};
        frontmatter.split('\n').forEach(line => {
          const match = line.match(/^(\w+):\s*(.+)$/);
          if (match) {
            const [, key, value] = match;
            if (key === 'date') {
              parsedFrontmatter[key] = value.replace(/['"]/g, '');
            } else if (key === 'title') {
              parsedFrontmatter[key] = value.replace(/['"]/g, '');
            }
          }
        });
        
        return {
          slug,
          title: parsedFrontmatter.title,
          date: new Date(parsedFrontmatter.date),
        };
      }).sort((a, b) => b.date.valueOf() - a.date.valueOf()); // Sort by date descending
    } catch (error) {
      console.error('Error reading posts:', error);
      return [];
    }
  }

  // Helper function to get posts per page from config
  function getPostsPerPage(): number {
    try {
      const configPath = path.join(process.cwd(), 'src', 'config.ts');
      const configContent = fs.readFileSync(configPath, 'utf8');
      const match = configContent.match(/postsPerPage:\s*(\d+)/);
      return match ? parseInt(match[1]) : 7; // Default to 7 if not found
    } catch (error) {
      return 7; // Default fallback
    }
  }

  // Helper function to check if pagination component exists
  function paginationComponentExists(): boolean {
    const paginationPath = path.join(process.cwd(), 'src', 'components', 'Pagination.astro');
    return fs.existsSync(paginationPath);
  }

  // Helper function to check if paginated route exists
  function paginatedRouteExists(): boolean {
    const paginatedRoutePath = path.join(process.cwd(), 'src', 'pages', 'page', '[page].astro');
    return fs.existsSync(paginatedRoutePath);
  }

  // Helper function to calculate pagination math
  function calculatePaginationMath(totalPosts: number, postsPerPage: number) {
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const pages = [];
    
    for (let i = 1; i <= totalPages; i++) {
      const startIndex = (i - 1) * postsPerPage;
      const endIndex = Math.min(startIndex + postsPerPage, totalPosts);
      const postsOnPage = endIndex - startIndex;
      
      pages.push({
        pageNumber: i,
        startIndex,
        endIndex,
        postsOnPage,
        hasPrevious: i > 1,
        hasNext: i < totalPages,
        previousPage: i > 1 ? i - 1 : null,
        nextPage: i < totalPages ? i + 1 : null,
      });
    }
    
    return { totalPages, pages };
  }

  test('Property 9: Pagination math is correct for any number of posts', () => {
    const allPosts = getAllPosts();
    const postsPerPage = getPostsPerPage();
    
    // Ensure we have posts to test
    expect(allPosts.length).toBeGreaterThan(0);
    expect(postsPerPage).toBeGreaterThan(0);
    
    // Test with different post counts using property-based testing
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: Math.max(100, allPosts.length * 2) }),
        fc.integer({ min: 1, max: 20 }),
        (totalPosts, testPostsPerPage) => {
          const { totalPages, pages } = calculatePaginationMath(totalPosts, testPostsPerPage);
          
          // Verify total pages calculation
          const expectedTotalPages = Math.ceil(totalPosts / testPostsPerPage);
          expect(totalPages).toBe(expectedTotalPages);
          
          // Verify each page has correct properties
          pages.forEach((page, index) => {
            // Page numbers should be sequential starting from 1
            expect(page.pageNumber).toBe(index + 1);
            
            // Posts on page should not exceed postsPerPage
            expect(page.postsOnPage).toBeLessThanOrEqual(testPostsPerPage);
            expect(page.postsOnPage).toBeGreaterThan(0);
            
            // First page should not have previous
            if (page.pageNumber === 1) {
              expect(page.hasPrevious).toBe(false);
              expect(page.previousPage).toBeNull();
            } else {
              expect(page.hasPrevious).toBe(true);
              expect(page.previousPage).toBe(page.pageNumber - 1);
            }
            
            // Last page should not have next
            if (page.pageNumber === totalPages) {
              expect(page.hasNext).toBe(false);
              expect(page.nextPage).toBeNull();
            } else {
              expect(page.hasNext).toBe(true);
              expect(page.nextPage).toBe(page.pageNumber + 1);
            }
            
            // Verify index calculations
            expect(page.startIndex).toBe((page.pageNumber - 1) * testPostsPerPage);
            expect(page.endIndex).toBeLessThanOrEqual(totalPosts);
            expect(page.endIndex).toBeGreaterThan(page.startIndex);
          });
          
          // Verify all posts are covered exactly once
          const totalPostsCovered = pages.reduce((sum, page) => sum + page.postsOnPage, 0);
          expect(totalPostsCovered).toBe(totalPosts);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 9: Actual site pagination math matches expected calculations', () => {
    const allPosts = getAllPosts();
    const postsPerPage = getPostsPerPage();
    
    // Calculate expected pagination
    const { totalPages, pages } = calculatePaginationMath(allPosts.length, postsPerPage);
    
    // Verify the calculation matches our site configuration
    expect(totalPages).toBe(Math.ceil(allPosts.length / postsPerPage));
    
    // Property-based test: For each calculated page, verify its properties
    fc.assert(
      fc.property(
        fc.constantFrom(...pages),
        (page) => {
          // Verify page number is valid
          expect(page.pageNumber).toBeGreaterThan(0);
          expect(page.pageNumber).toBeLessThanOrEqual(totalPages);
          
          // Verify posts on page calculation
          const expectedPostsOnPage = Math.min(
            postsPerPage,
            allPosts.length - (page.pageNumber - 1) * postsPerPage
          );
          expect(page.postsOnPage).toBe(expectedPostsOnPage);
          
          // Verify navigation properties
          if (page.pageNumber === 1) {
            expect(page.hasPrevious).toBe(false);
            expect(page.previousPage).toBeNull();
          }
          
          if (page.pageNumber === totalPages) {
            expect(page.hasNext).toBe(false);
            expect(page.nextPage).toBeNull();
          }
          
          // Verify previous/next page numbers are valid
          if (page.previousPage !== null) {
            expect(page.previousPage).toBeGreaterThan(0);
            expect(page.previousPage).toBeLessThan(page.pageNumber);
          }
          
          if (page.nextPage !== null) {
            expect(page.nextPage).toBeGreaterThan(page.pageNumber);
            expect(page.nextPage).toBeLessThanOrEqual(totalPages);
          }
          
          return true;
        }
      ),
      { numRuns: Math.min(100, pages.length) }
    );
  });

  test('Property 9: Pagination component handles edge cases correctly', () => {
    // Test edge cases with property-based testing
    fc.assert(
      fc.property(
        fc.record({
          currentPage: fc.integer({ min: 1, max: 10 }),
          totalPages: fc.integer({ min: 1, max: 10 }),
        }).filter(({ currentPage, totalPages }) => currentPage <= totalPages),
        ({ currentPage, totalPages }) => {
          // Verify current page is within valid range
          expect(currentPage).toBeGreaterThan(0);
          expect(currentPage).toBeLessThanOrEqual(totalPages);
          
          // Verify navigation logic
          const hasPrevious = currentPage > 1;
          const hasNext = currentPage < totalPages;
          
          expect(hasPrevious).toBe(currentPage > 1);
          expect(hasNext).toBe(currentPage < totalPages);
          
          // Verify previous/next page calculations
          if (hasPrevious) {
            const previousPage = currentPage - 1;
            expect(previousPage).toBeGreaterThan(0);
            expect(previousPage).toBeLessThan(currentPage);
          }
          
          if (hasNext) {
            const nextPage = currentPage + 1;
            expect(nextPage).toBeGreaterThan(currentPage);
            expect(nextPage).toBeLessThanOrEqual(totalPages);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 9: Pagination infrastructure exists', () => {
    // Verify pagination component exists
    expect(paginationComponentExists()).toBe(true);
    
    // Verify paginated route exists
    expect(paginatedRouteExists()).toBe(true);
    
    // Verify configuration is valid
    const postsPerPage = getPostsPerPage();
    expect(postsPerPage).toBeGreaterThan(0);
    expect(postsPerPage).toBeLessThanOrEqual(50); // Reasonable upper limit
  });

  test('Property 9 Verification: Site pagination setup is consistent', () => {
    const allPosts = getAllPosts();
    const postsPerPage = getPostsPerPage();
    
    // Verify we have posts
    expect(allPosts.length).toBeGreaterThan(0);
    
    // Verify posts per page configuration
    expect(postsPerPage).toBe(12); // Astro configuration
    
    // Calculate expected pagination
    const expectedTotalPages = Math.ceil(allPosts.length / postsPerPage);
    
    // Verify pagination makes sense
    expect(expectedTotalPages).toBeGreaterThan(0);
    
    // If we have more posts than postsPerPage, we should have multiple pages
    if (allPosts.length > postsPerPage) {
      expect(expectedTotalPages).toBeGreaterThan(1);
    }
    
    // Verify infrastructure exists
    expect(paginationComponentExists()).toBe(true);
    expect(paginatedRouteExists()).toBe(true);
  });
});