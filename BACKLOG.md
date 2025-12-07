# Technical Anxiety - Development Backlog

## Prioritized Items

### 1. RSS Feed Optimization
**Goal:** Ensure RSS feed includes full post content for better reader experience

**Tasks:**
- [ ] Check current jekyll-feed configuration
- [ ] Verify feed.xml is including full post content vs excerpts
- [ ] Test feed in common RSS readers (Feedly, etc.)
- [ ] Add feed_meta tag if not already present
- [ ] Consider adding explicit feed link in header/footer

**Notes:**
- jekyll-feed plugin is already installed
- Default behavior may need customization
- Should include images and formatting

---

### 2. Related Posts
**Goal:** Keep readers engaged by showing 3-4 related posts at bottom of each article

**Tasks:**
- [ ] Research Jekyll's built-in related posts (LSI vs basic)
- [ ] Design simple related posts section (minimal styling)
- [ ] Add to post layout template
- [ ] Test with various posts to ensure relevance
- [ ] Consider manual related posts override for key articles

**Notes:**
- Jekyll has `site.related_posts` built-in
- LSI (Latent Semantic Indexing) requires classifier-reborn gem
- Basic version uses recent posts - may be good enough
- Keep design minimal - title, excerpt, maybe image
- Should match existing site aesthetic

---

## Completed Items
- [x] Newsletter removal - MailChimp config cleaned from _config.yml

---

## Explicitly Avoiding (Don't Over-Engineer)
- Custom search implementation
- Complex tagging systems
- Multiple comment systems
- Custom analytics dashboards
- Elaborate build pipelines
- A/B testing
- Custom Jekyll plugins that break GitHub Pages
