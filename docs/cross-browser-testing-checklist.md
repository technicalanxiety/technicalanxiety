# Cross-Browser Testing Checklist

This document provides a comprehensive checklist for manual cross-browser testing of the Astro migration.

## Automated Testing

Run the automated cross-browser tests first:

```bash
npm run test:cross-browser
```

This will test:
- ✅ Chrome desktop and mobile viewports
- ✅ Basic page loading and structure
- ✅ JavaScript functionality
- ✅ CSS loading and styling
- ✅ Touch target sizes on mobile
- ✅ Horizontal overflow detection

## Manual Testing Requirements

### Desktop Browsers

#### Chrome (Latest)
- [ ] Homepage loads correctly
- [ ] Navigation works (header menu)
- [ ] Theme toggle functions (dark/light mode)
- [ ] Blog post pages render properly
- [ ] Search functionality works
- [ ] Comments load (Giscus)
- [ ] Table of contents generates and links work
- [ ] Reading progress indicator functions
- [ ] Pagination works on listing pages
- [ ] Tag pages load and display posts
- [ ] Breadcrumb navigation displays correctly
- [ ] Footer links work
- [ ] RSS feed is accessible
- [ ] 404 page displays for invalid URLs

#### Firefox (Latest)
- [ ] All Chrome tests above
- [ ] CSS Grid/Flexbox layouts render correctly
- [ ] Custom CSS properties (variables) work
- [ ] Font loading works properly
- [ ] Smooth scrolling behavior
- [ ] Focus indicators visible for keyboard navigation

#### Safari (Latest - macOS only)
- [ ] All Chrome tests above
- [ ] WebKit-specific CSS features work
- [ ] Touch events work on trackpad
- [ ] Scroll behavior is smooth
- [ ] Date formatting displays correctly

#### Edge (Latest)
- [ ] All Chrome tests above
- [ ] Microsoft-specific optimizations work
- [ ] Performance is comparable to Chrome

### Mobile Devices

#### iPhone (Safari)
**Viewport: 390x844 (iPhone 12 Pro)**
- [ ] Homepage loads and is readable
- [ ] Navigation is accessible (hamburger menu if present)
- [ ] Touch targets are appropriately sized (min 44px)
- [ ] Text is readable without zooming
- [ ] Images scale properly
- [ ] No horizontal scrolling required
- [ ] Theme toggle works with touch
- [ ] Search input works with virtual keyboard
- [ ] Blog posts are readable in portrait/landscape
- [ ] Comments section works
- [ ] Pinch-to-zoom works properly
- [ ] Scroll performance is smooth

#### Android Phone (Chrome)
**Viewport: 375x667 (iPhone SE equivalent)**
- [ ] All iPhone tests above
- [ ] Android-specific touch behaviors work
- [ ] Back button behavior is correct
- [ ] Share functionality works (if implemented)

#### iPad (Safari)
**Viewport: 768x1024**
- [ ] Layout adapts properly to tablet size
- [ ] Sidebar behavior is appropriate
- [ ] Touch interactions work smoothly
- [ ] Landscape orientation works well
- [ ] Split-screen compatibility (if applicable)

#### Android Tablet (Chrome)
**Viewport: 800x1280**
- [ ] All iPad tests above
- [ ] Android-specific behaviors work

### Responsive Breakpoints

Test at these specific widths:
- [ ] **320px** - Minimum mobile width
- [ ] **375px** - iPhone SE
- [ ] **390px** - iPhone 12 Pro
- [ ] **768px** - iPad portrait
- [ ] **1024px** - iPad landscape / small desktop
- [ ] **1200px** - Medium desktop
- [ ] **1920px** - Large desktop

### Performance Testing

#### Lighthouse Audits
Run Lighthouse on each browser and record scores:

**Chrome Desktop:**
- [ ] Performance: ≥90
- [ ] Accessibility: ≥90
- [ ] Best Practices: ≥90
- [ ] SEO: ≥90

**Chrome Mobile:**
- [ ] Performance: ≥90
- [ ] Accessibility: ≥90
- [ ] Best Practices: ≥90
- [ ] SEO: ≥90

#### Core Web Vitals
- [ ] **LCP (Largest Contentful Paint)**: <2.5s
- [ ] **FID (First Input Delay)**: <100ms
- [ ] **CLS (Cumulative Layout Shift)**: <0.1

### Accessibility Testing

#### Keyboard Navigation
- [ ] Tab order is logical
- [ ] All interactive elements are reachable
- [ ] Focus indicators are visible
- [ ] Skip links work (if present)
- [ ] Escape key closes modals/dropdowns

#### Screen Reader Testing
- [ ] Page structure is logical with headings
- [ ] Images have appropriate alt text
- [ ] Links have descriptive text
- [ ] Form labels are associated correctly
- [ ] ARIA attributes are used appropriately

### Cross-Browser Compatibility Issues

Common issues to watch for:

#### CSS Issues
- [ ] Flexbox/Grid layout differences
- [ ] Custom property (CSS variable) support
- [ ] Vendor prefix requirements
- [ ] Font rendering differences
- [ ] Animation/transition support

#### JavaScript Issues
- [ ] ES6+ feature support
- [ ] Event handling differences
- [ ] Local storage functionality
- [ ] Fetch API behavior
- [ ] Date/time formatting

#### Performance Issues
- [ ] Image loading behavior
- [ ] Font loading strategies
- [ ] JavaScript execution speed
- [ ] Memory usage patterns

## Testing Tools

### Browser Developer Tools
- **Chrome DevTools**: Network, Performance, Lighthouse tabs
- **Firefox Developer Tools**: Responsive Design Mode
- **Safari Web Inspector**: Timelines, Storage tabs

### Online Testing Services
- **BrowserStack**: Cross-browser testing platform
- **Sauce Labs**: Automated browser testing
- **LambdaTest**: Live interactive testing

### Accessibility Tools
- **axe DevTools**: Accessibility testing extension
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Built-in accessibility audit

## Issue Reporting

When issues are found, document:

1. **Browser and version**
2. **Operating system**
3. **Device type** (desktop/mobile/tablet)
4. **Viewport size**
5. **Steps to reproduce**
6. **Expected behavior**
7. **Actual behavior**
8. **Screenshots/videos** (if applicable)
9. **Console errors** (if any)

## Sign-off Criteria

Cross-browser testing is complete when:

- [ ] All automated tests pass
- [ ] Manual testing completed on required browsers
- [ ] All critical issues resolved
- [ ] Performance targets met on all browsers
- [ ] Accessibility requirements satisfied
- [ ] No horizontal scrolling on mobile devices
- [ ] All interactive elements work across browsers
- [ ] Visual consistency maintained across browsers

## Emergency Rollback Triggers

Immediately rollback if:
- [ ] Site is completely inaccessible on any major browser
- [ ] Critical functionality broken (search, navigation, comments)
- [ ] Performance degrades significantly (>50% slower)
- [ ] Accessibility severely impacted
- [ ] Data loss or corruption occurs