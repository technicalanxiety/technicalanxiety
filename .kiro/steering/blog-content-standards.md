---
inclusion: fileMatch
fileMatchPattern: "_posts/**/*.md"
---

# Blog Content Standards

## Core Principles
- **Authentic voice** - Direct, honest, sometimes raw. No corporate speak.
- **Practical over theoretical** - Real-world experience, not textbook theory.
- **Help others** - If one person solves a problem faster, it matters.
- **Don't over-engineer** - Keep it simple, focus on content.

## Post Requirements

**Front Matter** (see `.github/SNIPPETS.md` for templates):
- layout, title, date, image, tags, description (150-160 chars)
- Optional: series, series_part

**Structure**:
- Flexible format - let content dictate structure
- Target: Sub-10 min reads (~1,500-2,500 words)
- Use headers, short paragraphs, blockquotes for callouts

**Technical Content**:
- Include code examples with syntax highlighting
- Explain what code does, not just show it
- Real-world examples, not toy problems

**Images**:
- Source: Unsplash
- Size: 1200x630px (featured), <200KB
- Always credit: `**Photo by [Name](url) on [Unsplash](url)**`
- Location: /img/ directory

## Workflow

**Drafts**: `_posts/backlog/` → **Published**: `_posts/`
**Naming**: `YYYY-MM-DD-post-slug.md`
**Cadence**: Bi-weekly target, weekly stretch goal

**Pre-Publish Checklist** (see `.github/QUICK_REFERENCE.md`):
- Front matter complete
- Image optimized with attribution
- Code blocks have language tags
- Links tested, reading time <10 min
- SEO description 150-160 chars

## Tags
**Existing**: Anxiety, Leadership, Azure, Governance, Operations, Log Analytics
**Guidelines**: Use existing tags, create sparingly, PascalCase, max 3-4 per post

## Series Posts
- Consistent series name across parts
- Number sequentially (1, 2, 3...)
- Each part stands alone but references others
- See `.github/SNIPPETS.md` for front matter template

## Reference
- Templates: `.github/SNIPPETS.md`
- Quick reference: `.github/QUICK_REFERENCE.md`
- Technical guide: `.kiro/steering/jekyll-technical-guide.md`
