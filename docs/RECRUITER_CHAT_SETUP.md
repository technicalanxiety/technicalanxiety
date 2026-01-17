# Recruiter Chat Setup Guide

## Overview

POC implementation of an AI chat widget for recruiters to ask questions about Jason's background, skills, and experience. Uses Groq API (free tier) with client-side rate limiting.

## Features

- **Zero cost**: Uses Groq free tier (14,400 requests/day)
- **Fast responses**: 300+ tokens/second inference speed
- **Client-side rate limiting**: 20 messages per day per user
- **No storage**: Conversation history in browser memory only
- **Security**: API key server-side only, input validation
- **Responsive**: Works on mobile and desktop

## Setup Instructions

### 1. Get Groq API Key

1. Go to https://console.groq.com/keys
2. Sign up for free account (no credit card required)
3. Click "Create API Key"
4. Name: `recruiter-chat`
5. Copy the key (starts with `gsk_...`)

### 2. Local Development

Create `.env` file in project root:

```bash
GROQ_API_KEY=gsk_your_actual_key_here
```

**Important**: Never commit `.env` file. It's already in `.gitignore`.

### 3. Azure Static Web App Configuration

Add the key to your SWA configuration:

#### Option A: Azure Portal
1. Navigate to your Static Web App
2. Settings → Configuration
3. Application settings → New setting
4. Name: `GROQ_API_KEY`
5. Value: `gsk_your_key_here`
6. Save

#### Option B: Azure CLI
```bash
az staticwebapp appsettings set \
    --name your-swa-name \
    --setting-names GROQ_API_KEY="gsk_your_key_here"
```

### 4. Test Locally

```bash
# Install dependencies (if needed)
npm install

# Start dev server
npm run dev
```

Visit http://localhost:4321 and click the chat button in bottom-right corner.

## Architecture

```
┌─────────────────┐
│  Browser        │
│  - Chat UI      │
│  - Rate Limit   │
│  - localStorage │
└────────┬────────┘
         │
         │ POST /api/chat
         │
┌────────▼────────┐
│  Azure SWA      │
│  API Function   │
│  - Validation   │
│  - GROQ_API_KEY │
└────────┬────────┘
         │
         │ OpenAI-compatible API
         │
┌────────▼────────┐
│  Groq           │
│  Llama 3.3 70B  │
│  (Free Tier)    │
└─────────────────┘
```

## Rate Limiting

### Client-Side (Current POC)
- 20 messages per day per browser
- Stored in localStorage
- Resets at midnight
- User can bypass (acceptable for POC)

### Future: Server-Side
If abuse becomes an issue, add Azure Table Storage:
- Track by IP address
- More robust enforcement
- Cost: ~$0/month (within free tier)

## Cost Analysis

### Current Setup
- **Groq API**: $0 (free tier: 14,400 requests/day, 70K tokens/min)
- **Azure SWA Functions**: $0 (included in free tier)
- **Storage**: $0 (client-side only)

**Total: $0/month**

### Performance
- **Response time**: ~1-2 seconds (300+ tokens/second)
- **Model**: Llama 3.3 70B (high quality responses)
- **Daily capacity**: 14,400 requests (far exceeds expected usage)

### Worst Case (Abuse)
- Groq rate limits kick in (429 errors)
- Chat becomes temporarily unavailable
- No unexpected costs

## Security Considerations

### Implemented
- ✅ API token server-side only (never exposed to client)
- ✅ Input validation (length, type checking)
- ✅ Rate limiting (client-side)
- ✅ Error handling (no sensitive info leaked)
- ✅ HTTPS only (enforced by Azure SWA)

### Not Implemented (POC)
- ❌ Server-side rate limiting
- ❌ Request logging/analytics
- ❌ IP-based blocking
- ❌ CAPTCHA for abuse prevention

## Customization

### Update System Prompt
Edit `api/chat/index.js` to modify Jason's background info in the system prompt.

### Change Model
Edit `api/chat/index.js` line ~140 to use different Groq model:
- `llama-3.3-70b-versatile` (current, best quality)
- `llama-3.1-70b-versatile` (alternative)
- `mixtral-8x7b-32768` (longer context)

Available models: https://console.groq.com/docs/models

### Adjust Rate Limits
Edit `src/components/RecruiterChat.astro` line 149:
```javascript
const RATE_LIMIT = {
  maxPerDay: 20, // Change this number
  storageKey: 'chat-usage'
};
```

### Styling
All styles are in `src/components/RecruiterChat.astro` `<style>` section.
Uses CSS variables from theme for consistency.

## Monitoring

### Check Usage
1. Browser DevTools → Application → Local Storage
2. Look for `chat-usage` key
3. Shows count and date

### Check Errors
1. Browser DevTools → Console
2. Look for "Chat error:" messages
3. Check Network tab for API failures

### Azure Logs
```bash
# View function logs
az staticwebapp functions log \
    --name your-swa-name \
    --function-name chat
```

## Troubleshooting

### Chat button not appearing
- Check browser console for errors
- Verify RecruiterChat component imported in BaseLayout.astro

### "Service configuration error"
- GROQ_API_KEY not set in environment
- Check Azure SWA application settings
- Verify key starts with `gsk_`

### "Service temporarily unavailable"
- Hit Groq rate limit (14,400/day - unlikely)
- Check Groq console for API status
- Wait a few minutes and try again

### "Daily limit reached"
- User hit 20 message limit
- Resets at midnight local time
- Clear localStorage to reset (testing only)

## Future Enhancements

### Phase 2 (If Successful)
- Server-side rate limiting with Azure Table Storage
- Analytics dashboard (conversation topics, usage patterns)
- A/B testing different models
- Conversation export for recruiters

### Phase 3 (Production)
- Consider paid tier for higher quality (if needed)
- Add CAPTCHA for abuse prevention
- Implement conversation persistence
- Email notifications for high-value conversations

## Testing Checklist

- [ ] Chat button appears on all pages
- [ ] Can open/close chat window
- [ ] Can send messages and receive responses
- [ ] Rate limit counter updates
- [ ] Rate limit enforced at 20 messages
- [ ] Works on mobile devices
- [ ] No console errors
- [ ] API token not exposed in browser

## Support

For issues or questions:
- Check Azure SWA logs
- Review Groq API status: https://status.groq.com
- Verify environment variables set correctly
- Test with curl to isolate UI vs API issues

```bash
# Test API directly
curl -X POST http://localhost:4321/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is Jason'\''s experience with Azure?"}'
```
