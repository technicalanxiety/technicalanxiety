# Giscus Setup Instructions

To get the correct Giscus configuration for your repository:

1. **Enable Discussions** (if not already enabled):
   - Go to https://github.com/technicalanxiety/technicalanxiety/settings
   - Scroll down to "Features" section
   - Check "Discussions"

2. **Get Giscus Configuration**:
   - Visit https://giscus.app/
   - Enter your repository: `technicalanxiety/technicalanxiety`
   - Choose "Discussion title contains page pathname"
   - Select a discussion category (create "Comments" if it doesn't exist)
   - Choose your preferred features
   - Copy the generated configuration

3. **Update src/config.ts**:
   Replace the giscus section with the values from giscus.app:
   ```typescript
   giscus: {
     repo: 'technicalanxiety/technicalanxiety',
     repoId: 'YOUR_REPO_ID_FROM_GISCUS_APP',
     category: 'Comments',
     categoryId: 'YOUR_CATEGORY_ID_FROM_GISCUS_APP',
   },
   ```

4. **Test the Comments**:
   - Deploy the site
   - Visit a blog post
   - Comments should appear at the bottom

## Current Configuration Status

The GiscusComments component is now properly integrated into the PostLayout.
Once you update the configuration with the correct IDs from giscus.app, 
comments will work on all blog posts.