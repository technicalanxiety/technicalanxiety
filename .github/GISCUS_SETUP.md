# Giscus Comments Setup Guide

Giscus is a comments system powered by GitHub Discussions. It's free, open-source, and perfect for technical blogs.

## Why Giscus?

- ✅ **Free forever** - No ads, no tracking
- ✅ **GitHub-based** - Your audience already has accounts
- ✅ **Privacy-friendly** - No third-party tracking
- ✅ **Markdown support** - Code blocks, formatting, etc.
- ✅ **Reactions** - GitHub emoji reactions
- ✅ **Moderation** - Full control via GitHub
- ✅ **Theme-aware** - Automatically matches light/dark mode

## Setup Steps

### 1. Enable GitHub Discussions

1. Go to your repo: https://github.com/technicalanxiety/technicalanxiety.github.io
2. Click **Settings**
3. Scroll to **Features** section
4. Check **Discussions**

### 2. Create a Comments Category

1. Go to **Discussions** tab in your repo
2. Click the gear icon next to "Categories"
3. Click **New category**
4. Name it: **Comments**
5. Description: "Blog post comments"
6. Discussion format: **Announcement** (only you can create new discussions, but anyone can comment)

### 3. Install Giscus App

1. Go to: https://github.com/apps/giscus
2. Click **Install**
3. Select **Only select repositories**
4. Choose: `technicalanxiety/technicalanxiety.github.io`
5. Click **Install**

### 4. Get Your Configuration

1. Go to: https://giscus.app/
2. Fill in the form:
   - **Repository**: `technicalanxiety/technicalanxiety.github.io`
   - **Page ↔️ Discussions Mapping**: pathname
   - **Discussion Category**: Comments
   - **Features**: Enable reactions
   - **Theme**: preferred_color_scheme

3. Scroll down to see the generated script
4. Copy these values:
   - `data-repo-id`
   - `data-category-id`

### 5. Update _config.yml

Open `_config.yml` and update the giscus section:

```yaml
giscus:
  repo: "technicalanxiety/technicalanxiety.github.io"
  repo_id: "YOUR_REPO_ID_HERE"  # From giscus.app
  category: "Comments"
  category_id: "YOUR_CATEGORY_ID_HERE"  # From giscus.app
```

### 6. Test It

1. Build your site: `bundle exec jekyll build`
2. Serve locally: `bundle exec jekyll serve`
3. Open a blog post
4. Scroll to the bottom
5. You should see the Giscus comment box

### 7. Deploy

```bash
git add .
git commit -m "feat: Switch from Disqus to Giscus comments"
git push origin master
```

## Features

### For Readers
- Comment using their GitHub account
- Markdown formatting with code blocks
- React with emoji
- Get notifications for replies
- Edit/delete their own comments

### For You (Moderator)
- Full moderation control via GitHub
- Lock/unlock discussions
- Hide/delete comments
- Pin important comments
- Export all comments (they're in your repo)

## Moderation

All comments are GitHub Discussions, so you can moderate them at:
https://github.com/technicalanxiety/technicalanxiety.github.io/discussions

### Common Actions
- **Hide spam**: Click "..." → Hide comment
- **Lock discussion**: Click "Lock conversation"
- **Pin comment**: Click "..." → Pin comment
- **Convert to issue**: Click "..." → Convert to issue

## Privacy

Giscus is privacy-friendly:
- No tracking cookies
- No ads
- No data selling
- Open source
- Self-hosted option available

## Troubleshooting

### Comments not showing?
1. Check that Discussions are enabled
2. Verify repo_id and category_id are correct
3. Make sure Giscus app is installed
4. Check browser console for errors

### Wrong theme?
Giscus uses `data-theme="preferred_color_scheme"` which automatically matches your site's theme toggle.

### Want to migrate from Disqus?
Unfortunately, there's no automated way to migrate Disqus comments to Giscus. You can:
1. Export Disqus comments (XML)
2. Manually recreate important discussions
3. Or keep Disqus archive link in old posts

## Customization

### Change theme manually
Edit `_includes/giscus-comments.html` and change:
```html
data-theme="preferred_color_scheme"
```

To one of:
- `light` - Always light
- dark` - Always dark
- `dark_dimmed` - GitHub dark dimmed
- `transparent_dark` - Transparent dark

### Change position
Edit `data-input-position`:
- `top` - Comment box at top (current)
- `bottom` - Comment box at bottom

### Disable reactions
Edit `data-reactions-enabled`:
- `1` - Enabled (current)
- `0` - Disabled

## Support

- Giscus docs: https://giscus.app/
- GitHub: https://github.com/giscus/giscus
- Discussions: https://github.com/giscus/giscus/discussions

---

**Result**: Your blog now has a modern, privacy-friendly comment system! 💬
