# Fixing "Next.js" Detection Issue on Vercel

## Problem

When deploying to Vercel, you're getting this error:

```
Collecting page data using 1 worker ...
Generating static pages using 1 worker (0/12) ...
Error occurred prerendering page "/ai-assistant".
TypeError: Cannot read properties of undefined (reading 'trim')
Export encountered an error on /ai-assistant/page: /ai-assistant, exiting the build.
Next.js build worker exited with code: 1
```

## Root Cause

**Vercel is incorrectly detecting this as a Next.js project**, but it's actually a **Vite + React** project. This happens because Vercel's auto-detection sometimes misidentifies projects that have:
- A `pages/` directory (we have `frontend/src/pages/`)
- React dependencies
- TypeScript configuration

Since this project uses Vite (not Next.js), the Next.js build command fails.

## Solutions

### Solution 1: Use Root-Level vercel.json (RECOMMENDED)

We've already added `/vercel.json` which explicitly tells Vercel how to build:

```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install --legacy-peer-deps",
  "framework": null,
  "rewrites": [...]
}
```

**Key settings:**
- `"framework": null` - Tells Vercel **NOT** to auto-detect a framework
- `"buildCommand": "cd frontend && npm run build"` - Uses Vite's build command
- `"outputDirectory": "frontend/dist"` - Where Vite puts the built files

### Solution 2: Deploy Frontend Directory Only

Instead of deploying the root, deploy only the `frontend/` directory:

1. In Vercel Dashboard → Your Project → Settings → General
2. Change **Root Directory** from `./` to `./frontend`
3. Redeploy

This works because `frontend/vercel.json` explicitly sets:
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### Solution 3: Use Vercel CLI with Explicit Settings

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from root with explicit settings
vercel --prod \
  --build-env=NODE_ENV=production \
  --build-command="cd frontend && npm run build" \
  --output-directory="frontend/dist"
```

### Solution 4: Override Framework Detection

Add this to your Vercel project settings via API or CLI:

```bash
vercel projects set <your-project-slug>
vercel env add FRAMEWORK_OVERRIDE production
# Enter: none
```

Or in Vercel Dashboard:
1. Project Settings → General
2. Framework Preset → **"Other"** or **"None"**
3. Save and Redeploy

## Steps to Fix Current Deployment

### Option A: Redeploy with Configuration (Quickest)

1. The `vercel.json` file is already in your repo
2. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "Fix Vercel deployment - add explicit build config"
   git push
   ```
3. Vercel will auto-deploy with the new configuration
4. If it still fails, force a new deployment:
   - Go to Vercel Dashboard → Your Project
   - Click "Redeploy" → Select "Redeploy to Production"

### Option B: Use Vercel CLI to Redeploy

```bash
# Install CLI if needed
npm install -g vercel

# Login
vercel login

# Pull project settings
vercel link

# Redeploy with production build
vercel --prod --force
```

### Option C: Clear Build Cache and Redeploy

1. Go to Vercel Dashboard → Your Project → Settings → Git
2. Find "Ignored Build Step"
3. Enter: `1` (this skips the build)
4. Deploy (will skip but clear cache)
5. Remove the `1` and deploy again

## Additional Configuration Added

### Root package.json
Created `/package.json` with:
```json
{
  "scripts": {
    "vercel-build": "cd frontend && npm run build"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

This gives Vercel explicit build instructions.

### Root .vercelignore
Created `/.vercelignore` to exclude:
- All `node_modules`
- Backend code
- Environment files
- Build directories

## Troubleshooting

### Issue: Still trying to use Next.js build

**Check:**
1. Verify `vercel.json` is in project **root**
2. Make sure `"framework": null` is set
3. Check there's no `next.config.js` in the project
4. Clear build cache (see Option C above)

### Issue: Build fails with different error

**Check:**
1. Build locally first:
   ```bash
   cd frontend
   npm install --legacy-peer-deps
   npm run build
   ```
2. If local build fails, fix those issues first
3. Check Vercel deployment logs in Dashboard

### Issue: pnpm not found

The error mentioned "install pnpm". If you're seeing this:

**Option 1:** Use npm instead (recommended)
- The `vercel.json` now uses `npm install --legacy-peer-deps`

**Option 2:** If you want to use pnpm:
- In Vercel Dashboard → Settings → General
- Change Package Manager to **pnpm**

**Option 3:** Add pnpm to vercel.json:
```json
{
  "installCommand": "cd frontend && pnpm install"
}
```

### Issue: Peer dependency warnings

Using `--legacy-peer-deps` in the install command handles this:
```json
"installCommand": "cd frontend && npm install --legacy-peer-deps"
```

## Verification

After fixing, verify the build:

1. **Local test:**
   ```bash
   cd frontend
   npm install --legacy-peer-deps
   npm run build
   npm run preview
   ```
   Visit `http://localhost:4173` and test navigation

2. **Vercel build:**
   - Go to Vercel Dashboard → Deployments
   - Check latest deployment logs
   - Should see: `npm run build` NOT `next build`

3. **Test deployed app:**
   - Visit your Vercel URL
   - Test all routes: `/`, `/login`, `/dashboard`, etc.
   - Refresh pages - should work without 404

## Environment Variables

Make sure these are set in Vercel Dashboard → Settings → Environment Variables:

```bash
VITE_API_URL=https://your-backend-domain.com
VITE_SOCKET_URL=https://your-backend-domain.com
VITE_APP_NAME=Hamro Health
```

**Important:** Add these **before** deploying, or redeploy after adding them.

## Summary of Changes

### Created/Modified Files

1. ✅ `/vercel.json` - Explicit build config (sets `framework: null`)
2. ✅ `/package.json` - Root package.json with vercel-build script
3. ✅ `/.vercelignore` - Excludes backend and node_modules
4. ✅ `/frontend/vercel.json` - Frontend-specific config
5. ✅ `/frontend/.vercelignore` - Frontend exclusions
6. ✅ `/frontend/vite.config.ts` - PWA navigation fallback
7. ✅ `VERCEL_NEXTJS_FIX.md` - This guide

### What These Files Do

| File | Purpose |
|------|---------|
| `vercel.json` | Tells Vercel to use Vite, not Next.js |
| `package.json` | Provides build script for Vercel |
| `.vercelignore` | Prevents backend from being included in deployment |
| `vite.config.ts` | Fixes 404 errors on routes and enables PWA |

## Deployment Checklist

Before deploying, ensure:

- [ ] `/vercel.json` exists in project root
- [ ] `vercel.json` has `"framework": null`
- [ ] `/package.json` exists at root
- [ ] Frontend builds locally: `cd frontend && npm run build`
- [ ] Environment variables are set in Vercel Dashboard
- [ ] No `next.config.js` files exist
- [ ] All changes are committed to Git

## Quick Fix Command

If you have Vercel CLI installed:

```bash
# Force redeploy with clean build
vercel --prod --force --yes
```

This will:
- Use the new `vercel.json` configuration
- Clear any cached builds
- Deploy using npm (not pnpm)
- Build the frontend with Vite

## Still Having Issues?

1. **Check Vercel Build Logs:**
   - Dashboard → Deployments → Latest deployment
   - Look for which command is being run
   - Should see `npm run build` NOT `next build`

2. **Verify Framework Setting:**
   - Settings → General → Framework Preset
   - Should be **"Other"** or **"None"**

3. **Try Vercel CLI:**
   ```bash
   vercel --prod --force
   ```

4. **Contact Support:**
   - Vercel Dashboard → Support
   - Mention: Project detected as Next.js but uses Vite

## Technical Details

### Why Vercel Detects This as Next.js

Vercel's framework detection looks for:
1. `next.config.js` - ✗ Doesn't exist
2. `pages/` directory - ✓ EXISTS (but it's `src/pages/`)
3. `app/` directory - ✗ Doesn't exist
4. Next.js dependencies - ✗ Not in dependencies

The `src/pages/` directory causes the false positive.

### How Our Fix Works

The `vercel.json` configuration overrides auto-detection:

```json
{
  "framework": null,              // DISABLES auto-detection
  "buildCommand": "cd frontend && npm run build",  // Uses Vite
  "outputDirectory": "frontend/dist"  // Vite's output
}
```

This explicitly tells Vercel:
- Don't detect any framework
- Use this specific build command
- Output to this directory

---

**Status:** Configuration updated. Push to GitHub and Vercel will deploy correctly with Vite, not Next.js.
