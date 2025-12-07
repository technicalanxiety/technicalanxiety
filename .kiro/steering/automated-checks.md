---
inclusion: manual
---

# Automated Checks for Technical Anxiety Blog

This document defines automated checks that should be implemented for the blog.

## Pre-Commit Checks

### Image Optimization Check
**Purpose**: Ensure all images are optimized before commit

**Check**:
- Verify images in /img/ are under 200KB
- Check image dimensions match standards (1200x630 for featured)
- Warn if images are unoptimized

**Implementation**: Git pre-commit hook or GitHub Action

### Front Matter Validation
**Purpose**: Ensure all posts have valid front matter

**Required Fields**:
- layout: post
- title: (non-empty string)
- date: (valid date format)
- image: (file exists in /img/)
- tags: (array with at least one tag)
- description: (string, 150-160 characters)

**Optional Fields**:
- series: (string)
- series_part: (number)

**Implementation**: Python script or Ruby validator

### File Naming Convention
**Purpose**: Ensure posts follow naming convention

**Pattern**: `YYYY-MM-DD-post-slug.md`

**Checks**:
- Date format is valid
- Slug is lowercase with hyphens
- File extension is .md

### Image Attribution Check
**Purpose**: Ensure Unsplash images have proper attribution

**Check**:
- If image is from Unsplash, verify attribution exists
- Pattern: `**Photo by [Name](url) on [Unsplash](url)**`
- Warn if attribution is missing

## Build-Time Checks

### Broken Link Detection
**Purpose**: Find broken internal and external links

**Checks**:
- Internal links point to existing pages/posts
- External links return 200 status (with caching)
- Anchor links point to existing headers

**Tools**: html-proofer gem or similar

**Implementation**:
```bash
bundle exec htmlproofer ./_site \
  --disable-external \
  --allow-hash-href \
  --assume-extension
```

### Image Existence Check
**Purpose**: Verify all referenced images exist

**Checks**:
- Front matter image exists in /img/
- Inline images exist
- No broken image references

### Syntax Highlighting Check
**Purpose**: Ensure code blocks have language tags

**Check**:
- Find code blocks without language specification
- Warn if ``` without language tag
- Suggest appropriate language tag

### Reading Time Validation
**Purpose**: Ensure posts are under 10 minute read time

**Check**:
- Calculate word count
- Estimate reading time (200 words/minute)
- Warn if over 2,500 words (~10 minutes)

## Post-Publish Checks

### Social Media Preview
**Purpose**: Verify social sharing looks correct

**Checks**:
- Featured image is 1200x630px
- Title is under 60 characters
- Description is 150-160 characters
- Open Graph tags are correct

**Tools**: Social media preview tools

### SEO Validation
**Purpose**: Ensure SEO best practices

**Checks**:
- Title tag present and appropriate length
- Meta description present and appropriate length
- Headers used properly (H1 → H2 → H3)
- Alt text on images
- Internal linking present

### Accessibility Check
**Purpose**: Ensure content is accessible

**Checks**:
- Images have alt text
- Links have descriptive text (not "click here")
- Color contrast is sufficient
- Headers are in logical order

## Scheduled Checks

### Weekly Checks
- Scan for broken external links
- Check for outdated dependencies (Dependabot)
- Review analytics for popular posts
- Check for comments needing response

### Monthly Checks
- Review and update tags/categories
- Audit image sizes and optimization
- Check site performance (PageSpeed Insights)
- Review and update internal links

## Implementation Priority

### Phase 1 (High Priority)
1. Front matter validation
2. Image existence check
3. File naming convention check
4. Broken internal link detection

### Phase 2 (Medium Priority)
1. Image optimization check
2. Image attribution check
3. Reading time validation
4. Syntax highlighting check

### Phase 3 (Low Priority)
1. External link checking (with caching)
2. SEO validation
3. Accessibility check
4. Social media preview validation

## GitHub Actions Workflow Example

```yaml
name: Blog Quality Checks

on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]

jobs:
  validate:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Ruby
      uses: ruby/setup-ruby@v1
      with:
        ruby-version: 3.2
        bundler-cache: true
    
    - name: Build Jekyll site
      run: bundle exec jekyll build
    
    - name: Validate front matter
      run: |
        # Python script to validate front matter
        python scripts/validate-frontmatter.py
    
    - name: Check for broken links
      run: |
        bundle exec htmlproofer ./_site \
          --disable-external \
          --allow-hash-href \
          --assume-extension
    
    - name: Validate images
      run: |
        # Check all images exist and are optimized
        python scripts/validate-images.py
    
    - name: Check reading time
      run: |
        # Warn if posts are too long
        python scripts/check-reading-time.py
```

## Scripts to Create

### validate-frontmatter.py
```python
"""Validate front matter in blog posts."""
import os
import yaml
from pathlib import Path

def validate_post(filepath):
    """Validate a single post's front matter."""
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Extract front matter
    if not content.startswith('---'):
        return False, "Missing front matter"
    
    parts = content.split('---', 2)
    if len(parts) < 3:
        return False, "Invalid front matter format"
    
    try:
        front_matter = yaml.safe_load(parts[1])
    except yaml.YAMLError as e:
        return False, f"Invalid YAML: {e}"
    
    # Check required fields
    required = ['layout', 'title', 'date', 'image', 'tags', 'description']
    for field in required:
        if field not in front_matter:
            return False, f"Missing required field: {field}"
    
    # Validate description length
    desc = front_matter['description']
    if len(desc) < 150 or len(desc) > 160:
        return False, f"Description should be 150-160 chars, got {len(desc)}"
    
    # Check image exists
    image_path = Path('img') / front_matter['image']
    if not image_path.exists():
        return False, f"Image not found: {image_path}"
    
    return True, "Valid"

# Run validation on all posts
posts_dir = Path('_posts')
errors = []

for post in posts_dir.glob('*.md'):
    valid, message = validate_post(post)
    if not valid:
        errors.append(f"{post.name}: {message}")

if errors:
    print("Validation errors found:")
    for error in errors:
        print(f"  - {error}")
    exit(1)
else:
    print("All posts validated successfully!")
```

### validate-images.py
```python
"""Validate images in blog posts."""
import os
from pathlib import Path
from PIL import Image

def check_image_size(filepath):
    """Check if image is optimized."""
    size = os.path.getsize(filepath)
    if size > 200 * 1024:  # 200KB
        return False, f"Image too large: {size / 1024:.0f}KB"
    return True, "OK"

def check_image_dimensions(filepath):
    """Check if featured image has correct dimensions."""
    with Image.open(filepath) as img:
        width, height = img.size
        if width != 1200 or height != 630:
            return False, f"Expected 1200x630, got {width}x{height}"
    return True, "OK"

# Check all images
img_dir = Path('img')
warnings = []

for img_file in img_dir.glob('*.jpg'):
    # Check size
    valid, message = check_image_size(img_file)
    if not valid:
        warnings.append(f"{img_file.name}: {message}")
    
    # Check dimensions for featured images
    # (Skip if image is clearly not a featured image)
    if img_file.stat().st_size > 50 * 1024:  # Likely a featured image
        valid, message = check_image_dimensions(img_file)
        if not valid:
            warnings.append(f"{img_file.name}: {message}")

if warnings:
    print("Image optimization warnings:")
    for warning in warnings:
        print(f"  - {warning}")
    # Don't fail build, just warn
else:
    print("All images validated successfully!")
```

### check-reading-time.py
```python
"""Check reading time for blog posts."""
from pathlib import Path
import re

def estimate_reading_time(filepath):
    """Estimate reading time in minutes."""
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Remove front matter
    content = re.sub(r'^---.*?---', '', content, flags=re.DOTALL)
    
    # Count words
    words = len(content.split())
    
    # Estimate time (200 words per minute)
    minutes = words / 200
    
    return minutes, words

# Check all posts
posts_dir = Path('_posts')
warnings = []

for post in posts_dir.glob('*.md'):
    minutes, words = estimate_reading_time(post)
    if minutes > 10:
        warnings.append(
            f"{post.name}: {minutes:.1f} min read ({words} words) - "
            f"Consider splitting or reducing"
        )

if warnings:
    print("Reading time warnings:")
    for warning in warnings:
        print(f"  - {warning}")
else:
    print("All posts are within target reading time!")
```

## Usage

These checks can be run:
1. **Locally** before committing
2. **In CI/CD** via GitHub Actions
3. **As git hooks** for automatic validation

## Remember

- Checks should help, not hinder
- Warnings are okay, not everything needs to fail the build
- Focus on high-value checks first
- Keep checks fast (< 30 seconds total)
- Make it easy to run locally
