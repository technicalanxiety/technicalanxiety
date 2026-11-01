# Publishing Workflow Guide

## Overview

The site uses Astro with an automated publishing workflow for scheduled posts. This document explains how to manage content and the publishing process.

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
series_part: 1                      # Optional: part number in series
---

Your content here using Markdown. Don't add a `# Title` heading: the layout
renders the title from front matter.

## Section Headers

- Use proper heading hierarchy (H2 for sections, H3 below that)
- Include code blocks with language specification
- Add internal links with trailing slashes: [link text](/other-post/)
```

#### 3. Add Images (Optional)
If your post includes images:
1. Add the full-size original to `public/img/your-image.jpg` (don't crop it)
2. Reference in frontmatter: `image: "your-image.jpg"`
3. Run image optimization: `node optimize-images.js` (crops featured images to 1200x630; see `.github/QUICK_REFERENCE.md`)

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
- `series_part`: Part number in the series (backlog and published posts)
- `author`: Defaults to "Jason Rinehart"
- `draft`: Set to `true` to exclude from build

#### Content Standards

- **Voice**: Direct, honest, sometimes raw. No corporate speak.
- **Practical over theoretical**: Real-world experience, not textbook theory.
  Real examples, not toy problems.
- **Help others**: If one person solves a problem faster, it matters.
- **Length**: Aim for under 10 minutes (about 1,500-2,500 words). Let the
  content dictate structure; use headers, short paragraphs and blockquotes.
- **Code**: Every code block gets a language tag. Explain what the code does,
  not just show it. KQL follows `docs/KQL_WRITING_STANDARDS.md`.
- **Tags**: Use existing tags (Leadership, AI, Azure, Operations, Governance,
  Architecture, Anxiety, Development, Observability, Log Analytics,
  Infrastructure, Productivity, Platform, ...). Create new ones sparingly,
  in PascalCase, 3-4 tags per post at most.
- **Titles**: 50-60 characters reads best in search results and social cards.
- **File format**: UTF-8 without BOM, LF line endings, straight quotes
  (`'` `"`) rather than smart quotes. Check with `file post.md`: it should say
  "UTF-8 text" and not "CRLF". Fix CRLF with
  `tr -d '\r' < post.md > fixed.md && mv fixed.md post.md`.
- **Spotify episodes**: When a post has a companion podcast episode, embed the
  player as the first thing in the body:

  ```html
  <iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/EPISODE_ID?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
  ```

  Preview with `npm run dev` to check the sizing.

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

### Publishing Gate

The gate exists because the hunger is infinite and capacity is not. AI tools
removed the speed limit; the body still has one. Before a post goes into the
backlog, answer these honestly:

**Time**

- Has the idea survived at least 72 hours in Cold?
- Did it earn Warming by passing the memory test (restate it without
  re-reading)?
- Has it been in Pull long enough to prove it's worth finishing?

**Quality**

- Can you state the core claim in one sentence?
- Does it solve a real problem, or just feed momentum?
- Would you still publish it if nobody read it?
- Is it a question (personal writing) or an answer (work artifact)?

**Machine check**

- Is it ready, or does the calendar just say so?
- Is Pull at 3 items or fewer?
- Is it earning its place, or filling a slot?

A "no" or a hesitation means it sits longer. Red flags: publishing on a
schedule instead of when ready, feeling obligated because it was announced,
rushing to get it out there, checking metrics before writing, treating the
backlog as a queue instead of a filter.

**Incubation** (`INCUBATION.md`, kept local and out of git):

- Entries are one claim, one tension, one question, in 4 lines or fewer.
  Never park full drafts; drafts create obligation.
- Date every entry. Status is only Cold, Warming or Pull. No tags or
  categories.
- Cold → Warming only if you still care and can restate it without
  re-reading. Warming → Pull only if it's worth the energy and Pull has room
  (max 3). Pull → Backlog only when finished, not when impatient.
- Most ideas should die in Cold. Tidying the incubation file is optimizing
  for output.

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
series_part: 1               # Optional
---
```

### File Naming
- **No date prefix** in filename (the date comes from front matter)
- **Filename becomes slug** (e.g., `my-post.md` → `/my-post/`)
- **Tags as array** format: `[Tag1, Tag2]`
- **Images** referenced without path: `"image.jpg"` (stored in `public/img/`)

## Series Management

### Series Landing Pages

Every series needs a page in `src/content/series/`. Posts join it by exact
text match: each post's `series:` value must equal the page's `title:`
character for character (case and spacing included), or the post silently
drops out of the series page and navigation.

```yaml
---
title: "Series Name"
description: "What the series covers"
image: "series-image.jpg"
tags: [Tag1, Tag2]
order: 7                    # Position on /series/; don't reuse another page's number
featured: false             # Show in the featured series list
---

## Overview

## The Core Problem

## What You'll Learn

**Part 1: Part Title**
One-line summary of the part.

**Part 2: Part Title**
One-line summary of the part.

## Who This Is For
```

Add a `**Part N: Title**` entry each time a new part is written. Run the
series page image through `node optimize-images.js` like a post image.

### Creating Series Links
To link to the next post in a series, end your current post with this block,
just before the photo attribution (`NEXT_PART` is the next part's exact
filename, no date prefix):

```markdown
## What's Next?

<!-- NEXT_PART: next-post-filename.md -->
**Coming Next:** Part 2: Part Title (Publishing January 22, 2026)

One or two sentences teasing what the next part covers.
<!-- END_NEXT_PART -->
```

Once the next post is published, `scripts/update-series-links.js` (run by the
scheduled workflow and by `npm run backlog publish`) replaces the placeholder
with:
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
3. Run image optimization: `node optimize-images.js`

#### Local Development Issues
**Symptoms**: Site won't start or shows errors locally
**Solutions**:
1. Install dependencies: `npm install`
2. Clear cache: `rm -rf .astro node_modules/.astro`, then restart `npm run dev`
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