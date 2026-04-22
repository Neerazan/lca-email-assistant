# 🚀 Deployment Quick Reference Card

**Print this page for quick access!**

---

## 📋 Your Project Details

```
Project Name:    lca-email-assistant
Domain:         dhakalnirajan.com.np
Subdomain:      app.dhakalnirajan.com.np
VPS Port:       3001
PM2 App Name:   lca-email-assistant
Deploy Path:    /var/www/lca-email-assistant
Repository:     https://github.com/Neerazan/lca-email-assistant.git
```

---

## 🔑 GitHub Secrets Checklist

```
☐ VPS_HOST         = Your VPS IP (e.g., 123.45.67.89)
☐ VPS_USER         = root (or your SSH user)
☐ VPS_SSH_KEY      = Your private SSH key (~/.ssh/id_ed25519 content)
☐ DEPLOY_PATH      = /var/www/lca-email-assistant
```

---

## ⚡ SSH Commands Cheat Sheet

```bash
# Connect to VPS
ssh root@YOUR_VPS_IP

# View app logs
pm2 logs lca-email-assistant

# Monitor live
pm2 monit

# Check status
pm2 status

# Restart app
pm2 restart lca-email-assistant

# Stop app
pm2 stop lca-email-assistant

# Start app
pm2 start ecosystem.config.js

# Check listening ports
netstat -tuln | grep 3001

# View Nginx errors
sudo tail -f /var/log/nginx/error.log

# Check SSL certificate
sudo certbot certificates

# Renew SSL
sudo certbot renew --nginx

# Check system resources
top

# Check disk space
df -h

# Deploy from local machine
git push origin main
```

---

## 🔄 Deployment Quick Flow

```
1. Make code changes locally
2. git add . && git commit -m "message" && git push origin main
3. GitHub Actions automatically:
   ├─ Builds your project
   ├─ Runs tests/lint
   ├─ Deploys to VPS
   ├─ Restarts PM2
   └─ Service live
4. Takes 2-5 minutes
5. Go to: https://app.dhakalnirajan.com.np ✓
```

---

## 🆘 Common Issues Quick Fixes

| Issue | Fix |
|-------|-----|
| 502 Bad Gateway | `pm2 restart lca-email-assistant` |
| DNS not resolving | `nslookup app.dhakalnirajan.com.np 8.8.8.8` |
| SSL error | `sudo certbot certonly --nginx -d app.dhakalnirajan.com.np` |
| Port already in use | `sudo lsof -i :3001` → `sudo kill -9 PID` |
| App won't start | `pm2 logs lca-email-assistant` (check logs) |
| High memory | `pm2 monit` (check usage) → `pm2 restart` |
| Out of disk space | `df -h` (check) → `sudo rm -rf /var/log/pm2/*.log` |

---

## 📁 Key File Locations

```
On Your Machine:
├─ QUICK_START.md              ← Follow these 20 steps
├─ DEPLOYMENT_GUIDE.md         ← Detailed explanations
├─ TROUBLESHOOTING.md          ← Common issues
├─ ARCHITECTURE.md             ← System diagrams
├─ ecosystem.config.js         ← PM2 config
└─ .github/workflows/deploy.yml ← GitHub Actions

On VPS (/var/www/lca-email-assistant/):
├─ .next/                       ← Built Next.js app
├─ node_modules/               ← Dependencies
├─ ecosystem.config.js         ← PM2 reference copy
└─ .env.production             ← Environment variables (secret!)

On VPS System:
├─ /etc/nginx/sites-available/lca-email-assistant  ← Nginx config
├─ /var/log/pm2/               ← PM2 logs
└─ /var/log/nginx/             ← Nginx logs
```

---

## 🎯 Setup Quick Path (45 mins)

```
Step 1: SSH to VPS                              (2 min)
Step 2: Install Node, npm, Nginx, PM2, Git    (10 min)
Step 3: Create Nginx config                    (5 min)
Step 4: Setup PM2 startup                      (5 min)
Step 5: Add DNS in Cloudflare                  (5 min)
Step 6: Get SSL certificate                    (5 min)
Step 7: Clone repo, install, build, start      (10 min)
Step 8: Test in browser                        (3 min)
Step 9: Setup GitHub secrets & actions         (5 min)
Step 10: Verify first deployment               (3 min)

Total: ~45 minutes
```

---

## 📊 Performance Monitoring

```bash
# Real-time monitoring dashboard
pm2 monit

# Check processes
pm2 status
ps aux | grep node

# Memory usage
free -h

# Disk usage
df -h

# CPU usage
top (then press M for memory sort)

# Network connections
netstat -an | grep ESTABLISHED | wc -l

# Port listening
netstat -tuln
```

---

## 🔐 Security Checklist

```
☐ SSH key authentication enabled
☐ Password login disabled for root
☐ Firewall configured (ports 80, 443, 22)
☐ SSL certificate valid and auto-renewing
☐ GitHub secrets stored (not in code)
☐ .env.production not in Git
☐ Private SSH key kept safe
☐ Regular system updates applied
☐ Monitoring logs active
☐ Backup strategy in place
```

---

## 🌐 DNS Testing

```bash
# Test DNS resolution
nslookup app.dhakalnirajan.com.np          # Default
nslookup app.dhakalnirajan.com.np 8.8.8.8 # Google DNS
dig app.dhakalnirajan.com.np               # Detailed info

# Expected output:
# app.dhakalnirajan.com.np has address YOUR_VPS_IP
```

---

## 💻 GitHub Actions Workflow

```
File: .github/workflows/deploy.yml

Phases:
1. Checkout code from main branch
2. Setup Node.js 20
3. npm ci (clean install)
4. npm run lint (optional)
5. npm run build
6. SSH to VPS
7. Stop PM2 app
8. Git pull latest
9. npm ci --omit=dev
10. npm run build
11. PM2 start
12. Verify online
13. Check port 3001
14. Verify Nginx config
15. Show logs

Total time: 2-5 minutes
```

---

## 📱 After Deployment - Daily Operations

```bash
# Morning check
pm2 status                    # Are all apps online?
pm2 logs lca-email-assistant  # Any errors overnight?
curl https://app.dhakalnirajan.com.np  # Is it responding?

# When deploying code
git add . && git commit -m "message" && git push origin main
# Then wait 3-5 minutes for GitHub Actions
# Then verify at https://app.dhakalnirajan.com.np

# When troubleshooting
pm2 logs lca-email-assistant --lines 50
pm2 describe lca-email-assistant
netstat -tuln | grep 3001
curl -I https://app.dhakalnirajan.com.np

# Weekly maintenance
sudo apt update && sudo apt upgrade -y   # Keep system updated
sudo certbot renew --dry-run             # Check SSL renewal
df -h                                     # Check disk space
```

---

## 🔗 Important URLs

```
Your Application:
├─ https://app.dhakalnirajan.com.np

GitHub:
├─ Repository: https://github.com/Neerazan/lca-email-assistant
├─ Actions: https://github.com/Neerazan/lca-email-assistant/actions
└─ Settings/Secrets: https://github.com/Neerazan/lca-email-assistant/settings/secrets

Cloudflare:
├─ Dashboard: https://dash.cloudflare.com/
├─ Your domain: dhakalnirajan.com.np
├─ DNS tab: Add A records
└─ SSL/TLS tab: Configure certificate

Documentation (local):
├─ README_DEPLOYMENT.md  ← Start here for navigation
├─ QUICK_START.md        ← Follow for setup
├─ DEPLOYMENT_GUIDE.md   ← Deep dive explanations
├─ TROUBLESHOOTING.md    ← When problems occur
└─ ARCHITECTURE.md       ← System diagrams
```

---

## 📞 Troubleshooting Flowchart

```
Is app down?
├─ NO  → Go back to work ✓
└─ YES → pm2 status
        ├─ Shows "online"  → Check Nginx: sudo nginx -t
        │                 → Check port: netstat -tuln | grep 3001
        │                 → Restart: pm2 restart lca-email-assistant
        │
        └─ Shows error     → pm2 logs lca-email-assistant
                          → pm2 delete all
                          → pm2 start ecosystem.config.js
                          → Check logs again
                          
App still down?
├─ Check disk: df -h
├─ Check memory: free -h
├─ Check processes: top
├─ Read TROUBLESHOOTING.md
└─ Collect info and ask for help
```

---

## ⏰ Service Restart Times

```
Application restart:          2-5 seconds
Nginx reload:                 ~0.5 second (no downtime)
SSL certificate renewal:      No downtime
System reboot:                30 seconds (PM2 auto-restarts app)
GitHub Actions workflow:      2-5 minutes total
DNS propagation:              5 minutes to 48 hours
```

---

## 🚀 Deployment Success = 

```
✓ Git push to main
✓ GitHub Actions runs
✓ Build successful
✓ Deploy successful
✓ App online
✓ Port 3001 listening
✓ Nginx passes traffic
✓ Users can access app
✓ HTTPS working
✓ Logs show requests
= 🎉 DEPLOYMENT SUCCESSFUL!
```

---

## 💡 Quick Tips

1. **Always check logs first**: `pm2 logs lca-email-assistant`
2. **DNS issues?**: Wait 15 minutes and test with Google DNS: `nslookup app.dhakalnirajan.com.np 8.8.8.8`
3. **Memory full?**: Check with `pm2 monit`, clear old logs: `sudo rm -rf /var/log/pm2/*.log`
4. **Nginx errors?**: Check syntax: `sudo nginx -t`, view config: `sudo cat /etc/nginx/sites-enabled/lca-email-assistant`
5. **SSL certificate?**: Check expiry: `sudo certbot certificates`, auto-renews every 90 days
6. **Multiple deploys?**: No need to repeat setup, just `git push origin main` each time
7. **Need to roll back?**: Check backup: `ls -la /var/www/lca-email-assistant/.backup/`
8. **Live debugging?**: Use `pm2 attach lca-email-assistant` for interactive logs

---

## 📋 Pre-Launch Checklist

```
Setup Phase:
☐ VPS server rented and accessible
☐ SSH key generated and saved securely
☐ Domain registered (dhakalnirajan.com.np)
☐ Cloudflare account created
☐ GitHub repository ready

Configuration Phase:
☐ Node.js, npm, Nginx, PM2, Git installed on VPS
☐ Nginx config created for subdomain
☐ SSL certificate obtained from Let's Encrypt
☐ ecosystem.config.js configured for PM2
☐ GitHub secrets added (VPS_HOST, VPS_USER, VPS_SSH_KEY, DEPLOY_PATH)
☐ GitHub Actions workflow file (.github/workflows/deploy.yml) created

Deployment Phase:
☐ Repository cloned on VPS
☐ Dependencies installed (npm ci)
☐ Project built (npm run build)
☐ PM2 started successfully
☐ Application accessible via https://app.dhakalnirajan.com.np
☐ DNS resolves correctly
☐ SSL certificate valid
☐ PM2 set to auto-start on reboot

Testing Phase:
☐ Test manual deployment
☐ Test GitHub Actions automatic deployment
☐ Verify logs show no errors
☐ Check monitoring (pm2 monit)
☐ Load test the application
☐ Verify backups in place

Going Live:
☐ All checks passed
☐ Documentation updated with final URLs
☐ Team notified of new URL
☐ Monitor logs for first 24 hours
☐ Setup alerts/monitoring if needed
```

---

**Print this page and keep it handy! 🚀**

For detailed information, see the full documentation files:
- QUICK_START.md (fastest setup)
- DEPLOYMENT_GUIDE.md (deep dive)
- TROUBLESHOOTING.md (when issues occur)
