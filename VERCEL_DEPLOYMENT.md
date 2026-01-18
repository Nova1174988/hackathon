# 🚀 Fixing Vercel 404 NOT_FOUND Error

## Problem Description

After deploying to Vercel, you're seeing:
```
404: NOT_FOUND
Code: NOT_FOUND
ID: bom1::2lmwg-1768731960839-412c567 f6918
```

## Root Cause

The application uses **client-side routing** (React Router's `BrowserRouter`). When you:
1. Navigate to `https://your-app.vercel.app/` - ✅ Works (index.html exists)
2. Navigate to `https://your-app.vercel.app/login` - ❌ 404 Error (no /login file exists)
3. Refresh on `/dashboard` - ❌ 404 Error (no /dashboard file exists)

Vercel expects actual files for these routes, but React Router handles them in the browser.

## Solution

We've added **three configuration files** to fix this issue:

### 1. Root `vercel.json` (Project Root)
```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Frontend `vercel.json` (Frontend Directory)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 3. Updated `vite.config.ts`
Added PWA navigation fallback configuration:
```typescript
workbox: {
  navigateFallback: '/index.html',
  navigateFallbackDenylist: [/^\/api/, /^\/socket\.io/],
  globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
}
```

## How to Deploy

### Option 1: Deploy from Root Directory

1. Push code to GitHub
2. Import repository in Vercel
3. Use **root directory** as the source
4. Vercel will read `vercel.json` from root
5. It will build `frontend/` and deploy from `frontend/dist/`

### Option 2: Deploy Frontend Directory Only

1. Push code to GitHub
2. Import repository in Vercel
3. Set **Root Directory** to `frontend`
4. Vercel will read `frontend/vercel.json`
5. It will build and deploy normally

## Quick Fix for Existing Deployment

If you already deployed and see 404 errors:

1. **Add `vercel.json` files** (already done in this commit)
2. **Redeploy**:
   ```bash
   # Using Vercel CLI
   vercel --prod
   ```
   OR
   - Push to GitHub → Vercel auto-deploys
   - Or trigger redeploy from Vercel dashboard

3. **Clear build cache** (if needed):
   - Go to Vercel project
   - Settings → Git → Ignored Build Step → Enter `1`
   - Deploy again
   - Remove ignored build step after

## What These Configurations Do

### Rewrites Rule
```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

This tells Vercel:
- For **any** incoming request (`/(.*)`)
- Serve `index.html`
- React Router then takes over and renders the correct page

### PWA Fallback
```typescript
navigateFallback: '/index.html'
```

Service Worker uses `index.html` as fallback for navigation, ensuring:
- Offline navigation works
- Page refresh doesn't break
- Deep links work correctly

### Base Path
```typescript
base: '/'
```
Ensures all assets and routes use correct relative paths.

## Environment Variables

Required for production deployment:

```bash
VITE_API_URL=https://your-backend-domain.com
VITE_SOCKET_URL=https://your-backend-domain.com
VITE_APP_NAME=Hamro Health
```

Add these in:
- Vercel Dashboard → Settings → Environment Variables
- OR `vercel.json` (not recommended for sensitive data)

## Verification

After deployment, test these URLs:

- ✅ `https://your-app.vercel.app/` - Home
- ✅ `https://your-app.vercel.app/login` - Login page (no 404)
- ✅ `https://your-app.vercel.app/dashboard` - Dashboard (if logged in)
- ✅ `https://your-app.vercel.app/symptom-checker` - Symptom Checker
- ✅ Refresh each page - Should still load

## Common Issues & Solutions

### Issue: Still getting 404 after adding vercel.json

**Solution:**
1. Make sure `vercel.json` is in the **root** of the deployed directory
2. Redeploy with production build: `vercel --prod`
3. Clear Vercel build cache

### Issue: API calls failing

**Solution:**
1. Check `VITE_API_URL` environment variable
2. Ensure backend is deployed and accessible
3. Verify CORS settings on backend include your Vercel domain

### Issue: PWA not installing

**Solution:**
1. Must use HTTPS (Vercel provides this)
2. Check service worker is registered
3. Clear browser cache and reload

### Issue: Assets not loading (404 for images, etc.)

**Solution:**
1. Ensure `base: '/'` in `vite.config.ts`
2. Check asset paths are correct in code
3. Verify files exist in `dist/` folder after build

## Backend Deployment

The backend must be deployed separately:

**Options:**
- **Railway**: Easy Node.js/PostgreSQL deployment
- **Render**: Free tier available
- **Heroku**: Paid plans only now
- **AWS/DigitalOcean**: More control, more complex

**Backend endpoints:**
- API: `https://your-backend.com/api/*`
- WebSocket: `https://your-backend.com` (Socket.io)

Update `VITE_API_URL` in Vercel to point to your deployed backend.

## Project Structure

```
hamro-health/
├── vercel.json              # Root Vercel config
├── backend/                 # Node.js/Express backend
├── frontend/                # React frontend
│   ├── vercel.json         # Frontend-specific Vercel config
│   ├── vite.config.ts      # Vite + PWA config
│   ├── index.html
│   └── src/
│       ├── App.tsx         # React Router setup
│       └── ...
└── docker-compose.yml       # Local development
```

## Additional Files Added

1. `vercel.json` - Root deployment config
2. `frontend/vercel.json` - Frontend deployment config
3. `frontend/.vercelignore` - Files to ignore during deployment
4. `frontend/DEPLOYMENT.md` - Detailed deployment guide

## Testing Locally

Before deploying, test the build:

```bash
cd frontend
npm run build
npm run preview
```

Visit `http://localhost:4173` and test navigation and refresh.

## Summary

The 404 error is fixed by:
1. ✅ Adding `vercel.json` with rewrite rules
2. ✅ Configuring PWA fallback in `vite.config.ts`
3. ✅ Setting correct base path
4. ✅ Deploying with proper environment variables

All changes have been applied to the repository. Simply redeploy to Vercel!

## Need Help?

- Vercel Docs: https://vercel.com/docs
- React Router: https://reactrouter.com
- Vite: https://vitejs.dev
