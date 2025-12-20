#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Verifies that the Astro site is deployed correctly and all critical paths work
 */

import { execSync } from 'child_process';
import https from 'https';
import { URL } from 'url';

const SITE_URL = 'https://technicalanxiety.com';
const STAGING_URL = 'https://ambitious-wave-0d77c1c10-staging.azurestaticapps.net';

// Critical paths to verify
const CRITICAL_PATHS = [
  '/',                                    // Homepage
  '/setting-up-kiro-ai-assistant/',      // Recent blog post
  '/rss.xml',                            // RSS feed
  '/sitemap.xml',                        // Sitemap
  '/search/',                            // Search page
  '/tags/azure/',                        // Tag page
  '/about/',                             // About page
  '/nonexistent-page-404-test/',         // 404 test
];

// Expected status codes
const EXPECTED_STATUS = {
  '/': 200,
  '/setting-up-kiro-ai-assistant/': 200,
  '/rss.xml': 200,
  '/sitemap.xml': 200,
  '/search/': 200,
  '/tags/azure/': 200,
  '/about/': 200,
  '/nonexistent-page-404-test/': 404,
};

/**
 * Check HTTP status of a URL
 */
function checkUrl(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'HEAD',
      timeout: 10000,
    };

    const req = https.request(options, (res) => {
      resolve({
        url,
        status: res.statusCode,
        headers: res.headers,
      });
    });

    req.on('error', (err) => {
      reject({ url, error: err.message });
    });

    req.on('timeout', () => {
      req.destroy();
      reject({ url, error: 'Request timeout' });
    });

    req.end();
  });
}

/**
 * Verify all critical paths
 */
async function verifyCriticalPaths(baseUrl) {
  console.log(`\n🔍 Verifying critical paths for: ${baseUrl}`);
  console.log('=' .repeat(60));

  const results = [];
  
  for (const path of CRITICAL_PATHS) {
    const url = baseUrl + path;
    const expectedStatus = EXPECTED_STATUS[path];
    
    try {
      const result = await checkUrl(url);
      const success = result.status === expectedStatus;
      
      results.push({
        path,
        url,
        expected: expectedStatus,
        actual: result.status,
        success,
      });

      const status = success ? '✅' : '❌';
      console.log(`${status} ${path.padEnd(35)} ${result.status} (expected ${expectedStatus})`);
      
    } catch (error) {
      results.push({
        path,
        url,
        expected: expectedStatus,
        actual: 'ERROR',
        success: false,
        error: error.error,
      });
      
      console.log(`❌ ${path.padEnd(35)} ERROR: ${error.error}`);
    }
  }

  return results;
}

/**
 * Check required meta tags on homepage
 */
async function checkMetaTags(baseUrl) {
  console.log(`\n🏷️  Checking meta tags for: ${baseUrl}`);
  console.log('=' .repeat(60));

  try {
    const response = await fetch(baseUrl);
    const html = await response.text();
    
    const requiredTags = [
      { name: 'title', pattern: /<title>.*<\/title>/ },
      { name: 'description', pattern: /<meta name="description"/ },
      { name: 'og:title', pattern: /<meta property="og:title"/ },
      { name: 'og:description', pattern: /<meta property="og:description"/ },
      { name: 'twitter:card', pattern: /<meta name="twitter:card"/ },
      { name: 'canonical', pattern: /<link rel="canonical"/ },
    ];

    const results = [];
    
    for (const tag of requiredTags) {
      const found = tag.pattern.test(html);
      results.push({ name: tag.name, found });
      
      const status = found ? '✅' : '❌';
      console.log(`${status} ${tag.name}`);
    }

    return results;
    
  } catch (error) {
    console.log(`❌ Error checking meta tags: ${error.message}`);
    return [];
  }
}

/**
 * Run Lighthouse audit (if available)
 */
async function runLighthouseAudit(url) {
  console.log(`\n🚨 Running Lighthouse audit for: ${url}`);
  console.log('=' .repeat(60));

  try {
    // Check if lighthouse is available
    execSync('which lighthouse', { stdio: 'ignore' });
    
    const command = `lighthouse ${url} --only-categories=performance,accessibility,best-practices,seo --output=json --quiet`;
    const output = execSync(command, { encoding: 'utf8' });
    const results = JSON.parse(output);
    
    const scores = {
      performance: Math.round(results.lhr.categories.performance.score * 100),
      accessibility: Math.round(results.lhr.categories.accessibility.score * 100),
      bestPractices: Math.round(results.lhr.categories['best-practices'].score * 100),
      seo: Math.round(results.lhr.categories.seo.score * 100),
    };

    console.log(`Performance:    ${scores.performance}/100 ${scores.performance >= 90 ? '✅' : '❌'}`);
    console.log(`Accessibility:  ${scores.accessibility}/100 ${scores.accessibility >= 90 ? '✅' : '❌'}`);
    console.log(`Best Practices: ${scores.bestPractices}/100 ${scores.bestPractices >= 90 ? '✅' : '❌'}`);
    console.log(`SEO:           ${scores.seo}/100 ${scores.seo >= 90 ? '✅' : '❌'}`);

    return scores;
    
  } catch (error) {
    console.log('⚠️  Lighthouse not available or failed to run');
    console.log('   Install with: npm install -g lighthouse');
    return null;
  }
}

/**
 * Main verification function
 */
async function main() {
  const args = process.argv.slice(2);
  const environment = args[0] || 'production';
  
  const baseUrl = environment === 'staging' ? STAGING_URL : SITE_URL;
  
  console.log(`🚀 Deployment Verification Script`);
  console.log(`Environment: ${environment}`);
  console.log(`URL: ${baseUrl}`);
  
  try {
    // Verify critical paths
    const pathResults = await verifyCriticalPaths(baseUrl);
    
    // Check meta tags
    const metaResults = await checkMetaTags(baseUrl);
    
    // Run Lighthouse audit
    const lighthouseResults = await runLighthouseAudit(baseUrl);
    
    // Summary
    console.log(`\n📊 Summary`);
    console.log('=' .repeat(60));
    
    const pathSuccesses = pathResults.filter(r => r.success).length;
    const pathTotal = pathResults.length;
    console.log(`Critical Paths: ${pathSuccesses}/${pathTotal} passing`);
    
    const metaSuccesses = metaResults.filter(r => r.found).length;
    const metaTotal = metaResults.length;
    console.log(`Meta Tags: ${metaSuccesses}/${metaTotal} found`);
    
    if (lighthouseResults) {
      const lighthouseSuccesses = Object.values(lighthouseResults).filter(score => score >= 90).length;
      console.log(`Lighthouse: ${lighthouseSuccesses}/4 categories ≥90`);
    }
    
    // Exit code
    const allPathsPass = pathSuccesses === pathTotal;
    const allMetaPass = metaSuccesses === metaTotal;
    const lighthousePass = !lighthouseResults || Object.values(lighthouseResults).every(score => score >= 90);
    
    if (allPathsPass && allMetaPass && lighthousePass) {
      console.log('\n✅ All verifications passed!');
      process.exit(0);
    } else {
      console.log('\n❌ Some verifications failed. Check the output above.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error(`\n💥 Verification failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle command line usage
if (process.argv[1].endsWith('verify-deployment.js')) {
  main().catch(console.error);
}

export { verifyCriticalPaths, checkMetaTags, runLighthouseAudit };