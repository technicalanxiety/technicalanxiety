# Quick Reference Cheat Sheet

Fast reference for common tasks and patterns.

## Creating a New Post

```bash
# 1. Create a scheduled draft in src/content/backlog/
npm run backlog add "Post Title"

# 2. Edit the generated file: front matter (see templates below) and content

# 3. Set the date. The daily workflow (9 AM UTC) moves it to
#    src/content/posts/ once the date is today or earlier.
npm run backlog:list     # see what's scheduled
npm run backlog:check    # see what's ready to publish

# Or publish immediately
npm run backlog publish post-slug.md

# 4. Commit and push
git add src/content/backlog/post-slug.md src/assets/img/
git commit -m "post: schedule new post about topic"
git push
```

The filename becomes the URL slug: `src/content/posts/post-slug.md` → `/post-slug/`.

## Front Matter Templates

Schemas live in `src/content.config.ts`.

### Standard Post

```yaml
---
title: "Post Title"
date: 2026-01-15
tags: [Azure, Leadership]
description: "SEO description 150-160 characters that entices clicks from search results and social media"
image: "../../assets/img/filename.jpg"
---
```

### Series Post

```yaml
---
title: "Series Name, Part 1"
date: 2026-01-15
tags: [Azure, Governance]
series: "Series Name"
series_part: 1          # same field in backlog/ and posts/
description: "SEO description for this part of the series"
image: "../../assets/img/filename.jpg"
---
```

Series landing pages are defined in `src/content/series/`.

### Linking to an Unpublished Next Part

End every part except the last with this block, just before the `---` and
photo attribution. `NEXT_PART` must be the next part's exact filename in
`src/content/backlog/` (no date prefix):

```markdown
## What's Next?

<!-- NEXT_PART: next-post-slug.md -->
**Coming Next:** Part 2: Part Title (Publishing January 22, 2026)

One or two sentences teasing what the next part covers.
<!-- END_NEXT_PART -->
```

Once the next part is published, `scripts/update-series-links.js` replaces
everything between the markers with:

```markdown
**Next in Series:** [Next Post Title →](/next-post-slug/)
```

It runs after every scheduled publish and after `npm run backlog publish`, and
checks every published post each time. Run it yourself after publishing any
other way:

```bash
node scripts/update-series-links.js
```

## Image Workflow

```bash
# 1. Download from Unsplash and save the full-size original, uncropped
cp ~/Downloads/photo.jpg src/assets/img/filename.jpg

# 2. Reference it in front matter, relative to the post file
image: "../../assets/img/filename.jpg"

# 3. Add attribution at end of post
```

There's no optimize step. Images in `src/assets/img/` are processed by Astro at
build time (`image()` in `src/content.config.ts` validates the path, so a typo
fails the build):

- Post header: the full image at its own shape (never cropped)
- Cards: AVIF/WebP at the size each layout displays
- `og:image`: a 1200x630 JPEG, cropped toward the most salient part of the frame
- Only the original is committed; generated files live in `dist/`

The social crop aims for the most salient region (sharp's "attention"), not the
center. For very tall or busy photos, check the post's `og:image` after
`npm run build` and, if it misses, crop the original to roughly 1.9:1 around
the subject.

In-post images (screenshots, diagrams) go in `src/assets/img/` too, linked
relatively so Astro optimizes them:

```markdown
![Query results](../../assets/img/query-results.png)
```

`public/img/` only holds the site's default social image. Old image URLs from
before the move (`/img/<name>.jpg`, `/img/optimized/<name>.{avif,webp,jpg}`)
keep working: `src/pages/img/[...path].ts` writes a web-sized copy at each one
during the build, for hotlinks and image-search results.

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

```kql
// KQL queries
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

# Stage and commit with a conventional commit message
git add src/content/backlog/new-post-title.md
git commit -m "post: add new post about topic"

# Push and create PR
git push origin post/new-post-title

# After PR merged, update master
git checkout master
git pull origin master
```

Pushes to `master` deploy to Azure Static Web Apps. PRs get a staging preview.

## Conventional Commit Types

- `post:` - New blog post
- `draft:` - Draft post changes
- `fix:` - Bug fixes or corrections
- `feat:` - New features
- `docs:` - Documentation updates
- `style:` - Formatting, CSS changes
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

## Astro Commands

```bash
npm run dev            # Dev server at http://localhost:4321
npm run build          # Production build to dist/
npm run preview        # Serve the built site
npm run check          # Type and content-schema check
npm test               # Vitest suite
npm run deploy:check   # check + test + build (run before pushing)
npx markdownlint "src/content/**/*.md"   # Lint posts
npm outdated           # Check for outdated packages
```

## Pre-Publish Checklist

- [ ] Front matter complete (title, date, image, tags, description)
- [ ] Image in `src/assets/img/`, referenced as `../../assets/img/<file>`
- [ ] Image attribution at end of post
- [ ] Code blocks have language tags
- [ ] Links tested
- [ ] Reading time under 10 minutes (~2,500 words)
- [ ] SEO description 150-160 characters
- [ ] Tags match existing taxonomy
- [ ] Series metadata (if applicable)
- [ ] `npm run deploy:check` passes

## Existing Tags

Most used, in order:

- Leadership
- AI
- Azure
- Operations
- Governance
- Architecture
- Anxiety
- Development
- Observability
- Log Analytics
- Infrastructure

## Target Metrics

- **Reading time**: Sub-10 minutes (~1,500-2,500 words)
- **Description**: 150-160 characters
- **Title**: 50-60 characters
- **Image size**: < 200KB
- **Image dimensions**: 1200x630px (featured)
- **Publishing**: Bi-weekly (every 2 weeks)

## Useful Links

- **Live Site**: <https://technicalanxiety.com>
- **GitHub Repo**: <https://github.com/technicalanxiety/technicalanxiety>
- **Unsplash**: <https://unsplash.com>
- **TinyPNG**: <https://tinypng.com>
- **Astro Docs**: <https://docs.astro.build/>
