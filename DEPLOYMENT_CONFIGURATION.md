# Astro Migration Deployment Configuration

## Overview

This document outlines the production deployment configuration for the Astro migration, including the cutover process from Jekyll to Astro.

## Current Deployment Setup

### Primary Hosting: Azure Static Web Apps

- **Service**: Azure Static Web Apps
- **Resource Name**: ambitious-wave-0d77c1c10
- **Production URL**: https://technicalanxiety.com
- **Staging URL**: https://ambitious-wave-0d77c1c10-staging.azurestaticapps.net (astro-migration branch)
- **Workflow**: `.github/workflows/azure-static-web-apps-ambitious-wave-0d77c1c10.yml`

### Current Configuration

The Azure Static Web Apps workflow is already configured to:
- Deploy `master` branch to **Production** environment
- Deploy `astro-migration` branch to **Staging** environment
- Build Astro site using `npm run build`
- Deploy from `dist/` directory

## Cutover Process

### Phase 1: Pre-Cutover Verification

1. **Verify staging deployment**:
   ```bash
   # Check that astro-migration branch deploys successfully to staging
   curl -I https://ambitious-wave-0d77c1c10-staging.azurestaticapps.net/
   ```

2. **Run final tests on staging**:
   - Lighthouse audits
   - Cross-browser testing
   - Link checker
   - Property-based tests

### Phase 2: Production Cutover

The cutover will be executed by merging the `astro-migration` branch to `master`:

```bash
# 1. Ensure astro-migration is up to date
git checkout astro-migration
git pull origin astro-migration

# 2. Switch to master and merge
git checkout master
git pull origin master
git merge astro-migration

# 3. Push to trigger production deployment
git push origin master
```

### Phase 3: DNS Configuration (If Needed)

Current DNS should already be configured for Azure Static Web Apps. If changes are needed:

1. **Check current DNS records**:
   ```bash
   dig technicalanxiety.com
   nslookup technicalanxiety.com
   ```

2. **Azure Static Web Apps Custom Domain**:
   - Domain: `technicalanxiety.com`
   - CNAME: Points to Azure Static Web Apps endpoint
   - SSL: Managed by Azure (Let's Encrypt)

## Deployment Verification

After cutover, verify these endpoints:

### Critical Paths
```bash
# Homepage
curl -I https://technicalanxiety.com/

# Recent blog post
curl -I https://technicalanxiety.com/setting-up-kiro-ai-assistant/

# RSS Feed
curl -I https://technicalanxiety.com/rss.xml

# Sitemap
curl -I https://technicalanxiety.com/sitemap.xml

# Search functionality
curl -I https://technicalanxiety.com/search/

# Tag pages
curl -I https://technicalanxiety.com/tags/azure/

# 404 page
curl -I https://technicalanxiety.com/nonexistent-page/
```

### Performance Verification
```bash
# Run Lighthouse audit
npm run lighthouse-audit

# Check Core Web Vitals
# Use PageSpeed Insights: https://pagespeed.web.dev/
```

## Build Configuration

### Astro Build Settings

```javascript
// astro.config.mjs
export default defineConfig({
  output: 'static',
  site: 'https://technicalanxiety.com',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
```

### Package.json Scripts

```json
{
  "scripts": {
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

## Environment Variables

No environment variables are currently required for the static build. All configuration is in:
- `astro.config.mjs`
- `src/config.ts`

## Monitoring and Alerts

### Post-Deployment Monitoring

1. **Azure Static Web Apps Metrics**:
   - Monitor deployment status
   - Check for build failures
   - Monitor traffic patterns

2. **Google Analytics**:
   - Verify tracking is working
   - Monitor for traffic drops
   - Check for increased 404 errors

3. **Manual Checks** (First 24 hours):
   - Test critical user journeys
   - Monitor Giscus comments
   - Check search functionality
   - Verify theme toggle works

## Rollback Configuration

If rollback is needed, the process is documented in `ROLLBACK_PROCEDURE.md`:

1. **Quick rollback**: Reset master branch to `pre-astro-migration` tag
2. **Alternative**: Revert the merge commit
3. **Emergency**: Use Azure Static Web Apps deployment slots

## Security Considerations

### HTTPS Configuration
- Azure Static Web Apps provides automatic HTTPS
- SSL certificate is managed by Azure (Let's Encrypt)
- HTTP requests are automatically redirected to HTTPS

### Content Security Policy
Current CSP headers should be maintained. Check in browser dev tools after deployment.

## Performance Targets

Post-deployment, verify these Lighthouse scores:
- **Performance**: ≥ 90
- **Accessibility**: ≥ 90  
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90

## Deployment Checklist

### Pre-Cutover
- [ ] Staging deployment successful
- [ ] All property tests passing
- [ ] Lighthouse audits meet targets
- [ ] Cross-browser testing complete
- [ ] Rollback procedure documented and tested

### During Cutover
- [ ] Merge astro-migration to master
- [ ] Push to trigger production deployment
- [ ] Monitor Azure deployment status
- [ ] Verify production site loads

### Post-Cutover
- [ ] Run verification scripts
- [ ] Check Google Analytics tracking
- [ ] Test Giscus comments
- [ ] Monitor for 24 hours
- [ ] Document any issues

## Support Contacts

- **Azure Static Web Apps**: Azure Portal support
- **Domain/DNS**: Current domain registrar
- **Repository**: GitHub (technicalanxiety/technicalanxiety.github.io)
- **Primary Contact**: Jason Rinehart

## Notes

- The Azure Static Web Apps configuration is already optimized for Astro
- No additional DNS changes should be required
- The staging environment allows for final testing before cutover
- Deployment is automated via GitHub Actions