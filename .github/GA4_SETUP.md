# Google Analytics 4 Setup Guide

Your blog has been updated to support Google Analytics 4 (GA4). The old Universal Analytics (UA-155892178-1) was shut down by Google in July 2023.

## Steps to Complete Setup

### 1. Create a GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon in bottom left)
3. In the **Property** column, click **Create Property**
4. Enter property details:
   - Property name: `Technical Anxiety Blog`
   - Reporting time zone: Your timezone
   - Currency: USD (or your preference)
5. Click **Next**
6. Fill in business details and click **Create**
7. Accept the Terms of Service

### 2. Set Up Data Stream

1. Click **Web** as your platform
2. Enter your website details:
   - Website URL: `https://technicalanxiety.com`
   - Stream name: `Technical Anxiety`
3. Click **Create stream**

### 3. Get Your Measurement ID

After creating the stream, you'll see your **Measurement ID** in the format: `G-XXXXXXXXXX`

Copy this ID.

### 4. Update Your Blog Configuration

Edit `_config.yml` and replace the google-analytics line:

```yaml
google-analytics: G-XXXXXXXXXX  # Replace with your actual Measurement ID
```

### 5. Deploy and Verify

1. Commit and push your changes
2. Wait for your site to rebuild
3. Visit your website
4. In GA4, go to **Reports** → **Realtime** to see if your visit is tracked

## What Changed

- ✅ Updated from Universal Analytics (UA) to Google Analytics 4 (GA4)
- ✅ Added modern gtag.js tracking code
- ✅ Tracking code only loads when `google-analytics` is configured
- ✅ Improved page load performance with async loading

## Privacy Considerations

GA4 is more privacy-focused than Universal Analytics, but consider:

- Adding a privacy policy page
- Informing users about analytics in your footer
- Consider cookie consent if required in your jurisdiction
- Review GA4 data retention settings (default is 2 months)

## Alternative Analytics

If you prefer privacy-focused alternatives to Google Analytics:

- **Plausible** - Simple, privacy-friendly, GDPR compliant
- **Fathom** - Privacy-first, no cookies
- **Umami** - Open source, self-hosted option
- **GoatCounter** - Open source, lightweight

## Resources

- [GA4 Documentation](https://support.google.com/analytics/answer/10089681)
- [GA4 vs Universal Analytics](https://support.google.com/analytics/answer/11583528)
- [GA4 Privacy Controls](https://support.google.com/analytics/answer/9019185)
