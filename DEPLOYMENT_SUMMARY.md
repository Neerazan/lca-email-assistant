# Deployment Setup - Complete Summary

You now have everything configured for production deployment. Here's what was added to your project:

---

## 📁 New Files Created

```
your-project/
├── DEPLOYMENT_GUIDE.md          ← Complete step-by-step guide
├── QUICK_START.md               ← Quick reference checklist
├── TROUBLESHOOTING.md           ← Common issues & solutions
├── ecosystem.config.js          ← PM2 configuration
├── .env.production.example      ← Environment variables template
└── .github/workflows/
    ├── deploy.yml               ← Main CI/CD workflow (recommended)
    └── deploy-simple.yml        ← Simple Git pull workflow (alternative)
```

---

## 🚀 What These Files Do

### 1. **DEPLOYMENT_GUIDE.md**
- Complete 7-section deployment guide
- Covers: VPS setup, Nginx, PM2, GitHub Actions, Cloudflare, Monitoring
- Detailed explanations for each section
- Security best practices included

### 2. **QUICK_START.md**
- 20-step numbered checklist
- Copy-paste commands for VPS setup
- Phase by phase breakdown
- Quick reference for common commands
- **START HERE if you're in a hurry**

### 3. **TROUBLESHOOTING.md**
- 15+ common issues with solutions
- Debugging commands
- Real error messages and fixes
- Useful command reference

### 4. **ecosystem.config.js**
- PM2 process manager configuration
- Specifies:
  - Application name: `lca-email-assistant`
  - Port: `3001`
  - Memory limit: `500MB`
  - Log locations
  - Auto-restart settings

### 5. **.env.production.example**
- Template for production environment variables
- Copy to `.env.production` and fill values
- Add your actual API URLs, API keys, etc.

### 6. **.github/workflows/deploy.yml** (Recommended)
- Full CI/CD workflow that:
  - Builds Next.js project on push to main
  - Runs lint checks (optional)
  - Deploys to VPS automatically
  - Restarts PM2
  - Verifies deployment success
  - Handles errors gracefully

### 7. **.github/workflows/deploy-simple.yml** (Alternative)
- Simpler workflow using git pull
- Useful if you don't want full CI build
- Just pulls code and restarts

---

## 📋 Implementation Steps (Summary)

### Phase 1: VPS Setup
1. SSH to VPS
2. Install: Node.js, Nginx, PM2, Git
3. Create project directory
4. Clone repository

### Phase 2: Nginx Configuration
1. Create Nginx config file
2. Enable site
3. Test and reload

### Phase 3: PM2 Setup
1. Add ecosystem.config.js
2. Setup PM2 startup

### Phase 4: Cloudflare DNS
1. Add A DNS record for subdomain
2. Point to VPS IP
3. Configure SSL settings

### Phase 5: SSL Certificate
1. Install Certbot
2. Get certificate from Let's Encrypt
3. Setup auto-renewal

### Phase 6: Deploy Application
1. Install dependencies
2. Build Next.js project
3. Start with PM2

### Phase 7: GitHub Actions
1. Add secrets to GitHub
2. Push workflow files
3. Push code to main branch
4. Watch deployment run automatically

---

## 🔑 GitHub Secrets Needed

```
VPS_HOST         → Your VPS IP address (e.g., 123.45.67.89)
VPS_USER         → SSH user (usually: root)
VPS_SSH_KEY      → Your private SSH key (full content including -----BEGIN/END lines)
DEPLOY_PATH      → /var/www/lca-email-assistant
APP_PORT         → 3001 (optional)
```

---

## 🏗️ Architecture Overview

```
Your Local Machine
        ↓
GitHub Repository (main branch)
        ↓
GitHub Actions (on push)
        ├─ npm install
        ├─ npm run build
        └─ npm run lint (optional)
        ↓
Build Artifact (.next, node_modules)
        ↓
SSH Deploy to VPS
        ├─ Stop PM2 process
        ├─ Pull latest code
        ├─ Install dependencies
        ├─ Build Next.js
        └─ Start PM2
        ↓
VPS Application Running
        ├─ Node.js process (port 3001)
        ├─ Managed by PM2 (auto-restart)
        └─ Behind Nginx reverse proxy
        ↓
Nginx Server (ports 80/443)
        ├─ HTTP/HTTPS
        ├─ SSL certificates (Let's Encrypt)
        └─ Reverse proxy to 127.0.0.1:3001
        ↓
Cloudflare DNS
        ├─ app.dhakalnirajan.com.np → VPS IP
        ├─ SSL/TLS: Full
        └─ Always HTTPS: Enabled
        ↓
End User Browser
        └─ https://app.dhakalnirajan.com.np
```

---

## ✅ Deployment Workflow

### First Time (Manual)
```
VPS Setup → Install Dependencies → Build → Start PM2 → Configure SSL → Test
```

### Subsequent Deployments (Automatic via GitHub Actions)
```
git push origin main → GitHub detects push → GitHub Actions runs → 
Build in CI → Deploy to VPS → Restart PM2 → Service live
```

### Time Estimate
- **First deployment:** 30-45 minutes (VPS setup + config)
- **Subsequent deployments:** 2-5 minutes (automatic)

---

## 🎯 Your Domain Setup

**Primary Domain:** `dhakalnirajan.com.np`  
**Subdomain:** `app.dhakalnirajan.com.np`  
**Protocol:** HTTPS (automatic via Let's Encrypt)

### Cloudflare Configuration
| Setting | Value |
|---------|-------|
| Domain | dhakalnirajan.com.np |
| A Record | app → YOUR_VPS_IP |
| SSL/TLS Mode | Full |
| Auto HTTPS | Enabled |
| Nameservers | Set at domain registrar |

---

## 🔐 Security Checklist

- [ ] SSH key authentication enabled (no password login)
- [ ] Firewall configured (ports 80, 443, 22 only)
- [ ] SSL certificate valid (HTTPS enforced)
- [ ] Regular certificate renewal (auto via Certbot)
- [ ] PM2 set to auto-restart on reboot
- [ ] Backups of .next build before deploy
- [ ] GitHub secrets secured and hidden
- [ ] Git repository private (if sensitive data)
- [ ] System updates applied regularly
- [ ] Monitoring logs actively

---

## 📊 Monitoring After Deployment

### Watch the deployment live:
```bash
# SSH to VPS
ssh root@YOUR_VPS_IP

# Watch logs in real-time
pm2 logs lca-email-assistant

# Monitor RAM/CPU
pm2 monit

# Check if service is up
curl https://app.dhakalnirajan.com.np
```

### GitHub Actions:
```
Go to: GitHub → Actions → Watch workflow run
```

---

## 🛠️ Common Tasks After Going Live

### View Application Logs
```bash
pm2 logs lca-email-assistant --lines 100
```

### Restart Application
```bash
pm2 restart lca-email-assistant
```

### Deploy New Code
```bash
git add .
git commit -m "Your changes"
git push origin main
# GitHub Actions automatically deploys!
```

### Update Environment Variables
1. Edit `.env.production` on VPS
2. Restart app: `pm2 restart lca-email-assistant`

### Check SSL Certificate
```bash
sudo certbot certificates
# Should renew automatically
```

### Update System
```bash
sudo apt update && sudo apt upgrade -y
sudo systemctl reboot  # If major updates
```

---

## ⚠️ Important Notes

1. **Build happens in GitHub Actions, not on VPS**
   - VPS only runs the built application
   - Faster deployments
   - Lighter VPS resource usage

2. **PM2 ensures your app stays running**
   - Auto-restart on crash
   - Survives server reboot
   - Memory limits prevent crashes

3. **DNS can take time to propagate**
   - Initial setup: wait 15-48 hours
   - After changes: wait 5-60 minutes
   - Use multiple DNS servers to test

4. **SSL certificates auto-renew**
   - Let's Encrypt certificates last 90 days
   - Certbot renews automatically
   - No manual action needed

5. **Multiple projects on same VPS**
   - Each needs different port
   - Each needs different subdomain
   - Each needs separate Nginx config
   - Each needs separate PM2 app

---

## 📞 Need Help?

### Before asking for help, collect:
```bash
pm2 status
pm2 logs lca-email-assistant --lines 50
curl https://app.dhakalnirajan.com.np
nslookup app.dhakalnirajan.com.np
df -h
free -h
```

### Useful Resources:
- [Next.js Deployment Guide](https://nextjs.org/docs/app/building-and-deploying/deploying)
- [PM2 Docs](https://pm2.keymetrics.io/docs)
- [Nginx Docs](https://nginx.org/en/docs/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Let's Encrypt](https://letsencrypt.org/)
- [Cloudflare DNS Docs](https://developers.cloudflare.com/dns/)

---

## 📝 Next Steps

1. **Commit these files to your repository:**
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

2. **Follow QUICK_START.md** for VPS setup (20 steps)

3. **After successful deployment:**
   - Test the application
   - Monitor logs
   - Setup backups
   - Configure monitoring alerts

4. **For subsequent code changes:**
   - Just `git push origin main`
   - GitHub Actions handles everything else

---

## 📚 File Guide

| File | When to Use | Key Info |
|------|-------------|----------|
| DEPLOYMENT_GUIDE.md | Detailed setup reference | Complete explanations |
| QUICK_START.md | Following 20-step setup | Copy-paste commands |
| TROUBLESHOOTING.md | Issues occurring | Problem → Solution |
| ecosystem.config.js | PM2 config | Auto-managed by PM2 |
| .github/workflows/deploy.yml | CI/CD pipeline | Auto-runs on git push |
| .env.production.example | Template for env vars | Copy to .env.production |

---

## 🎉 You're All Set!

Your project now has:
- ✅ Production-ready configuration
- ✅ Automated CI/CD pipeline
- ✅ Process management (PM2)
- ✅ Web server (Nginx)
- ✅ SSL/HTTPS (Let's Encrypt)
- ✅ DNS management (Cloudflare)
- ✅ Comprehensive guides and troubleshooting

**Ready to deploy? Start with QUICK_START.md!**
