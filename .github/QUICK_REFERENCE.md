# Quick Reference Guide

## Common Tasks

### Local Development

```bash
# Install dependencies
bundle install

# Build site
bundle exec jekyll build

# Serve locally (with live reload)
bundle exec jekyll serve

# Serve with drafts
bundle exec jekyll serve --drafts

# Production build
JEKYLL_ENV=production bundle exec jekyll build
```

### Creating New Content

#### New Blog Post
```bash
# Create file: _posts/YYYY-MM-DD-title.md
---
layout: post
title: "Your Post Title"
date: YYYY-MM-DD HH:MM -0600
image: your-image.jpg
tags: [Tag1, Tag2]
description: "Brief description for SEO and social sharing"
---

Your content here...
```

#### New Page
```bash
# Create file: _pages/page-name.md
---
layout: page
title: "Page Title"
permalink: /page-name/
image: optional-image.jpg
---

Your content here...
```

### Updating Configuration

#### Add New Social Platform
Edit `_config.yml`:
```yaml
social:
  links:
    - https://twitter.com/username
    - https://linkedin.com/in/username
    - https://github.com/username  # Add new platform
```

#### Change Site Description
Edit `_config.yml`:
```yaml
description: Your new description here
```

#### Update Google Analytics
Edit `_config.yml`:
```yaml
google-analytics: G-XXXXXXXXXX  # Your GA4 Measurement ID
```

### Managing Dependencies

```bash
# Update all dependencies
bundle update

# Update specific gem
bundle update jekyll

# Check for outdated gems
bundle outdated

# Audit for security issues
bundle audit
```

### Git Workflow

```bash
# Check status
git status

# Stage changes
git add .

# Commit with message
git commit -m "Description of changes"

# Push to GitHub (triggers rebuild)
git push origin master

# View recent commits
git log --oneline -5
```

### Troubleshooting

#### Build Fails
```bash
# Clean and rebuild
bundle exec jekyll clean
bundle exec jekyll build

# Check for errors
bundle exec jekyll build --verbose
```

#### Ruby Version Issues
```bash
# Check Ruby version
ruby --version

# Should be 3.4.x or compatible with Gemfile
```

#### Port Already in Use
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Or use different port
bundle exec jekyll serve --port 4001
```

## File Structure

```
.
├── _config.yml           # Main configuration
├── _includes/            # Reusable components
│   ├── head.html
│   ├── header.html
│   ├── footer.html
│   └── sidebar.html
├── _layouts/             # Page templates
│   ├── default.html
│   ├── post.html
│   └── page.html
├── _pages/               # Static pages
│   ├── about.md
│   └── privacy.md
├── _posts/               # Blog posts
│   └── YYYY-MM-DD-title.md
├── _sass/                # Stylesheets
├── img/                  # Images
├── Gemfile               # Ruby dependencies
└── index.html            # Homepage
```

## Important URLs

### Local
- Site: http://localhost:4000
- RSS Feed: http://localhost:4000/feed.xml
- Privacy: http://localhost:4000/privacy/

### Production
- Site: https://technicalanxiety.com
- RSS Feed: https://technicalanxiety.com/feed.xml
- Privacy: https://technicalanxiety.com/privacy/

### Admin
- GitHub Repo: https://github.com/technicalanxiety/technicalanxiety.github.io
- GitHub Pages Settings: https://github.com/technicalanxiety/technicalanxiety.github.io/settings/pages
- Dependabot Alerts: https://github.com/technicalanxiety/technicalanxiety.github.io/security/dependabot
- Google Analytics: https://analytics.google.com

## SEO Checklist for New Posts

- [ ] Add descriptive title (50-60 characters)
- [ ] Write meta description (150-160 characters)
- [ ] Add relevant tags (3-5 tags)
- [ ] Include featured image (1200x630px for social sharing)
- [ ] Use proper heading hierarchy (H2, H3, etc.)
- [ ] Add alt text to images
- [ ] Include internal links to related posts
- [ ] Preview social sharing cards

## Performance Tips

1. **Optimize Images**: Compress before uploading (use TinyPNG, ImageOptim)
2. **Image Sizes**: 
   - Featured images: 1200x630px
   - In-post images: Max 1200px wide
   - Thumbnails: 400x300px
3. **Keep Posts Focused**: Aim for 800-2000 words
4. **Use Code Blocks**: Properly format code with syntax highlighting

## Backup Strategy

1. **GitHub**: Primary backup (automatic)
2. **Local**: Keep local copy synced
3. **Images**: Consider separate backup of /img/ folder
4. **Database**: Not applicable (static site)

## Support Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Liquid Template Language](https://shopify.github.io/liquid/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Google Analytics 4 Help](https://support.google.com/analytics/answer/10089681)

## Quick Fixes

### Broken Links
```bash
# Check for broken links (requires htmlproofer)
gem install html-proofer
bundle exec jekyll build
htmlproofer ./_site --disable-external
```

### Clear Cache
```bash
# Clear Jekyll cache
rm -rf .jekyll-cache _site

# Rebuild
bundle exec jekyll build
```

### Reset to Last Commit
```bash
# Discard all local changes
git reset --hard HEAD

# Pull latest from GitHub
git pull origin master
```

---

**Last Updated**: November 14, 2025
