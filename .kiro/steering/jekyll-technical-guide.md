---
inclusion: fileMatch
fileMatchPattern: "**/*.{md,html,yml,rb}"
---

# Jekyll Technical Guide

## Project Structure
- `_config.yml`: Site configuration (title, URL, plugins, pagination)
- `_posts/`: Published posts | `_posts/backlog/`: Drafts (excluded from build)
- `_pages/`: Static pages | `_layouts/`: Templates | `_includes/`: Components
- `_sass/`: Stylesheets | `img/`: Images | `js/`: JavaScript
- `Gemfile`: Ruby dependencies

## Key Configuration
- **URL**: https://technicalanxiety.com
- **Markdown**: kramdown | **Permalink**: `:title/` (clean URLs)
- **Pagination**: 7 posts/page
- **Plugins**: jekyll-paginate, jekyll-sitemap, jekyll-feed, jekyll-seo-tag

## Development Commands
- Start server: `bundle exec jekyll serve --livereload` (http://127.0.0.1:4000/)
- Build site: `bundle exec jekyll build`
- Clean build: `bundle exec jekyll clean && bundle exec jekyll build`
- Update deps: `bundle update` | Check updates: `bundle outdated`

## Post Workflow
1. Create draft: `_posts/backlog/YYYY-MM-DD-slug.md`
2. Add front matter (see `.github/SNIPPETS.md` for templates)
3. Write content with markdown
4. Publish: Move to `_posts/` directory
5. Git workflow: Feature branch → commit → PR → merge to main → auto-deploy

## Front Matter Essentials
**Standard**: layout, title, date, image, tags, description
**Series**: Add `series: "Name"` and `series_part: 1`
**Pages**: layout, title, permalink, image

## Image Workflow
1. Download from Unsplash
2. Optimize: 1200x630px, <200KB (use ImageMagick, TinyPNG, or Squoosh)
3. Save to `img/` directory
4. Reference in front matter: `image: filename.jpg`
5. Add attribution: `**Photo by [Name](url) on [Unsplash](url)**`

## Markdown Quick Reference
- Headers: `##` (H2), `###` (H3) - H1 auto-generated from title
- Emphasis: `**bold**`, `*italic*`, `> blockquote`
- Code: ` ```language ` for blocks, `` `inline` `` for inline
- Links: `[text](url)` | Images: `![alt](/img/file.jpg)`
- Lists: `-` or `1.` | Horizontal rule: `---`

## Troubleshooting
**Post not showing**: Check date isn't future, file in `_posts/` not `backlog/`, valid YAML front matter, correct filename format
**Images not loading**: Verify in `/img/`, filename matches front matter, no leading slash
**Build failing**: Check GitHub Actions, validate YAML, check for broken links
**Jekyll won't start**: Run `bundle install`, check Ruby version (3.x), use `--trace` flag

## Deployment
- **Auto-deploy** on push to main branch via GitHub Pages
- Build takes 1-2 minutes
- Check Actions tab for status
- Site updates at https://technicalanxiety.com

## SEO & Performance
- Titles: 50-60 chars | Descriptions: 150-160 chars
- Use proper header hierarchy (H2 → H3)
- Internal linking, alt text on images
- Sitemap & RSS auto-generated
- Optimize images before adding (<200KB target)

## Resources
See `.github/QUICK_REFERENCE.md` for workflows and `.github/SNIPPETS.md` for templates.
External docs: [Jekyll](https://jekyllrb.com/docs/), [GitHub Pages](https://docs.github.com/en/pages), [Kramdown](https://kramdown.gettalong.org/syntax.html)
