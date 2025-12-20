# Astro Migration Rollback Procedure

## Overview

This document outlines the procedure to rollback from the Astro migration to the original Jekyll site in case of critical issues during or after cutover.

## Pre-Rollback Information

- **Rollback Tag**: `pre-astro-migration`
- **Jekyll Branch**: `master`
- **Astro Branch**: `astro-migration`
- **Production Domain**: technicalanxiety.com
- **Hosting**: GitHub Pages

## Rollback Scenarios

### Scenario 1: Issues Discovered During Cutover (Before DNS/Deployment Switch)

If issues are found during the cutover process but before the production deployment is switched:

1. **Stop the cutover process**
2. **Do not merge astro-migration to master**
3. **Continue using Jekyll site (no action needed)**

### Scenario 2: Issues Discovered After Cutover (Production is Running Astro)

If critical issues are discovered after the Astro site is live in production:

#### Quick Rollback (< 5 minutes)

1. **Revert GitHub Pages to Jekyll**:
   ```bash
   git checkout master
   git reset --hard pre-astro-migration
   git push origin master --force
   ```

2. **Verify rollback**:
   - Check that technicalanxiety.com loads the Jekyll site
   - Verify recent posts are accessible
   - Test search functionality
   - Check comments are working

#### Alternative Rollback (If GitHub Pages config changed)

If the GitHub Pages configuration was modified during cutover:

1. **Go to GitHub repository settings**
2. **Navigate to Pages section**
3. **Change source back to "Deploy from a branch"**
4. **Select branch: master**
5. **Select folder: / (root)**
6. **Save configuration**

## Post-Rollback Actions

After successful rollback:

1. **Document the issues** that caused the rollback
2. **Create GitHub issues** for each problem found
3. **Notify stakeholders** of the rollback
4. **Plan resolution timeline** for the issues
5. **Schedule new cutover attempt** after fixes are implemented

## Rollback Verification Checklist

After rollback, verify these critical paths:

- [ ] Homepage loads correctly
- [ ] Recent blog posts are accessible
- [ ] Search functionality works
- [ ] Comments (Giscus) load properly
- [ ] Dark/light theme toggle works
- [ ] RSS feed is accessible
- [ ] Sitemap.xml is available
- [ ] 404 page displays correctly
- [ ] Mobile responsiveness works

## Emergency Contacts

- **Primary**: Jason Rinehart (site owner)
- **Repository**: https://github.com/technicalanxiety/technicalanxiety.github.io
- **Hosting Support**: GitHub Pages (no direct support, community forums)

## Recovery Time Objectives

- **Detection to Decision**: < 15 minutes
- **Decision to Rollback Execution**: < 5 minutes
- **Rollback Execution**: < 5 minutes
- **Total Recovery Time**: < 25 minutes

## Testing After Rollback

Run these quick tests to ensure rollback was successful:

```bash
# Test homepage
curl -I https://technicalanxiety.com/

# Test a recent post
curl -I https://technicalanxiety.com/setting-up-kiro-ai-assistant/

# Test RSS feed
curl -I https://technicalanxiety.com/feed.xml

# Test sitemap
curl -I https://technicalanxiety.com/sitemap.xml
```

## Notes

- The `pre-astro-migration` tag represents the exact state of the Jekyll site before migration
- All Jekyll dependencies and build processes should remain functional
- The rollback does not affect the astro-migration branch - fixes can continue there
- Consider this rollback procedure as a safety net, not a failure