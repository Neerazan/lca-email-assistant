# Deployment Troubleshooting Guide

Quick solutions for common issues when deploying to your VPS.

---

## 🔴 502 Bad Gateway Error

### Symptoms
- Website shows "502 Bad Gateway" error
- App is not processing requests

### Solutions

**Step 1: Check if application is running**
```bash
pm2 status
# Look for lca-email-assistant status
```

**Step 2: If app is running, restart it**
```bash
pm2 restart lca-email-assistant
sleep 3
pm2 logs lca-email-assistant --lines 20
```

**Step 3: Check if port 3001 is listening**
```bash
netstat -tuln | grep 3001
# Should show: tcp 0 0 127.0.0.1:3001
```

**Step 4: Check Nginx logs**
```bash
sudo tail -f /var/log/nginx/error.log
```

**Step 5: If still not working, check memory**
```bash
pm2 monit
# If memory is full, restart:
pm2 stop lca-email-assistant
pm2 start ecosystem.config.js
```

**Step 6: Hard rebuild**
```bash
pm2 stop lca-email-assistant
pm2 delete lca-email-assistant
cd /var/www/lca-email-assistant
rm -rf node_modules .next
npm ci --omit=dev
npm run build
pm2 start ecosystem.config.js
```

---

## 🔴 DNS Not Resolving (app.dhakalnirajan.com.np not found)

### Symptoms
- `nslookup app.dhakalnirajan.com.np` shows error
- Website not accessible by domain
- But VPS IP works

### Solutions

**Step 1: Check Cloudflare DNS records**
1. Go to https://dash.cloudflare.com/
2. Select `dhakalnirajan.com.np`
3. Go to `DNS` tab
4. Look for `app` A record pointing to your VPS IP
5. If missing, add it:
   - Name: `app`
   - Type: `A`
   - IPv4: YOUR_VPS_IP
   - Proxy: Proxied (orange cloud)

**Step 2: Flush DNS cache**
```bash
# On your local machine (Windows, Mac, or Linux)

# macOS:
sudo dscacheutil -flushcache

# Linux:
sudo systemctl restart systemd-resolved

# Windows (run as admin):
ipconfig /flushdns

# Or query directly:
nslookup app.dhakalnirajan.com.np 8.8.8.8
```

**Step 3: Check from VPS**
```bash
# On VPS, check if domain resolves to itself
nslookup app.dhakalnirajan.com.np
dig app.dhakalnirajan.com.np
```

**Step 4: Wait for DNS propagation**
DNS changes can take 15 minutes to 48 hours. Wait and try again.

**Step 5: Check Cloudflare nameservers**
1. Go to Cloudflare > Nameservers section
2. Compare with nameservers in your domain registrar
3. They should match
4. If not, update them at registrar

---

## 🔴 SSL Certificate Error (ERR_SSL_VERSION_OR_CIPHER_UNSUITABLE)

### Symptoms
- Browser shows SSL certificate error
- HTTPS not working
- Certificate not valid warning

### Solutions

**Step 1: Check certificate exists**
```bash
sudo ls -la /etc/letsencrypt/live/app.dhakalnirajan.com.np/
# Should show: fullchain.pem and privkey.pem
```

**Step 2: If certificate doesn't exist, create it**
```bash
sudo certbot certonly --nginx -d app.dhakalnirajan.com.np
```

**Step 3: Check certificate expiration**
```bash
sudo certbot certificates
# Look for expiration date
```

**Step 4: Renew certificate**
```bash
sudo certbot renew --nginx
```

**Step 5: Reload Nginx**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

**Step 6: If Nginx won't load, check syntax**
```bash
sudo nginx -T  # Show all config with errors
```

**Step 7: Force certificate renewal**
```bash
sudo certbot renew --force-renewal
```

---

## 🔴 Application Won't Start

### Symptoms
- PM2 shows error status
- App starts but immediately stops
- Cannot access application

### Solutions

**Step 1: Check PM2 logs**
```bash
pm2 logs lca-email-assistant
pm2 logs lca-email-assistant --err
```

**Step 2: Check Node process**
```bash
ps aux | grep node
```

**Step 3: Check if someone else is using port 3001**
```bash
sudo lsof -i :3001
# If something else is using it, kill it:
sudo kill -9 PROCESS_ID
```

**Step 4: Try starting manually**
```bash
cd /var/www/lca-email-assistant
node_modules/next/dist/bin/next start
# Wait 5 seconds and check for errors
# Press Ctrl+C to stop
```

**Step 5: Check for build errors**
```bash
cd /var/www/lca-email-assistant
npm run build
# Look for build errors in output
```

**Step 6: Verify dependencies installed**
```bash
npm list
# Look for missing dependencies
npm ci --omit=dev
npm run build
```

**Step 7: Check environment variables**
```bash
echo $NODE_ENV
# Should be "production"
```

**Step 8: Full reset and restart**
```bash
pm2 stop all
pm2 delete all
cd /var/www/lca-email-assistant
rm -rf node_modules .next
npm ci --omit=dev
npm run build
pm2 start ecosystem.config.js
sleep 3
pm2 logs lca-email-assistant --lines 30
```

---

## 🔴 GitHub Actions Deployment Fails

### Symptoms
- Workflow shows red X
- Deployment doesn't complete
- Errors in GitHub Actions logs

### Solutions

**Step 1: Check GitHub Actions logs**
1. Go to GitHub repository
2. Click `Actions` tab
3. Click on failed workflow
4. Check the error in the logs

**Step 2: Verify GitHub Secrets**
1. Go to `Settings > Secrets and variables > Actions`
2. Verify all secrets exist:
   - `VPS_HOST`
   - `VPS_USER`
   - `VPS_SSH_KEY`
   - `DEPLOY_PATH`

**Step 3: Test SSH connection**
```bash
# On VPS, test SSH login works:
ssh -i /path/to/private/key user@VPS_IP
# Should connect without password

# On local machine, test the key:
ssh -i ~/.ssh/id_ed25519 user@VPS_IP
```

**Step 4: Check SSH key format**
```bash
# Private key should start with:
-----BEGIN OPENSSH PRIVATE KEY-----
# or
-----BEGIN ED25519 PRIVATE KEY-----

# Not:
-----BEGIN RSA PRIVATE KEY----- (old format)
```

**Step 5: Regenerate SSH key if needed**
```bash
# On VPS:
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519
# Copy entire output (including -----BEGIN and -----END)
# Update GitHub secret VPS_SSH_KEY
```

**Step 6: Check deploy path permissions**
```bash
# On VPS, verify deploy directory is accessible:
ls -la /var/www/lca-email-assistant
# Should show your user owns it
```

**Step 7: Verify build succeeds locally first**
```bash
npm install
npm run build
# If this fails locally, it will fail in Actions too
```

---

## 🔴 Out of Memory / Application Crashes

### Symptoms
- Application randomly restarts
- Memory usage increases over time
- PM2 shows app restarted many times

### Solutions

**Step 1: Check memory allocation**
```bash
pm2 monit
# Shows real-time CPU and memory usage
```

**Step 2: Increase memory limit**
Edit `ecosystem.config.js`:
```javascript
max_memory_restart: '1000M'  // Increase from 500M to 1000M
```

Then restart:
```bash
pm2 restart lca-email-assistant
```

**Step 3: Check for memory leaks**
```bash
pm2 logs lca-email-assistant | tail -100
# Look for growing memory numbers
```

**Step 4: Monitor server resources**
```bash
top
# Press 'M' to sort by memory
# Look for Node.js process
```

**Step 5: If low on disk space**
```bash
df -h
# Check available space

# Clean up:
sudo rm -rf /var/log/pm2/*.log  # Clear old logs
npm cache clean --force
```

**Step 6: Restart with single instance**
Ensure `ecosystem.config.js` has:
```javascript
instances: 1,
exec_mode: 'fork'
```

---

## 🔴 Nginx Configuration Error

### Symptoms
- `sudo systemctl reload nginx` fails
- Nginx won't start
- "Invalid configuration" error

### Solutions

**Step 1: Check Nginx syntax**
```bash
sudo nginx -t
# Shows specific error location
```

**Step 2: Check Nginx config file**
```bash
sudo cat /etc/nginx/sites-enabled/lca-email-assistant
# Look for syntax errors (missing semicolons, braces, etc.)
```

**Step 3: Recreate Nginx config from scratch**
```bash
sudo nano /etc/nginx/sites-available/lca-email-assistant
```

Copy-paste the exact config from `DEPLOYMENT_GUIDE.md` section 2.1

**Step 4: Check if upstream is correct**
```bash
netstat -tuln | grep 3001
# Should show application listening on 127.0.0.1:3001
```

**Step 5: Reload Nginx**
```bash
sudo systemctl reload nginx
# or restart if reload doesn't work:
sudo systemctl restart nginx
```

**Step 6: Check Nginx started**
```bash
sudo systemctl status nginx
curl http://127.0.0.1
# Should show error (which is fine, app is on 3001)
```

---

## 🔴 Cannot SSH to VPS

### Symptoms
- Permission denied
- Connection refused
- Cannot authenticate

### Solutions

**Step 1: Check SSH command**
```bash
ssh -v user@VPS_IP
# Shows verbose connection details
```

**Step 2: Check SSH key permissions**
```bash
ls -la ~/.ssh/
# id_ed25519 should be: -rw------- (600)
# id_ed25519.pub should be: -rw-r--r-- (644)

chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
```

**Step 3: Check if public key is on VPS**
```bash
cat ~/.ssh/id_ed25519.pub
# This should be in ~/.ssh/authorized_keys on VPS
```

**Step 4: Add key if not present**
```bash
# On local machine:
ssh-copy-id -i ~/.ssh/id_ed25519 user@VPS_IP
```

**Step 5: Check VPS SSH config**
```bash
sudo nano /etc/ssh/sshd_config
# Look for:
# PubkeyAuthentication yes
# PasswordAuthentication no (if using keys only)
```

**Step 6: Restart SSH service on VPS**
```bash
sudo systemctl restart ssh
```

---

## 🔴 Subdomain Not Working But Main Domain Works

### Symptoms
- `dhakalnirajan.com.np` works
- `app.dhakalnirajan.com.np` doesn't work
- Cloudflare shows subdomain created

### Solutions

**Step 1: Verify DNS record exists**
```bash
nslookup app.dhakalnirajan.com.np
# Should return VPS IP
```

**Step 2: Check Cloudflare DNS**
1. Go to Cloudflare
2. Select domain
3. Click DNS tab
4. Look for `app` record
5. If missing, create it

**Step 3: Wait for DNS propagation**
```bash
# Check multiple DNS servers:
nslookup app.dhakalnirajan.com.np 1.1.1.1   # Cloudflare DNS
nslookup app.dhakalnirajan.com.np 8.8.8.8   # Google DNS
nslookup app.dhakalnirajan.com.np 208.67.222.222  # OpenDNS
```

**Step 4: Check Nginx is listening on subdomain**
```bash
sudo nginx -t
# Check config includes subdomain
sudo cat /etc/nginx/sites-enabled/lca-email-assistant | grep server_name
```

**Step 5: Clear DNS cache and try again**
```bash
# On local machine:

# macOS:
sudo dscacheutil -flushcache

# Linux:
sudo systemctl restart systemd-resolved

# Windows (as admin):
ipconfig /flushdns
```

---

## 🔴 Application Slow / High Load

### Symptoms
- Website is very slow
- Takes long time to load pages
- CPU usage is high

### Solutions

**Step 1: Check server resources**
```bash
top
# Shows CPU and memory usage
# Press 'q' to quit

# Or use:
htop
```

**Step 2: Check if other apps using resources**
```bash
ps aux --sort=-%cpu | head -20
# Shows top processes by CPU
```

**Step 3: Check disk I/O**
```bash
iostat -x 1
# Shows disk usage
```

**Step 4: Check application logs**
```bash
pm2 logs lca-email-assistant --lines 100
# Look for errors or warnings
```

**Step 5: Check network connections**
```bash
netstat -an | grep CONNECTED | wc -l
# Shows number of active connections
```

**Step 6: Optimize Next.js build**
```bash
cd /var/www/lca-email-assistant
npm run build
# Look for any warnings during build
```

**Step 7: Reduce PM2 memory usage**
In `ecosystem.config.js`:
```javascript
max_memory_restart: '300M'  // Lower threshold for restart
```

**Step 8: Check Nginx performance**
```bash
sudo nginx -s reload
# Reload Nginx without dropping connections
```

---

## 🔴 Commits/Pushes from GitHub Actions Not Working

### Symptoms
- Deployment workflow can't pull latest code
- "Permission denied" when pulling
- "fatal: unable to access repository"

### Solutions

**Step 1: Verify repository URL**
```bash
cd /var/www/lca-email-assistant
git remote -v
# Should show https or ssh URL
```

**Step 2: If using HTTPS, add credentials**
```bash
# Create .git-credentials:
echo "https://USERNAME:PERSONAL_TOKEN@github.com" > ~/.git-credentials

# Configure git:
git config credential.helper store
git config credential.username USERNAME
```

Get personal token from: GitHub > Settings > Developer settings > Personal access tokens

**Step 3: If using SSH, verify key**
```bash
ssh -T git@github.com
# Should say "Hi USERNAME"
```

**Step 4: Update remote to SSH**
```bash
git remote set-url origin git@github.com:Neerazan/lca-email-assistant.git
git pull origin main
```

**Step 5: In GitHub Actions, ensure SSH key is set**
Check `VPS_SSH_KEY` secret is correct SSH private key

---

## 🔴 Port Already in Use

### Symptoms
- PM2 says port 3001 already in use
- "EADDRINUSE" error
- Application won't start on 3001

### Solutions

**Step 1: Find what's using the port**
```bash
sudo lsof -i :3001
# Shows process using port 3001
```

**Step 2: Kill the process**
```bash
sudo kill -9 PROCESS_ID
# Or more gracefully:
kill -TERM PROCESS_ID
```

**Step 3: Change port** (if you want different port)
Edit `ecosystem.config.js`:
```javascript
port: 3002,  // Change to different port
```

Then update Nginx:
```bash
sudo nano /etc/nginx/sites-available/lca-email-assistant
# Change upstream port from 3001 to 3002
```

**Step 4: Restart services**
```bash
sudo nginx -t && sudo systemctl reload nginx
pm2 restart lca-email-assistant
```

---

## 🟡 Useful Debugging Commands

**Monitor everything live:**
```bash
pm2 monit
```

**Check all processes:**
```bash
pm2 list
pm2 status
```

**See detailed errors:**
```bash
pm2 logs lca-email-assistant
pm2 logs lca-email-assistant --err
pm2 describe lca-email-assistant
```

**Check system resources:**
```bash
free -h                    # Memory
df -h                      # Disk space
top                        # Processes
```

**Check network:**
```bash
netstat -tuln              # Listening ports
netstat -an | grep ESTAB   # Established connections
```

**Check domain/DNS:**
```bash
nslookup app.dhakalnirajan.com.np
dig app.dhakalnirajan.com.np
curl -I https://app.dhakalnirajan.com.np
```

**Check SSL:**
```bash
sudo certbot certificates
echo | openssl s_client -servername app.dhakalnirajan.com.np -connect app.dhakalnirajan.com.np:443 2>/dev/null | openssl x509 -noout -dates
```

---

## 📋 Debug Information Collection

When reporting issues, collect this information:

```bash
# VPS Info
uname -a
node --version
npm --version

# Application Status
pm2 status
pm2 logs lca-email-assistant --lines 50

# Nginx Status
sudo systemctl status nginx
sudo nginx -t

# Port Status
netstat -tuln | grep -E "80|443|3001"

# DNS Status
nslookup app.dhakalnirajan.com.np

# System Resources
free -h
df -h
top -b -n 1 | head -20

# SSL Certificate
sudo certbot certificates
```

Paste this information when asking for help.

---

## Getting Help

1. **Check logs first** - Most issues are visible in logs
2. **Gather debug info** - Use commands above
3. **Check this guide** - Likely solution is here
4. **Check DEPLOYMENT_GUIDE.md** - For setup info
5. **Check GitHub Actions logs** - For CI/CD issues

**Common log locations:**
- Application: `pm2 logs lca-email-assistant`
- Nginx errors: `/var/log/nginx/error.log`
- PM2 logs: `/var/log/pm2/lca-assistant-error.log`
- System: `journalctl -xe` (recent errors)
