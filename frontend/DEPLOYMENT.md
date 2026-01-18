# Vercel Deployment Guide

This guide explains how to deploy the Hamro Health frontend to Vercel and fix common 404 errors.

## Prerequisites

- Vercel account (free tier works)
- GitHub repository with the project code
- Backend API deployed and accessible

## Deployment Steps

### 1. Prepare for Deployment

Make sure your `frontend/vercel.json` is properly configured:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "cleanUrls": true
}
```

### 2. Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and log in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   - `VITE_API_URL`: Your deployed backend API URL
   - `VITE_SOCKET_URL`: Your deployed backend WebSocket URL
6. Click "Deploy"

### 3. Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel
```

## Fixing 404 NOT_FOUND Errors

### Problem
When deploying a React app with client-side routing (BrowserRouter) to Vercel, direct navigation to routes like `/login` or `/dashboard` results in 404 errors. This happens because:

- Vercel looks for actual files matching these paths
- These routes don't exist as physical files
- They're handled client-side by React Router

### Solutions

#### 1. Use vercel.json Rewrites (Primary Solution)
The `vercel.json` file in the `frontend/` directory contains rewrite rules that tell Vercel to serve `index.html` for all routes:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### 2. Configure PWA Service Worker
The `vite.config.ts` includes PWA configuration to handle offline navigation:

```typescript
workbox: {
  navigateFallback: '/index.html',
  navigateFallbackDenylist: [/^\/api/, /^\/socket\.io/],
}
```

#### 3. Verify Base Path
Ensure `vite.config.ts` has:

```typescript
export default defineConfig({
  base: '/',
  // ... rest of config
})
```

## Troubleshooting

### After Deployment

1. **Clear Build Cache**
   - Go to Vercel project dashboard
   - Settings → Git → Ignored Build Step
   - Force a new deployment

2. **Check Environment Variables**
   - Make sure `VITE_API_URL` and `VITE_SOCKET_URL` are set
   - URLs should be HTTPS in production

3. **Verify Routing**
   - Test direct URLs: `https://your-app.vercel.app/login`
   - Test navigating between pages
   - Test refreshing pages

### Common Issues

#### 404 on Page Refresh
- Check that `vercel.json` has rewrites configured
- Ensure the file is in the `frontend/` directory
- Redeploy after adding `vercel.json`

#### API Calls Failing
- Verify `VITE_API_URL` environment variable
- Check CORS settings on backend
- Ensure backend is deployed and accessible

#### PWA Not Working
- Check that service worker is registered
- Verify HTTPS is enabled (PWA requirement)
- Clear browser cache and reload

## Production Environment Variables

Required environment variables for Vercel:

```bash
VITE_API_URL=https://your-backend-api.com
VITE_SOCKET_URL=https://your-backend-api.com
VITE_APP_NAME=Hamro Health
```

## Post-Deployment Checklist

- [ ] Home page loads at root URL
- [ ] Direct navigation to routes works (e.g., `/login`)
- [ ] Page refresh doesn't cause 404
- [ ] API calls are successful
- [ ] PWA installs correctly
- [ ] Real-time features work (Socket.io)
- [ ] Images and assets load properly
- [ ] SSL/HTTPS is enabled

## Custom Domain Setup

1. Go to project dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Update CORS settings on backend to include new domain

## Performance Optimization

Vercel automatically optimizes:
- Static asset caching
- CDN distribution
- Image optimization (if using next/image or similar)
- Edge network deployment

## Monitoring

Use Vercel Analytics to monitor:
- Page views
- Core Web Vitals
- Deployment logs
- Error tracking

## Support

For Vercel-specific issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://vercel.com/community)

## Notes

- The backend should be deployed separately (e.g., Railway, Render)
- Always use HTTPS for API URLs in production
- The PWA will only work with HTTPS
- Environment variables with `VITE_` prefix are automatically available in the frontend
