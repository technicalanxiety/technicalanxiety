# Lighthouse Audit Report

**Generated:** 2025-12-20T03:18:49.654Z

## Summary

| Page | Performance | Accessibility | Best Practices | SEO | Status |
|------|-------------|---------------|----------------|-----|--------|
| homepage | 100 | 90 | 100 | 92 | ✅ Pass |
| blog-post | 100 | 96 | 100 | 100 | ✅ Pass |
| tag-page | 99 | 96 | 100 | 100 | ✅ Pass |
| archive | 100 | 96 | 100 | 100 | ✅ Pass |
| about | 96 | 98 | 100 | 100 | ✅ Pass |
| search | 99 | 95 | 100 | 100 | ✅ Pass |

## Overall Status: ✅ All audits passing (90+ scores)

## Detailed Issues

### homepage

**URL:** http://localhost:4323/

#### Time to Interactive (Score: 54)

Time to Interactive is the amount of time it takes for the page to become fully interactive. [Learn more about the Time to Interactive metric](https://developer.chrome.com/docs/lighthouse/performance/interactive/).

#### Background and foreground colors do not have a sufficient contrast ratio. (Score: 0)

Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.11/color-contrast).

**Details:**
- <a href="/what-architects-actually-do-pt1/" class="button button-primary" data-astro-cid-j7pv25f6="">
- <a href="/tags/Azure/" class="tag" data-astro-cid-j7pv25f6="">
- <a href="/tags/Infrastructure/" class="tag" data-astro-cid-j7pv25f6="">

#### Heading elements are not in a sequentially-descending order (Score: 0)

Properly ordered headings that do not skip levels convey the semantic structure of the page, making it easier to navigate and understand when using assistive technologies. [Learn more about heading order](https://dequeuniversity.com/rules/axe/4.11/heading-order).

**Details:**
- <h3 class="hero-topics-title">

#### Links do not have a discernible name (Score: 0)

Link text (and alternate text for images, when used as links) that is discernible, unique, and focusable improves the navigation experience for screen reader users. [Learn how to make links accessible](https://dequeuniversity.com/rules/axe/4.11/link-name).

**Details:**
- <a href="/bicep-terraform-vhs/" class="image-link" data-astro-cid-j7pv25f6="">
- <a href="/agent-governance-deployment/" class="image-link" data-astro-cid-j7pv25f6="">
- <a href="/poetry-of-code-part1/" class="image-link" data-astro-cid-j7pv25f6="">

#### Reduce unused JavaScript (Score: 50)

Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. [Learn how to reduce unused JavaScript](https://developer.chrome.com/docs/lighthouse/performance/unused-javascript/).

**Details:**
- https://www.googletagmanager.com/gtag/js?id=G-2HB2W9WDMR

#### Links do not have descriptive text (Score: 0)

Descriptive link text helps search engines understand your content. [Learn how to make links more accessible](https://developer.chrome.com/docs/lighthouse/seo/link-text/).

**Details:**

#### Improve image delivery (Score: 50)

Reducing the download time of images can improve the perceived load time of the page and LCP. [Learn more about optimizing image size](https://developer.chrome.com/docs/performance/insights/image-delivery)

**Details:**
- http://localhost:4323/img/optimized/me.avif
- http://localhost:4323/img/platform-layer-3.jpg
- http://localhost:4323/img/bicep-terraform-vhs.jpg

#### Network dependency tree (Score: 0)

[Avoid chaining critical requests](https://developer.chrome.com/docs/performance/insights/network-dependency-tree) by reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load.

**Details:**

#### Render blocking requests (Score: 0)

Requests are blocking the page's initial render, which may delay LCP. [Deferring or inlining](https://developer.chrome.com/docs/performance/insights/render-blocking) can move these network requests out of the critical path.

**Details:**
- http://localhost:4323/_astro/_slug_.CtxdIBUb.css
- http://localhost:4323/_astro/index.CL5j6l-P.css

### blog-post

**URL:** http://localhost:4323/setting-up-kiro-ai-assistant/

#### Minimize main-thread work (Score: 50)

Consider reducing the time spent parsing, compiling and executing JS. You may find delivering smaller JS payloads helps with this. [Learn how to minimize main-thread work](https://developer.chrome.com/docs/lighthouse/performance/mainthread-work-breakdown/)

**Details:**

#### Reduce JavaScript execution time (Score: 50)

Consider reducing the time spent parsing, compiling, and executing JS. You may find delivering smaller JS payloads helps with this. [Learn how to reduce Javascript execution time](https://developer.chrome.com/docs/lighthouse/performance/bootup-time/).

**Details:**
- http://localhost:4323/setting-up-kiro-ai-assistant/
- Unattributable
- https://www.googletagmanager.com/gtag/js?id=G-2HB2W9WDMR

#### Image elements do not have explicit `width` and `height` (Score: 50)

Set an explicit width and height on image elements to reduce layout shifts and improve CLS. [Learn how to set image dimensions](https://web.dev/articles/optimize-cls#images_without_dimensions)

**Details:**
- http://localhost:4323/img/kiro-brain.jpg

#### Links rely on color to be distinguishable. (Score: 0)

Low-contrast text is difficult or impossible for many users to read. Link text that is discernible improves the experience for users with low vision. [Learn how to make links distinguishable](https://dequeuniversity.com/rules/axe/4.11/link-in-text-block).

**Details:**
- <a href="https://www.rackspace.com/blog/how-kiro-ai-agents-accelerate-development">
- <a href="https://www.youtube.com/watch?v=Fer2DKJ2jNA">
- <a href="/about/">

#### Reduce unused JavaScript (Score: 50)

Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. [Learn how to reduce unused JavaScript](https://developer.chrome.com/docs/lighthouse/performance/unused-javascript/).

**Details:**
- https://www.googletagmanager.com/gtag/js?id=G-2HB2W9WDMR

#### Improve image delivery (Score: 50)

Reducing the download time of images can improve the perceived load time of the page and LCP. [Learn more about optimizing image size](https://developer.chrome.com/docs/performance/insights/image-delivery)

**Details:**
- http://localhost:4323/img/kiro-brain.jpg

#### Network dependency tree (Score: 0)

[Avoid chaining critical requests](https://developer.chrome.com/docs/performance/insights/network-dependency-tree) by reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load.

**Details:**

#### Render blocking requests (Score: 0)

Requests are blocking the page's initial render, which may delay LCP. [Deferring or inlining](https://developer.chrome.com/docs/performance/insights/render-blocking) can move these network requests out of the critical path.

**Details:**
- http://localhost:4323/_astro/_slug_.CtxdIBUb.css
- http://localhost:4323/_astro/_slug_.DUEVQa2X.css

### tag-page

**URL:** http://localhost:4323/tags/azure/

#### Time to Interactive (Score: 85)

Time to Interactive is the amount of time it takes for the page to become fully interactive. [Learn more about the Time to Interactive metric](https://developer.chrome.com/docs/lighthouse/performance/interactive/).

#### Background and foreground colors do not have a sufficient contrast ratio. (Score: 0)

Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.11/color-contrast).

**Details:**
- <a href="/tags/Azure/" class="tag tag-current" data-astro-cid-tge3q7ae="">
- <a href="/tags/Infrastructure/" class="tag " data-astro-cid-tge3q7ae="">
- <a href="/tags/Operations/" class="tag " data-astro-cid-tge3q7ae="">

#### Reduce unused JavaScript (Score: 50)

Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. [Learn how to reduce unused JavaScript](https://developer.chrome.com/docs/lighthouse/performance/unused-javascript/).

**Details:**
- https://www.googletagmanager.com/gtag/js?id=G-2HB2W9WDMR

#### Improve image delivery (Score: 50)

Reducing the download time of images can improve the perceived load time of the page and LCP. [Learn more about optimizing image size](https://developer.chrome.com/docs/performance/insights/image-delivery)

**Details:**
- http://localhost:4323/img/optimized/me.avif
- http://localhost:4323/img/platform-layer-3.jpg
- http://localhost:4323/img/bicep-terraform-vhs.jpg

#### Network dependency tree (Score: 0)

[Avoid chaining critical requests](https://developer.chrome.com/docs/performance/insights/network-dependency-tree) by reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load.

**Details:**

#### Render blocking requests (Score: 0)

Requests are blocking the page's initial render, which may delay LCP. [Deferring or inlining](https://developer.chrome.com/docs/performance/insights/render-blocking) can move these network requests out of the critical path.

**Details:**
- http://localhost:4323/_astro/_slug_.CtxdIBUb.css

### archive

**URL:** http://localhost:4323/archive/

#### Background and foreground colors do not have a sufficient contrast ratio. (Score: 0)

Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.11/color-contrast).

**Details:**
- <span class="archive-tag" data-astro-cid-qma2cssl="">
- <span class="archive-tag" data-astro-cid-qma2cssl="">
- <span class="archive-tag" data-astro-cid-qma2cssl="">

#### Reduce unused JavaScript (Score: 50)

Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. [Learn how to reduce unused JavaScript](https://developer.chrome.com/docs/lighthouse/performance/unused-javascript/).

**Details:**
- https://www.googletagmanager.com/gtag/js?id=G-2HB2W9WDMR

#### Network dependency tree (Score: 0)

[Avoid chaining critical requests](https://developer.chrome.com/docs/performance/insights/network-dependency-tree) by reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load.

**Details:**

#### Render blocking requests (Score: 0)

Requests are blocking the page's initial render, which may delay LCP. [Deferring or inlining](https://developer.chrome.com/docs/performance/insights/render-blocking) can move these network requests out of the critical path.

**Details:**
- http://localhost:4323/_astro/_slug_.CtxdIBUb.css

### about

**URL:** http://localhost:4323/about/

#### Largest Contentful Paint (Score: 85)

Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more about the Largest Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)

#### Heading elements are not in a sequentially-descending order (Score: 0)

Properly ordered headings that do not skip levels convey the semantic structure of the page, making it easier to navigate and understand when using assistive technologies. [Learn more about heading order](https://dequeuniversity.com/rules/axe/4.11/heading-order).

**Details:**
- <h3 data-astro-cid-kh7btl4r="">

#### Reduce unused JavaScript (Score: 50)

Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. [Learn how to reduce unused JavaScript](https://developer.chrome.com/docs/lighthouse/performance/unused-javascript/).

**Details:**
- https://www.googletagmanager.com/gtag/js?id=G-2HB2W9WDMR

#### Improve image delivery (Score: 0)

Reducing the download time of images can improve the perceived load time of the page and LCP. [Learn more about optimizing image size](https://developer.chrome.com/docs/performance/insights/image-delivery)

**Details:**
- http://localhost:4323/img/optimized/about.avif
- http://localhost:4323/img/optimized/JasonRinehart_TI.avif
- http://localhost:4323/img/optimized/TI_award.avif

#### LCP request discovery (Score: 0)

[Optimize LCP](https://developer.chrome.com/docs/performance/insights/lcp-discovery) by making the LCP image discoverable from the HTML immediately, and avoiding lazy-loading

**Details:**

#### Network dependency tree (Score: 0)

[Avoid chaining critical requests](https://developer.chrome.com/docs/performance/insights/network-dependency-tree) by reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load.

**Details:**

#### Render blocking requests (Score: 0)

Requests are blocking the page's initial render, which may delay LCP. [Deferring or inlining](https://developer.chrome.com/docs/performance/insights/render-blocking) can move these network requests out of the critical path.

**Details:**
- http://localhost:4323/_astro/_slug_.CtxdIBUb.css

### search

**URL:** http://localhost:4323/search/

#### Background and foreground colors do not have a sufficient contrast ratio. (Score: 0)

Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.11/color-contrast).

**Details:**
- <h1 data-astro-cid-ipsxrsrh="">
- <p data-astro-cid-ipsxrsrh="">
- <p class="search-instructions" data-astro-cid-ipsxrsrh="">

#### Reduce unused JavaScript (Score: 50)

Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. [Learn how to reduce unused JavaScript](https://developer.chrome.com/docs/lighthouse/performance/unused-javascript/).

**Details:**
- https://www.googletagmanager.com/gtag/js?id=G-2HB2W9WDMR

#### Network dependency tree (Score: 0)

[Avoid chaining critical requests](https://developer.chrome.com/docs/performance/insights/network-dependency-tree) by reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load.

**Details:**

#### Render blocking requests (Score: 0)

Requests are blocking the page's initial render, which may delay LCP. [Deferring or inlining](https://developer.chrome.com/docs/performance/insights/render-blocking) can move these network requests out of the critical path.

**Details:**
- http://localhost:4323/_astro/_slug_.CtxdIBUb.css
- http://localhost:4323/_astro/search.C95TzccC.css

## Requirements Validation

- **Requirement 5.1 (Performance 90+):** ✅ PASS - All pages meet requirement
- **Requirement 5.2 (Accessibility 90+):** ✅ PASS - All pages meet requirement
- **Requirement 5.3 (Best Practices 90+):** ✅ PASS - All pages meet requirement
- **Requirement 5.4 (SEO 90+):** ✅ PASS - All pages meet requirement
- **Requirement 5.5 (LCP < 2.5s):** Manual verification needed (check Core Web Vitals in reports)

