# ETAPA 1: Builder (PHP, Composer)FROM php:8.3-fpm-alpine

FROM php:8.3-fpm-alpine AS builder

RUN apk add --no-cache postgresql-dev libzip-dev zip unzip git curl nginx supervisor

# Instalar dependencias del sistema

RUN apk add --no-cache \RUN docker-php-ext-install pdo pdo_pgsql pgsql zip

    git \

    unzip \COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

    zip \

    postgresql-dev \WORKDIR /var/www/html

    libzip-dev \

    oniguruma-dev \COPY . .

    $PHPIZE_DEPS

RUN composer install --no-dev --optimize-autoloader --no-interaction

# Instalar extensiones PHP

RUN docker-php-ext-install \RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

    pdo \

    pdo_pgsql \RUN mkdir -p /etc/nginx/http.d /etc/supervisor/conf.d /var/log/supervisor /run/php

    pgsql \

    mbstring \RUN printf "user nginx;\nworker_processes auto;\nerror_log /var/log/nginx/error.log warn;\npid /var/run/nginx.pid;\nevents { worker_connections 1024; }\nhttp {\n  include /etc/nginx/mime.types;\n  default_type application/octet-stream;\n  access_log /var/log/nginx/access.log;\n  sendfile on;\n  keepalive_timeout 65;\n  include /etc/nginx/http.d/*.conf;\n}" > /etc/nginx/nginx.conf

    bcmath \

    opcache \RUN printf "server {\n  listen 8080;\n  root /var/www/html/public;\n  index index.php;\n  location / {\n    try_files \$uri \$uri/ /index.php?\$query_string;\n  }\n  location ~ \.php\$ {\n    fastcgi_pass unix:/run/php/php8.3-fpm.sock;\n    fastcgi_index index.php;\n    fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;\n    include fastcgi_params;\n  }\n}" > /etc/nginx/http.d/default.conf

    zip

RUN printf "[supervisord]\nnodaemon=true\nlogfile=/var/log/supervisor/supervisord.log\npidfile=/var/run/supervisord.pid\n\n[program:php-fpm]\ncommand=/usr/local/sbin/php-fpm --nodaemonize --fpm-config /usr/local/etc/php-fpm.d/www.conf\nautostart=true\nautorestart=true\nstdout_logfile=/var/log/supervisor/php-fpm.log\nstderr_logfile=/var/log/supervisor/php-fpm-error.log\n\n[program:nginx]\ncommand=/usr/sbin/nginx -g \"daemon off;\"\nautostart=true\nautorestart=true\nstdout_logfile=/var/log/supervisor/nginx.log\nstderr_logfile=/var/log/supervisor/nginx-error.log" > /etc/supervisor/conf.d/supervisord.conf

# Instalar Composer

COPY --from=composer:latest /usr/bin/composer /usr/bin/composerRUN printf "[www]\nuser = nginx\ngroup = nginx\nlisten = /run/php/php8.3-fpm.sock\nlisten.owner = nginx\nlisten.group = nginx\nlisten.mode = 0660\npm = dynamic\npm.max_children = 5\npm.start_servers = 2\npm.min_spare_servers = 1\npm.max_spare_servers = 3" > /usr/local/etc/php-fpm.d/www.conf



# Establecer directorio de trabajoEXPOSE 8080

WORKDIR /var/www

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

# Copiar archivos de dependencias
COPY composer.json composer.lock ./

# Instalar dependencias de producción
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-scripts \
    --optimize-autoloader

# Copiar el resto del código
COPY . .

# Optimizar autoload
RUN composer dump-autoload --optimize

# ETAPA 2: Runtime (Nginx, PHP-FPM)
FROM nginx:1.25-alpine

# Instalar PHP-FPM y supervisor
RUN apk add --no-cache \
    php83-fpm \
    php83-pgsql \
    php83-pdo_pgsql \
    php83-mbstring \
    php83-bcmath \
    php83-opcache \
    php83-zip \
    supervisor

# Establecer directorio de trabajo
WORKDIR /var/www

# Copiar código desde builder
COPY --from=builder /var/www .

# Copiar configuraciones
COPY nginx.conf /etc/nginx/nginx.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Configurar PHP-FPM para Socket Unix
RUN sed -i 's|listen = 127.0.0.1:9000|listen = /run/php/php8.3-fpm.sock|g' /etc/php83/php-fpm.d/www.conf \
    && sed -i 's|;listen.owner = nobody|listen.owner = nginx|g' /etc/php83/php-fpm.d/www.conf \
    && sed -i 's|;listen.group = nobody|listen.group = nginx|g' /etc/php83/php-fpm.d/www.conf \
    && sed -i 's|;listen.mode = 0660|listen.mode = 0660|g' /etc/php83/php-fpm.d/www.conf \
    && sed -i 's|user = nobody|user = nginx|g' /etc/php83/php-fpm.d/www.conf \
    && sed -i 's|group = nobody|group = nginx|g' /etc/php83/php-fpm.d/www.conf

# Crear directorios y establecer permisos
RUN mkdir -p \
    /run/php \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    && chown -R nginx:nginx /var/www /run/php \
    && chmod -R 775 storage bootstrap/cache

# Optimizar Laravel (caché de configuración)
RUN php artisan config:cache || true \
    && php artisan route:cache || true \
    && php artisan view:cache || true

# Exponer puerto
EXPOSE 8080

# Comando de inicio
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
