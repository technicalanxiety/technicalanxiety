---
inclusion: fileMatch
fileMatchPattern: "src/content/**/*.md"
---

# Blog Content Standards

## Core Principles
- **Authentic voice** - Direct, honest, sometimes raw. No corporate speak.
- **Practical over theoretical** - Real-world experience, not textbook theory.
- **Help others** - If one person solves a problem faster, it matters.
- **Don't over-engineer** - Keep it simple, focus on content.

## Post Requirements

## Post Requirements

**Front Matter** (Astro format):
```yaml
---
title: "Your Post Title"
date: 2024-12-25
tags: [Azure, Leadership]
description: "SEO description 150-160 characters"
image: "image-filename.jpg"
series: "Series Name"        # Optional
series_order: 1              # Optional (backlog posts)
# OR series_part: 1          # Optional (published posts)
author: "Jason Rinehart"     # Optional (defaults to this)
draft: false                 # Optional (defaults to false)
---
```

**Required Fields**:
- `title`: Clear, descriptive title with target keywords
- `date`: YYYY-MM-DD format (future dates for scheduling)
- `tags`: Array format `[Tag1, Tag2]` - use existing tags when possible
- `description`: 150-160 characters for SEO and social sharing

**Optional Fields**:
- `image`: Filename only (stored in `public/img/`)
- `series`: For multi-part content (exact name match across parts)
- `series_order`: Part number for backlog posts
- `series_part`: Part number for published posts
- `author`: Defaults to "Jason Rinehart"
- `draft`: Set to `true` to exclude from build

**Structure**:
- Flexible format - let content dictate structure
- Target: Sub-10 min reads (~1,500-2,500 words)
- Use headers, short paragraphs, blockquotes for callouts

**Technical Content**:
- Include code examples with syntax highlighting
- Explain what code does, not just show it
- Real-world examples, not toy problems

**Images**:
- Source: Unsplash or original photography
- Size: 1200x630px (featured), optimized for web
- Always credit: `**Photo by [Name](url) on [Unsplash](url)**`
- Location: `public/img/` directory (originals)
- Optimization: Run `node optimize-images.js` after adding new images
- Reference: Use filename only in frontmatter (no path or quotes)
- Formats: Automatic WebP/AVIF generation for performance

**File Formatting**:
- **Encoding**: UTF-8 (no BOM)
- **Line endings**: Unix (LF) - never Windows (CRLF)
- **Characters**: Use ASCII quotes (`'` `"`) not smart quotes (`'` `"`)
- **Validation**: Check with `file filename.md` - should show "UTF-8 text" without "CRLF"
- **Fix CRLF**: `tr -d '\r' < file.md > file-fixed.md && mv file-fixed.md file.md`

## Workflow

**Directory Structure**:
- **Scheduled Posts**: `src/content/backlog/` (future dates)
- **Published Posts**: `src/content/posts/` (current/past dates)

**File Naming**: 
- Astro format: `post-slug.md` (no date prefix)
- Slug becomes URL: `post-slug.md` → `/post-slug/`

**Publishing Process**:
1. Create in backlog: `npm run backlog add "Post Title"`
2. Edit file in `src/content/backlog/`
3. Set future date for scheduling
4. Automatic publishing daily at 9 AM UTC
5. Manual publishing: `npm run backlog publish filename.md`

**Development Workflow**:
- Local preview: `npm run dev` (http://localhost:4321/)
- Build test: `npm run build`
- Image optimization: `node optimize-images.js`

**Pre-Publish Checklist**:
- [ ] **Frontmatter**: All required fields present and valid YAML
- [ ] **Date Format**: YYYY-MM-DD format
- [ ] **Tags**: Use existing tags, array format `[Tag1, Tag2]`
- [ ] **Description**: 150-160 characters, compelling and descriptive
- [ ] **Image**: Optimized and properly referenced (filename only, no quotes)
- [ ] **Content**: Headers, code blocks with language tags, internal links with trailing slashes
- [ ] **Series**: Consistent naming and navigation (if applicable)
- [ ] **Local Test**: `npm run dev` and `npm run build` both work
- [ ] **Links**: All internal links use trailing slashes (`/post-slug/`)
- [ ] **Performance**: Images optimized, content scannable
- [ ] **SEO**: Title includes keywords, description is compelling

## Tags
**Existing**: Anxiety, Leadership, Azure, Governance, Operations, Log Analytics, Infrastructure, Architecture, Platform, AI, Development, Productivity, Post
**Guidelines**: 
- Use existing tags when possible
- Create new tags sparingly
- PascalCase format
- Maximum 3-4 tags per post
- Array format in frontmatter: `tags: [Azure, Leadership]`

## Series Posts

**Frontmatter Requirements**:
- **Consistent series name** across all parts (exact match)
- **Backlog posts**: Use `series_order: 1` for part numbering
- **Published posts**: Use `series_part: 1` for part numbering
- **Sequential numbering**: 1, 2, 3... (not Part 1, Part 2)

**Content Structure**:
- Each part should stand alone but reference others
- Include series context in introduction
- End with navigation to other parts
- Use "What's Next" sections for upcoming parts

**Navigation Requirements**:
- **Every series part** must include navigation at the end
- Place before photo attribution
- Format: `*This is Part X of the "Series Name" series. [Part Y: Title](/part-y/) covers topic.*`
- **Internal links**: Always use trailing slashes (`/post-slug/`)

**Automated Linking System**:
The GitHub Actions workflow automatically handles series progression:

1. **Add placeholder** in current post for next part:
```markdown
<!-- NEXT_PART: next-post-filename.md -->
## What's Next?

**Coming Next:** Part 3: Title (Publishing Date)

Brief preview of what the next part will cover.
<!-- END_NEXT_PART -->
```

2. **When next part publishes**, the workflow automatically:
   - Scans all posts for matching `<!-- NEXT_PART: filename -->` comments
   - Replaces the entire section with: `**Next in Series:** [Title →](/slug/)`
   - Creates seamless forward linking without manual updates

3. **Workflow runs daily** at 9 AM UTC and processes posts with dates <= today

**Complete Series Template**:
```markdown
<!-- NEXT_PART: series-name-pt3.md -->
## What's Next?

**Coming Next:** Part 3: Title (Publishing Date)

Brief preview of what the next part will cover.
<!-- END_NEXT_PART -->

---

*This is Part 2 of the "Series Name" series. [Part 1: Title](/part-1/) covered topic. [Part 3: Title](/part-3/) explores next topic.*

**Photo by [Name](url) on [Unsplash](url)**
```

## Astro-Specific Requirements

**Content Collections**:
- Published posts: `src/content/posts/` collection
- Scheduled posts: `src/content/backlog/` collection
- Separate collections prevent duplicate ID warnings

**URL Structure**:
- Filename becomes slug: `my-post.md` → `/my-post/`
- No date prefixes in filenames (Astro uses frontmatter date)
- Internal links must have trailing slashes

**Build Process**:
- Static site generation with Astro
- Automatic image optimization (WebP/AVIF)
- Performance optimized (90+ Lighthouse scores)
- Fast builds and hot reloading in development

**Publishing Timezone**:
- All dates processed in Central Time (America/Chicago)
- Consistent publishing behavior regardless of server timezone
- Posts publish when date <= current Central Time date

## File Formatting & Troubleshooting

**Astro Requirements**:
- **Encoding**: UTF-8 (no BOM)
- **Line endings**: Unix (LF) preferred
- **Frontmatter**: Valid YAML syntax
- **Content**: Markdown with Astro compatibility

**Common Issues**:
1. **Invalid frontmatter**: Check YAML syntax, proper indentation
2. **Image not loading**: Verify filename in `public/img/`, no quotes in frontmatter
3. **Build failures**: Check required fields (title, date, tags, description)
4. **Links broken**: Use trailing slashes for internal links

**Validation Commands**:
```bash
# Test local build
npm run build

# Check backlog status
npm run backlog:list
npm run backlog:check

# Optimize images
node optimize-images.js

# Start development server
npm run dev
```

**Debugging Process**:
1. Check frontmatter syntax and required fields
2. Verify image paths and optimization
3. Test build locally before publishing
4. Review GitHub Actions logs for deployment issues

## Reference & Resources

**Documentation**:
- **Publishing Workflow**: `docs/PUBLISHING_WORKFLOW.md` - Complete publishing guide
- **GitHub Actions Setup**: `GITHUB_ACTIONS_SETUP.md` - Workflow configuration
- **Project Backlog**: `BACKLOG.md` - Current priorities and completed items

**Management Commands**:
```bash
# Backlog management
npm run backlog:list              # List all scheduled posts
npm run backlog:check             # Check posts ready to publish  
npm run backlog add "Title"       # Create new scheduled post
npm run backlog publish file.md   # Manually publish specific post

# Development
npm run dev                       # Local development server
npm run build                     # Test production build
npm run preview                   # Preview production build

# Utilities
node optimize-images.js           # Optimize images
node scripts/manage-backlog.js    # Direct script access
```

**File Locations**:
- **Published**: `src/content/posts/`
- **Scheduled**: `src/content/backlog/`
- **Images**: `public/img/` (originals), `public/img/optimized/` (processed)
- **Config**: `src/config.ts`, `astro.config.mjs`
- **Workflows**: `.github/workflows/`

**Performance Standards**:
- Lighthouse scores: 90+ across all categories
- Image optimization: WebP/AVIF with fallbacks
- Fast builds: Astro static site generation
- SEO optimized: Proper meta tags and structure
