# Refresh Social Media Cache

When you see Facebook's message about images being "processed asynchronously", here's how to force a refresh:

## 🔄 Facebook Debugger
1. Visit: https://developers.facebook.com/tools/debug/
2. Enter your blog post URL (e.g., `https://technicalanxiety.com/your-post/`)
3. Click "Debug"
4. Click "Scrape Again" to force Facebook to re-fetch the page
5. Verify the image appears correctly

## 🐦 Twitter Card Validator
1. Visit: https://cards-dev.twitter.com/validator
2. Enter your blog post URL
3. Click "Preview card"
4. Verify the image and metadata appear correctly

## 💼 LinkedIn Post Inspector
1. Visit: https://www.linkedin.com/post-inspector/
2. Enter your blog post URL
3. Click "Inspect"
4. Verify the preview looks correct

## 🔧 What We've Enhanced

The meta tags now include:
- ✅ `og:image:width` and `og:image:height` (1200x630)
- ✅ `og:image:type` (image/png)
- ✅ `og:image:alt` for accessibility
- ✅ `twitter:image:alt` for Twitter accessibility
- ✅ Proper image dimensions for both platforms

## 📝 Tips for Better Social Sharing

1. **Always test new posts** with the debuggers above
2. **Wait a few minutes** after publishing before testing
3. **Use "Scrape Again"** if the image doesn't appear immediately
4. **Check mobile previews** as well as desktop
5. **Verify the image URL** is accessible directly

## 🚨 Common Issues

- **404 on image**: Check that static assets are serving correctly
- **Wrong dimensions**: Verify image is exactly 1200x630px
- **Cache issues**: Use "Scrape Again" in Facebook debugger
- **HTTPS required**: Ensure all URLs use HTTPS

Your social share image should now work perfectly across all platforms!