# Deployment Architecture & Flow Guide

Visual representation of how your deployment system works.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          YOUR LOCAL MACHINE                               │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                   │   │
│  │  $ git push origin main                                         │   │
│  │  ↓                                                              │   │
│  │  GitHub Repository (Neerazan/lca-email-assistant)             │   │
│  │                                                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                     GITHUB ACTIONS (CI/CD)                                │
│                                                                           │
│  1. Checkout code                                                        │
│  2. Setup Node.js 20                                                    │
│  3. Install dependencies (npm ci)                                       │
│  4. Run linting (npm run lint)                                          │
│  5. Build Next.js (npm run build)                                       │
│  6. Create deployment package (.next, node_modules, etc.)              │
│  7. SSH Deploy to VPS                                                   │
│                                                                           │
│     Deployment Script:                                                   │
│     ├─ Stop PM2 process                                                 │
│     ├─ Git pull latest code                                             │
│     ├─ Install dependencies                                             │
│     ├─ Build application                                                │
│     ├─ Start PM2                                                        │
│     └─ Verify status                                                    │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    YOUR VPS (Production Server)                           │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  Process Manager (PM2)                                          │ │
│  │                                                                   │ │
│  │  App: lca-email-assistant                                       │ │
│  │  Status: Online ✓                                               │ │
│  │  Port: 3001                                                     │ │
│  │  Memory: 250MB / 500MB                                          │ │
│  │  Uptime: 42 days                                                │ │
│  ├──────────────────────────────────────────────────────────────────┤ │
│  │  Node.js Process                                                │ │
│  │  └─ Next.js Server                                              │ │
│  │     127.0.0.1:3001 (localhost only)                             │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                    ↓                                     │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  Nginx Reverse Proxy                                            │ │
│  │                                                                   │ │
│  │  Listen: 0.0.0.0:80   (HTTP)                                    │ │
│  │  Listen: 0.0.0.0:443  (HTTPS)                                   │ │
│  │                                                                   │ │
│  │  app.dhakalnirajan.com.np:443                                   │ │
│  │  ├─ SSL Certificate (Let's Encrypt)                             │ │
│  │  ├─ Auto-renew (Certbot)                                        │ │
│  │  └─ Proxy → 127.0.0.1:3001                                      │ │
│  │                                                                   │ │
│  │  HTTP → HTTPS Redirect                                          │ │
│  │  All traffic encrypted ✓                                        │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  File Structure:                                                         │
│  /var/www/lca-email-assistant/                                          │
│  ├─ .next/            (Next.js build)                                    │
│  ├─ node_modules/     (Dependencies)                                    │
│  ├─ public/           (Static files)                                    │
│  ├─ .git/             (Repository)                                      │
│  ├─ ecosystem.config.js                                                 │
│  └─ package.json                                                        │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                      INTERNET / CDN                                       │
│                                                                           │
│  Cloudflare (DNS & DDoS Protection)                                      │
│  ├─ Domain: dhakalnirajan.com.np                                        │
│  ├─ A Record: app → YOUR_VPS_IP                                         │
│  ├─ SSL/TLS: Full                                                       │
│  ├─ Always HTTPS: Enabled                                               │
│  ├─ Nameservers: Configured at registrar                                │
│  └─ Status: Active ✓                                                    │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                      END USERS                                            │
│                                                                           │
│  Browser: https://app.dhakalnirajan.com.np                              │
│  ↓                                                                       │
│  Cloudflare DNS Resolution                                              │
│  ↓                                                                       │
│  VPS IP Address: YOUR_VPS_IP                                            │
│  ↓                                                                       │
│  Nginx (HTTPS/443) ✓ Secure Connection                                  │
│  ↓                                                                       │
│  Inside VPS: Proxy to 127.0.0.1:3001                                    │
│  ↓                                                                       │
│  Node.js / Next.js Application                                          │
│  ↓                                                                       │
│  Response sent back through same path                                   │
│  ↓                                                                       │
│  Rendered Page in Browser ✓                                             │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Request Flow Diagram

```
1. USER REQUESTS
   ↓
   Browser: GET https://app.dhakalnirajan.com.np
   ↓

2. DNS RESOLUTION (Cloudflare)
   ↓
   Query: app.dhakalnirajan.com.np
   ↓
   Response: YOUR_VPS_IP (1.2.3.4)
   ↓

3. CONNECT TO VPS
   ↓
   TCP Connection to 1.2.3.4:443
   ↓
   TLS/SSL Handshake (Let's Encrypt Certificate)
   ↓

4. NGINX REVERSE PROXY
   ↓
   Receives HTTPS request on 443
   ↓
   Checks: server_name app.dhakalnirajan.com.np
   ↓
   Matches config ✓
   ↓

5. FORWARD TO APPLICATION
   ↓
   Proxy pass: 127.0.0.1:3001
   ↓
   Set headers (X-Real-IP, X-Forwarded-For, etc.)
   ↓

6. NODE.JS / NEXT.JS
   ↓
   PM2 Process: lca-email-assistant
   ↓
   Receives request
   ↓
   Process request (server-side rendering, API calls, etc.)
   ↓

7. RESPONSE
   ↓
   Next.js generates response
   ↓
   Returns HTML/JSON to Nginx
   ↓

8. NGINX SENDS BACK
   ↓
   Response through HTTPS connection
   ↓
   Browser receives response
   ↓

9. BROWSER RENDERS
   ↓
   Loads CSS, JavaScript
   ↓
   Page displayed to user ✓
```

---

## 🔄 Deployment Flow

```
┌─────────────────────────────────────────────────────────────┐
│  DEVELOPER: Make Code Changes                              │
│  ├─ Update components                                       │
│  ├─ Fix bugs                                                │
│  ├─ Add features                                            │
│  └─ Test locally (npm run dev)                              │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  LOCAL GIT: Commit Changes                                  │
│  ├─ git add .                                               │
│  ├─ git commit -m "description"                             │
│  └─ git push origin main                                    │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  GITHUB: Webhook Triggered                                  │
│  ├─ New commit detected on main branch                      │
│  ├─ GitHub Actions workflow automatically starts            │
│  └─ Execution ID: xxxxx                                     │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  CI/CD PIPELINE: Build Phase                                │
│  ├─ 1. Checkout code from repository                        │
│  ├─ 2. Install Node.js 20                                   │
│  ├─ 3. npm ci (clean install)                               │
│  ├─ 4. npm run lint (optional)                              │
│  ├─ 5. npm run build                                        │
│  ├─ ✓ Build successful!                                     │
│  └─ Artifacts created (.next, node_modules)                 │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  CI/CD PIPELINE: Deploy Phase                               │
│  ├─ SSH connect to VPS                                      │
│  ├─ Authenticate with VPS_SSH_KEY secret                    │
│  ├─ Login successful ✓                                      │
│  └─ Execute deployment script...                            │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  VPS: Deployment Script Executes                            │
│  ├─ Check deployment path exists                            │
│  ├─ Create backup of current .next build                    │
│  ├─ Stop PM2 process (lca-email-assistant)                 │
│  ├─ git fetch & git reset --hard main                       │
│  ├─ npm ci --omit=dev (install prod deps)                   │
│  ├─ npm run build                                           │
│  ├─ pm2 start ecosystem.config.js                           │
│  ├─ Wait 3 seconds for startup                              │
│  ├─ Verify app online                                       │
│  ├─ Check port 3001 listening ✓                             │
│  ├─ Verify Nginx config ✓                                   │
│  ├─ Print last 10 logs                                      │
│  └─ pm2 save (persist config)                               │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  SERVICE: Application Running                               │
│  ├─ Status: Online ✓                                        │
│  ├─ Uptime: 0s (just started)                               │
│  ├─ Memory: Monitoring...                                   │
│  ├─ Process healthy ✓                                       │
│  └─ Ready for requests ✓                                    │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  GITHUB ACTIONS: Verification                               │
│  ├─ Workflow completed ✓ (Green checkmark)                  │
│  ├─ Deployment successful!                                  │
│  ├─ Duration: ~3-5 minutes                                  │
│  └─ Changes live at:                                        │
│     https://app.dhakalnirajan.com.np                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔁 Automatic Restart Flow

```
SCENARIO 1: Application Crashes
│
├─ Node.js process crashes
│  ├─ Unhandled exception
│  ├─ Out of memory
│  └─ Or manual kill
│
└─ PM2 Detects Crash
   ├─ Restart: false → exit
   └─ Restart: true → immediate restart
      ├─ Wait small delay
      ├─ Start new Node.js process
      ├─ Bind to port 3001
      └─ Status: Online ✓
         └─ Requests resume flowing!


SCENARIO 2: Server Reboots
│
├─ sudo reboot
│  ├─ All processes stop
│  ├─ VPS restarts
│  └─ System boot complete
│
└─ PM2 Auto-Startup (registered to init)
   ├─ Detects previous saved config
   ├─ Auto-resurrect: lca-email-assistant
   ├─ Start Node.js process
   ├─ Bind to port 3001
   └─ Status: Online ✓
      └─ Service back up automatically!


SCENARIO 3: Memory High
│
├─ PM2 monitoring
│  ├─ Memory: 400MB / 500MB
│  ├─ Memory: 450MB / 500MB
│  ├─ Memory: 475MB / 500MB
│  └─ Memory: 505MB / 500MB ← exceeded
│
└─ PM2 Restarts (graceful)
   ├─ Stop process gracefully
   ├─ Wait for pending requests
   ├─ Kill if timeout
   ├─ Start fresh process
   ├─ Memory: 0MB (fresh)
   └─ Status: Online ✓
      └─ Continues serving requests!
```

---

## 📁 Directory Structure After Deployment

```
VPS: /var/www/lca-email-assistant/

lca-email-assistant/
│
├─ .git/                         (Git repository)
│  └─ ... (git metadata)
│
├─ .next/                        (Next.js build output)
│  ├─ static/
│  │  ├─ _next/
│  │  │  ├─ chunks/
│  │  │  │  └─ (JavaScript bundles)
│  │  │  └─ (App router)
│  │  └─ (Other static assets)
│  ├─ server/
│  │  ├─ app/
│  │  │  └─ (Server components)
│  │  ├─ middleware/
│  │  └─ (Server functions)
│  └─ image-cache/
│
├─ node_modules/                (Production dependencies only)
│  ├─ next/
│  ├─ react/
│  ├─ react-dom/
│  ├─ jwt-decode/
│  └─ (other packages needed in production)
│
├─ public/                       (Static files)
│  ├─ favicon.ico
│  └─ (images, fonts, etc.)
│
├─ app/                          (Source code)
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ chat/
│  ├─ settings/
│  └─ ...
│
├─ components/                   (React components)
│  ├─ ChatWindow.tsx
│  ├─ AuthProvider.tsx
│  └─ ...
│
├─ contexts/                     (React contexts)
│  └─ AuthContext.tsx
│
├─ hooks/                        (Custom hooks)
│  └─ useAgentStream.ts
│
├─ lib/                          (Utilities)
│  └─ api.ts
│
├─ types/                        (TypeScript types)
│  └─ ...
│
├─ .env.production               (Environment variables, NOT in git)
├─ .gitignore
├─ ecosystem.config.js           (PM2 configuration)
├─ next.config.ts               (Next.js configuration)
├─ tsconfig.json                (TypeScript configuration)
├─ package.json                 (Dependencies metadata)
├─ package-lock.json            (Locked dependency versions)
│
├─ logs/                         (Created after running)
│  └─ lca-assistant-*.log
│
└─ .backup/                      (Backups from deployments)
   └─ .next.TIMESTAMP
```

---

## 🔐 Ports & Services Mapping

```
┌────────────────────────────────────────────────────────────┐
│  EXTERNAL (Internet / Users)                               │
├────────────────────────────────────────────────────────────┤
│  Port 80   → HTTP (Nginx)    → Redirect to 443            │
│  Port 443  → HTTPS (Nginx)   → Secure Connection          │
│  Port 22   → SSH (System)    → Admin Access               │
└────────────────────────────────────────────────────────────┘
              ↓↓ (Decrypted inside VPS)
┌────────────────────────────────────────────────────────────┐
│  INTERNAL (Inside VPS / localhost)                         │
├────────────────────────────────────────────────────────────┤
│  127.0.0.1:3001  ← Nginx proxy (from 443)                │
│  │                                                         │
│  └─→ Node.js Process (Next.js App)                        │
│      └─ Next.js Server                                     │
│      └─ API Routes                                         │
│      └─ SSR Pages                                          │
│                                                            │
│  127.0.0.1:7000  ← PM2 API (internal only)               │
│  127.0.0.1:22    ← SSH (see external)                     │
└────────────────────────────────────────────────────────────┘
```

---

## 🎯 Complete Traffic Flow Example

```
1️⃣  USER
    └─ Opens browser
    └─ Types: https://app.dhakalnirajan.com.np

2️⃣  DNS QUERY
    └─ Browser → Cloudflare
    └─ Query: app.dhakalnirajan.com.np
    └─ Response: 1.2.3.4 (Your VPS IP)

3️⃣  TCP HANDSHAKE
    └─ Browser → 1.2.3.4:443
    └─ SYN →
    └─ SYN-ACK ←
    └─ ACK →
    └─ Connection established

4️⃣  TLS HANDSHAKE
    └─ Browser requests certificate
    └─ Nginx presents: app.dhakalnirajan.com.np cert (Let's Encrypt)
    └─ Browser verifies certificate
    └─ Encryption negotiated ✓

5️⃣  FIRST REQUEST
    └─ Browser → Nginx:443 (encrypted)
    └─ GET / HTTP/1.1
    └─ Host: app.dhakalnirajan.com.np
    └─ Headers: ...

6️⃣  NGINX PROCESSES
    └─ Receives encrypted request
    └─ Matches server block (app.dhakalnirajan.com.np)
    └─ Matches location / {}
    └─ → proxy_pass http://127.0.0.1:3001

7️⃣  NGINX FORWARDS
    └─ Nginx (internal) → Node.js:3001 (unencrypted, localhost only)
    └─ Sets headers:
       ├─ X-Real-IP: user's IP
       ├─ X-Forwarded-For: user's IP
       ├─ X-Forwarded-Proto: https
       └─ Host: app.dhakalnirajan.com.np

8️⃣  NODE.JS / NEXT.JS PROCESSES
    └─ PM2 runs: node_modules/next/dist/bin/next start
    └─ Next.js server listening on 127.0.0.1:3001
    └─ Receives request
    └─ Processes:
       ├─ Route matching
       ├─ Component rendering
       ├─ API calls (if needed)
       └─ Generates HTML/JSON response

9️⃣  RESPONSE SENT BACK
    └─ Node.js → Nginx (internal)
    └─ 200 OK
    └─ Content-Type: text/html
    └─ Content-Length: 12345
    └─ [HTML content]

🔟 NGINX SENDS TO BROWSER
    └─ Nginx → Browser (encrypted HTTPS)
    └─ Same response (200 OK + HTML)
    └─ Browser receives response

1️⃣1️⃣ BROWSER RENDERS
    └─ Parse HTML
    └─ Load CSS, JavaScript
    └─ Render interactive page
    └─ User sees: Your website! ✓

1️⃣2️⃣ SUBSEQUENT REQUESTS
    └─ Same flow for:
       ├─ CSS files
       ├─ JavaScript bundles
       ├─ Images
       ├─ API calls
       └─ (All encrypted, proxied)

✅ SUCCESS = Application fully live and accessible!
```

---

## 🔍 Monitoring Points

```
┌─ GitHub Actions
│  └─ Watch build/deploy logs
│     └─ github.com/Neerazan/lca-email-assistant/actions
│
├─ VPS SSH Connection
│  ├─ pm2 logs lca-email-assistant      ← App logs
│  ├─ pm2 monit                         ← Live monitoring
│  ├─ pm2 status                        ← Process status
│  └─ pm2 describe lca-email-assistant  ← Detailed info
│
├─ System Resources
│  ├─ top                               ← CPU/Memory
│  ├─ df -h                             ← Disk space
│  ├─ free -h                           ← RAM usage
│  └─ netstat -tuln                     ← Active ports
│
├─ Web Services
│  ├─ sudo systemctl status nginx       ← Nginx status
│  ├─ sudo tail -f /var/log/nginx/error.log  ← Nginx errors
│  └─ curl https://app.dhakalnirajan.com.np   ← Health check
│
├─ SSL Certificate
│  ├─ sudo certbot certificates         ← Expiration dates
│  └─ sudo certbot renew --dry-run      ← Test renewal
│
└─ DNS & Network
   ├─ nslookup app.dhakalnirajan.com.np ← DNS resolution
   ├─ dig app.dhakalnirajan.com.np      ← Detailed DNS
   └─ curl -I https://app.dhakalnirajan.com.np  ← Headers
```

---

## 🎓 Learning Path

```
Phase 1: Setup (1-2 hours)
  ├─ Read DEPLOYMENT_GUIDE.md (sections 1-3)
  ├─ Setup VPS (Node, npm, Nginx, PM2)
  ├─ Create Nginx config
  ├─ Configure PM2
  └─ Deploy app manually

Phase 2: Automation (1 hour)
  ├─ Setup Cloudflare DNS
  ├─ Get SSL certificate
  ├─ Add GitHub secrets
  ├─ Push GitHub Actions workflow
  └─ Test first automatic deployment

Phase 3: Refinement (ongoing)
  ├─ Monitor logs
  ├─ Understand metrics
  ├─ Setup auto-renewal (certbot)
  ├─ Configure backups
  └─ Optimize performance

Phase 4: Mastery (ongoing)
  ├─ Multiple projects on same VPS
  ├─ Environment variable management
  ├─ Advanced monitoring
  ├─ Disaster recovery
  └─ Performance optimization
```

---

This architecture ensures:
- ✅ **Security**: HTTPS encryption, firewall, SSH keys
- ✅ **Reliability**: Auto-restart, backups, monitoring
- ✅ **Performance**: Reverse proxy, CDN-ready
- ✅ **Maintainability**: Automated deployments, clear logs
- ✅ **Scalability**: Can add more projects/ports
