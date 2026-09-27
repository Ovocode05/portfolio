# Production deployment notes

This project can be hosted as a single static site plus a small Express API.

## Files
- nginx-portfolio.conf: example nginx config
- scripts/deploy-ubuntu.sh: Ubuntu setup helper

## Quick deploy
1. Copy this project to /var/www/retro-facebook-portfolio
2. Install backend dependencies in /var/www/retro-facebook-portfolio/backend
3. Point nginx config to your domain
4. Start the backend as a systemd service

Example:

```bash
sudo bash /var/www/retro-facebook-portfolio/scripts/deploy-ubuntu.sh your-domain.com
```

If you want HTTPS, install Certbot and run:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```
