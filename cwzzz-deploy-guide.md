# cwzzz.online Deployment Guide

## Quick Start (3 Steps)

### Step 1: Run Deployment Script

**Double-click**: `deploy-cwzzz.bat`

This will automatically:
- Initialize Git
- Push to GitHub
- Deploy to Vercel
- Guide you through domain binding

### Step 2: Configure DNS

At your domain registrar (where you bought cwzzz.online):

**Option A (Easiest)**: Change Nameservers
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**Option B**: Add DNS records
```
Type: A    Name: @    Value: 76.76.21.21
Type: CNAME Name: www Value: cname.vercel-dns.com
```

### Step 3: Bind Domain in Vercel

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click Settings → Domains
4. Click Add
5. Enter `cwzzz.online`
6. Click Add

---

## Manual Deployment (If script doesn't work)

### 1. Install Required Tools

```bash
# Install Vercel CLI
npm install -g vercel

# Install Railway CLI (optional, for backend)
npm install -g @railway/cli
```

### 2. Deploy Frontend

```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 3. Bind Domain

```bash
# Bind cwzzz.online
vercel domains add cwzzz.online
```

### 4. Configure DNS

Login to your domain registrar and update DNS settings as shown above.

### 5. Deploy Backend (Optional)

```bash
cd backend
railway login
railway init
railway up
railway variables set JWT_SECRET=your_secret_key_at_least_32_chars
railway variables set NODE_ENV=production
```

---

## After Deployment

### Check DNS Propagation

Visit: https://dnschecker.org/#A/cwzzz.online

### Access Your Website

- Main: https://cwzzz.online
- WWW: https://www.cwzzz.online

### Configure API URL

Edit `api-config.js` and replace:
```javascript
window.API_BASE_URL = 'https://your-backend.up.railway.app';
```

---

## Troubleshooting

### DNS Not Working?
- Wait for propagation (up to 48 hours)
- Clear DNS cache: `ipconfig /flushdns`
- Check nameserver settings

### CORS Errors?
- Update `backend/server.js` with your domain
- Redeploy backend

### Need Help?

See detailed documentation:
- `域名部署指南-cwzzz.online.md` (Chinese)
- `CWZZZ-部署指南.md` (Quick guide)

---

**Good luck with your deployment!** ?
