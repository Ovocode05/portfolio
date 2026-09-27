#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/retro-facebook-portfolio"
BACKEND_DIR="$APP_DIR/backend"
NGINX_SITE="/etc/nginx/sites-available/retro-facebook-portfolio"
NGINX_ENABLED="/etc/nginx/sites-enabled/retro-facebook-portfolio"
DOMAIN="${1:-your-domain.com}"

if [[ $EUID -ne 0 ]]; then
  echo "Run this script as root or with sudo."
  exit 1
fi

apt update
apt install -y nginx nodejs npm
mkdir -p "$APP_DIR"
if [ -d "$APP_DIR/.git" ] || [ -f "$APP_DIR/package.json" ]; then
  echo "Project already exists at $APP_DIR"
else
  echo "Copy the project folder to $APP_DIR first."
  exit 1
fi

cd "$BACKEND_DIR"
npm install --production

cat > "$NGINX_SITE" <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    root $APP_DIR;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3001/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
}
EOF

ln -sf "$NGINX_SITE" "$NGINX_ENABLED"
nginx -t
systemctl reload nginx

cat > /etc/systemd/system/retro-portfolio-backend.service <<EOF
[Unit]
Description=Retro Portfolio Blog Backend
After=network.target

[Service]
WorkingDirectory=$BACKEND_DIR
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=3
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now retro-portfolio-backend.service

echo "Deployment setup complete."
echo "Open http://$DOMAIN"
