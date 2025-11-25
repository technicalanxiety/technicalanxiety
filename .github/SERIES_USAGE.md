# Series Feature Usage Guide

## Overview
Your site now supports multi-part blog series with automatic navigation.

## How to Use

### 1. Add Series Metadata to Front Matter

Add two fields to each post in a series:

```yaml
---
layout: post
title: "Your Post Title - Part 1"
date: 2025-12-02 00:00:00 -0600
image: your-image.jpg
tags: [YourTags]
series: "Series Name"        # Must match exactly across all parts
series_part: 1               # Numeric part number
---
```

### 2. Series Name Must Match Exactly

All posts in the same series must have the **exact same** `series` value:

**Good:**
- Post 1: `series: "Decide or Drown"`
- Post 2: `series: "Decide or Drown"`
- Post 3: `series: "Decide or Drown"`

**Bad (won't work):**
- Post 1: `series: "Decide or Drown"`
- Post 2: `series: "Decide Or Drown"`  ← Different capitalization
- Post 3: `series: "Decide or Drown "`  ← Extra space

### 3. Part Numbers

Use sequential integers starting from 1:
- Part 1: `series_part: 1`
- Part 2: `series_part: 2`
- Part 3: `series_part: 3`

### 4. What You Get

When a post has series metadata, readers will see:
- A navigation box showing all parts in the series
- Current part highlighted
- Links to other parts
- Automatic ordering by part number

### 5. Example Front Matter

**Decide or Drown - Part 1:**
```yaml
---
layout: post
title: "Decide or Drown - Part 1"
date: 2025-12-02 00:00:00 -0600
image: template.jpg
tags: [Leadership]
series: "Decide or Drown"
series_part: 1
---
```

**What Architects Actually Do - Part 2:**
```yaml
---
layout: post
title: "What Architects Actually Do - Part 2"
date: 2025-12-09 00:00:00 -0600
image: template.jpg
tags: [Leadership, Architecture]
series: "What Architects Actually Do"
series_part: 2
---
```

## Your Current Series

### Series 1: "Decide or Drown"
- Part 1: The Illusion of Choice
- Part 2: Technical Gluttony
- Part 3: (TBD)

### Series 2: "What Architects Actually Do"
- Part 1: The Translation Layer
- Part 2: Translation in Practice
- Part 3: Earning Technical Credibility

## Notes

- You can remove manual series links from post content - the navigation is automatic
- Series navigation appears right after the post title
- Works with your existing tags and related posts features
- No changes needed to existing non-series posts
