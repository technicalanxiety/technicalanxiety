# Publishing Workflow - Astro Migration

## Overview

The site now uses Astro with an automated publishing workflow for scheduled posts. This document explains how to manage content and the publishing process.

## Directory Structure

```
src/content/posts/           # Published posts
src/content/posts/backlog/   # Scheduled posts (future dates)
```

## Scheduled Publishing

### How It Works
1. **Daily Check**: GitHub Actions runs daily at 9 AM UTC
2. **Date Check**: Scans `src/content/posts/backlog/` for posts with dates <= today
3. **Auto-Publish**: Moves ready posts to `src/content/posts/`
4. **Auto-Build**: Rebuilds and deploys the site automatically
5. **Series Links**: Updates any series navigation links

### Manual Management

Use the backlog management script for easy post management:

```bash
# List all backlog posts
npm run backlog:list

# Check which posts are ready to publish
npm run backlog:check

# Create a new scheduled post
npm run backlog add "My New Post Title"

# Manually publish a specific post
npm run backlog publish my-post-slug.md
```

## Post Format

### Frontmatter (Astro)
```yaml
---
title: "Your Post Title"
date: 2024-12-25
tags: [Azure, Leadership]
description: "SEO description 150-160 characters"
image: "image-filename.jpg"
series: "Series Name"        # Optional
series_order: 1              # Optional
---
```

### Key Differences from Jekyll
- **No date prefix** in filename (Astro uses frontmatter date)
- **Filename becomes slug** (e.g., `my-post.md` → `/my-post/`)
- **Tags as array** format: `[Tag1, Tag2]`
- **Images** referenced without path: `"image.jpg"` (stored in `public/img/`)

## Series Management

### Creating Series Links
To link to the next post in a series, add this placeholder in your current post:

```markdown
<!-- NEXT_PART: next-post-filename.md -->
*Next part coming soon...*
<!-- END_NEXT_PART -->
```

When the next post is published, this will automatically be replaced with:
```markdown
**Next in Series:** [Next Post Title →](/next-post-slug/)
```

## Workflow Files

### GitHub Actions
- `.github/workflows/publish-scheduled-posts.yml` - Daily publishing automation
- `.github/workflows/azure-static-web-apps-*.yml` - Build and deployment

### Management Scripts
- `scripts/manage-backlog.js` - Backlog management utilities
- `package.json` - NPM scripts for easy access

## Testing the Workflow

### Local Testing
```bash
# Check what posts would be published
npm run backlog:check

# Test the publishing script locally
node scripts/manage-backlog.js check
```

### Manual Trigger
You can manually trigger the publishing workflow from GitHub:
1. Go to Actions tab in GitHub
2. Select "Publish Scheduled Posts (Astro)"
3. Click "Run workflow"

## Migration Notes

### From Jekyll
- Old Jekyll posts are already migrated to Astro format
- Backlog directory moved from `_posts/backlog/` to `src/content/posts/backlog/`
- Build process changed from Jekyll to `npm run build`
- URLs remain the same (`:title/` format preserved)

### Performance
- Astro builds are faster than Jekyll
- Static site generation with modern optimizations
- All Lighthouse requirements met (90+ scores)

## Troubleshooting

### Common Issues
1. **Post not publishing**: Check date format in frontmatter (`YYYY-MM-DD`)
2. **Build failures**: Check frontmatter syntax and required fields
3. **Series links not updating**: Ensure placeholder format is exact

### Logs
Check GitHub Actions logs for detailed publishing information:
- Go to Actions tab → Latest "Publish Scheduled Posts" run
- Review step outputs for any errors

## Best Practices

1. **Schedule in advance**: Create posts with future dates for consistent publishing
2. **Test locally**: Use `npm run dev` to preview posts before scheduling
3. **Optimize images**: Use the image optimization tools for better performance
4. **SEO descriptions**: Always include meaningful descriptions (150-160 chars)
5. **Tags consistency**: Use existing tags when possible for better organization

## Support

For issues with the publishing workflow:
1. Check GitHub Actions logs
2. Test locally with backlog management scripts
3. Review this documentation
4. Check Astro build logs for syntax errors