# Changelog

All notable changes to this project will be documented in this file.

## [2025-11-14] - Security & Dependency Updates

### Added
- Google Analytics 4 (GA4) support with modern gtag.js tracking
- Jekyll SEO Tag plugin for automatic meta tags generation
- Jekyll Feed plugin for RSS feed generation
- Ruby 3.4+ compatibility gems (csv, base64, bigdecimal)
- Enhanced site metadata in _config.yml (description, author bio, language)
- SECURITY.md with vulnerability reporting process
- Documentation: GA4_SETUP.md, SECURITY_UPDATES.md
- Preconnect hints for Google Fonts performance optimization
- Open Graph and Twitter Card meta tags (via jekyll-seo-tag)
- Structured data (JSON-LD) for better SEO

### Changed
- Migrated from Universal Analytics (UA-155892178-1) to GA4
- Updated Gemfile with pinned versions and better organization
- Modernized Google Fonts loading (CSS2 API with font-display: swap)
- Replaced manual meta tags with {% seo %} tag in head.html
- Updated _config.yml with proper author structure

### Deprecated
- Universal Analytics tracking code (Google shut down UA in July 2023)

### Security
- Updated nokogiri to >= 1.18.0
- Updated kramdown to >= 2.4.0
- Updated commonmarker to >= 0.23.12
- Pinned bundler to ~> 2.3
- Added explicit version constraints for reproducible builds

### Fixed
- Ruby 3.4 compatibility issue (missing csv gem)
- Build process now completes successfully
- RSS feed generation working at /feed.xml

## [2025-11-14] - Social Media & Privacy Updates

### Added
- Enhanced Twitter/X integration with proper SEO configuration
- Privacy policy page at /privacy/
- Social media profile links in structured data
- Privacy policy link in footer
- Aria labels for social media icons (accessibility)

### Changed
- Updated social media configuration in _config.yml for better SEO
- Simplified footer social links to show only configured platforms
- Updated sidebar social links to use new config structure
- Added comments to newsletter config for easier setup

### Improved
- Twitter Card configuration for better social sharing
- Open Graph data structure for social platforms
- Footer now shows Privacy link prominently

## [2025-11-14] - UX Improvements (Reading Time, Social Sharing, Cookie Consent)

### Added
- Reading time estimates on all posts and article cards
- Default social sharing image (SVG) for posts without featured images
- Cookie consent banner with localStorage persistence
- Styled reading time indicator with clock icon
- Responsive cookie consent design

### Changed
- Updated post layout to display reading time
- Updated homepage article cards to show reading time
- Added default logo/image for social sharing in config

### Improved
- Better user experience with reading time estimates
- Compliance with cookie laws (GDPR/CCPA)
- Social media sharing appearance for posts without images

## Next Steps

### Immediate
- [x] Set up Google Analytics 4 property
- [x] Add GA4 Measurement ID to _config.yml
- [x] Test site locally and verify tracking
- [x] Add privacy policy page
- [x] Add reading time estimates to posts
- [x] Create default social sharing image
- [x] Add cookie consent banner

### Short-term
- [ ] Update Ionicons from v4 to v7 (requires template changes)
- [ ] Add dark mode toggle
- [ ] Add related posts section
- [ ] Optimize images for web

### Long-term
- [ ] Evaluate Jekyll 4.x migration
- [ ] Consider modern icon library alternatives (Lucide, Heroicons)
- [ ] Implement PWA features for offline reading
- [ ] Add related posts section
