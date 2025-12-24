# Giscus Setup Instructions

✅ **Repository is now PUBLIC and ready for Giscus!**

## Quick Setup (5 minutes)

### Step 1: Get Your Configuration
1. Visit **https://giscus.app/**
2. Enter repository: `technicalanxiety/technicalanxiety`
3. Choose **"Discussion title contains page pathname"**
4. Select category: **"General"** (or create "Comments" if you prefer)
5. Choose your preferred features (reactions enabled, etc.)

### Step 2: Copy the Generated Values
From the giscus.app configuration, copy these values:
- `data-repo-id` 
- `data-category-id`

### Step 3: Update src/config.ts
Replace the giscus section with:
```typescript
giscus: {
  repo: 'technicalanxiety/technicalanxiety', // ✅ Already correct
  repoId: 'YOUR_REPO_ID_FROM_GISCUS_APP',     // ← Paste here
  category: 'General',                         // ← Or 'Comments' if you created it
  categoryId: 'YOUR_CATEGORY_ID_FROM_GISCUS_APP', // ← Paste here
},
```

### Step 4: Test
1. Commit and push the changes
2. Visit any blog post on your deployed site
3. Comments should appear at the bottom!

## Current Status

✅ Repository is public  
✅ GitHub Discussions enabled  
✅ GiscusComments component integrated into all blog posts  
✅ Theme synchronization working  
⏳ **Just need to update the IDs from giscus.app**

## Troubleshooting

If comments don't appear:
1. Check browser console for errors
2. Verify the repo ID and category ID are correct
3. Make sure the category exists in GitHub Discussions
4. Try a different discussion category (like "General")

The component includes graceful fallback, so if there are configuration issues, 
users will see a friendly "Comments temporarily unavailable" message.