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

## Next Steps

### Immediate
- [ ] Set up Google Analytics 4 property
- [ ] Add GA4 Measurement ID to _config.yml
- [ ] Test site locally and verify tracking

### Short-term
- [ ] Update Ionicons from v4 to v7
- [ ] Add privacy policy page
- [ ] Consider cookie consent implementation
- [ ] Add dark mode toggle

### Long-term
- [ ] Evaluate Jekyll 4.x migration
- [ ] Consider modern icon library alternatives
- [ ] Implement PWA features for offline reading
- [ ] Add reading time estimates to posts
