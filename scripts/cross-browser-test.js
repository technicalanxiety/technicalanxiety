#!/usr/bin/env node

/**
 * Cross-browser testing script for Astro migration
 * Tests the site across different browsers and devices
 */

import puppeteer from 'puppeteer';
import { spawn, execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

const BROWSERS = [
  { name: 'Chrome', product: 'chrome' },
  // Firefox support in Puppeteer can be limited, focusing on Chrome for reliability
];

const VIEWPORTS = {
  desktop: { width: 1920, height: 1080, isMobile: false },
  tablet: { width: 768, height: 1024, isMobile: true, hasTouch: true },
  mobile: { width: 375, height: 667, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  iphone: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 3 },
};

const TEST_PAGES = [
  '/',
  '/about/',
  '/search/',
  '/tags/',
];

class CrossBrowserTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      errors: [],
      details: []
    };
    this.previewUrl = null;
    this.previewProcess = null;
  }

  async startPreviewServer() {
    console.log('🔨 Building Astro site...');
    try {
      execSync('npm run build', { stdio: 'inherit' });
    } catch (error) {
      throw new Error(`Build failed: ${error.message}`);
    }

    console.log('🚀 Starting preview server...');
    return new Promise((resolve, reject) => {
      this.previewProcess = spawn('npm', ['run', 'preview'], {
        stdio: 'pipe',
        detached: false
      });

      let resolved = false;

      this.previewProcess.stdout.on('data', (data) => {
        const output = data.toString();
        console.log('Preview:', output.trim());

        // Look for the preview URL in the output - updated pattern for Astro v5
        const urlMatch = output.match(/Local\s+http:\/\/[^\s]+/) || output.match(/http:\/\/localhost:\d+/);
        if (urlMatch && !resolved) {
          // Extract just the URL part
          const fullMatch = urlMatch[0];
          const urlPart = fullMatch.includes('Local') ? fullMatch.split(/\s+/).pop() : fullMatch;
          this.previewUrl = urlPart;
          console.log(`✅ Preview server running at: ${this.previewUrl}`);
          resolved = true;
          setTimeout(resolve, 2000); // Give server time to fully start
        }
      });

      this.previewProcess.stderr.on('data', (data) => {
        console.error('Preview error:', data.toString());
      });

      this.previewProcess.on('error', (error) => {
        if (!resolved) {
          resolved = true;
          reject(error);
        }
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          reject(new Error('Preview server failed to start within 30 seconds'));
        }
      }, 30000);
    });
  }

  async stopPreviewServer() {
    if (this.previewProcess) {
      console.log('🛑 Stopping preview server...');
      this.previewProcess.kill('SIGTERM');
      this.previewProcess = null;
    }
  }

  async testBrowser(browserConfig) {
    console.log(`\n🌐 Testing ${browserConfig.name}...`);
    
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        product: browserConfig.product,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      });

      for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
        console.log(`  📱 Testing ${viewportName} viewport (${viewport.width}x${viewport.height})`);
        
        await this.testViewport(browser, browserConfig.name, viewportName, viewport);
      }

    } catch (error) {
      this.recordError(`${browserConfig.name} browser test failed`, error);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  async testViewport(browser, browserName, viewportName, viewport) {
    const page = await browser.newPage();
    
    try {
      await page.setViewport(viewport);

      for (const testPage of TEST_PAGES) {
        await this.testPage(page, browserName, viewportName, testPage);
      }

    } catch (error) {
      this.recordError(`${browserName} ${viewportName} viewport test failed`, error);
    } finally {
      await page.close();
    }
  }

  async testPage(page, browserName, viewportName, pagePath) {
    const url = `${this.previewUrl}${pagePath}`;
    const testName = `${browserName} - ${viewportName} - ${pagePath}`;
    
    try {
      console.log(`    🔍 Testing ${pagePath}`);
      
      // Navigate to page
      const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
      
      if (!response || !response.ok()) {
        throw new Error(`HTTP ${response?.status() || 'unknown'}: ${response?.statusText() || 'Failed to load'}`);
      }

      // Basic page structure tests
      await this.runPageTests(page, testName);
      
      this.results.passed++;
      this.results.details.push({
        test: testName,
        status: 'PASS',
        url: url
      });

    } catch (error) {
      this.recordError(testName, error);
      this.results.details.push({
        test: testName,
        status: 'FAIL',
        url: url,
        error: error.message
      });
    }
  }

  async runPageTests(page, testName) {
    // Test 1: Page loads and has title
    const title = await page.title();
    if (!title || title.trim() === '') {
      throw new Error('Page has no title');
    }

    // Test 2: No JavaScript errors
    const jsErrors = [];
    page.on('pageerror', error => jsErrors.push(error.message));
    
    // Wait for page to be fully loaded
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (jsErrors.length > 0) {
      console.warn(`⚠️  JavaScript errors on ${testName}:`, jsErrors);
    }

    // Test 3: Basic page structure
    const hasContent = await page.evaluate(() => {
      const body = document.body;
      return body && body.textContent.trim().length > 0;
    });
    
    if (!hasContent) {
      throw new Error('Page has no content');
    }

    // Test 4: CSS loads properly
    const hasStyles = await page.evaluate(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body);
      return styles.fontFamily && styles.fontFamily !== '';
    });
    
    if (!hasStyles) {
      throw new Error('CSS not loaded properly');
    }

    // Test 5: No horizontal overflow on mobile
    const viewport = await page.viewport();
    if (viewport.isMobile) {
      const hasOverflow = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth + 10; // Allow small margin
      });
      
      if (hasOverflow) {
        console.warn(`⚠️  Horizontal overflow detected on ${testName}`);
      }
    }

    // Test 6: Interactive elements are accessible
    const interactiveElements = await page.$$('button, a, input, select, textarea');
    for (const element of interactiveElements.slice(0, 5)) { // Test first 5 elements
      const box = await element.boundingBox();
      if (box && viewport.isMobile) {
        const minTouchTarget = 32; // Minimum touch target size
        if (box.width < minTouchTarget && box.height < minTouchTarget) {
          console.warn(`⚠️  Small touch target detected on ${testName}`);
        }
      }
    }
  }

  recordError(testName, error) {
    this.results.failed++;
    this.results.errors.push({
      test: testName,
      error: error.message,
      stack: error.stack
    });
    console.error(`❌ ${testName}: ${error.message}`);
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.passed + this.results.failed,
        passed: this.results.passed,
        failed: this.results.failed,
        success_rate: `${Math.round((this.results.passed / (this.results.passed + this.results.failed)) * 100)}%`
      },
      details: this.results.details,
      errors: this.results.errors
    };

    // Write detailed report
    writeFileSync('cross-browser-test-report.json', JSON.stringify(report, null, 2));
    
    // Write summary
    const summary = `# Cross-Browser Test Report

Generated: ${report.timestamp}

## Summary
- **Total Tests**: ${report.summary.total}
- **Passed**: ${report.summary.passed}
- **Failed**: ${report.summary.failed}
- **Success Rate**: ${report.summary.success_rate}

## Test Results

${report.details.map(detail => 
  `- ${detail.status === 'PASS' ? '✅' : '❌'} ${detail.test} - ${detail.url}`
).join('\n')}

${report.errors.length > 0 ? `
## Errors

${report.errors.map(error => 
  `### ${error.test}
\`\`\`
${error.error}
\`\`\``
).join('\n\n')}
` : ''}
`;

    writeFileSync('cross-browser-test-report.md', summary);
    
    return report;
  }

  async run() {
    console.log('🚀 Starting Cross-Browser Testing...\n');
    
    try {
      await this.startPreviewServer();
      
      for (const browser of BROWSERS) {
        await this.testBrowser(browser);
      }
      
      const report = this.generateReport();
      
      console.log('\n📊 Test Results:');
      console.log(`✅ Passed: ${report.summary.passed}`);
      console.log(`❌ Failed: ${report.summary.failed}`);
      console.log(`📈 Success Rate: ${report.summary.success_rate}`);
      
      if (report.summary.failed > 0) {
        console.log('\n❌ Some tests failed. Check cross-browser-test-report.md for details.');
        process.exit(1);
      } else {
        console.log('\n🎉 All cross-browser tests passed!');
      }
      
    } catch (error) {
      console.error('💥 Cross-browser testing failed:', error.message);
      process.exit(1);
    } finally {
      await this.stopPreviewServer();
    }
  }
}

// Run the tests
const tester = new CrossBrowserTester();
tester.run().catch(console.error);