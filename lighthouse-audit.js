#!/usr/bin/env node

import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:4321';
const OUTPUT_DIR = 'lighthouse-reports';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

// Pages to audit
const pages = [
  { name: 'homepage', url: `${BASE_URL}/` },
  { name: 'blog-post', url: `${BASE_URL}/setting-up-kiro-ai-assistant/` },
  { name: 'tag-page', url: `${BASE_URL}/tags/azure/` },
  { name: 'archive', url: `${BASE_URL}/archive/` },
  { name: 'about', url: `${BASE_URL}/about/` },
  { name: 'search', url: `${BASE_URL}/search/` }
];

const results = [];

async function runAudits() {
  console.log('🚀 Starting Lighthouse audits...\n');

  // Launch Puppeteer browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const page of pages) {
    console.log(`📊 Auditing ${page.name}: ${page.url}`);
    
    try {
      const outputPath = path.join(OUTPUT_DIR, `${page.name}.json`);
      
      // Run Lighthouse audit with Puppeteer
      const result = await lighthouse(page.url, {
        port: new URL(browser.wsEndpoint()).port,
        output: 'json',
        logLevel: 'error'
      });
      
      // Save the report
      fs.writeFileSync(outputPath, result.report);
      
      // Parse results
      const report = JSON.parse(result.report);
      const scores = {
        performance: Math.round(report.categories.performance.score * 100),
        accessibility: Math.round(report.categories.accessibility.score * 100),
        bestPractices: Math.round(report.categories['best-practices'].score * 100),
        seo: Math.round(report.categories.seo.score * 100)
      };
      
      results.push({
        page: page.name,
        url: page.url,
        scores,
        issues: extractIssues(report)
      });
      
      console.log(`  ✅ Performance: ${scores.performance}`);
      console.log(`  ✅ Accessibility: ${scores.accessibility}`);
      console.log(`  ✅ Best Practices: ${scores.bestPractices}`);
      console.log(`  ✅ SEO: ${scores.seo}\n`);
      
    } catch (error) {
      console.error(`❌ Failed to audit ${page.name}:`, error.message);
      results.push({
        page: page.name,
        url: page.url,
        error: error.message
      });
    }
  }

  // Close browser
  await browser.close();

  // Generate summary report
  generateSummaryReport(results);
}

function extractIssues(lhr) {
  const issues = [];
  
  // Check for failing audits
  Object.entries(lhr.audits).forEach(([key, audit]) => {
    if (audit.score !== null && audit.score < 0.9 && audit.scoreDisplayMode !== 'informative') {
      issues.push({
        id: key,
        title: audit.title,
        score: audit.score,
        description: audit.description,
        details: audit.details?.items?.slice(0, 3) // Limit to first 3 items
      });
    }
  });
  
  return issues;
}

function generateSummaryReport(results) {
  const timestamp = new Date().toISOString();
  
  let report = `# Lighthouse Audit Report\n\n`;
  report += `**Generated:** ${timestamp}\n\n`;
  
  // Summary table
  report += `## Summary\n\n`;
  report += `| Page | Performance | Accessibility | Best Practices | SEO | Status |\n`;
  report += `|------|-------------|---------------|----------------|-----|--------|\n`;
  
  let allPassing = true;
  
  results.forEach(result => {
    if (result.error) {
      report += `| ${result.page} | - | - | - | - | ❌ Error |\n`;
      allPassing = false;
    } else {
      const { scores } = result;
      const status = (scores.performance >= 90 && scores.accessibility >= 90 && 
                     scores.bestPractices >= 90 && scores.seo >= 90) ? '✅ Pass' : '⚠️ Issues';
      
      if (status === '⚠️ Issues') allPassing = false;
      
      report += `| ${result.page} | ${scores.performance} | ${scores.accessibility} | ${scores.bestPractices} | ${scores.seo} | ${status} |\n`;
    }
  });
  
  report += `\n## Overall Status: ${allPassing ? '✅ All audits passing (90+ scores)' : '⚠️ Some audits need attention'}\n\n`;
  
  // Detailed issues
  report += `## Detailed Issues\n\n`;
  
  results.forEach(result => {
    if (result.error) {
      report += `### ${result.page} - Error\n\n`;
      report += `**URL:** ${result.url}\n\n`;
      report += `**Error:** ${result.error}\n\n`;
    } else if (result.issues && result.issues.length > 0) {
      report += `### ${result.page}\n\n`;
      report += `**URL:** ${result.url}\n\n`;
      
      result.issues.forEach(issue => {
        report += `#### ${issue.title} (Score: ${Math.round(issue.score * 100)})\n\n`;
        report += `${issue.description}\n\n`;
        
        if (issue.details && issue.details.length > 0) {
          report += `**Details:**\n`;
          issue.details.forEach(detail => {
            if (typeof detail === 'string') {
              report += `- ${detail}\n`;
            } else if (detail.url) {
              report += `- ${detail.url}\n`;
            } else if (detail.node) {
              report += `- ${detail.node.snippet || detail.node.nodeLabel}\n`;
            }
          });
          report += `\n`;
        }
      });
    }
  });
  
  // Requirements validation
  report += `## Requirements Validation\n\n`;
  report += `- **Requirement 5.1 (Performance 90+):** ${checkRequirement(results, 'performance', 90)}\n`;
  report += `- **Requirement 5.2 (Accessibility 90+):** ${checkRequirement(results, 'accessibility', 90)}\n`;
  report += `- **Requirement 5.3 (Best Practices 90+):** ${checkRequirement(results, 'bestPractices', 90)}\n`;
  report += `- **Requirement 5.4 (SEO 90+):** ${checkRequirement(results, 'seo', 90)}\n`;
  report += `- **Requirement 5.5 (LCP < 2.5s):** Manual verification needed (check Core Web Vitals in reports)\n\n`;
  
  // Save report
  fs.writeFileSync(path.join(OUTPUT_DIR, 'lighthouse-summary.md'), report);
  
  console.log('📋 Summary report generated: lighthouse-reports/lighthouse-summary.md');
  console.log(`\n🎯 Overall Status: ${allPassing ? '✅ All requirements met!' : '⚠️ Some issues found - see report for details'}`);
}

function checkRequirement(results, category, threshold) {
  const failing = results.filter(r => !r.error && r.scores[category] < threshold);
  if (failing.length === 0) {
    return '✅ PASS - All pages meet requirement';
  } else {
    return `❌ FAIL - ${failing.length} page(s) below ${threshold}: ${failing.map(f => f.page).join(', ')}`;
  }
}

// Run the audits
runAudits().catch(console.error);