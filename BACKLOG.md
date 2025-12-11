# Technical Anxiety - Development Backlog

## Status: ✅ CORE FEATURES COMPLETE
All major backlog items have been successfully implemented! The site now has:
- RSS feed with subscription widget
- Related posts at the bottom of articles  
- Series collection widget for content discovery
- Full light/dark theme support
- Optimized performance and SEO

**Next Phase:** Focus on content creation and let user data drive future development decisions.

## Prioritized Items

*All major backlog items have been completed! 🎉*

### Content-Driven Enhancements (Data-Driven Decisions)
- [ ] **Series navigation enhancement** - Add next/previous navigation within series posts
  - Series progress indicator (e.g., "Part 2 of 4")
  - Valuable for multi-part content strategy
- [ ] **Topic-based landing pages** - Dedicated pages for major topics (Leadership, Azure, Log Analytics)
  - Better than tag pages - curated content with context
  - Could improve SEO for key expertise areas
- [ ] **Enhanced content discovery** 
  - "Popular Posts" widget based on analytics data
  - "Recently Updated" for revised older posts
  - Simple search (Jekyll Simple Search) if content volume grows significantly

### Technical Considerations (Low Priority)
- [ ] **Performance monitoring** - Core Web Vitals tracking in GA4
- [ ] **Image optimization** - Lazy loading and WebP format for future visual content
- [ ] **Content management** 
  - Archive older posts (2020-2021) to separate section
  - Content freshness reviews for technical posts
  - "Last Updated" dates for evergreen content

---

## Completed Items
- [x] Newsletter removal - MailChimp config cleaned from _config.yml
- [x] Related Posts - Added related posts section at bottom of articles (completed 2025-11-14)
- [x] RSS Feed - Jekyll Feed plugin installed and RSS widget added to sidebar (completed 2025-11-25)

---

## Explicitly Avoiding (Keep It Simple)
- Complex comment systems beyond Giscus
- Newsletter integration (RSS is perfect for tech audience)
- Heavy JavaScript features or widgets
- Over-categorization beyond current tag system
- Social media widgets beyond current Follow section
- Custom search implementation (unless content grows significantly)
- Complex tagging systems
- Custom analytics dashboards
- Elaborate build pipelines
- A/B testing
- Custom Jekyll plugins that break GitHub Pages
