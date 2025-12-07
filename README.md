# Technical Anxiety Blog

Personal blog by Jason Rinehart covering Azure architecture, cloud governance, technical leadership, and managing anxiety in tech.

**Live Site**: [technicalanxiety.com](https://technicalanxiety.com)

## Purpose

This repository contains the source code for my personal technical blog. I write about:
- Microsoft Azure architecture and governance
- Cloud adoption patterns and best practices
- Technical leadership and team building
- Managing anxiety and mental health in tech careers
- Real-world experiences from 20+ years in technology

## Tech Stack

- **Platform**: Jekyll static site generator
- **Hosting**: GitHub Pages
- **Theme**: Custom theme based on Jekyll
- **Ruby**: 3.2.3
- **Deployment**: Automatic on push to main branch

## Local Development

```bash
# Install dependencies
bundle install

# Start local server with live reload
bundle exec jekyll serve --livereload

# Visit http://127.0.0.1:4000
```

## Project Structure

- `_posts/` - Published blog posts
- `_posts/backlog/` - Draft posts (not published)
- `_pages/` - Static pages (About, Start Here, etc.)
- `img/` - Images and graphics
- `.github/` - Documentation, ideas, and maintenance files
- `.kiro/` - Kiro AI assistant configuration

## Writing & Publishing

Posts are written in Markdown with YAML front matter. See `.kiro/steering/blog-content-standards.md` for detailed guidelines.

**Quick workflow:**
1. Create draft in `_posts/backlog/`
2. Write and refine content
3. Move to `_posts/` when ready to publish
4. Push to main branch - site updates automatically

## License

Content is © Jason Rinehart. Code is MIT licensed (see LICENSE.txt).

## Contact

- **LinkedIn**: [linkedin.com/in/rinehart76](https://linkedin.com/in/rinehart76)
- **Twitter**: [@anxiouslytech](https://twitter.com/anxiouslytech)
- **Website**: [technicalanxiety.com](https://technicalanxiety.com)