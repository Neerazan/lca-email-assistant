# 📚 Deployment Documentation Index

Complete guide to hosting your Next.js project on a VPS with Nginx, PM2, and GitHub Actions CI/CD.

---

## 🎯 Where to Start

**Choose based on your situation:**

### 🚀 I want to deploy NOW (Quick path)
→ Start with: **[QUICK_START.md](QUICK_START.md)**
- 20 numbered steps
- Copy-paste commands for VPS setup
- Estimated time: 45 minutes first time, 5 minutes after

### 📖 I want to understand the system (Learning path)
→ Start with: **[ARCHITECTURE.md](ARCHITECTURE.md)**
- Visual diagrams of how everything connects
- Request flow from user to your app
- Deployment flow automation
- Then read: **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**

### 🆘 Something is broken (Troubleshooting path)
→ Go to: **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)**
- 15+ common issues with solutions
- Copy-paste debugging commands
- Problem → Solution format

---

## 📋 Complete File Guide

### Main Documentation Files

| File | Purpose | Read Time | When to Use |
|------|---------|-----------|------------|
| **QUICK_START.md** | 20-step numbered deployment checklist | 10 min | First-time setup, quick reference |
| **DEPLOYMENT_GUIDE.md** | Complete detailed guide with explanations | 30 min | Deep understanding needed |
| **TROUBLESHOOTING.md** | Common issues and solutions | 20 min | Something isn't working |
| **ARCHITECTURE.md** | Visual diagrams and system flow | 15 min | Understand how everything works |
| **DEPLOYMENT_SUMMARY.md** | Overview of what was added to project | 10 min | Quick reference of new files |

### Configuration Files (Auto-created)

| File | Purpose | Edit? |
|------|---------|-------|
| **ecosystem.config.js** | PM2 process manager config | ✓ Customize port/memory if needed |
| **.github/workflows/deploy.yml** | Main CI/CD workflow (recommended) | ✓ Adjust build/deploy commands |
| **.github/workflows/deploy-simple.yml** | Simple Git pull workflow | ✓ Alternative simpler deployer |
| **.env.production.example** | Environment variables template | ✓ Copy to .env.production with real values |

---

## 🗺️ Navigation Guide

### If you're asking...

**"How do I set up everything?"**
→ [QUICK_START.md](QUICK_START.md) - Follow steps 1️⃣ through 2️⃣0️⃣

**"I want to understand the architecture"**
→ [ARCHITECTURE.md](ARCHITECTURE.md) - See diagrams and flows

**"I have an error, what's wrong?"**
→ [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Find your error, get solution

**"How do I deploy code changes?"**
→ [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) Section 6 - or just `git push origin main`

**"What ports and services are running?"**
→ [ARCHITECTURE.md](ARCHITECTURE.md) - "Ports & Services Mapping" section

**"How do I check if deployment succeeded?"**
→ [ARCHITECTURE.md](ARCHITECTURE.md) - "Complete Traffic Flow" section

**"I need detailed explanations"**
→ [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - All 7 sections with details

**"What files were added to my project?"**
→ [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md) - Summary of all new files

---

## 📚 Document Purposes

### 1. QUICK_START.md ⚡
**Best for:** Getting it done fast
- 20 numbered steps
- Copy-paste commands
- Minimal explanations
- Just the essentials

```bash
Use this to:
✓ Set up VPS from scratch
✓ Get to production in 45 minutes
✓ Quick reference for commands
✗ Learn how things work (read DEPLOYMENT_GUIDE.md instead)
```

### 2. DEPLOYMENT_GUIDE.md 📖
**Best for:** Understanding everything
- 7 major sections
- Detailed explanations
- Why things are configured this way
- Security best practices
- Monitoring and troubleshooting tips

```bash
Use this to:
✓ Understand deployment architecture
✓ Learn why configs are set this way
✓ Setup multiple projects
✓ Implement security best practices
✓ Learn from comments and explanations
✗ Just get it done quickly (use QUICK_START.md)
```

### 3. TROUBLESHOOTING.md 🔧
**Best for:** When something breaks
- 15+ common issues
- Problem description → Solution
- Debugging commands
- Real error messages

```bash
Use this to:
✓ Fix "502 Bad Gateway"
✓ Debug DNS issues
✓ Resolve deployment failures
✓ Check application health
✓ Find out what's using port 3001
✓ Get system information for support
```

### 4. ARCHITECTURE.md 🏗️
**Best for:** Understanding the big picture
- ASCII diagrams of system architecture
- Request flow from user to app
- Deployment process flow
- Automatic restart scenarios
- Traffic routing through services

```bash
Use this to:
✓ See how everything connects
✓ Understand request path
✓ Learn deployment automation
✓ See monitoring points
✓ Understand port mapping
✓ Learn what happens on server restart
```

### 5. DEPLOYMENT_SUMMARY.md 📝
**Best for:** Quick overview
- Summary of all new files
- System architecture overview
- Important notes and checklists
- Next steps

```bash
Use this to:
✓ Understand what was added to project
✓ See the checklist before going live
✓ Get quick reference of new files
✓ Review security best practices
```

---

## 🎯 Recommended Reading Order

### First-Time Setup
1. **ARCHITECTURE.md** (10 min) - Understand the system
2. **QUICK_START.md** (45 min) - Follow the 20 steps
3. **TROUBLESHOOTING.md** (bookmark) - Reference if issues arise

### If Something Breaks
1. **TROUBLESHOOTING.md** - Find your issue → Get solution
2. **Terminal** - Run debugging commands
3. **DEPLOYMENT_GUIDE.md** - Read relevant section

### When You Have Time
- **DEPLOYMENT_GUIDE.md** - Deep dive into all sections
- **ARCHITECTURE.md** - Understand request flows
- **DEPLOYMENT_SUMMARY.md** - Review checklist

---

## ⏱️ Time Estimates

| Task | Time | Document |
|------|------|----------|
| Read about architecture | 10 min | ARCHITECTURE.md |
| First-time VPS setup | 45 min | QUICK_START.md |
| First deployment | 5-10 min | (After setup) |
| Subsequent deployments | 1-2 min | Just `git push` |
| Troubleshoot issue | 5-30 min | TROUBLESHOOTING.md |
| Setup multiple projects | 20 min/project | DEPLOYMENT_GUIDE.md |
| Full understanding | 60 min | All documents |

---

## 🚀 Quick Command Reference

```bash
# View application logs
pm2 logs lca-email-assistant

# Check application status
pm2 status

# Restart application
pm2 restart lca-email-assistant

# Deploy code changes
git add .
git commit -m "Your changes"
git push origin main
# GitHub Actions handles everything else!

# Check server health
curl https://app.dhakalnirajan.com.np

# Check DNS resolution
nslookup app.dhakalnirajan.com.np

# SSH to VPS
ssh root@YOUR_VPS_IP

# Check SSL certificate expiry
sudo certbot certificates
```

---

## 📊 Document Size Reference

```
QUICK_START.md          ~8 KB    (5-10 min read)
DEPLOYMENT_GUIDE.md     ~25 KB   (20-30 min read)
TROUBLESHOOTING.md      ~20 KB   (15-20 min read)
ARCHITECTURE.md         ~15 KB   (10-15 min read)
DEPLOYMENT_SUMMARY.md   ~10 KB   (5-10 min read)
```

---

## ✅ Before You Start

Make sure you have:
- [ ] VPS with root/sudo access
- [ ] Domain: `dhakalnirajan.com.np` (with Cloudflare)
- [ ] GitHub account with repository access
- [ ] SSH key generated (or ability to generate one)
- [ ] Computer with terminal access

---

## 🎓 Learning Outcomes

After following these guides, you will know:
- ✅ How to set up a VPS for production deployment
- ✅ How Nginx works as a reverse proxy
- ✅ How PM2 manages and monitors Node.js processes
- ✅ How GitHub Actions automates deployment
- ✅ How Cloudflare DNS and SSL/TLS work
- ✅ How to troubleshoot common issues
- ✅ How to maintain and monitor your production app
- ✅ How to deploy multiple projects on one VPS

---

## 🔗 File Relationships

```
You want to:                    Read this:
├─ Deploy quickly              → QUICK_START.md
├─ Understand everything       → DEPLOYMENT_GUIDE.md
├─ Fix a problem              → TROUBLESHOOTING.md
├─ See system architect       → ARCHITECTURE.md
├─ Get overview               → DEPLOYMENT_SUMMARY.md
├─ Know which files were added → DEPLOYMENT_SUMMARY.md
├─ Configure PM2              → ecosystem.config.js
├─ Setup GitHub Actions       → .github/workflows/deploy.yml
└─ Set environment variables  → .env.production.example
```

---

## 💡 Pro Tips

1. **Start with QUICK_START.md** - It's designed to be followed step-by-step
2. **Keep TROUBLESHOOTING.md bookmarked** - You'll need it if something breaks
3. **Understand ARCHITECTURE.md** - Know how requests flow through the system
4. **Read DEPLOYMENT_GUIDE.md later** - For deep understanding and best practices
5. **Commit all files to Git** - These guides are part of your project now
6. **Update docs if you change config** - Keep documentation in sync with reality

---

## 🆘 Getting Help

If something doesn't work:

1. **Check TROUBLESHOOTING.md** - 90% of issues are there
2. **Run debugging commands** - Gather system information
3. **Check logs** - `pm2 logs lca-email-assistant`
4. **Verify each step** - Go through QUICK_START.md again
5. **Read DEPLOYMENT_GUIDE.md** - Get more details about each step

---

## 📌 Important Reminders

- ⚠️ **SSH Key**: Keep your private SSH key safe! Never commit it to Git.
- ⚠️ **GitHub Secrets**: Store sensitive data as GitHub Secrets, not in code
- ⚠️ **Environment Variables**: Copy `.env.production.example` to `.env.production` and add real values
- ⚠️ **DNS Changes**: Can take 15-48 hours to propagate initially
- ⚠️ **Port 3001**: Make sure nothing else is using this port on your VPS
- ⚠️ **Backups**: The deployment creates backups before updating code

---

## 🎉 You're Ready!

Everything is set up. Now:

1. **Read ARCHITECTURE.md** (10 min) - Understand the big picture
2. **Follow QUICK_START.md** (45 min) - Set up your VPS
3. **Test your deployment** (5 min) - Verify everything works
4. **Make code changes and push** - GitHub Actions deploys automatically!

> 💬 Need help? Check TROUBLESHOOTING.md or re-read the relevant section of DEPLOYMENT_GUIDE.md

---

**Happy Deploying! 🚀**
