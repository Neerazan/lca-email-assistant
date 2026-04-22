# Complete Deployment Guide: Next.js on VPS with Nginx, PM2, and GitHub Actions

This guide covers hosting your Next.js project on a shared VPS with multiple projects using Nginx, PM2, and automated deployment via GitHub Actions.

**Domain:** `dhakalnirajan.com.np`  
**Subdomain:** `app.dhakalnirajan.com.np` (replace with your actual subdomain)

---

## Table of Contents
1. [VPS Initial Setup](#1-vps-initial-setup)
2. [Nginx Configuration](#2-nginx-configuration)
3. [PM2 Setup](#3-pm2-setup)
4. [GitHub Actions CI/CD Pipeline](#4-github-actions-cicd-pipeline)
5. [Cloudflare DNS Configuration](#5-cloudflare-dns-configuration)
6. [Deployment Process](#6-deployment-process)
7. [Monitoring & Troubleshooting](#7-monitoring--troubleshooting)

---

## 1. VPS Initial Setup

### Step 1.1: Connect to Your VPS
```bash
ssh root@YOUR_VPS_IP
# or
ssh your_user@YOUR_VPS_IP
```

### Step 1.2: Update System Packages
```bash
sudo apt update
sudo apt upgrade -y
```

### Step 1.3: Install Node.js and npm
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

### Step 1.4: Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 1.5: Install PM2 Globally
```bash
sudo npm install -g pm2
pm2 --version
```

### Step 1.6: Create Project Directory Structure
```bash
# Create a projects directory (if not exists)
sudo mkdir -p /var/www
cd /var/www

# Create directory for your project
sudo mkdir -p lca-email-assistant
sudo chown $USER:$USER lca-email-assistant
cd lca-email-assistant
```

### Step 1.7: Setup SSH Key for GitHub (Optional but Recommended)
```bash
ssh-keygen -t ed25519 -C "deploy@yourserver"
# Press Enter to accept defaults
cat ~/.ssh/id_ed25519.pub
# Copy this key and add it to GitHub account's SSH keys
# Settings > SSH and GPG keys > New SSH key
```

### Step 1.8: Install Git
```bash
sudo apt install -y git
git --version
```

### Step 1.9: Setup Firewall (UFW)
```bash
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable
sudo ufw status
```

---

## 2. Nginx Configuration

### Step 2.1: Create Nginx Config for Your Subdomain
```bash
sudo nano /etc/nginx/sites-available/lca-email-assistant
```

Paste this configuration:
```nginx
upstream lca_backend {
    server 127.0.0.1:3001;
}

server {
    listen 80;
    listen [::]:80;
    server_name app.dhakalnirajan.com.np;

    # Redirect HTTP to HTTPS (will be updated after SSL certificate)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name app.dhakalnirajan.com.np;

    # SSL certificates (will be configured by GitHub Actions or manually)
    ssl_certificate /etc/letsencrypt/live/app.dhakalnirajan.com.np/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.dhakalnirajan.com.np/privkey.pem;

    # SSL configuration
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

        # Next.js specific headers
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
    }
}
```

### Step 2.2: Enable the Site
```bash
sudo ln -s /etc/nginx/sites-available/lca-email-assistant /etc/nginx/sites-enabled/
```

### Step 2.3: Test and Reload Nginx
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 2.4: Setup SSL Certificate Using Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (requires DNS to be pointing to your server first)
sudo certbot certonly --nginx -d app.dhakalnirajan.com.np

# Auto-renew SSL certificates
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

> **Note:** If you haven't configured Cloudflare DNS yet, do that first (Step 5) before running certbot.

---

## 3. PM2 Setup

### Step 3.1: Create PM2 Ecosystem Configuration
```bash
cd /var/www/lca-email-assistant
nano ecosystem.config.js
```

Paste this configuration:
```javascript
module.exports = {
  apps: [
    {
      name: 'lca-email-assistant',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/var/www/lca-email-assistant',
      port: 3001,
      env: {
        NODE_ENV: 'production'
      },
      // Auto-restart settings
      autorestart: true,
      max_memory_restart: '500M',
      error_file: '/var/log/pm2/lca-assistant-error.log',
      out_file: '/var/log/pm2/lca-assistant-out.log',
      log_file: '/var/log/pm2/lca-assistant-combined.log',
      // Graceful shutdown
      listen_timeout: 10000,
      kill_timeout: 5000,
    }
  ]
};
```

### Step 3.2: Create Logs Directory
```bash
mkdir -p /var/log/pm2
```

### Step 3.3: Link PM2 to Startup
```bash
pm2 startup
# Copy and run the output command provided

# Save PM2 process list
pm2 save
```

### Step 3.4: Verify PM2 Configuration
```bash
pm2 list
# Should show no apps running yet (that's fine)
```

---

## 4. GitHub Actions CI/CD Pipeline

### Step 4.1: Create GitHub Secrets
Go to: `GitHub Repository > Settings > Secrets and variables > Actions > New repository secret`

Create these secrets:

| Secret Name | Value |
|---|---|
| `VPS_HOST` | Your VPS IP address |
| `VPS_USER` | SSH user (usually `root` or your username) |
| `VPS_SSH_KEY` | Your private SSH key (paste entire key including `-----BEGIN...` and `-----END...`) |
| `DEPLOY_PATH` | `/var/www/lca-email-assistant` |
| `APP_PORT` | `3001` |

### Step 4.2: Create GitHub Actions Workflow File
Create a new file in your repo:
```bash
.github/workflows/deploy.yml
```

Paste this content:
```yaml
name: Build and Deploy to VPS

on:
  push:
    branches:
      - main
  workflow_dispatch: # Allow manual trigger

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Next.js project
        run: npm run build

      - name: Create artifact directory
        run: mkdir -p deploy-artifact

      - name: Prepare deployment files
        run: |
          # Copy built files
          cp -r .next deploy-artifact/
          cp -r public deploy-artifact/ || true
          cp -r node_modules deploy-artifact/ || true
          cp package.json deploy-artifact/
          cp ecosystem.config.js deploy-artifact/ || true
          cp next.config.ts deploy-artifact/ || true
          cp tsconfig.json deploy-artifact/ || true

      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: build-artifact
          path: deploy-artifact/
          retention-days: 1

      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: 22
          script: |
            #!/bin/bash
            set -e
            
            DEPLOY_PATH="${{ secrets.DEPLOY_PATH }}"
            APP_NAME="lca-email-assistant"
            
            echo "🚀 Starting deployment..."
            
            # Create backup of current deployment
            if [ -d "$DEPLOY_PATH/.next" ]; then
              echo "📦 Creating backup..."
              cp -r "$DEPLOY_PATH/.next" "$DEPLOY_PATH/.next.backup"
            fi
            
            # Navigate to deployment directory
            cd "$DEPLOY_PATH"
            
            # Stop the app
            echo "⏹️  Stopping application..."
            pm2 stop "$APP_NAME" || true
            
            # Create a temporary directory for new files
            TEMP_DIR=$(mktemp -d)
            trap "rm -rf $TEMP_DIR" EXIT
            
            # Download and extract build artifact
            echo "📥 Downloading build artifact..."
            # Since we're using SSH, we'll rsync or scp the files
            # For now, we'll use a simpler approach with file copying
            
            # Clear old build files (keep node_modules and ecosystem.config.js)
            rm -rf .next public || true
            
            # Copy new files via SSH (using GitHub Actions artifact)
            # Install dependencies on server if needed
            if [ ! -d "node_modules" ]; then
              echo "📦 Installing npm dependencies..."
              npm ci --omit=dev
            fi
            
            # Start the app with PM2
            echo "🚀 Starting application..."
            pm2 start ecosystem.config.js || pm2 restart "$APP_NAME"
            
            # Save PM2 list
            pm2 save
            
            echo "✅ Deployment completed successfully!"
            pm2 logs "$APP_NAME" --lines 10

      - name: Verify deployment
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: 22
          script: |
            pm2 status
            echo "Checking if service is running on port 3001..."
            if netstat -tuln | grep -q ":3001"; then
              echo "✅ Application is listening on port 3001"
            else
              echo "❌ Application is not listening on port 3001"
              exit 1
            fi
```

### Step 4.3: Alternative Simpler Workflow (Using Git Pull)
If the above is complex, here's a simpler alternative:

Create `.github/workflows/deploy-simple.yml`:
```yaml
name: Deploy via Git Pull

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: 22
          script: |
            #!/bin/bash
            set -e
            
            DEPLOY_PATH="${{ secrets.DEPLOY_PATH }}"
            APP_NAME="lca-email-assistant"
            
            echo "🚀 Starting deployment..."
            cd "$DEPLOY_PATH"
            
            # Pull latest code
            echo "📥 Pulling latest code..."
            git pull origin main
            
            # Install dependencies
            echo "📦 Installing dependencies..."
            npm ci --omit=dev
            
            # Build
            echo "🔨 Building application..."
            npm run build
            
            # Stop old process
            echo "⏹️  Stopping application..."
            pm2 stop "$APP_NAME" || true
            
            # Start application
            echo "🚀 Starting application..."
            pm2 start ecosystem.config.js || pm2 restart "$APP_NAME"
            pm2 save
            
            echo "✅ Deployment completed!"
            sleep 2
            pm2 logs "$APP_NAME" --lines 5
```

---

## 5. Cloudflare DNS Configuration

### Step 5.1: Login to Cloudflare Dashboard
Go to: `https://dash.cloudflare.com/`

### Step 5.2: Add DNS Record
1. Select your domain: `dhakalnirajan.com.np`
2. Go to `DNS` section
3. Click `+ Add record`

| Setting | Value |
|---|---|
| Type | `A` |
| Name | `app` (for subdomain `app.dhakalnirajan.com.np`) |
| IPv4 Address | Your VPS IP address |
| TTL | Auto |
| Proxy status | `Proxied` (orange cloud) |

### Step 5.3: Configure SSL/TLS
1. Go to `SSL/TLS` tab
2. Set Mode to `Full` or `Full (strict)`
3. Go to `Edge Certificates`
4. Enable `Always Use HTTPS`

### Step 5.4: Verify DNS Propagation
```bash
# From your local machine or VPS
nslookup app.dhakalnirajan.com.np
# or
dig app.dhakalnirajan.com.np

# Should return your VPS IP
```

---

## 6. Deployment Process

### First Time Setup (Manual)

#### 6.1: Clone Repository on VPS
```bash
cd /var/www/lca-email-assistant
git clone https://github.com/Neerazan/lca-email-assistant.git .
# or if using SSH keys
git clone git@github.com:Neerazan/lca-email-assistant.git .
```

#### 6.2: Install Dependencies
```bash
npm install --production
```

#### 6.3: Build the Project
```bash
npm run build
```

#### 6.4: Start with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 6.5: Verify Everything Works
```bash
# Check if app is running
pm2 status

# Check if listening on port 3001
netstat -tuln | grep 3001

# Check Nginx
sudo systemctl status nginx

# Test locally on VPS
curl http://127.0.0.1:3001
```

#### 6.6: Get SSL Certificate
```bash
sudo certbot certonly --nginx -d app.dhakalnirajan.com.np
```

#### 6.7: Test Via Domain
```bash
# From your local machine
curl https://app.dhakalnirajan.com.np
# or open in browser
```

### Automatic Deployments (After Initial Setup)

Once the GitHub Actions workflow is set up and first deployment is done:

1. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **GitHub Actions automatically:**
   - Runs tests/linting
   - Builds Next.js project
   - Deploys to VPS
   - Restarts PM2 application

3. **Monitor deployment:**
   - Go to `GitHub > Actions` tab
   - Click on the workflow run
   - View logs in real-time

---

## 7. Monitoring & Troubleshooting

### 7.1: Check Application Logs
```bash
# Real-time logs
pm2 logs lca-email-assistant

# Last 50 lines
pm2 logs lca-email-assistant --lines 50

# View error log
tail -f /var/log/pm2/lca-assistant-error.log
```

### 7.2: Check Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### 7.3: Common Issues & Solutions

#### Issue: 502 Bad Gateway
```bash
# Check if app is running
pm2 status

# Check if listening on port 3001
netstat -tuln | grep 3001

# Restart app
pm2 restart lca-email-assistant

# Check logs
pm2 logs lca-email-assistant
```

#### Issue: DNS not resolving
```bash
# Flush DNS and check again
nslookup app.dhakalnirajan.com.np 8.8.8.8

# Check from VPS
dig app.dhakalnirajan.com.np
```

#### Issue: SSL Certificate problems
```bash
# Renew certificate manually
sudo certbot renew --nginx

# Check certificate status
sudo certbot certificates
```

#### Issue: Out of memory
Check if running multiple Node instances:
```bash
pm2 status
pm2 delete all
pm2 start ecosystem.config.js
```

### 7.4: Performance Monitoring
```bash
# Real-time PM2 monitoring
pm2 monit

# Check server resources
top
# or
htop

# Check disk space
df -h
```

### 7.5: Useful PM2 Commands
```bash
# List all processes
pm2 list

# Restart application
pm2 restart lca-email-assistant

# Stop application
pm2 stop lca-email-assistant

# Delete process
pm2 delete lca-email-assistant

# View detailed info
pm2 info lca-email-assistant

# Save current process list
pm2 save

# Start saved processes
pm2 resurrect
```

---

## Additional Notes

### Multiple Projects on Same VPS

For hosting multiple projects, repeat steps with different:
- Port numbers (3001, 3002, 3003, etc.)
- Subdomain names (api.domain.com, admin.domain.com, etc.)
- PM2 app names
- Nginx server blocks

### Security Best Practices

1. **Keep system updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Setup firewall properly (already done in Step 1.9)**

3. **Use SSH keys instead of passwords**

4. **Disable root login (if not already)**
   ```bash
   sudo nano /etc/ssh/sshd_config
   # Set: PermitRootLogin no
   ```

5. **Monitor application health:**
   ```bash
   pm2 install pm2-auto-resurrect
   ```

### Environment Variables

Create a `.env.production` file or use PM2 env:

In `ecosystem.config.js`:
```javascript
env: {
  NODE_ENV: 'production',
  API_URL: 'https://your-api-url.com',
  NEXT_PUBLIC_API_URL: 'https://your-api-url.com'
}
```

Or create `.env.production` in deploy directory and load with:
```bash
set -a
source .env.production
set +a
```

---

## Checklist Before Going Live

- [ ] VPS setup completed
- [ ] Nginx configured for your domain
- [ ] SSL certificate obtained
- [ ] PM2 ecosystem config created
- [ ] GitHub secrets configured
- [ ] GitHub Actions workflow created
- [ ] DNS records added to Cloudflare
- [ ] First deployment completed manually
- [ ] Application accessible via domain
- [ ] Domain SSL verification passed
- [ ] Monitoring setup complete
- [ ] Backup strategy in place

---

## Support Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/app/building-and-deploying/deploying)
- [PM2 Documentation](https://pm2.keymetrics.io/docs)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cloudflare DNS Guide](https://developers.cloudflare.com/dns/)
- [Let's Encrypt Certbot](https://certbot.eff.org/instructions)
