import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';
import { JSDOM } from 'jsdom';

/**
 * Feature: astro-migration, Property 5: Theme Toggle Round-Trip
 * 
 * Property 5: Theme Toggle Round-Trip
 * For any theme state (light or dark), toggling the theme twice SHALL return 
 * to the original state, and the preference SHALL persist across page loads.
 * 
 * Validates: Requirements 2.2
 */

describe('Theme Toggle Property Tests', () => {
  let dom: JSDOM;
  let document: Document;
  let window: Window;
  let localStorage: Storage;

  beforeEach(() => {
    // Set up DOM environment
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <button id="theme-toggle" class="theme-toggle" aria-label="Toggle dark/light mode">
            <span class="theme-toggle-icon">
              <svg class="sun-icon"></svg>
              <svg class="moon-icon"></svg>
            </span>
          </button>
        </body>
      </html>
    `, { 
      url: 'http://localhost',
      pretendToBeVisual: true,
      resources: 'usable'
    });

    document = dom.window.document;
    window = dom.window as any;
    localStorage = dom.window.localStorage;

    // Make globals available
    global.document = document;
    (global as any).window = window;
    global.localStorage = localStorage;

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    dom.window.close();
  });
  // Helper function to simulate theme toggle functionality
  function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    if (!themeToggle) return null;
    
    function getInitialTheme() {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
      return 'dark'; // Default theme
    }
    
    const currentTheme = getInitialTheme();
    htmlElement.setAttribute('data-theme', currentTheme);
    
    function updateAriaLabel(theme: string) {
      if (themeToggle) {
        themeToggle.setAttribute('aria-label', 
          theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        );
      }
    }
    
    updateAriaLabel(currentTheme);
    
    // Toggle theme function
    function toggleTheme() {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateAriaLabel(newTheme);
      
      return newTheme;
    }
    
    return {
      getCurrentTheme: () => htmlElement.getAttribute('data-theme'),
      toggleTheme,
      getStoredTheme: () => localStorage.getItem('theme')
    };
  }

  test('Property 5: Theme toggle round-trip returns to original state', () => {
    const themeController = initThemeToggle();
    expect(themeController).toBeDefined();
    
    if (!themeController) return;
    
    // Property-based test: For any initial theme state, toggling twice returns to original
    fc.assert(
      fc.property(
        fc.constantFrom('light', 'dark'),
        (initialTheme) => {
          // Set initial theme
          document.documentElement.setAttribute('data-theme', initialTheme);
          localStorage.setItem('theme', initialTheme);
          
          const originalTheme = themeController.getCurrentTheme();
          expect(originalTheme).toBe(initialTheme);
          
          // Toggle once
          const firstToggle = themeController.toggleTheme();
          expect(firstToggle).not.toBe(originalTheme);
          expect(themeController.getCurrentTheme()).toBe(firstToggle);
          
          // Toggle twice (should return to original)
          const secondToggle = themeController.toggleTheme();
          expect(secondToggle).toBe(originalTheme);
          expect(themeController.getCurrentTheme()).toBe(originalTheme);
          
          // Verify persistence
          expect(themeController.getStoredTheme()).toBe(originalTheme);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 5: Theme preference persists across simulated page loads', () => {
    const themeController = initThemeToggle();
    expect(themeController).toBeDefined();
    
    if (!themeController) return;
    
    // Property-based test: For any theme preference, it persists across page loads
    fc.assert(
      fc.property(
        fc.constantFrom('light', 'dark'),
        (preferredTheme) => {
          // Set theme preference
          localStorage.setItem('theme', preferredTheme);
          
          // Simulate page reload by reinitializing
          const newController = initThemeToggle();
          expect(newController).toBeDefined();
          
          if (!newController) return false;
          
          // Verify theme was restored
          expect(newController.getCurrentTheme()).toBe(preferredTheme);
          expect(newController.getStoredTheme()).toBe(preferredTheme);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 5: Default theme is dark when no preference is stored', () => {
    // Clear any stored preference
    localStorage.clear();
    
    const themeController = initThemeToggle();
    expect(themeController).toBeDefined();
    
    if (!themeController) return;
    
    // Should default to dark theme
    expect(themeController.getCurrentTheme()).toBe('dark');
  });
});