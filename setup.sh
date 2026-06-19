export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y software-properties-common nginx
add-apt-repository ppa:ondrej/php -y
apt-get update
apt-get install -y php8.3-fpm php8.3-cli php8.3-common php8.3-mysql php8.3-zip php8.3-gd php8.3-mbstring php8.3-curl php8.3-xml php8.3-bcmath

cat > /etc/nginx/sites-available/simpatik << 'EOF'
server {
    listen 80;
    server_name _;
    root /var/www/simpatik/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php index.html index.htm;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
EOF

ln -sf /etc/nginx/sites-available/simpatik /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

mkdir -p /var/www/simpatik/public
chown -R www-data:www-data /var/www/simpatik

systemctl restart php8.3-fpm
systemctl restart nginx

