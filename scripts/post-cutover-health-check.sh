#!/bin/bash

# Post-Cutover Health Check Script
# This script performs automated checks on the migrated Astro site

set -e

# Configuration
SITE_URL="https://technicalanxiety.com"
LOG_FILE="monitoring-$(date +%Y%m%d).log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo "[$TIMESTAMP] $1" | tee -a "$LOG_FILE"
}

# Check function with status reporting
check() {
    local test_name="$1"
    local url="$2"
    local expected_status="${3:-200}"
    
    echo -n "Checking $test_name... "
    
    if response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url"); then
        if [ "$response" = "$expected_status" ]; then
            echo -e "${GREEN}✓ PASS${NC} ($response)"
            log "PASS: $test_name - HTTP $response"
            return 0
        else
            echo -e "${RED}✗ FAIL${NC} (Expected $expected_status, got $response)"
            log "FAIL: $test_name - Expected HTTP $expected_status, got $response"
            return 1
        fi
    else
        echo -e "${RED}✗ ERROR${NC} (Connection failed)"
        log "ERROR: $test_name - Connection failed to $url"
        return 1
    fi
}

# Check content function
check_content() {
    local test_name="$1"
    local url="$2"
    local expected_text="$3"
    
    echo -n "Checking $test_name content... "
    
    if content=$(curl -s --max-time 10 "$url"); then
        if echo "$content" | grep -q "$expected_text"; then
            echo -e "${GREEN}✓ PASS${NC}"
            log "PASS: $test_name - Content contains '$expected_text'"
            return 0
        else
            echo -e "${RED}✗ FAIL${NC} (Content not found)"
            log "FAIL: $test_name - Content does not contain '$expected_text'"
            return 1
        fi
    else
        echo -e "${RED}✗ ERROR${NC} (Failed to fetch content)"
        log "ERROR: $test_name - Failed to fetch content from $url"
        return 1
    fi
}

echo "=========================================="
echo "Post-Cutover Health Check"
echo "Site: $SITE_URL"
echo "Time: $TIMESTAMP"
echo "=========================================="

# Initialize counters
TOTAL_CHECKS=0
PASSED_CHECKS=0

# Core page checks
echo -e "\n${YELLOW}Core Pages${NC}"
tests=(
    "Homepage:$SITE_URL/"
    "About Page:$SITE_URL/about/"
    "Archive:$SITE_URL/archive/"
    "Search:$SITE_URL/search/"
)

for test in "${tests[@]}"; do
    IFS=':' read -r name url <<< "$test"
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if check "$name" "$url"; then
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    fi
done

# Recent blog posts check (sample a few)
echo -e "\n${YELLOW}Recent Blog Posts${NC}"
recent_posts=(
    "Setting up Kiro:$SITE_URL/setting-up-kiro-ai-assistant/"
    "Agent Governance:$SITE_URL/agent-governance/"
    "Bicep vs Terraform:$SITE_URL/bicep-terraform-vhs/"
)

for test in "${recent_posts[@]}"; do
    IFS=':' read -r name url <<< "$test"
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if check "$name" "$url"; then
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    fi
done

# Feed and sitemap checks
echo -e "\n${YELLOW}Feeds and Sitemaps${NC}"
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if check "RSS Feed" "$SITE_URL/rss.xml"; then
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
fi

TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if check "Sitemap" "$SITE_URL/sitemap.xml"; then
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
fi

# Content checks
echo -e "\n${YELLOW}Content Validation${NC}"
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if check_content "Homepage Title" "$SITE_URL/" "Technical Anxiety"; then
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
fi

TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if check_content "RSS Feed Content" "$SITE_URL/rss.xml" "<rss"; then
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
fi

# 404 page check
echo -e "\n${YELLOW}Error Handling${NC}"
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if check "404 Page" "$SITE_URL/this-page-does-not-exist/" "404"; then
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
fi

# Performance check (basic)
echo -e "\n${YELLOW}Performance Check${NC}"
echo -n "Checking homepage load time... "
if load_time=$(curl -s -o /dev/null -w "%{time_total}" --max-time 10 "$SITE_URL/"); then
    if (( $(echo "$load_time < 3.0" | bc -l) )); then
        echo -e "${GREEN}✓ PASS${NC} (${load_time}s)"
        log "PASS: Homepage load time - ${load_time}s"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "${YELLOW}⚠ SLOW${NC} (${load_time}s)"
        log "WARN: Homepage load time slow - ${load_time}s"
    fi
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
else
    echo -e "${RED}✗ ERROR${NC}"
    log "ERROR: Could not measure homepage load time"
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
fi

# Summary
echo -e "\n=========================================="
echo "Health Check Summary"
echo "=========================================="
echo "Total Checks: $TOTAL_CHECKS"
echo "Passed: $PASSED_CHECKS"
echo "Failed: $((TOTAL_CHECKS - PASSED_CHECKS))"

if [ $PASSED_CHECKS -eq $TOTAL_CHECKS ]; then
    echo -e "Status: ${GREEN}ALL CHECKS PASSED${NC}"
    log "SUMMARY: All $TOTAL_CHECKS checks passed"
    exit 0
elif [ $PASSED_CHECKS -ge $((TOTAL_CHECKS * 80 / 100)) ]; then
    echo -e "Status: ${YELLOW}MOSTLY HEALTHY${NC} ($(( PASSED_CHECKS * 100 / TOTAL_CHECKS ))% passed)"
    log "SUMMARY: $PASSED_CHECKS/$TOTAL_CHECKS checks passed ($(( PASSED_CHECKS * 100 / TOTAL_CHECKS ))%)"
    exit 1
else
    echo -e "Status: ${RED}CRITICAL ISSUES${NC} ($(( PASSED_CHECKS * 100 / TOTAL_CHECKS ))% passed)"
    log "SUMMARY: CRITICAL - Only $PASSED_CHECKS/$TOTAL_CHECKS checks passed ($(( PASSED_CHECKS * 100 / TOTAL_CHECKS ))%)"
    exit 2
fi