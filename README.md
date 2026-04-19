# Technical Anxiety

A technical blog covering Azure, cloud architecture, leadership, and navigating anxiety in tech. Built with Astro 6, deployed to Azure Static Web Apps.

**Live**: [www.technicalanxiety.com](https://www.technicalanxiety.com)

## Project Structure

```text
/
├── api/                         # Azure Functions (contact form, recruiter chat)
│   ├── chat/                    # Recruiter chat function
│   └── contact/                 # Consulting contact form function
├── docs/                        # Project documentation
├── public/
│   └── img/                     # Static images
├── scripts/                     # Build, maintenance, and utility scripts
├── src/
│   ├── components/              # Astro and React components
│   │   ├── ArchitectureMap.tsx   # Interactive architecture visualization (React)
│   │   ├── BackToTop.astro      # Scroll-to-top button
│   │   ├── Breadcrumbs.astro    # Breadcrumb navigation
│   │   ├── ContentFlow.astro    # Content layout flow
│   │   ├── CookieConsent.astro  # Cookie consent banner
│   │   ├── GiscusComments.astro # Giscus comment integration
│   │   ├── Header.astro         # Site navigation and search
│   │   ├── Footer.astro         # Site footer
│   │   ├── Hero.astro           # Homepage hero section
│   │   ├── OptimizedImage.astro # Image optimization wrapper
│   │   ├── Pagination.astro     # Post list pagination
│   │   ├── ReadingProgress.astro # Reading progress bar
│   │   ├── RecruiterChat.astro  # AI recruiter chat widget
│   │   ├── SearchBox.astro      # Search UI
│   │   ├── SeriesNavigation.astro # Series part navigation
│   │   ├── Sidebar.astro        # Author bio and recent posts
│   │   ├── TableOfContents.astro # Auto-generated TOC
│   │   └── ThemeToggle.astro    # Dark/light mode toggle
│   ├── content/
│   │   ├── posts/               # Published blog posts (~70 articles)
│   │   ├── backlog/             # Scheduled posts (future dates)
│   │   └── series/              # Series metadata (12 series)
│   ├── layouts/
│   │   ├── BaseLayout.astro     # Base HTML structure, meta tags, analytics
│   │   └── PostLayout.astro     # Blog post template
│   ├── pages/                   # Route pages (see Site Pages below)
│   ├── styles/                  # CSS (theme, base, layout, hero, critical)
│   ├── test/                    # Vitest test suite (12 test files)
│   ├── utils/posts.ts           # Post query and filtering utilities
│   ├── config.ts                # Site configuration
│   └── content.config.ts        # Content collection schemas (Content Layer API)
├── .kiro/
│   ├── hooks/                   # Agent hooks (lint, validation, changelog)
│   ├── steering/                # Steering files (coding standards, publishing gates)
│   └── settings/                # MCP and editor settings
├── astro.config.mjs
└── package.json
```

## Site Pages

| Route | Description |
|:------|:------------|
| `/` | Homepage with paginated post grid |
| `/archive/` | Full post archive |
| `/series/` | Series index with landing pages |
| `/tags/` | Tag index and per-tag post lists |
| `/about/` | About Jason Rinehart |
| `/resume/` | Professional resume |
| `/consulting/` | Consulting services and contact form |
| `/architecture/` | Interactive architecture map |
| `/loom/` | Project Loom — PostgreSQL-native AI memory compiler |
| `/search/` | Full-text post search (Fuse.js) |
| `/start-here/` | Curated starting point for new readers |
| `/azure/`, `/governance/`, `/leadership/`, `/operations/`, `/log-analytics/` | Topic landing pages |
| `/changelog/` | Site changelog |
| `/privacy/`, `/security/` | Legal and security policy |
| `/rss.xml` | RSS feed |

## Commands

| Command | Action |
|:--------|:-------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run check` | Run Astro type checking |
| `npm run test` | Run Vitest test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run test:cross-browser` | Run cross-browser tests (Puppeteer) |
| `npm run deploy:check` | Check, test, and build in sequence |
| `npm run verify:production` | Verify production deployment |
| `npm run verify:staging` | Verify staging deployment |

### Content Management

| Command | Action |
|:--------|:-------|
| `npm run backlog:list` | List all scheduled posts |
| `npm run backlog:check` | Check posts ready to publish |
| `npm run backlog add "Title"` | Create new scheduled post |
| `npm run backlog publish file.md` | Manually publish a specific post |

## Content Management

### Automated Publishing

Posts in `src/content/backlog/` with a date ≤ today are automatically moved to `src/content/posts/` and deployed. The GitHub Actions workflow runs daily at 9 AM UTC.

### Adding a Post

**Scheduled (recommended):**
```bash
npm run backlog add "Your Post Title"
# Edit the generated file in src/content/backlog/
# Set a future date — it auto-publishes when the date arrives
```

**Direct:**
Create a `.md` file in `src/content/posts/` with this frontmatter:

```yaml
---
title: "Your Post Title"
date: 2026-01-01
tags: [Azure, Leadership, Anxiety]
description: "Brief description for SEO (150-160 characters)"
image: "your-image.jpg"
series: "Optional Series Name"
series_part: 1
---
```

### Content Collections

Defined in `src/content.config.ts` using Astro's Content Layer API with Zod schemas:

- **posts** — Published articles with title, date, tags, optional series membership
- **backlog** — Scheduled posts (uses `series_order` instead of `series_part`)
- **series** — Series metadata with title, description, image, tags, display order, featured flag

### Series

Each series has a landing page at `/series/[slug]/` with overview content, tag links, and ordered post list. Series metadata lives in `src/content/series/`. Currently 12 series covering topics from AI governance to platform resiliency.

### Content Guidelines

- **Images**: Place in `public/img/`, run `node optimize-images.js` to generate optimized versions
- **Tags**: PascalCase format — `[Azure, Leadership, Anxiety]`
- **Internal links**: Always use trailing slashes — `/post-slug/`
- **Series**: Series name in post frontmatter must match the series title exactly

## Tech Stack

| Layer | Technology |
|:------|:-----------|
| Framework | Astro 6 (static output) |
| UI Components | Astro components + React (architecture map) |
| Styling | CSS custom properties, dark/light theme |
| Fonts | Rajdhani, Orbitron, Fira Code (Google Fonts) |
| Search | Fuse.js (client-side fuzzy search) |
| Comments | Giscus (GitHub Discussions) |
| Analytics | Google Analytics (GA4) |
| Testing | Vitest, Puppeteer (cross-browser) |
| Image optimization | Sharp |
| Linting | markdownlint |
| Icons | Ionicons 7 |

### Dependencies

**Runtime**: Astro, @astrojs/react, @astrojs/rss, @astrojs/sitemap, Fuse.js, React 19, Sass, TypeScript

**Dev**: Vitest, jsdom, fast-check (property-based testing), Puppeteer, Sharp, Lighthouse, markdownlint-cli

## Deployment

### Azure Static Web Apps

The site deploys automatically via GitHub Actions on push to `master`.

- **Production**: [www.technicalanxiety.com](https://www.technicalanxiety.com) — `master` branch
- **Preview**: Automatic preview deployments on pull requests
- **Workflow**: `.github/workflows/azure-static-web-apps-ambitious-wave-0d77c1c10.yml`

### Scheduled Publishing

- **Workflow**: `.github/workflows/publish-scheduled-posts.yml`
- **Schedule**: Daily at 9 AM UTC (also manually triggerable)
- **Process**: Moves ready posts from backlog → posts, triggers site rebuild

### API Functions

Azure Functions in the `api/` directory handle:
- **Contact form** (`/api/contact`) — Consulting inquiry submissions
- **Recruiter chat** (`/api/chat`) — AI-powered recruiter chat responses

## Testing

12 test files covering:

- Content migration integrity
- URL preservation
- Meta tag completeness
- Search relevance
- Series navigation
- Pagination validity
- Tag linking
- Theme toggle
- Table of contents
- Code syntax highlighting
- Link checking
- Cross-browser compatibility

```bash
npm run test              # Single run
npm run test:watch        # Watch mode
npm run test:ui           # Vitest UI
npm run test:cross-browser # Puppeteer cross-browser tests
```

## Theme and Styling

- **CSS variables**: `src/styles/theme.css` (colors, spacing, typography, transitions)
- **Dark/light mode**: System detection with manual toggle, persisted to localStorage
- **Base styles**: `src/styles/base.css`, `src/styles/layout.css`
- **Critical CSS**: Inlined in `BaseLayout.astro` for fastest paint

## Kiro Integration

The project uses Kiro steering files (`.kiro/steering/`) for consistent AI-assisted development:

- Coding standards, anti-patterns, security practices
- Astro technical guide, publishing gates
- Blog content standards, KQL writing standards
- Git workflow, testing strategy

Agent hooks (`.kiro/hooks/`) automate validation on file save, pre-commit checks, changelog updates, and image optimization checks.

## Documentation

| Document | Location |
|:---------|:---------|
| Publishing workflow | `docs/PUBLISHING_WORKFLOW.md` |
| Cross-browser testing | `docs/CROSS_BROWSER_TESTING.md` |
| Recruiter chat setup | `docs/RECRUITER_CHAT_SETUP.md` |
| GitHub Actions setup | `GITHUB_ACTIONS_SETUP.md` |
| Deployment configuration | `DEPLOYMENT_CONFIGURATION.md` |
| Groq migration notes | `GROQ_MIGRATION.md` |

## Troubleshooting

**Build errors**: Clear the Astro cache and rebuild:
```bash
rm -rf node_modules/.astro
npm run build
```

**Content not showing**: Check frontmatter syntax, verify the file is in the correct directory, and confirm the date format is `YYYY-MM-DD`.

**Images not loading**: Verify images are in `public/img/`, use filename only in frontmatter (no path prefix), and run `node optimize-images.js` after adding new images.

**Auto-publish not working**: Check the GitHub Actions logs for the "Publish Scheduled Posts" workflow. Verify `PAT_TOKEN` is configured in repository secrets.

## Migration History

- **Astro 6 upgrade** (March 2026) — Content Layer API migration, `.slug` → `.id` refactor, `render()` updates, Node 22 CI
- **Jekyll → Astro migration** (December 2025) — Full site migration with URL preservation, 90+ Lighthouse scores, automated publishing

## License

- **Code and framework**: MIT License — see [LICENSE](LICENSE)
- **Blog content**: Creative Commons Attribution 4.0 International (CC BY 4.0)

## Links

- **Site**: [www.technicalanxiety.com](https://www.technicalanxiety.com)
- **Author**: [Jason Rinehart on LinkedIn](https://linkedin.com/in/rinehart76)
- **Astro docs**: [docs.astro.build](https://docs.astro.build)
