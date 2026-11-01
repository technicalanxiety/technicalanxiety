# Deployment Configuration

## Overview

How technicalanxiety.com is built, deployed and verified.

## Hosting: Azure Static Web Apps

- **Resource Name**: ambitious-wave-0d77c1c10
- **Production URL**: https://technicalanxiety.com
- **Workflow**: `.github/workflows/azure-static-web-apps-ambitious-wave-0d77c1c10.yml`

The workflow:
- Deploys `master` to **Production** on every push
- Builds a **preview environment** for each pull request, removed when the PR closes
- Builds with `npm run build` on Node.js 24 and deploys `dist/`

The scheduled publish workflow (`.github/workflows/publish-scheduled-posts.yml`)
commits to `master` when posts go live, which triggers a production deploy.

### Custom Domain

- Domain: `technicalanxiety.com`, CNAME to the Static Web Apps endpoint
- SSL: managed by Azure

```bash
dig technicalanxiety.com
```

## Deployment Verification

After a deploy, verify these endpoints:

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

## Monitoring

1. **Azure Static Web Apps**: deployment status and build failures in the
   Azure Portal and the GitHub Actions run log
2. **Google Analytics**: tracking working, no traffic drops, no spike in 404s
3. **After a significant site change**: test search, theme toggle and Giscus
   comments, and run `npm run verify:production`

## Rollback

Revert the offending commit on `master` and push; the deploy workflow
redeploys the previous state. Static Web Apps keeps no separate slots, so a
revert is the rollback.

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

## Support Contacts

- **Azure Static Web Apps**: Azure Portal support
- **Domain/DNS**: Current domain registrar
- **Repository**: GitHub (technicalanxiety/technicalanxiety)
- **Primary Contact**: Jason Rinehart
