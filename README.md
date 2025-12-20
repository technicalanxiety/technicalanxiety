# Technical Anxiety Blog

A technical blog covering Azure, Log Analytics, leadership, and navigating anxiety in tech. Built with Astro for optimal performance and developer experience.

🌐 **Live Site**: [technicalanxiety.com](https://technicalanxiety.com)

## Migration Status

✅ **Migration Complete** - Successfully migrated from Jekyll to Astro on [DATE]

This site was migrated from Jekyll to Astro to improve:
- Build performance and developer experience
- Modern web standards and accessibility
- SEO and Core Web Vitals scores
- Content management workflow

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
│   │   ├── posts/          # Blog posts (Markdown)
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
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 📝 Content Management

### Adding New Blog Posts

1. Create a new `.md` file in `src/content/posts/`
2. Use the following frontmatter template:

```yaml
---
title: "Your Post Title"
date: 2024-01-01
tags: ["azure", "leadership", "anxiety"]
series: "Optional Series Name"
series_order: 1
image: "/img/your-image.jpg"
description: "Brief description for SEO and social sharing"
---
```

3. Write your content in Markdown
4. Run `npm run dev` to preview locally
5. Commit and push to deploy

### Content Guidelines

- **Images**: Place in `public/img/` directory
- **Tags**: Use consistent, lowercase tags
- **Series**: Group related posts with `series` and `series_order`
- **SEO**: Always include `description` for better search results

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

The site is automatically deployed via GitHub Actions when changes are pushed to the `main` branch.

### Deployment Targets

- **Production**: [technicalanxiety.com](https://technicalanxiety.com)
- **Preview**: Automatic preview deployments for pull requests

### Monitoring

After deployment, monitor the site health:

```bash
# Run health check
./scripts/post-cutover-health-check.sh

# Monitor metrics
node scripts/monitoring-dashboard.js report
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
- Verify file is in `src/content/posts/`
- Ensure date format is correct (YYYY-MM-DD)

**Images Not Loading**
- Verify images are in `public/img/`
- Check image paths in frontmatter and content
- Ensure image files are committed to git

### Getting Help

- **Documentation**: [Astro Docs](https://docs.astro.build)
- **Issues**: Create an issue in this repository
- **Contact**: [Contact form on the website](https://technicalanxiety.com/about/)

## 📚 Migration History

### Jekyll to Astro Migration (2024)

**Completed**: [DATE]

**Key Improvements**:
- ⚡ 40% faster build times
- 🎯 Improved Lighthouse scores (90+ across all metrics)
- 🔧 Better developer experience with TypeScript
- 📱 Enhanced mobile performance
- 🔍 Improved SEO and accessibility

**Archived Files**: See `jekyll-archive/` directory for original Jekyll implementation

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
