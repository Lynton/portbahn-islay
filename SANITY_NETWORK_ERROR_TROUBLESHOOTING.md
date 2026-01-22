# Sanity Studio Network Error Troubleshooting

## Error
```
Request error while attempting to reach https://t25lpmnm.api.sanity.io/v2025-02-19/data/actions/production
```

## Quick Fixes

### 1. Check Network Connection
- Ensure you have a stable internet connection
- Try refreshing the page
- Check if other websites load normally

### 2. Clear Browser Cache
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Clear browser cache and cookies for localhost

### 3. Restart Dev Server
```bash
# Stop the dev server (Ctrl+C)
# Then restart
npm run dev
```

### 4. Check Environment Variables
Ensure `.env.local` has correct values:
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

### 5. Verify Sanity Project Access
- Go to https://www.sanity.io/manage
- Verify your project is accessible
- Check if you're logged in with the correct account

### 6. Check API Token (if using)
If you have `SANITY_API_TOKEN` set, ensure it's valid:
- Go to https://www.sanity.io/manage
- API → Tokens
- Verify token has correct permissions

### 7. Try Sanity CLI Login
```bash
npx sanity login
```

### 8. Check for Large Requests
The error shows many patch operations. If editing large arrays:
- Try saving smaller changes
- Edit fields individually rather than all at once
- Save frequently

### 9. Browser Console Check
Open browser DevTools (F12) and check:
- Network tab for failed requests
- Console for additional error messages
- Application tab → Cookies for Sanity session

### 10. Try Different Browser
- Test in Chrome, Firefox, or Safari
- Disable browser extensions temporarily

### 11. Check Firewall/Proxy
- Ensure Sanity API endpoints aren't blocked
- Check corporate firewall settings if applicable

### 12. API Version Mismatch
The error shows API version `v2025-02-19`. We've updated the client to match, but if issues persist:
- Check Sanity status: https://status.sanity.io
- Try updating Sanity packages: `npm update sanity next-sanity`

## If Problem Persists

1. **Check Sanity Status**: https://status.sanity.io
2. **Sanity Support**: https://www.sanity.io/help
3. **GitHub Issues**: Check for known issues with your Sanity version

## Common Causes

- **Network timeout**: Large requests timing out (300s timeout shown)
- **CORS issues**: Browser blocking cross-origin requests
- **Authentication**: Session expired or invalid token
- **API rate limiting**: Too many requests in short time
- **Schema validation**: Invalid data causing API rejection

## Prevention

- Save changes frequently
- Edit fields one at a time for large documents
- Keep Sanity packages updated
- Monitor network tab for request sizes


