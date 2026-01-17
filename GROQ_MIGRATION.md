# Groq Migration - Quick Reference

## What Changed
Switched from Hugging Face (deprecated free API) to Groq (active free tier).

## Why Groq?
- **14,400 requests/day** (vs HF's paid-only models)
- **300+ tokens/second** (fastest free option)
- **$0 forever** (no credit card required)
- **Llama 3.3 70B** (high quality responses)
- **OpenAI-compatible API** (minimal code changes)

## Setup Steps

### 1. Get Groq API Key
```bash
# Visit: https://console.groq.com/keys
# Sign up (free, no credit card)
# Create API key
# Copy key (starts with gsk_...)
```

### 2. Local Testing
```bash
# Create .env file
echo "GROQ_API_KEY=gsk_your_key_here" > .env

# Test locally
npm run dev
# Visit http://localhost:4321
# Click chat button, test a message
```

### 3. Azure SWA Configuration
```bash
# Option A: Azure Portal
# Navigate to SWA → Settings → Configuration
# Add: GROQ_API_KEY = gsk_your_key_here

# Option B: Azure CLI
az staticwebapp appsettings set \
    --name ambitious-wave-0d77c1c10 \
    --setting-names GROQ_API_KEY="gsk_your_key_here"
```

### 4. Deploy
```bash
# Commit changes
git add .
git commit -m "Switch to Groq API for chat feature"
git push origin feature/recruiter-chat

# Preview deployment will auto-create
# Add GROQ_API_KEY to preview environment in Azure Portal
```

## Files Modified
- `api/chat/index.js` - Updated to use Groq API
- `.env.example` - Updated with Groq key format
- `docs/RECRUITER_CHAT_SETUP.md` - Full documentation update

## Testing Checklist
- [ ] Get Groq API key from console.groq.com
- [ ] Add to local .env file
- [ ] Test locally (npm run dev)
- [ ] Send test message in chat
- [ ] Verify response received
- [ ] Commit and push to branch
- [ ] Add key to Azure SWA preview environment
- [ ] Test on preview deployment
- [ ] Verify no console errors

## API Details
- **Endpoint**: `https://api.groq.com/openai/v1/chat/completions`
- **Model**: `llama-3.3-70b-versatile`
- **Rate Limit**: 14,400 requests/day, 70K tokens/min
- **Format**: OpenAI-compatible (standard chat completions)

## Cost
**$0/month** - Completely free tier, no credit card required.

## Next Steps
1. Get Groq API key
2. Test locally
3. Deploy to preview
4. Test on preview
5. Merge to main when working
