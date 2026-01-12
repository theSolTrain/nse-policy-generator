# Vercel Deployment Guide

## Special Considerations

### 1. Playwright Setup

Playwright with full Chromium is too large for Vercel's serverless functions (50MB limit). We need to use a lightweight alternative.

**Option A: Use @playwright/browser-chromium (Recommended)**

This is optimized for serverless environments:

```bash
npm install @playwright/browser-chromium playwright-core
```

Then update `lib/pdf/render.ts` to use it.

**Option B: Use playwright-core with CDN browser**

Use playwright-core and download browser on-demand from CDN.

### 2. Function Timeout

PDF generation can take time. The `vercel.json` file sets `maxDuration: 30` seconds.

### 3. Environment Variables

No special environment variables needed for MVP.

## Deployment Steps

1. **Push to GitHub/GitLab/Bitbucket**

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Next.js

3. **Build Settings** (should auto-detect):
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Deploy!**

## Post-Deployment

- Check function logs if PDF generation fails
- Monitor function execution time
- Consider upgrading to Pro plan if you hit timeout limits
