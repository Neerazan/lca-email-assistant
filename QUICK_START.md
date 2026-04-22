# Quick Start Deployment Checklist

Follow these steps in order to deploy your Next.js app.

**Your Details:**
- Domain: `dhakalnirajan.com.np`
- Subdomain: `app.dhakalnirajan.com.np` (change if needed)
- VPS Port: `3001`
- Deploy Path: `/var/www/lca-email-assistant`
- App Name: `lca-email-assistant`

---

## PHASE 1: VPS Setup (Run on VPS)

### 1️⃣ Connect to VPS
```bash
ssh root@YOUR_VPS_IP
```

### 2️⃣ Copy all commands below and paste into VPS terminal:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install PM2 globally
sudo npm install -g pm2

# Install Git
sudo apt install -y git

# Setup firewall
sudo ufw allow 22/tcp && sudo ufw allow 80/tcp && sudo ufw allow 443/tcp && sudo ufw enable

# Create project directory
sudo mkdir -p /var/www/lca-email-assistant
sudo chown $USER:$USER /var/www/lca-email-assistant
cd /var/www/lca-email-assistant

# Clone repository
git clone https://github.com/Neerazan/lca-email-assistant.git .
```

### 3️⃣ Verify installation
```bash
node --version    # Should show v20.x.x
npm --version     # Should show 10.x.x or higher
nginx -v          # Should show nginx version
pm2 --version     # Should show PM2 version
git --version     # Should show git version
```

---

## PHASE 2: Create Nginx Configuration

### 4️⃣ Create Nginx config file
```bash
sudo nano /etc/nginx/sites-available/lca-email-assistant
```

**Paste this content** (press `Ctrl+Shift+V`):
```nginx
upstream lca_backend {
    server 127.0.0.1:3001;
}

server {
    listen 80;
    listen [::]:80;
    server_name app.dhakalnirajan.com.np;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name app.dhakalnirajan.com.np;

    ssl_certificate /etc/letsencrypt/live/app.dhakalnirajan.com.np/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.dhakalnirajan.com.np/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    client_max_body_size 10M;

    location / {
        proxy_pass http://lca_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
    }
}
```

Then press `Ctrl+X`, then `Y`, then `Enter` to save.

### 5️⃣ Enable site and restart Nginx
```bash
sudo ln -s /etc/nginx/sites-available/lca-email-assistant /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## PHASE 3: Setup PM2

### 6️⃣ Ensure ecosystem.config.js exists in project
Check that file exists at: `/var/www/lca-email-assistant/ecosystem.config.js`

If not, create it:
```bash
cat > /var/www/lca-email-assistant/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'lca-email-assistant',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/lca-email-assistant',
    port: 3001,
    env: { NODE_ENV: 'production' },
    autorestart: true,
    max_memory_restart: '500M',
    error_file: '/var/log/pm2/lca-assistant-error.log',
    out_file: '/var/log/pm2/lca-assistant-out.log',
  }]
};
EOF
```

### 7️⃣ Setup PM2 startup
```bash
mkdir -p /var/log/pm2
pm2 startup
# Copy and run the command provided in output
pm2 save
```

---

## PHASE 4: Cloudflare DNS Setup

### 8️⃣ Add DNS Record to Cloudflare

1. Go to: https://dash.cloudflare.com/
2. Select domain: `dhakalnirajan.com.np`
3. Click `DNS` tab
4. Click `+ Add record`
5. Fill in:
   - **Type:** A
   - **Name:** app
   - **IPv4 Address:** YOUR_VPS_IP
   - **TTL:** Auto
   - **Proxy status:** Proxied (orange cloud)
6. Click Save

### 9️⃣ Configure SSL in Cloudflare
1. Go to `SSL/TLS` tab
2. Set **Mode** to `Full`
3. Go to `Edge Certificates`
4. Enable `Always Use HTTPS`

### 🔟 Verify DNS (run this on VPS):
```bash
nslookup app.dhakalnirajan.com.np
# Should show your VPS IP
```

---

## PHASE 5: Get SSL Certificate

### 1️⃣1️⃣ Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 1️⃣2️⃣ Get SSL Certificate
```bash
sudo certbot certonly --nginx -d app.dhakalnirajan.com.np
# Follow prompts, use email for important notices
```

### 1️⃣3️⃣ Setup auto-renewal
```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## PHASE 6: Deploy Application

### 1️⃣4️⃣ Install dependencies and build
```bash
cd /var/www/lca-email-assistant
npm install --production
npm run build
```

### 1️⃣5️⃣ Start with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
```

### 1️⃣6️⃣ Verify everything works
```bash
# Check PM2 status
pm2 status

# Check if listening on port 3001
netstat -tuln | grep 3001

# Check Nginx
sudo systemctl status nginx

# Test from VPS
curl http://127.0.0.1:3001
```

### 1️⃣7️⃣ Test via domain
From your local machine:
```bash
curl https://app.dhakalnirajan.com.np
```

Or open in browser: https://app.dhakalnirajan.com.np

---

## PHASE 7: GitHub Actions Setup

### 1️⃣8️⃣ Create GitHub Secrets

Go to: `GitHub Repository > Settings > Secrets and variables > Actions`

Click `New repository secret` and add these:

| Name | Value |
|------|-------|
| `VPS_HOST` | Your VPS IP address |
| `VPS_USER` | root (or your SSH user) |
| `VPS_SSH_KEY` | Your private SSH key content |
| `DEPLOY_PATH` | /var/www/lca-email-assistant |

**To get VPS_SSH_KEY:**
```bash
# On VPS, generate SSH key if needed:
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N ""

# Display the private key:
cat ~/.ssh/id_ed25519
# Copy the entire output including -----BEGIN and -----END lines
# Paste into GitHub secret
```

If using existing key on local machine:
```bash
# On your local machine
cat ~/.ssh/id_ed25519
# Copy and paste to GitHub
```

### 1️⃣9️⃣ Copy workflow files

The workflow files are already created:
- `.github/workflows/deploy.yml` (recommended - full CI/CD)
- `.github/workflows/deploy-simple.yml` (simpler alternative)

**Commit and push to GitHub:**
```bash
git add .
git commit -m "Add deployment files"
git push origin main
```

### 2️⃣0️⃣ Test GitHub Actions

1. Make a small change to your code
2. Push to main branch:
   ```bash
   git add .
   git commit -m "Test deployment"
   git push origin main
   ```
3. Go to GitHub > Actions tab
4. Watch the deployment run in real-time
5. After success, your app will restart with new code

---

## Useful Commands After Deployment

### Check Application Status
```bash
pm2 status
pm2 logs lca-email-assistant
```

### View Live Logs
```bash
pm2 logs lca-email-assistant --lines 50
```

### Restart Application
```bash
pm2 restart lca-email-assistant
```

### Stop Application
```bash
pm2 stop lca-email-assistant
```

### Start Application
```bash
pm2 start lca-email-assistant
```

### Check Nginx
```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### Check if app responds
```bash
curl https://app.dhakalnirajan.com.np
```

### SSH Key Generation (if needed)
```bash
# Generate new SSH key
ssh-keygen -t ed25519 -C "deploy@vps"
# Press Enter for defaults
cat ~/.ssh/id_ed25519
```

---

## Troubleshooting

### Issue: 502 Bad Gateway
```bash
pm2 status  # Check if app is running
pm2 restart lca-email-assistant
pm2 logs lca-email-assistant
```

### Issue: DNS not resolving
```bash
nslookup app.dhakalnirajan.com.np 8.8.8.8
dig app.dhakalnirajan.com.np @1.1.1.1
```

### Issue: SSL Certificate Error
```bash
sudo certbot certonly --nginx -d app.dhakalnirajan.com.np --force-renewal
```

### Issue: Port 3001 not listening
```bash
netstat -tuln | grep 3001
pm2 logs lca-email-assistant  # Check for errors
```

### Issue: Out of memory
```bash
pm2 monit           # Check memory usage
pm2 stop all
pm2 start ecosystem.config.js
```

---

## Subsequent Deployments

After initial setup, just push to main branch:

```bash
# Make your changes
git add .
git commit -m "Your changes"
git push origin main

# GitHub Actions automatically:
# 1. Builds your project
# 2. Runs tests/lint
# 3. Deploys to VPS
# 4. Restarts PM2
```

---

## Environment Variables in Production

Create `.env.production` file in project root:
```bash
echo "NODE_ENV=production" > /var/www/lca-email-assistant/.env.production
echo "NEXT_TELEMETRY_DISABLED=1" >> /var/www/lca-email-assistant/.env.production
# Add any other env vars needed
```

Then rebuild:
```bash
npm run build
pm2 restart lca-email-assistant
```

---

## Multiple Projects on Same VPS

To host another project:

1. Change port: 3002, 3003, etc.
2. Change subdomain: api.domain.com, admin.domain.com, etc.
3. Change app name: lca-backend, lca-admin, etc.
4. Repeat Nginx config with different port and domain
5. Repeat PM2 ecosystem config with new app name/port

---

## Final Checklist Before Going Live

- [ ] VPS setup completed (Node, npm, Nginx, PM2, Git)
- [ ] Nginx config created for subdomain
- [ ] SSL certificate obtained from Certbot
- [ ] PM2 ecosystem config in place
- [ ] Application deployed and running
- [ ] Cloudflare DNS pointing to VPS
- [ ] GitHub secrets configured
- [ ] GitHub Actions workflow in repo
- [ ] Verified access via https://app.dhakalnirajan.com.np
- [ ] PM2 startup configured (survives reboots)
- [ ] Logs accessible and being monitored

---

**Need Help?** Check logs first:
```bash
pm2 logs lca-email-assistant     # App logs
sudo tail -f /var/log/nginx/error.log  # Nginx errors
```
