# Technical Anxiety Blog

A technical blog covering Azure, Log Analytics, leadership, and navigating anxiety in tech. Built with Astro for optimal performance and developer experience.

🌐 **Live Site**: [technicalanxiety.com](https://technicalanxiety.com)

## Migration Status

✅ **Migration Complete** - Successfully migrated from Jekyll to Astro in December 2024

This site was migrated from Jekyll to Astro to improve:
- Build performance and developer experience  
- Modern web standards and accessibility
- SEO and Core Web Vitals scores (90+ Lighthouse scores)
- Automated content management workflow

## 🚀 Project Structure

```text
/
├── public/                  # Static assets (images, favicon, etc.)
│   └── img/                # Blog post images and graphics
├── src/
│   ├── components/         # Reusable Astro components
│   │   ├── Header.astro    # Site navigation and theme toggle
│   │   ├── Footer.astro    # Site footer with social links
│   │   ├── Sidebar.astro   # Author bio and recent posts
│   │   └── ...             # Other UI components
│   ├── content/            # Content collections
│   │   ├── posts/          # Published blog posts (live on site)
│   │   ├── backlog/        # Scheduled posts (future dates)
│   │   └── config.ts       # Content schema definitions
│   ├── layouts/            # Page layouts
│   │   ├── BaseLayout.astro # Base HTML structure
│   │   └── PostLayout.astro # Blog post template
│   ├── pages/              # Route pages
│   │   ├── index.astro     # Homepage
│   │   ├── about.astro     # About page
│   │   ├── archive.astro   # Post archive
│   │   └── [...slug].astro # Dynamic blog post pages
│   ├── styles/             # CSS and styling
│   └── utils/              # Utility functions
├── scripts/                # Build and maintenance scripts
├── astro.config.mjs        # Astro configuration
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run test`            | Run test suite (unit and property-based tests)   |
| `npm run test:watch`      | Run tests in watch mode                          |
| **Content Management**    |                                                  |
| `npm run backlog:list`    | List all scheduled posts                         |
| `npm run backlog:check`   | Check posts ready to publish                     |
| `npm run backlog add "Title"` | Create new scheduled post                    |
| `npm run backlog publish file.md` | Manually publish specific post          |
| **Utilities**             |                                                  |
| `node optimize-images.js` | Optimize images for web performance              |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 📝 Content Management

### Automated Publishing Workflow

The site uses an automated publishing system with scheduled posts:

**Directories**:
- `src/content/posts/` - Published posts (live on site)
- `src/content/backlog/` - Scheduled posts (future dates)

**Publishing Commands**:
```bash
# List all scheduled posts
npm run backlog:list

# Check which posts are ready to publish
npm run backlog:check

# Create a new scheduled post
npm run backlog add "Post Title"

# Manually publish a specific post
npm run backlog publish post-filename.md
```

### Adding New Blog Posts

**Option 1: Scheduled Publishing (Recommended)**
```bash
# Create a new scheduled post
npm run backlog add "Your Post Title"

# Edit the generated file in src/content/backlog/
# Set a future date in frontmatter
# The post will auto-publish when the date arrives
```

**Option 2: Direct Publishing**
1. Create a new `.md` file in `src/content/posts/`
2. Use the frontmatter template below
3. Commit and push to deploy immediately

### Frontmatter Template

```yaml
---
title: "Your Post Title"
date: 2025-01-01
tags: [Azure, Leadership, Anxiety]
description: "Brief description for SEO (150-160 characters)"
image: "your-image.jpg"           # Optional - filename only, stored in public/img/
series: "Optional Series Name"    # Optional
series_order: 1                   # Optional - for backlog posts
series_part: 1                    # Optional - for published posts
---
```

### Automated Publishing

- **Schedule**: Daily at 9 AM UTC
- **Process**: Posts with dates ≤ today automatically move from backlog to published
- **Deployment**: Publishing triggers automatic site rebuild and deployment
- **Series Links**: Automatically updates navigation between series parts

### Content Guidelines

- **Images**: Place originals in `public/img/`, run `node optimize-images.js` to generate optimized versions
- **Tags**: Use PascalCase format: `[Azure, Leadership, Anxiety]`
- **Internal Links**: Always use trailing slashes: `/post-slug/`
- **Series**: Use consistent series names across all parts

## 🔧 Development

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:4321 in your browser
```

### Testing

The site includes comprehensive testing:

```bash
# Run all tests
npm run test

# Run tests in watch mode (for development)
npm run test:watch

# Run specific test file
npm run test src/test/content-migration.test.ts
```

### Build and Deploy

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy (automatic via GitHub Actions)
git push origin main
```

## 🚀 Deployment

The site is automatically deployed via GitHub Actions with two workflows:

### Automated Publishing
- **Schedule**: Daily at 9 AM UTC
- **Trigger**: Automatic (cron) or manual via GitHub Actions
- **Process**: Moves scheduled posts to published, updates series links, triggers deployment

### Azure Static Web Apps Deployment
- **Trigger**: Push to `master` branch (including from auto-publish)
- **Build**: Astro static site generation
- **Deploy**: Azure Static Web Apps with global CDN

### Deployment Targets

- **Production**: [technicalanxiety.com](https://technicalanxiety.com) (master branch)
- **Preview**: Automatic preview deployments for pull requests

### Manual Deployment

```bash
# Build and deploy (automatic via GitHub Actions)
git push origin master

# Or manually trigger auto-publish workflow
# Go to GitHub Actions → "Publish Scheduled Posts" → "Run workflow"
```

## 🎨 Customization

### Theme and Styling

- **CSS Variables**: Defined in `src/styles/theme.css`
- **Dark/Light Mode**: Automatic system detection with manual toggle
- **Typography**: Configured in `src/styles/base.css`

### Components

Key components for customization:

- `Header.astro` - Navigation and branding
- `Footer.astro` - Social links and copyright
- `Hero.astro` - Homepage hero section
- `Sidebar.astro` - Author bio and recent posts

## 📊 Analytics and SEO

### Analytics Setup

- **Google Analytics**: Configured in `src/config.ts`
- **Search Console**: Sitemap automatically generated at `/sitemap.xml`

### SEO Features

- Automatic meta tags and Open Graph data
- Structured data for blog posts
- RSS feed at `/rss.xml`
- Optimized images with lazy loading

## 🔍 Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clear cache and rebuild
rm -rf node_modules/.astro
npm run build
```

**Content Not Showing**
- Check frontmatter syntax in blog posts
- Verify file is in correct directory (`src/content/posts/` for published, `src/content/backlog/` for scheduled)
- Ensure date format is correct (YYYY-MM-DD)
- For scheduled posts, check if date is in the future

**Images Not Loading**
- Verify images are in `public/img/`
- Use filename only in frontmatter (no path, no quotes): `image: filename.jpg`
- Run `node optimize-images.js` after adding new images
- Ensure image files are committed to git

**Auto-publish Not Working**
- Check GitHub Actions logs for "Publish Scheduled Posts" workflow
- Verify posts in backlog have dates ≤ today
- Check that PAT_TOKEN secret is configured in repository settings

### Getting Help

- **Documentation**: 
  - [Astro Docs](https://docs.astro.build)
  - [Publishing Workflow](docs/PUBLISHING_WORKFLOW.md)
  - [GitHub Actions Setup](GITHUB_ACTIONS_SETUP.md)
- **Issues**: Create an issue in this repository
- **Contact**: [Contact form on the website](https://technicalanxiety.com/about/)

## 📚 Migration History

### Jekyll to Astro Migration (December 2024)

**Completed**: December 2024

**Key Improvements**:
- ⚡ 40% faster build times with Astro static site generation
- 🎯 Improved Lighthouse scores (90+ across all metrics)
- 🔧 Better developer experience with TypeScript and modern tooling
- 📱 Enhanced mobile performance and Core Web Vitals
- 🔍 Improved SEO and accessibility compliance
- 🤖 Automated publishing workflow with scheduled posts
- 🔗 Automatic series navigation and link management

**New Features**:
- Automated daily publishing at 9 AM UTC
- Scheduled post management with backlog system
- Automatic image optimization (WebP/AVIF generation)
- Series post navigation with automatic linking
- Enhanced search functionality
- Improved comment system integration

### Migration Verification

All migration requirements were validated through:
- ✅ Content parity verification (all posts migrated)
- ✅ URL structure preservation (no broken links)
- ✅ Feature parity testing (search, comments, themes)
- ✅ Performance benchmarking (Lighthouse audits)
- ✅ Cross-browser compatibility testing

## 👀 Want to learn more?

- **Astro Documentation**: [docs.astro.build](https://docs.astro.build)
- **Technical Anxiety Blog**: [technicalanxiety.com](https://technicalanxiety.com)
- **Author**: [Jason Rinehart on LinkedIn](https://linkedin.com/in/rinehart76)
