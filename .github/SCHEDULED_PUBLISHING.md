# Scheduled Post Publishing

## Overview
This repository uses GitHub Actions to automatically publish blog posts on their scheduled dates. Posts are staged in `_posts/backlog/` and automatically moved to `_posts/` when their date arrives.

## How It Works

### 1. Staging Posts
- Place draft posts in `_posts/backlog/` directory
- Set the `date:` field in the front matter to your desired publish date
- Posts will remain in backlog until that date

### 2. Automatic Publishing
- GitHub Action runs daily at 9 AM UTC
- Checks all posts in `_posts/backlog/`
- Moves posts dated today or earlier to `_posts/`
- Commits and pushes the changes
- GitHub Pages automatically rebuilds the site

### 3. Manual Publishing
You can also trigger publishing manually:
1. Go to the **Actions** tab in GitHub
2. Select **Publish Scheduled Posts** workflow
3. Click **Run workflow**
4. This will immediately publish any posts that are due

## Example Post Front Matter

```yaml
---
layout: post
title: "My Awesome Post"
date: 2024-12-01 09:00:00
description: "This post will publish on December 1st, 2024"
image: '/img/my-post.jpg'
tags: [azure, leadership]
---
```

## Workflow Schedule

The workflow runs:
- **Automatically**: Daily at 9 AM UTC (4 AM EST / 1 AM PST)
- **Manually**: On-demand via GitHub Actions interface

To change the schedule, edit `.github/workflows/publish-scheduled-posts.yml` and modify the cron expression:
```yaml
schedule:
  - cron: '0 9 * * *'  # Minute Hour Day Month DayOfWeek
```

## Benefits

✓ **Set and forget**: Write posts in advance, set dates, and they publish automatically  
✓ **No manual intervention**: No need to remember to publish posts  
✓ **Version controlled**: All posts are tracked in Git  
✓ **Flexible**: Can still manually publish anytime via Actions tab  
✓ **Safe**: Posts stay in backlog until their date, preventing accidental early publishing

## Troubleshooting

### Posts not publishing?
1. Check the Actions tab for workflow run status
2. Verify the post date is today or earlier
3. Ensure the post is in `_posts/backlog/` directory
4. Check that the date format is correct: `YYYY-MM-DD`

### Want to publish immediately?
1. Move the post manually from `_posts/backlog/` to `_posts/`
2. Or trigger the workflow manually from Actions tab

### Change timezone?
The workflow uses UTC. To adjust for your timezone:
- 9 AM UTC = 4 AM EST = 1 AM PST
- Modify the cron schedule in the workflow file

## Notes

- The workflow adds `[skip ci]` to commit messages to prevent infinite loops
- Posts are moved (not copied), so they disappear from backlog when published
- GitHub Actions scheduled runs may be delayed up to 15 minutes during high load
- The workflow requires no secrets or special permissions - uses default `GITHUB_TOKEN`
