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

**File Formatting**:
- **Encoding**: UTF-8 (no BOM)
- **Line endings**: Unix (LF) - never Windows (CRLF)
- **Characters**: Use ASCII quotes (`'` `"`) not smart quotes (`'` `"`)
- **Validation**: Check with `file filename.md` - should show "UTF-8 text" without "CRLF"
- **Fix CRLF**: `tr -d '\r' < file.md > file-fixed.md && mv file-fixed.md file.md`

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
- **File formatting**: Unix line endings (LF), UTF-8 encoding
- **Series posts**: "What's Next" section included (non-final parts)
- **Series posts**: HTML comment with next part filename included
- **Series posts**: Navigation links to other parts included
- **Series posts**: Previous parts updated to link forward (if applicable)

## Tags
**Existing**: Anxiety, Leadership, Azure, Governance, Operations, Log Analytics
**Guidelines**: Use existing tags, create sparingly, PascalCase, max 3-4 per post

## Series Posts
- Consistent series name across parts
- Number sequentially (1, 2, 3...)
- Each part stands alone but references others
- See `.github/SNIPPETS.md` for front matter template

**Series Navigation Requirements**:
- **Every series part** must include navigation to other parts at the end
- Place navigation section before the photo attribution
- Format: `*This is Part X of the "Series Name" series. [Part Y: Title](/url) covers topic.*`
- **Part 1**: Link to Part 2 (if published)
- **Middle parts**: Link to previous and next parts
- **Final part**: Reference previous parts and conclude series
- **When publishing new parts**: Update previous parts to link forward

**"What's Next" Section Requirements**:
- **Required for all non-final series parts**
- Place after main content, before series navigation
- Include teaser for next part's content
- Format: `## What's Next?` followed by preview text
- **Template**: `**Coming Next:** Part X: Title (Publishing Date)` + content preview
- **HTML Comments**: Add `<!-- NEXT_PART: YYYY-MM-DD-post-slug.md -->` before and `<!-- END_NEXT_PART -->` after the "What's Next" section for linking reference

**GitHub Actions Auto-Linking**:
- The daily publish workflow automatically processes these HTML comments
- When a new series part publishes, the workflow scans all existing posts for matching `<!-- NEXT_PART: filename -->` comments
- The entire "What's Next" section gets replaced with a clean link: `**Next in Series:** [Title →](/slug/)`
- This creates seamless forward linking without manual updates
- The automation runs daily at 9 AM UTC and processes posts with dates <= today

**Complete Series Template**:
```markdown
<!-- NEXT_PART: 2025-MM-DD-series-name-pt3.md -->
## What's Next?

**Coming Next:** Part 3: Title (Publishing Date)

Brief preview of what the next part will cover.
<!-- END_NEXT_PART -->

---

*This is Part 2 of the "Series Name" series. [Part 1: Title](/part-1-url) covered topic. [Part 3: Title](/part-3-url) explores next topic.*

**Photo by [Name](url) on [Unsplash](url)**
```

## File Formatting Troubleshooting

**Problem**: String replacements fail during editing
**Cause**: Mixed line endings (CRLF vs LF) or Unicode characters
**Solution**: 
```bash
# Check file format
file _posts/filename.md

# Fix CRLF line endings
tr -d '\r' < _posts/filename.md > temp.md && mv temp.md _posts/filename.md

# Check for smart quotes (shows hex)
grep -P "[\u2018\u2019\u201C\u201D]" _posts/filename.md

# Fix all markdown files at once
find _posts -name "*.md" -exec sh -c 'tr -d "\r" < "$1" > "$1.tmp" && mv "$1.tmp" "$1"' _ {} \;
```

**Prevention**: 
- Configure editor to use Unix line endings
- Use ASCII quotes in markdown
- Validate files before committing

## Reference
- Templates: `.github/SNIPPETS.md`
- Quick reference: `.github/QUICK_REFERENCE.md`
- Technical guide: `.kiro/steering/jekyll-technical-guide.md`
