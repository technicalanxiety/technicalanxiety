# Quick Reference Cheat Sheet

Fast reference for common tasks and patterns.

## Creating a New Post

```bash
# 1. Create draft
touch _posts/backlog/2025-01-15-post-slug.md

# 2. Add front matter (see template below)

# 3. Write content

# 4. When ready, move to _posts/
mv _posts/backlog/2025-01-15-post-slug.md _posts/

# 5. Commit and push
git add _posts/2025-01-15-post-slug.md img/image.jpg
git commit -m "post: publish new post about topic"
git push
```

## Front Matter Templates

### Standard Post
```yaml
---
layout: post
title: "Post Title"
date: 2025-01-15 09:00 -0600
image: filename.jpg
tags: [Azure, Leadership]
description: "SEO description 150-160 characters that entices clicks from search results and social media"
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
description: "SEO description for this part of the series"
---
```

## Image Workflow

```bash
# 1. Download from Unsplash
# 2. Optimize (TinyPNG, ImageOptim, or ImageMagick):
convert input.jpg -resize 1200x630^ -gravity center -extent 1200x630 -quality 85 output.jpg

# 3. Save to img/
cp optimized-image.jpg img/

# 4. Add to front matter
image: optimized-image.jpg

# 5. Add attribution at end of post
```

## Unsplash Attribution Template

```markdown
**Photo by [Photographer Name](https://unsplash.com/@username) on [Unsplash](https://unsplash.com/photos/photo-id)**
```

## Common Code Block Languages

````markdown
```python
# Python code
```

```javascript
// JavaScript code
```

```powershell
# PowerShell code
```

```bash
# Bash commands
```

```bicep
// Bicep/ARM templates
```

```yaml
# YAML configuration
```

```json
{
  "json": "data"
}
```
````

## Markdown Quick Reference

```markdown
## H2 Section Header
### H3 Subsection

**Bold text** for emphasis
*Italic text* for subtle emphasis

> Blockquote for callouts or important notes

- Unordered list
- Another item

1. Ordered list
2. Another item

[Link text](https://example.com)
[Internal link](/about/)

`inline code` for commands or variables

---

Horizontal rule for section breaks
```

## Git Workflow

```bash
# Create feature branch
git checkout -b post/new-post-title

# Check status
git status

# Stage changes
git add file.md

# Commit with conventional commit message
git commit -m "post: add new post about topic"

# Push and create PR
git push origin post/new-post-title

# After PR merged, update main
git checkout main
git pull origin main
```

## Conventional Commit Types

- `post:` - New blog post
- `draft:` - Draft post changes
- `fix:` - Bug fixes or corrections
- `feat:` - New features
- `docs:` - Documentation updates
- `style:` - Formatting, CSS changes
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

## Jekyll Commands

```bash
# Start dev server
bundle exec jekyll serve --livereload

# Build site
bundle exec jekyll build

# Build with future posts
bundle exec jekyll build --future

# Clean build
bundle exec jekyll clean && bundle exec jekyll build

# Update dependencies
bundle update

# Check for outdated gems
bundle outdated
```

## Pre-Publish Checklist

- [ ] Front matter complete (title, date, image, tags, description)
- [ ] Image optimized and in /img/
- [ ] Image attribution at end of post
- [ ] Code blocks have language tags
- [ ] Links tested
- [ ] Reading time under 10 minutes (~2,500 words)
- [ ] SEO description 150-160 characters
- [ ] Tags match existing taxonomy
- [ ] Series metadata (if applicable)

## Existing Tags

- Anxiety
- Leadership
- Azure
- Governance
- Operations
- Log Analytics

## Target Metrics

- **Reading time**: Sub-10 minutes (~1,500-2,500 words)
- **Description**: 150-160 characters
- **Title**: 50-60 characters
- **Image size**: < 200KB
- **Image dimensions**: 1200x630px (featured)
- **Publishing**: Bi-weekly (every 2 weeks)

## Useful Links

- **Live Site**: https://technicalanxiety.com
- **GitHub Repo**: https://github.com/technicalanxiety/technicalanxiety.github.io
- **Unsplash**: https://unsplash.com
- **TinyPNG**: https://tinypng.com
- **Jekyll Docs**: https://jekyllrb.com/docs/
