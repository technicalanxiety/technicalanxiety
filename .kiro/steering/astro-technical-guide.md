---
inclusion: fileMatch
fileMatchPattern: "astro-site/**/*.{astro,ts,js,md,json,mjs}"
---

# Astro Technical Guide

## Project Structure
- `astro.config.mjs`: Astro configuration (integrations, output, site URL)
- `src/content/posts/`: Blog posts (Markdown with frontmatter validation)
- `src/components/`: Reusable Astro components
- `src/layouts/`: Page layouts (BaseLayout, PostLayout)
- `src/pages/`: Route pages and API endpoints
- `src/styles/`: CSS/SCSS stylesheets
- `public/`: Static assets (images, favicon, robots.txt)
- `package.json`: Node.js dependencies

## Key Configuration
- **URL**: https://technicalanxiety.com
- **Output**: Static (SSG) | **Markdown**: Built-in with GFM support
- **Permalink**: `:slug/` (clean URLs, matching Jekyll format)
- **Pagination**: 7 posts/page
- **Integrations**: @astrojs/sitemap, @astrojs/rss, syntax highlighting

## Development Commands
- Start dev server: `npm run dev` (http://localhost:4321/)
- Build site: `npm run build`
- Preview build: `npm run preview`
- Run tests: `npm test` (Vitest with property-based testing)
- Type check: `npm run astro check`
- Update deps: `npm update` | Check updates: `npm outdated`

## Post Workflow
1. Create post: `src/content/posts/slug-name.md`
2. Add frontmatter (validated by Zod schema in `src/content/config.ts`)
3. Write content with markdown
4. Test locally: `npm run dev`
5. Git workflow: Feature branch → commit → PR → merge to main → auto-deploy

## Content Collections Schema
Posts are validated against this schema in `src/content/config.ts`:
```typescript
{
  title: string,
  date: Date,
  tags?: string[],
  series?: string,
  series_part?: number,
  image?: string,
  description?: string,
  author: string (default: 'Jason Rinehart'),
  draft: boolean (default: false)
}
```

## Front Matter Essentials
**Standard**: title, date, image, tags, description
**Series**: Add `series: "Name"` and `series_part: 1`
**Draft**: Add `draft: true` to exclude from build

Example:
```yaml
---
title: "My Blog Post"
date: 2025-12-19
image: "my-image.jpg"
tags: ["Azure", "Leadership"]
series: "My Series"
series_part: 1
description: "A brief description for SEO"
---
```

## Image Workflow
1. Download from Unsplash
2. Optimize: 1200x630px, <200KB (use ImageMagick, TinyPNG, or Squoosh)
3. Save to `public/img/` directory
4. Reference in frontmatter: `image: "filename.jpg"` (no path needed)
5. Add attribution: `**Photo by [Name](url) on [Unsplash](url)**`

## Component Architecture
- **BaseLayout**: SEO meta tags, theme support, analytics
- **PostLayout**: Blog post display with reading progress, TOC, series nav
- **Header/Footer**: Site navigation and branding
- **TableOfContents**: Auto-generated from h2/h3 headings
- **SeriesNavigation**: Previous/next links for multi-part series
- **Breadcrumbs**: Navigation path (Home > Category > Post)
- **ReadingProgress**: Scroll-based progress bar
- **ThemeToggle**: Dark/light mode with persistence

## Markdown Features
- Headers: `##` (H2), `###` (H3) - H1 auto-generated from title
- Emphasis: `**bold**`, `*italic*`, `> blockquote`
- Code: ` ```language ` for blocks with syntax highlighting
- Links: `[text](url)` | Images: `![alt](/img/file.jpg)`
- Lists: `-` or `1.` | Horizontal rule: `---`
- GFM: Tables, strikethrough, task lists, autolinks

## Testing Strategy
- **Unit Tests**: Component behavior and utilities
- **Property-Based Tests**: Universal correctness properties using fast-check
- **Integration Tests**: Content migration validation
- **Coverage**: Focus on critical paths, not 100% coverage
- **Run Tests**: `npm test` (Vitest framework)

## Property-Based Testing
Key properties validated:
- **Content Preservation**: All Jekyll posts migrated correctly
- **Series Navigation**: All series links resolve to valid pages
- **Table of Contents**: TOC contains links to all h2/h3 headings
- **URL Structure**: Astro URLs match Jekyll format
- **Meta Tags**: All pages have required SEO meta tags

## Troubleshooting
**Post not showing**: Check frontmatter validation, ensure not draft, verify date format
**Images not loading**: Verify in `public/img/`, check filename in frontmatter
**Build failing**: Check `npm run astro check`, validate frontmatter schema
**Dev server issues**: Clear cache with `rm -rf .astro`, restart dev server
**Type errors**: Run `npm run astro check` for TypeScript validation
**Date format errors**: If seeing "Expected type date, received string", ensure content schema uses `z.coerce.date()` to handle Jekyll date strings
**Missing dependencies**: Run `npm install` if seeing module not found errors

## Deployment
- **Auto-deploy** on push to main branch via GitHub Actions
- Build command: `npm run build`
- Output directory: `dist/`
- Build takes 1-2 minutes
- Site updates at https://technicalanxiety.com

## Performance Features
- **Static Generation**: All pages pre-built at build time
- **Image Optimization**: Automatic optimization with Sharp
- **Code Splitting**: Automatic JavaScript bundling
- **CSS Optimization**: Automatic minification and purging
- **Lighthouse Scores**: Target 90+ on all metrics

## SEO & Meta Tags
- Titles: 50-60 chars | Descriptions: 150-160 chars
- Open Graph and Twitter Card meta tags auto-generated
- Canonical URLs for all pages
- Sitemap.xml and RSS feed auto-generated
- Structured data for blog posts

## File Organization
```
astro-site/
├── src/
│   ├── components/          # Reusable UI components
│   ├── content/
│   │   ├── posts/          # Blog post markdown files
│   │   └── config.ts       # Content collection schemas
│   ├── layouts/            # Page layouts
│   ├── pages/              # Route pages
│   ├── styles/             # Global styles
│   ├── test/               # Test files
│   └── config.ts           # Site configuration
├── public/
│   ├── img/                # Images and assets
│   ├── favicon.svg         # Site favicon
│   └── robots.txt          # SEO robots file
├── astro.config.mjs        # Astro configuration
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
└── vitest.config.ts        # Test configuration
```

## Migration Notes
- Jekyll `_posts/` → Astro `src/content/posts/`
- Jekyll `_includes/` → Astro `src/components/`
- Jekyll `_layouts/` → Astro `src/layouts/`
- Jekyll `img/` → Astro `public/img/`
- Jekyll `_config.yml` → Astro `astro.config.mjs` + `src/config.ts`

## Resources
- [Astro Documentation](https://docs.astro.build/)
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Vitest Testing](https://vitest.dev/)
- [fast-check Property Testing](https://fast-check.dev/)

## Development Tips
- Use `npm run dev` for hot reloading during development
- Run `npm run astro check` before committing for type safety
- Test property-based tests with `npm test` to catch edge cases
- Use browser dev tools to verify meta tags and performance
- Check Lighthouse scores regularly to maintain performance standards