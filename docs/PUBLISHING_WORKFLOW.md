# Publishing Workflow - Astro Migration

## Overview

The site now uses Astro with an automated publishing workflow for scheduled posts. This document explains how to manage content and the publishing process.

## Directory Structure

```
src/content/posts/           # Published posts (live on site)
src/content/backlog/         # Scheduled posts (future dates)
```

## Complete Publishing Process

### Step-by-Step Guide

#### 1. Create a New Post
```bash
# Option A: Use the management script (recommended)
npm run backlog add "Your Post Title"

# Option B: Create manually
# Create file: src/content/backlog/your-post-slug.md
```

#### 2. Write Your Post
Edit the created file with proper frontmatter:

```yaml
---
title: "Your Compelling Post Title"
date: 2024-12-25                    # Future date for scheduling
tags: [Azure, Leadership, Operations] # Use existing tags when possible
description: "Clear SEO description that explains what readers will learn (150-160 chars)"
image: "your-image.jpg"             # Optional: image in public/img/
series: "Series Name"               # Optional: for multi-part content
series_order: 1                     # Optional: part number in series
---

# Your Post Title

Your content here using Markdown...

## Section Headers

- Use proper heading hierarchy (H1 for title, H2 for sections, etc.)
- Include code blocks with language specification
- Add internal links with trailing slashes: [link text](/other-post/)
```

#### 3. Add Images (Optional)
If your post includes images:
1. Add original image to `public/img/your-image.jpg`
2. Run image optimization: `node optimize-images.js`
3. Reference in frontmatter: `image: "your-image.jpg"`

#### 4. Preview Locally
```bash
# Start development server
npm run dev

# Visit: http://localhost:4321/
# Check your post appears in backlog (future-dated posts won't show on site)
```

#### 5. Validate Content
- **Frontmatter**: Ensure all required fields are present
- **Date format**: Use `YYYY-MM-DD` format
- **Tags**: Use existing tags for consistency
- **Links**: Internal links should have trailing slashes
- **Images**: Verify image paths are correct
- **Series**: If part of a series, ensure series name matches other posts

#### 6. Schedule for Publishing
The post will automatically publish when:
- Date in frontmatter is <= today
- GitHub Actions runs daily at 9 AM UTC (4 AM EST / 3 AM CST)

#### 7. Manual Publishing (Optional)
To publish immediately:
```bash
npm run backlog publish your-post-slug.md
```

#### 8. Verify Publication
After publishing (automatic or manual):
1. Check the site to ensure post appears
2. Verify series links are updated (if applicable)
3. Test internal links work correctly
4. Check social media preview (description/image)

### Content Guidelines

#### Required Fields
- `title`: Clear, descriptive title
- `date`: Future date for scheduling, past/today for immediate
- `tags`: Array of relevant tags
- `description`: SEO description (150-160 characters)

#### Optional Fields
- `image`: Featured image filename (stored in `public/img/`)
- `series`: Series name for multi-part content
- `series_order`: Part number (backlog posts) or `series_part` (published posts)
- `author`: Defaults to "Jason Rinehart"
- `draft`: Set to `true` to exclude from build

#### Content Best Practices
1. **SEO Optimization**
   - Use descriptive titles with target keywords
   - Write compelling meta descriptions
   - Include relevant internal links
   - Use proper heading structure (H1 → H2 → H3)

2. **Readability**
   - Break up long paragraphs
   - Use bullet points and numbered lists
   - Include code examples with syntax highlighting
   - Add section headers for easy scanning

3. **Technical Content**
   - Include working code examples
   - Provide context and explanations
   - Link to official documentation
   - Consider different skill levels

4. **Series Management**
   - Plan series structure in advance
   - Use consistent naming: "Series Name - Part 1", etc.
   - Add navigation placeholders for upcoming parts
   - Ensure logical progression between parts

### Automated Publishing

### How It Works
1. **Daily Check**: GitHub Actions runs daily at 9 AM UTC
2. **Date Check**: Scans `src/content/backlog/` for posts with dates <= today
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
series_order: 1              # Optional (for backlog posts)
# OR
series_part: 1               # Optional (for published posts)
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
- Backlog directory moved from `_posts/backlog/` to `src/content/backlog/`
- Build process changed from Jekyll to `npm run build`
- URLs remain the same (`:title/` format preserved)
- Duplicate ID warnings resolved with separate backlog collection

### Performance
- Astro builds are faster than Jekyll
- Static site generation with modern optimizations
- All Lighthouse requirements met (90+ scores)

## Troubleshooting

### Common Issues

#### Post Not Publishing
**Symptoms**: Post stays in backlog despite date being past
**Solutions**:
1. Check date format in frontmatter (must be `YYYY-MM-DD`)
2. Verify file is in `src/content/backlog/` directory
3. Check GitHub Actions logs for errors
4. Ensure frontmatter syntax is valid YAML

#### Build Failures
**Symptoms**: GitHub Actions build fails, site doesn't update
**Solutions**:
1. Check frontmatter syntax (YAML formatting)
2. Verify all required fields are present (`title`, `date`)
3. Check for invalid characters in frontmatter
4. Test locally with `npm run build`

#### Series Links Not Updating
**Symptoms**: "Next part coming soon" doesn't change to actual link
**Solutions**:
1. Ensure placeholder format is exact:
   ```markdown
   <!-- NEXT_PART: filename.md -->
   Content here
   <!-- END_NEXT_PART -->
   ```
2. Verify filename matches exactly (case-sensitive)
3. Check that both posts are in same series

#### Images Not Loading
**Symptoms**: Broken image icons or missing images
**Solutions**:
1. Verify image exists in `public/img/` directory
2. Check image filename in frontmatter (no path, just filename)
3. Remove quotes around image filename if present
4. Run image optimization: `node optimize-images.js`

#### Local Development Issues
**Symptoms**: Site won't start or shows errors locally
**Solutions**:
1. Install dependencies: `npm install`
2. Clear cache: `rm -rf node_modules/.astro`
3. Check Node.js version (requires Node 18+)
4. Verify all frontmatter is valid

### Debugging Steps

#### 1. Check Backlog Status
```bash
# See all backlog posts and their status
npm run backlog:list

# Check which posts are ready to publish
npm run backlog:check
```

#### 2. Test Local Build
```bash
# Test if site builds without errors
npm run build

# Start development server
npm run dev
```

#### 3. Review GitHub Actions
1. Go to repository → Actions tab
2. Click latest "Publish Scheduled Posts" workflow
3. Review each step for errors
4. Check "Publish scheduled posts" step output

#### 4. Manual Publishing Test
```bash
# Try publishing a specific post manually
npm run backlog publish your-post.md
```

### Getting Help

#### Log Locations
- **GitHub Actions**: Repository → Actions → Workflow run details
- **Local Build**: Terminal output from `npm run build`
- **Development**: Browser console and terminal

#### Common Error Messages
- `Error: Invalid frontmatter`: Check YAML syntax
- `Missing required field`: Add missing title/date/etc.
- `File not found`: Check file path and spelling
- `Build failed`: Review build logs for specific error

#### Support Resources
1. Check this documentation first
2. Review GitHub Actions logs
3. Test locally to isolate issues
4. Check Astro documentation for framework-specific issues

## Best Practices

### Content Planning
1. **Editorial Calendar**: Plan posts in advance with strategic dates
2. **Series Planning**: Outline multi-part series before writing first post
3. **Tag Strategy**: Use consistent, meaningful tags for better organization
4. **SEO Focus**: Research keywords and write for both humans and search engines

### Writing Guidelines
1. **Compelling Titles**: Use action words and specific benefits
2. **Strong Openings**: Hook readers in the first paragraph
3. **Scannable Content**: Use headers, bullets, and short paragraphs
4. **Code Examples**: Include working, tested code with explanations
5. **Internal Linking**: Connect related posts to keep readers engaged

### Technical Standards
1. **Image Optimization**: Always run `node optimize-images.js` for new images
2. **Performance**: Keep images under 1MB, optimize for web
3. **Accessibility**: Use descriptive alt text and proper heading hierarchy
4. **Mobile-First**: Preview on mobile devices during writing

### Publishing Workflow
1. **Schedule Strategically**: Consider your audience's timezone and habits
2. **Batch Creation**: Write multiple posts when inspired, schedule for consistent publishing
3. **Quality Control**: Always preview locally before scheduling
4. **Series Coordination**: Ensure series posts flow logically and reference each other

### SEO Optimization
1. **Meta Descriptions**: Write compelling 150-160 character descriptions
2. **Title Tags**: Include target keywords naturally in titles
3. **Internal Links**: Link to related posts with descriptive anchor text
4. **Image SEO**: Use descriptive filenames and alt text
5. **URL Structure**: Keep slugs short, descriptive, and keyword-rich

### Maintenance
1. **Regular Reviews**: Periodically update older posts with new information
2. **Link Checking**: Verify internal and external links still work
3. **Performance Monitoring**: Check Lighthouse scores after major changes
4. **Content Audits**: Remove or update outdated information

## Quick Reference

### Essential Commands
```bash
# Backlog management
npm run backlog:list              # List all scheduled posts
npm run backlog:check             # Check posts ready to publish
npm run backlog add "Title"       # Create new scheduled post
npm run backlog publish file.md   # Manually publish specific post

# Development
npm run dev                       # Start local development server
npm run build                     # Test production build
npm run preview                   # Preview production build locally

# Image optimization
node optimize-images.js           # Optimize images in public/img/
```

### File Locations
- **Published Posts**: `src/content/posts/`
- **Scheduled Posts**: `src/content/backlog/`
- **Images**: `public/img/` (originals) and `public/img/optimized/` (processed)
- **Configuration**: `src/config.ts`, `astro.config.mjs`
- **Workflows**: `.github/workflows/`

### Important URLs
- **Production**: https://technicalanxiety.com
- **Staging**: Azure Static Web Apps staging slot
- **Local Dev**: http://localhost:4321/
- **GitHub Actions**: Repository → Actions tab

## Support Resources

### Documentation
- **This Guide**: Complete publishing workflow
- **BACKLOG.md**: Project backlog and priorities  
- **GITHUB_ACTIONS_SETUP.md**: Detailed workflow configuration
- **Astro Docs**: https://docs.astro.build/

### Troubleshooting Process
1. **Check this documentation** for common solutions
2. **Test locally** with `npm run dev` and `npm run build`
3. **Review GitHub Actions logs** for automated publishing issues
4. **Check browser console** for client-side errors
5. **Verify file paths and syntax** for content issues

### Emergency Procedures
If automated publishing fails:
1. Check GitHub Actions status and logs
2. Manually publish critical posts: `npm run backlog publish filename.md`
3. Test local build to identify issues
4. Push fixes and re-run workflow if needed

Remember: The system is designed to be reliable and self-healing. Most issues resolve with proper frontmatter formatting and following the established patterns.