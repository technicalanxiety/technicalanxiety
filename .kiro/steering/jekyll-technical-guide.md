---
inclusion: fileMatch
fileMatchPattern: "**/*.{md,html,yml,rb}"
---

# Jekyll Technical Guide

## Project Structure

```
technicalanxiety.github.io/
├── _config.yml           # Site configuration
├── _posts/               # Published blog posts
│   └── backlog/         # Draft posts (excluded from build)
├── _pages/              # Static pages (about, start-here, etc.)
├── _layouts/            # Page templates
├── _includes/           # Reusable components
├── _sass/               # Stylesheets
├── img/                 # Images
├── js/                  # JavaScript files
├── Gemfile              # Ruby dependencies
└── .kiro/               # Kiro configuration
    └── steering/        # Project steering rules
```

## Jekyll Configuration

### _config.yml Key Settings
- **Title**: Technical Anxiety | Experience Blog
- **URL**: https://technicalanxiety.com
- **Markdown**: kramdown
- **Permalink**: `:title/` (clean URLs)
- **Pagination**: 7 posts per page
- **Exclude**: `_posts/backlog/` (drafts not published)

### Plugins
- jekyll-paginate
- jekyll-sitemap
- jekyll-feed
- jekyll-seo-tag

## Development Workflow

### Local Development
```bash
# Start Jekyll server with live reload
bundle exec jekyll serve --livereload

# Server runs at http://127.0.0.1:4000/
# Changes auto-rebuild and refresh browser
```

### Creating New Posts

1. **Create file in backlog**:
```bash
touch _posts/backlog/YYYY-MM-DD-post-slug.md
```

2. **Add front matter**:
```yaml
---
layout: post
title: "Post Title"
date: 2025-01-15 09:00 -0600
image: filename.jpg
tags: [Tag1, Tag2]
description: "SEO description"
---
```

3. **Write content** with proper markdown

4. **When ready to publish**, move to `_posts/`:
```bash
mv _posts/backlog/YYYY-MM-DD-post-slug.md _posts/
```

### Image Workflow

1. **Download from Unsplash**
2. **Optimize image**:
```bash
# Using ImageMagick (if installed)
convert input.jpg -resize 1200x630^ -gravity center -extent 1200x630 -quality 85 output.jpg

# Or use online tools: TinyPNG, ImageOptim, Squoosh
```

3. **Save to img/ directory**:
```bash
cp optimized-image.jpg img/
```

4. **Add to post front matter**:
```yaml
image: optimized-image.jpg
```

5. **Add attribution at end of post**:
```markdown
**Photo by [Name](https://unsplash.com/@username) on [Unsplash](https://unsplash.com/photos/id)**
```

## Markdown Formatting

### Headers
```markdown
# H1 - Post Title (automatic from front matter)
## H2 - Major Sections
### H3 - Subsections
```

### Emphasis
```markdown
**Bold text** for emphasis
*Italic text* for subtle emphasis
> Blockquotes for callouts or important notes
```

### Lists
```markdown
- Unordered list item
- Another item
  - Nested item

1. Ordered list item
2. Another item
```

### Links
```markdown
[Link text](https://example.com)
[Internal link](/about/)
[Post link](/post-slug/)
```

### Code Blocks
````markdown
```python
def example():
    return "Python code"
```

```javascript
function example() {
    return "JavaScript code";
}
```

```bash
# Shell commands
echo "Hello World"
```
````

### Inline Code
```markdown
Use `inline code` for commands, variables, or short code snippets.
```

### Horizontal Rules
```markdown
---
```

### Images
```markdown
![Alt text](/img/image.jpg)
```

## Front Matter Reference

### Standard Post
```yaml
---
layout: post
title: "Post Title"
date: 2025-01-15 09:00 -0600
image: filename.jpg
tags: [Azure, Leadership]
description: "SEO description under 160 characters"
---
```

### Series Post
```yaml
---
layout: post
title: "Series Name, Part 1"
date: 2025-01-15 09:00 -0600
image: filename.jpg
tags: [Azure, Governance]
series: "Series Name"
series_part: 1
description: "SEO description"
---
```

### Page (not post)
```yaml
---
layout: page
title: "Page Title"
permalink: /page-slug/
image: filename.jpg
---
```

## Git Workflow for Blog

### Creating New Post
```bash
# Create feature branch
git checkout -b post/new-post-title

# Create draft
touch _posts/backlog/2025-01-15-new-post.md

# Write and commit
git add _posts/backlog/2025-01-15-new-post.md
git commit -m "draft: add new post about topic"

# When ready to publish
mv _posts/backlog/2025-01-15-new-post.md _posts/
git add _posts/2025-01-15-new-post.md img/new-image.jpg
git commit -m "post: publish new post about topic"

# Push and create PR
git push origin post/new-post-title
```

### Updating Existing Post
```bash
# Create branch
git checkout -b fix/update-post-title

# Make changes
git add _posts/2025-01-15-post.md
git commit -m "fix: update post with corrections"

# Push and create PR
git push origin fix/update-post-title
```

## Build & Deployment

### GitHub Pages
- **Automatic deployment** on push to main branch
- Build takes 1-2 minutes
- Check Actions tab for build status
- Site updates at https://technicalanxiety.com

### Local Build
```bash
# Build site (output to _site/)
bundle exec jekyll build

# Build with future posts
bundle exec jekyll build --future

# Clean build
bundle exec jekyll clean
bundle exec jekyll build
```

## Troubleshooting

### Jekyll Won't Start
```bash
# Update dependencies
bundle install

# Check Ruby version
ruby --version  # Should be 3.x

# Check for errors
bundle exec jekyll serve --trace
```

### Post Not Showing
- Check date isn't in future
- Verify file is in `_posts/` not `_posts/backlog/`
- Check front matter is valid YAML
- Ensure filename format: `YYYY-MM-DD-slug.md`

### Images Not Loading
- Verify image is in `/img/` directory
- Check filename matches front matter
- Ensure image path is correct (no leading slash in front matter)
- Check file permissions

### Build Failing
- Check GitHub Actions for error details
- Verify all front matter is valid YAML
- Check for broken links
- Ensure all images exist

## Performance Optimization

### Image Optimization
- Compress images before adding
- Use appropriate formats (JPG for photos, PNG for graphics)
- Resize to standard dimensions
- Target: < 200KB per image

### Build Performance
- Keep _site/ out of git (.gitignore)
- Minimize plugins
- Use incremental builds during development

## SEO Best Practices

### On-Page SEO
- Descriptive titles (50-60 characters)
- Meta descriptions (150-160 characters)
- Use headers (H2, H3) for structure
- Internal linking to related posts
- Alt text for images

### Technical SEO
- Sitemap generated automatically (jekyll-sitemap)
- RSS feed generated automatically (jekyll-feed)
- Clean URLs (no .html extension)
- Fast page loads
- Mobile responsive

## Useful Commands

```bash
# Start dev server
bundle exec jekyll serve --livereload

# Build site
bundle exec jekyll build

# Check for updates
bundle outdated

# Update dependencies
bundle update

# Add new gem
bundle add gem-name

# Check site locally
open http://127.0.0.1:4000
```

## Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Kramdown Syntax](https://kramdown.gettalong.org/syntax.html)
- [Liquid Template Language](https://shopify.github.io/liquid/)
