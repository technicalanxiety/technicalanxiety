---
inclusion: manual
---

# Automated Checks Reference

Reference document for automated validation checks. Scripts and workflows are stored in `.github/workflows/` and `scripts/` directories.

## Pre-Commit Checks

**Image Optimization**
- Verify images <200KB, dimensions 1200x630 for featured images
- Implementation: Git pre-commit hook or GitHub Action

**Front Matter Validation**
- Required: layout, title, date, image, tags, description (150-160 chars)
- Optional: series, series_part
- Implementation: Python validator script

**File Naming Convention**
- Pattern: `YYYY-MM-DD-post-slug.md`
- Checks: Valid date, lowercase slug with hyphens, .md extension

**Image Attribution**
- Verify Unsplash attribution: `**Photo by [Name](url) on [Unsplash](url)**`
- Warn if missing

## Build-Time Checks

**Broken Link Detection**
- Internal links, external links (with caching), anchor links
- Tool: html-proofer gem
- Command: `bundle exec htmlproofer ./_site --disable-external --allow-hash-href --assume-extension`

**Image Existence**
- Verify front matter images exist in `/img/`
- Check inline image references

**Syntax Highlighting**
- Ensure code blocks have language tags
- Warn if ` ``` ` without language specification

**Reading Time Validation**
- Calculate word count, estimate time (200 words/min)
- Warn if >2,500 words (~10 min)

## Post-Publish Checks

**Social Media Preview**
- Image: 1200x630px | Title: <60 chars | Description: 150-160 chars
- Verify Open Graph tags

**SEO Validation**
- Title/meta tags appropriate length
- Proper header hierarchy (H1 → H2 → H3)
- Alt text on images, internal linking

**Accessibility**
- Images have alt text
- Descriptive link text (not "click here")
- Sufficient color contrast, logical header order

## Scheduled Checks

**Weekly**: Broken external links, outdated dependencies (Dependabot), analytics review
**Monthly**: Tag audit, image optimization audit, performance check (PageSpeed), internal link review

## Implementation Priority

**Phase 1 (High)**: Front matter validation, image existence, file naming, broken internal links
**Phase 2 (Medium)**: Image optimization, attribution check, reading time, syntax highlighting
**Phase 3 (Low)**: External links, SEO validation, accessibility, social preview

## Scripts Location

Validation scripts stored in `scripts/` directory:
- `validate-frontmatter.py`: Front matter validation
- `validate-images.py`: Image size and dimension checks
- `check-reading-time.py`: Reading time estimation

GitHub Actions workflow: `.github/workflows/blog-quality-checks.yml`

## Usage

Run checks:
1. Locally before committing
2. In CI/CD via GitHub Actions
3. As git hooks for automatic validation

## Principles

- Checks help, not hinder
- Warnings acceptable, not all failures block build
- Focus on high-value checks first
- Keep fast (<30 seconds total)
- Easy to run locally
