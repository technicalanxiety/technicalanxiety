#!/usr/bin/env node

/**
 * Post-Cutover Monitoring Dashboard
 * 
 * This script provides a simple monitoring dashboard for tracking
 * key metrics during the 24-hour post-cutover monitoring period.
 */

const fs = require('fs');
const path = require('path');

class MonitoringDashboard {
    constructor() {
        this.logFile = `monitoring-${new Date().toISOString().split('T')[0]}.log`;
        this.metricsFile = 'monitoring-metrics.json';
        this.startTime = new Date();
    }

    log(level, message) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${message}\n`;
        
        console.log(`${level.toUpperCase()}: ${message}`);
        fs.appendFileSync(this.logFile, logEntry);
    }

    loadMetrics() {
        try {
            if (fs.existsSync(this.metricsFile)) {
                return JSON.parse(fs.readFileSync(this.metricsFile, 'utf8'));
            }
        } catch (error) {
            this.log('warn', `Could not load metrics file: ${error.message}`);
        }
        
        return {
            checks: [],
            issues: [],
            startTime: this.startTime.toISOString(),
            lastUpdate: null
        };
    }

    saveMetrics(metrics) {
        metrics.lastUpdate = new Date().toISOString();
        fs.writeFileSync(this.metricsFile, JSON.stringify(metrics, null, 2));
    }

    recordCheck(checkType, status, details = {}) {
        const metrics = this.loadMetrics();
        
        const check = {
            timestamp: new Date().toISOString(),
            type: checkType,
            status: status, // 'pass', 'fail', 'warn'
            details: details
        };
        
        metrics.checks.push(check);
        
        if (status === 'fail') {
            metrics.issues.push({
                timestamp: check.timestamp,
                type: checkType,
                severity: details.severity || 'medium',
                description: details.description || 'Check failed',
                resolved: false
            });
        }
        
        this.saveMetrics(metrics);
        this.log(status === 'pass' ? 'info' : status, 
                `${checkType}: ${status.toUpperCase()} - ${details.description || 'No details'}`);
    }

    generateReport() {
        const metrics = this.loadMetrics();
        const now = new Date();
        const startTime = new Date(metrics.startTime);
        const hoursElapsed = (now - startTime) / (1000 * 60 * 60);
        
        console.log('\n' + '='.repeat(50));
        console.log('POST-CUTOVER MONITORING REPORT');
        console.log('='.repeat(50));
        console.log(`Start Time: ${startTime.toLocaleString()}`);
        console.log(`Current Time: ${now.toLocaleString()}`);
        console.log(`Hours Elapsed: ${hoursElapsed.toFixed(1)}/24.0`);
        console.log(`Progress: ${Math.min(100, (hoursElapsed / 24 * 100)).toFixed(1)}%`);
        
        // Summary statistics
        const recentChecks = metrics.checks.filter(check => {
            const checkTime = new Date(check.timestamp);
            return (now - checkTime) < (2 * 60 * 60 * 1000); // Last 2 hours
        });
        
        const passCount = recentChecks.filter(c => c.status === 'pass').length;
        const failCount = recentChecks.filter(c => c.status === 'fail').length;
        const warnCount = recentChecks.filter(c => c.status === 'warn').length;
        
        console.log('\nRECENT CHECKS (Last 2 Hours):');
        console.log(`✓ Passed: ${passCount}`);
        console.log(`⚠ Warnings: ${warnCount}`);
        console.log(`✗ Failed: ${failCount}`);
        
        // Active issues
        const activeIssues = metrics.issues.filter(issue => !issue.resolved);
        console.log(`\nACTIVE ISSUES: ${activeIssues.length}`);
        
        if (activeIssues.length > 0) {
            activeIssues.forEach((issue, index) => {
                const issueTime = new Date(issue.timestamp);
                const ageHours = (now - issueTime) / (1000 * 60 * 60);
                console.log(`${index + 1}. [${issue.severity.toUpperCase()}] ${issue.type}`);
                console.log(`   ${issue.description}`);
                console.log(`   Age: ${ageHours.toFixed(1)} hours`);
            });
        }
        
        // Health status
        console.log('\nOVERALL HEALTH:');
        if (activeIssues.filter(i => i.severity === 'critical').length > 0) {
            console.log('🔴 CRITICAL - Immediate attention required');
        } else if (activeIssues.filter(i => i.severity === 'high').length > 0) {
            console.log('🟡 DEGRADED - Issues need attention');
        } else if (activeIssues.length > 0) {
            console.log('🟢 STABLE - Minor issues present');
        } else {
            console.log('🟢 HEALTHY - No active issues');
        }
        
        // Recommendations
        console.log('\nRECOMMENDATIONS:');
        if (hoursElapsed < 2) {
            console.log('- Continue active monitoring (check every 15 minutes)');
            console.log('- Run health check script every 30 minutes');
        } else if (hoursElapsed < 8) {
            console.log('- Regular monitoring (check every 2 hours)');
            console.log('- Monitor user feedback channels');
        } else if (hoursElapsed < 24) {
            console.log('- Periodic monitoring (check every 4 hours)');
            console.log('- Prepare final migration report');
        } else {
            console.log('- 24-hour monitoring period complete');
            console.log('- Generate final migration success report');
        }
        
        console.log('\n' + '='.repeat(50));
    }

    resolveIssue(issueIndex) {
        const metrics = this.loadMetrics();
        const activeIssues = metrics.issues.filter(issue => !issue.resolved);
        
        if (issueIndex >= 0 && issueIndex < activeIssues.length) {
            const issue = activeIssues[issueIndex];
            issue.resolved = true;
            issue.resolvedAt = new Date().toISOString();
            
            this.saveMetrics(metrics);
            this.log('info', `Resolved issue: ${issue.type} - ${issue.description}`);
            return true;
        }
        
        return false;
    }

    simulateChecks() {
        // Simulate some monitoring checks for demonstration
        this.recordCheck('homepage_load', 'pass', { 
            description: 'Homepage loaded successfully',
            loadTime: '1.2s'
        });
        
        this.recordCheck('search_functionality', 'pass', { 
            description: 'Search returns results'
        });
        
        this.recordCheck('rss_feed', 'pass', { 
            description: 'RSS feed accessible and valid'
        });
        
        this.recordCheck('404_rate', 'warn', { 
            description: '404 rate slightly elevated (3% vs 2% baseline)',
            severity: 'low'
        });
    }
}

// CLI Interface
function main() {
    const dashboard = new MonitoringDashboard();
    const command = process.argv[2];
    
    switch (command) {
        case 'report':
            dashboard.generateReport();
            break;
            
        case 'check':
            const checkType = process.argv[3] || 'manual_check';
            const status = process.argv[4] || 'pass';
            const description = process.argv[5] || 'Manual check performed';
            dashboard.recordCheck(checkType, status, { description });
            break;
            
        case 'resolve':
            const issueIndex = parseInt(process.argv[3]) - 1;
            if (dashboard.resolveIssue(issueIndex)) {
                console.log('Issue resolved successfully');
            } else {
                console.log('Invalid issue index');
            }
            break;
            
        case 'simulate':
            dashboard.simulateChecks();
            console.log('Simulated monitoring checks recorded');
            break;
            
        default:
            console.log('Post-Cutover Monitoring Dashboard');
            console.log('');
            console.log('Usage:');
            console.log('  node monitoring-dashboard.js report                    - Show monitoring report');
            console.log('  node monitoring-dashboard.js check <type> <status>     - Record a check');
            console.log('  node monitoring-dashboard.js resolve <issue_number>    - Mark issue as resolved');
            console.log('  node monitoring-dashboard.js simulate                  - Add sample data');
            console.log('');
            console.log('Examples:');
            console.log('  node monitoring-dashboard.js check homepage_load pass "Site loads in 1.5s"');
            console.log('  node monitoring-dashboard.js check search_broken fail "Search returns no results"');
            console.log('  node monitoring-dashboard.js resolve 1');
    }
}

if (require.main === module) {
    main();
}

module.exports = MonitoringDashboard;