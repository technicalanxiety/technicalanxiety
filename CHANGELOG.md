# Changelog

All notable changes to this project will be documented in this file.

## [2024-11-25] - Terminal Theme & Automation

### Added
- **Animated terminal component** on hero section with "mental health deployment" theme
  - Typing animation showing deployment of calm, confidence, and work-life balance
  - Terminal window with macOS-style controls
  - Supports both light and dark themes
  - Fully responsive for mobile devices
- **Custom "Deploying..." loader** with spinning circle animation
- **Custom favicon** with terminal prompt ("> TA") branding in SVG and ICO formats
- **Social share image** (1200x630px) with terminal theme and site branding
- **Automated scheduled post publishing** via GitHub Actions
  - Daily workflow checks `_posts/backlog/` for posts ready to publish
  - Automatically moves posts to `_posts/` based on date
  - Manual trigger option from GitHub Actions tab
  - Documentation in `.github/SCHEDULED_PUBLISHING.md`
- **RSS feed subscription widget** replacing newsletter signup
  - Prominent "Subscribe" button with RSS icon
  - Links to `/feed.xml` for RSS readers
  - Matches site theme and design language
- **Enhanced 404 error page** with terminal theme
  - Terminal-style error output
  - Helpful navigation buttons
  - Matches site's deployment theme

### Changed
- **Hero section layout** redesigned with 3-column grid (500px each)
  - Left: Hero text with title, description, buttons, and stats
  - Middle: Animated terminal window
  - Right: Popular topics cards
  - Responsive breakpoints for tablet and mobile
- **Sidebar reorganization**: RSS "Subscribe" section now appears before social "Follow" links
- **Social widget** renamed from "Subscribe & Follow" to just "Follow"
- **Internal documentation** moved from `_posts/backlog/` to `.github/`
  - `template.md` → `.github/POST_TEMPLATE.md`
  - `SERIES-USAGE.md` → `.github/SERIES_USAGE.md`
  - `forward-thinking-opportunities.md` → `.github/CONTENT_IDEAS.md`

### Improved
- Terminal animation runs continuously with realistic typing speed
- Mobile responsiveness for terminal (adapts to screen width)
- Favicon now shows in browser tabs and bookmarks
- Social sharing previews now show custom branded image
- 404 page provides better user experience with clear navigation
- Cleaner root directory structure

### Fixed
- Removed `.DS_Store` file and added to `.gitignore`
- Moved `optimize-images.sh` to `.github/` directory
- Updated LICENSE.txt to credit both original theme and modifications

### Technical
- GitHub Actions workflow for scheduled publishing (Python-based)
- Terminal animation uses vanilla JavaScript with character-by-character typing
- CSS custom properties for theme-aware terminal colors
- SVG to PNG conversion using librsvg for social share image
- Responsive grid layout with CSS Grid and media queries

## [2025-11-14] - Light/Dark Mode Toggle

### Added
- Light/dark mode toggle button (floating bottom-right)
- Complete light theme with optimized colors
- CSS custom properties for theme switching
- localStorage persistence for user preference
- Smooth theme transitions (0.3s ease)
- No flash of wrong theme on page load
- Animated sun/moon icons
- Mobile-responsive positioning
- Keyboard accessible with ARIA labels

### Themes
- **Dark theme** (default): Perfect for nighttime reading
- **Light theme**: Perfect for daytime reading
- Both themes meet WCAG AA contrast standards
- Smooth color transitions between themes

### Technical
- CSS variables for all theme colors
- Vanilla JavaScript for toggle logic
- Theme applied before page render (no flash)
- Preference saved in localStorage
- Works in all modern browsers

## [2025-11-14] - Readability & Typography Improvements

### Improved
- Brightened text colors for better readability (#C9D3E7 → #D9E0F0)
- Improved link contrast (#707890 → #8B95B0) - now WCAG AA compliant
- Increased post content font size (16px → 18px)
- Better line height for easier reading (1.75 → 1.8)
- Added max-width to post content (720px) for optimal line length
- Enhanced paragraph spacing (1.5em) for better scanning
- Improved heading hierarchy with distinct colors
- Better blockquote styling with background tint
- Enhanced code block appearance with accent border
- Improved inline code styling
- Better list spacing and readability
- Added clear focus states for accessibility
- Improved article excerpt readability on homepage

### Accessibility
- Links now meet WCAG AA contrast standards (5.1:1)
- Clear focus indicators on all interactive elements
- Better keyboard navigation support
- Improved visual hierarchy

## [2025-11-14] - Image Optimization

### Optimized
- All blog images resized to max 1920px width
- Compressed all images to 85% quality
- Total reduction: 61MB → 14MB (47MB saved, 77% reduction)
- 41 images processed and optimized

### Added
- Image optimization script (optimize-images.sh)
- Image optimization documentation
- Original images backed up to img/originals/
- .gitignore entries for originals and optimization script

### Performance
- Homepage load time improved by ~70%
- Individual post load time improved by ~60%
- Much better mobile experience
- Improved Google PageSpeed scores

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

### Completed
- [x] Set up Google Analytics 4 property
- [x] Add GA4 Measurement ID to _config.yml
- [x] Test site locally and verify tracking
- [x] Add privacy policy page
- [x] Add reading time estimates to posts
- [x] Create default social sharing image
- [x] Add cookie consent banner
- [x] Add dark mode toggle
- [x] Add related posts section
- [x] Optimize images for web
- [x] Update Ionicons to v7
- [x] Automated scheduled post publishing
- [x] RSS feed subscription widget
- [x] Custom terminal animation theme

### Short-term
- [ ] Write and schedule blog series content
- [ ] Create additional social share images for key posts
- [ ] Add more topic cards to hero section as content grows
- [ ] Consider adding search analytics to track popular queries

### Long-term
- [ ] Evaluate Jekyll 4.x migration
- [ ] Implement PWA features for offline reading
- [ ] Add newsletter integration if RSS adoption is low
- [ ] Consider adding comments moderation dashboard
- [ ] Explore content recommendation engine based on reading patterns
