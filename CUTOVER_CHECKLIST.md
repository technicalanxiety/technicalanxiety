# Astro Migration Cutover Checklist

## Pre-Cutover Verification (Complete Before Cutover)

### Testing
- [ ] All property-based tests passing (`npm run test`)
- [ ] Cross-browser tests passing (`npm run test:cross-browser`)
- [ ] Lighthouse audits meet targets (≥90 on all categories)
- [ ] Link checker shows no broken links
- [ ] Staging deployment verified (`npm run verify:staging`)

### Content Verification
- [ ] All blog posts migrated and rendering correctly
- [ ] All images loading correctly
- [ ] Series navigation working on all series posts
- [ ] Tag pages displaying correct posts
- [ ] Search functionality working
- [ ] RSS feed validates (https://validator.w3.org/feed/)
- [ ] Sitemap.xml accessible and valid

### Feature Verification
- [ ] Dark/light theme toggle working
- [ ] Reading progress indicator working
- [ ] Table of contents generating correctly
- [ ] Breadcrumbs displaying correctly
- [ ] Pagination working on listing pages
- [ ] Giscus comments loading
- [ ] Cookie consent banner displaying
- [ ] 404 page displaying correctly

### Performance Verification
- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility ≥ 90
- [ ] Lighthouse Best Practices ≥ 90
- [ ] Lighthouse SEO ≥ 90
- [ ] LCP < 2.5 seconds
- [ ] No console errors in browser

### Rollback Preparation
- [ ] `pre-astro-migration` tag created on master branch
- [ ] Rollback procedure documented and reviewed
- [ ] Team aware of rollback process
- [ ] Rollback can be executed in < 5 minutes

## Cutover Execution

### Step 1: Final Staging Verification
```bash
# Verify staging is working
npm run verify:staging

# Check latest commit
git log --oneline -5
```

### Step 2: Merge to Master
```bash
# Ensure astro-migration is up to date
git checkout astro-migration
git pull origin astro-migration

# Switch to master
git checkout master
git pull origin master

# Merge astro-migration
git merge astro-migration

# Review the merge
git log --oneline -5
git diff HEAD~1
```

### Step 3: Push to Production
```bash
# Push to trigger production deployment
git push origin master

# Monitor GitHub Actions
# Go to: https://github.com/technicalanxiety/technicalanxiety.github.io/actions
```

### Step 4: Monitor Deployment
- [ ] GitHub Actions workflow completes successfully
- [ ] Azure Static Web Apps deployment succeeds
- [ ] No errors in deployment logs

### Step 5: Immediate Verification (Within 5 Minutes)
```bash
# Run production verification
npm run verify:production
```

Manual checks:
- [ ] Homepage loads: https://technicalanxiety.com/
- [ ] Recent post loads: https://technicalanxiety.com/setting-up-kiro-ai-assistant/
- [ ] Search works: https://technicalanxiety.com/search/
- [ ] RSS feed: https://technicalanxiety.com/rss.xml
- [ ] Sitemap: https://technicalanxiety.com/sitemap.xml

## Post-Cutover Monitoring (First Hour)

### Critical Path Testing
- [ ] Test on Chrome desktop
- [ ] Test on Firefox desktop
- [ ] Test on Safari desktop
- [ ] Test on Chrome mobile
- [ ] Test on Safari mobile (iOS)

### Feature Testing
- [ ] Theme toggle works
- [ ] Comments load (Giscus)
- [ ] Search returns results
- [ ] Tag pages work
- [ ] Series navigation works
- [ ] Pagination works

### Analytics Verification
- [ ] Google Analytics tracking code firing
- [ ] No spike in 404 errors
- [ ] Traffic patterns normal

## Post-Cutover Monitoring (First 24 Hours)

### Hourly Checks (First 6 Hours)
- [ ] Hour 1: Site accessible, no errors
- [ ] Hour 2: Site accessible, no errors
- [ ] Hour 3: Site accessible, no errors
- [ ] Hour 4: Site accessible, no errors
- [ ] Hour 5: Site accessible, no errors
- [ ] Hour 6: Site accessible, no errors

### Daily Checks (First 24 Hours)
- [ ] Morning: Check analytics for issues
- [ ] Afternoon: Check analytics for issues
- [ ] Evening: Check analytics for issues
- [ ] Night: Check analytics for issues

### Metrics to Monitor
- [ ] Page load times (should be same or better)
- [ ] 404 error rate (should not increase)
- [ ] Bounce rate (should be similar)
- [ ] Average session duration (should be similar)
- [ ] User-reported issues (monitor email/social)

## Rollback Decision Criteria

Execute rollback if ANY of these occur:

### Critical Issues (Immediate Rollback)
- [ ] Site completely inaccessible
- [ ] All pages returning 500 errors
- [ ] Major security vulnerability discovered
- [ ] Data loss or corruption

### Major Issues (Rollback Within 1 Hour)
- [ ] 404 error rate increases by >50%
- [ ] Page load times increase by >100%
- [ ] Critical features broken (search, comments, navigation)
- [ ] Mobile site completely broken

### Minor Issues (Fix Forward, No Rollback)
- Individual page rendering issues
- Styling inconsistencies
- Non-critical feature bugs
- Performance issues on specific pages

## Post-Cutover Completion (After 24 Hours)

### Final Verification
- [ ] All metrics stable for 24 hours
- [ ] No critical or major issues reported
- [ ] User feedback positive or neutral
- [ ] Analytics showing normal patterns

### Documentation
- [ ] Update README with Astro build instructions
- [ ] Archive Jekyll-specific files
- [ ] Document any issues encountered and resolutions
- [ ] Update team documentation

### Cleanup
- [ ] Remove Jekyll build files (if desired)
- [ ] Archive Jekyll branch (optional)
- [ ] Update repository description
- [ ] Celebrate successful migration! 🎉

## Emergency Contacts

- **Primary**: Jason Rinehart (site owner)
- **Repository**: https://github.com/technicalanxiety/technicalanxiety.github.io
- **Azure Support**: Azure Portal
- **Rollback Procedure**: See ROLLBACK_PROCEDURE.md

## Notes

- Keep this checklist open during cutover
- Check off items as completed
- Document any deviations or issues
- If in doubt, rollback and investigate