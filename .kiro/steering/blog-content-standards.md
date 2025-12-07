---
inclusion: always
---

# Technical Anxiety Blog - Content Standards

## Project Overview

**Site**: Technical Anxiety (technicalanxiety.com)
**Platform**: Jekyll + GitHub Pages
**Author**: Jason Rinehart
**Focus**: Azure architecture, cloud governance, technical leadership, mental health in tech

## Post Structure

### Flexible Format
- **No rigid structure required** - let the content dictate the format
- Older posts used PURPOSE/WALKTHROUGH/CONCLUSION sections
- Newer posts are more free-flowing and organic
- Structure should serve the content, not constrain it

### Front Matter Template
```yaml
---
layout: post
title: "Your Post Title"
date: YYYY-MM-DD HH:MM -0600
image: filename.jpg
tags: [Tag1, Tag2]
description: "Brief description for SEO and social sharing (150-160 chars)"
---
```

### Series Posts
When creating a series, add these fields:
```yaml
---
layout: post
title: "Series Title, Part 1"
date: YYYY-MM-DD HH:MM -0600
image: filename.jpg
tags: [Tag1, Tag2]
series: "Series Name"
series_part: 1
description: "Description"
---
```

**Series Standards:**
- Use consistent series name across all parts
- Number parts sequentially (1, 2, 3...)
- Include series navigation (handled by template)
- Each part should stand alone but reference others
- Final part should wrap up the series

## Content Guidelines

### Voice & Tone
- **Authentic and unfiltered** - this is Jason's space
- Direct, honest, sometimes raw
- No corporate speak or marketing fluff
- Personal experiences mixed with technical expertise
- It's okay to be vulnerable, especially about anxiety/mental health
- Technical content should be practical, not theoretical

### Writing Style
- **Target**: Sub-10 minute reads (roughly 1,500-2,500 words)
- Use short paragraphs for readability
- Break up text with headers, lists, quotes
- Use horizontal rules (---) to separate major sections
- Bold key points for scanning
- Use > blockquotes for important callouts or questions

### Technical Content
- **Always include code examples** when discussing technical topics
- Use proper syntax highlighting with language tags:

```python
# Python example
def example_function():
    return "formatted code"
```

```javascript
// JavaScript example
function exampleFunction() {
    return "formatted code";
}
```

```powershell
# PowerShell example
function Example-Function {
    return "formatted code"
}
```

```bicep
// Bicep example
resource example 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: 'examplename'
}
```

- Explain what the code does, not just show it
- Include comments in code for clarity
- Show real-world examples, not toy problems

## Images

### Image Standards
- **Source**: Unsplash (primary source)
- **Always credit photographers**: Include attribution at end of post
- **Format**: `**Photo by [Photographer Name](photographer-url) on [Unsplash](photo-url)**`

### Image Optimization
- **Optimize all images** before adding to repo
- **Standard sizes**:
  - Featured images: 1200x630px (social sharing optimal)
  - In-content images: Max 1200px width
  - Thumbnails: 400x300px (if needed)
- **Format**: JPG for photos, PNG for graphics/screenshots, SVG for logos
- **Compression**: Use tools like ImageOptim, TinyPNG, or similar
- **File naming**: lowercase-with-hyphens.jpg
- **Location**: /img/ directory

### Image Attribution Template
```markdown
**Photo by [Photographer Name](https://unsplash.com/@username) on [Unsplash](https://unsplash.com/photos/photo-id)**
```

## Publishing Workflow

### Draft Management
- **Drafts**: Store in `_posts/backlog/` directory
- **Published**: Move to `_posts/` directory
- **Naming**: `YYYY-MM-DD-post-slug.md`
- **Future dates**: Jekyll won't publish posts dated in the future

### Publishing Cadence
- **Target**: Bi-weekly (every 2 weeks)
- **Stretch goal**: Weekly when possible
- **Quality over quantity** - don't force posts

### Pre-Publish Checklist
- [ ] Front matter complete (title, date, image, tags, description)
- [ ] Image optimized and in /img/ directory
- [ ] Image attribution included at end of post
- [ ] Code blocks have proper syntax highlighting
- [ ] Links tested (no broken links)
- [ ] Reading time under 10 minutes
- [ ] SEO description under 160 characters
- [ ] Tags are consistent with existing taxonomy
- [ ] Series metadata added (if applicable)

## Tags & Categories

### Existing Tags
- Anxiety
- Leadership
- Azure
- Governance
- Operations
- Log Analytics

### Tag Guidelines
- Use existing tags when possible
- Create new tags sparingly
- Tags should be broad topics, not specific
- Use PascalCase for multi-word tags
- Maximum 3-4 tags per post

## SEO & Social Sharing

### Meta Description
- 150-160 characters
- Include key topic/benefit
- Natural language, not keyword stuffing
- Should entice clicks from search results

### Social Sharing
- Featured image should be 1200x630px
- Description becomes social share text
- Title should be compelling but not clickbait
- Test how it looks in social preview tools

## Content Ideas & Topics

### Core Topics
- Azure architecture and governance
- Cloud adoption patterns
- Technical leadership
- Managing anxiety in tech
- Career growth and development
- Real-world war stories

### Post Types
- **Technical deep-dives**: Specific Azure features, patterns, solutions
- **Leadership reflections**: Personal experiences, lessons learned
- **Mental health**: Anxiety, burnout, psychological safety
- **Career advice**: Growth, transitions, failures
- **Series**: Multi-part explorations of complex topics

## Automated Checks (To Implement)

### Pre-Commit Checks
- Image optimization verification
- Broken link detection
- Front matter validation
- File naming convention check
- Image attribution check

### Build Checks
- Jekyll build success
- No broken internal links
- All images exist
- Proper syntax highlighting

## Remember

- **This is your space** - write what matters to you
- **Authenticity over perfection** - raw and real beats polished and fake
- **Help others** - if one person solves a problem faster, it matters
- **Mix technical and human** - the intersection is your unique voice
- **Don't over-engineer** - keep the blog simple, focus on content
