# Technical Anxiety - Development Backlog

## Status: 🚀 ASTRO MIGRATION COMPLETE
Successfully migrated from Jekyll to Astro with significant performance improvements! All Lighthouse requirements met (90+ scores across all categories).

**Current Phase:** Post-migration optimization and content workflow setup.

## Prioritized Items

### 🔄 **Migration Cleanup & Workflow** (High Priority)
- [ ] **GitHub Actions Update** - Update auto-publishing workflow for Astro
  - Migrate from Jekyll `_posts/backlog` to Astro `src/content/posts/backlog`
  - Update build process to use `npm run build` instead of Jekyll
  - Test scheduled post publishing workflow
- [ ] **Content Backlog Migration** - Move any scheduled posts to new structure
  - Review existing backlog posts for Astro compatibility
  - Update frontmatter format if needed
- [ ] **Production Cutover** - Switch main branch to Astro
  - Merge `astro-migration` branch to `main`
  - Update default branch settings
  - Monitor for any issues post-cutover

### 📊 **Performance & Monitoring** (Medium Priority)
- [ ] **Core Web Vitals Monitoring** - Set up production performance tracking
  - Monitor LCP, CLS, FID metrics in production
  - Set up alerts for performance regressions
- [ ] **Image Optimization Pipeline** - Automate image optimization
  - Add image optimization to build process
  - Consider automated WebP/AVIF generation for new posts
- [ ] **CDN Optimization** - Leverage Azure Static Web Apps CDN
  - Optimize caching headers
  - Consider additional CDN optimizations

### ✨ **Content Enhancement** (Low Priority - Data-Driven)
- [ ] **Series Navigation Enhancement** - Add next/previous navigation within series posts
  - Series progress indicator (e.g., "Part 2 of 4")
  - Valuable for multi-part content strategy
- [ ] **Topic-Based Landing Pages** - Dedicated pages for major topics
  - Better than tag pages - curated content with context
  - Could improve SEO for key expertise areas (Leadership, Azure, Log Analytics)
- [ ] **Enhanced Content Discovery** 
  - "Popular Posts" widget based on analytics data
  - "Recently Updated" for revised older posts
  - Search improvements if content volume grows

### 🛠️ **Technical Debt** (As Needed)
- [ ] **Accessibility Improvements** - Address remaining Lighthouse accessibility issues
  - Fix color contrast ratios on tags/buttons
  - Improve heading structure hierarchy
  - Add aria-labels to image links
- [ ] **SEO Enhancements** - Fine-tune SEO beyond current 92-100 scores
  - Structured data markup
  - Enhanced meta descriptions
  - Internal linking optimization

---

## ✅ Completed Items (Astro Migration)

### Performance Optimization
- [x] **Font Loading Optimization** - Preload with display=swap (2024-12-19)
- [x] **JavaScript Deferral** - Google Analytics, Ionicons after page load (2024-12-19)
- [x] **Image Optimization** - WebP/AVIF with responsive sizing (2024-12-19)
- [x] **Critical CSS Inlining** - Above-the-fold styles inlined (2024-12-19)
- [x] **Lighthouse Requirements** - All pages 90+ performance (2024-12-19)

### Core Migration
- [x] **Astro Setup** - Project initialization and configuration (2024-12-19)
- [x] **Content Migration** - All blog posts migrated to Astro content collections (2024-12-19)
- [x] **Component Migration** - All Jekyll includes converted to Astro components (2024-12-19)
- [x] **Style Migration** - SCSS styles adapted for Astro (2024-12-19)
- [x] **Feature Parity** - All Jekyll features working in Astro (2024-12-19)

### Previous Jekyll Completions
- [x] Newsletter removal - MailChimp config cleaned (2025-11-14)
- [x] Related Posts - Added related posts section (2025-11-14)
- [x] RSS Feed - Jekyll Feed plugin and RSS widget (2025-11-25)

---

## 🚫 Explicitly Avoiding (Keep It Simple)
- Complex comment systems beyond Giscus
- Newsletter integration (RSS is perfect for tech audience)
- Heavy JavaScript features or widgets
- Over-categorization beyond current tag system
- Social media widgets beyond current Follow section
- Custom search implementation (unless content grows significantly)
- Complex tagging systems
- Custom analytics dashboards
- Elaborate build pipelines beyond current setup
- A/B testing frameworks
- Custom plugins that complicate deployment

---

## 📝 Notes
- **Performance**: Achieved 90-100 Lighthouse scores across all categories
- **Migration**: Zero content loss, improved performance, modern tech stack
- **Workflow**: GitHub Actions need updating for Astro build process
- **Focus**: Content creation over feature development unless data-driven need