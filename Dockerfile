# ==========================================
# ETAPA 1: Builder (Construcción)
# ==========================================
FROM php:8.3-fpm-alpine AS builder

# Instalar dependencias del sistema y extensiones PHP
RUN apk add --no-cache \
    git \
    unzip \
    zip \
    postgresql-dev \
    nodejs \
    npm \
    oniguruma-dev \
    libzip-dev \
    $PHPIZE_DEPS \
    && docker-php-ext-install \
        pdo_pgsql \
        pgsql \
        mbstring \
        bcmath \
        opcache \
        zip

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Crear directorio de trabajo
WORKDIR /var/www

# Copiar archivos de dependencias primero (para aprovechar caché de Docker)
COPY composer.json composer.lock ./
COPY package.json package-lock.json ./

# Instalar dependencias PHP (sin dev)
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copiar todo el código fuente
COPY . .

# Completar instalación de Composer
RUN composer dump-autoload --optimize --no-dev

# Instalar dependencias Node y construir assets
RUN npm ci && npm run build

# Limpiar archivos innecesarios
RUN rm -rf node_modules tests .git .env.example

# ==========================================
# ETAPA 2: Runtime (Producción)
# ==========================================
FROM php:8.3-fpm-alpine

# Instalar dependencias de runtime
RUN apk add --no-cache \
    nginx \
    supervisor \
    postgresql-client \
    postgresql-dev \
    && docker-php-ext-install \
        pdo_pgsql \
        pgsql \
        opcache \
        bcmath

# Configurar PHP-FPM para escuchar en un socket Unix
RUN sed -i 's|listen = 127.0.0.1:9000|listen = /run/php/php8.3-fpm.sock|g' /usr/local/etc/php-fpm.d/www.conf \
    # Asegurarse de que Nginx tenga permiso para usar el socket
    && sed -i 's|;listen.owner = www-data|listen.owner = nginx|g' /usr/local/etc/php-fpm.d/www.conf \
    && sed -i 's|;listen.group = www-data|listen.group = nginx|g' /usr/local/etc/php-fpm.d/www.conf \
    && sed -i 's|;listen.mode = 0660|listen.mode = 0660|g' /usr/local/etc/php-fpm.d/www.conf \
    && sed -i 's|user = www-data|user = nginx|g' /usr/local/etc/php-fpm.d/www.conf \
    && sed -i 's|group = www-data|group = nginx|g' /usr/local/etc/php-fpm.d/www.conf
# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar configuración de Supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Crear directorio de trabajo
WORKDIR /var/www

# Copiar aplicación desde builder CON PERMISOS CORRECTOS
COPY --from=builder --chown=nginx:nginx /var/www /var/www

# Crear directorios necesarios, configurar permisos y optimizar Laravel
RUN mkdir -p /run/php \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    # Establecer dueño a nginx
    && chown -R nginx:nginx /var/www /run/php \
    # Establecer permisos correctos (grupo puede escribir)
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache \
    # Optimizar Laravel para producción
    && php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Configurar PHP para producción
RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.memory_consumption=256" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.interned_strings_buffer=16" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.max_accelerated_files=10000" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.validate_timestamps=0" >> /usr/local/etc/php/conf.d/opcache.ini

# Exponer puerto 8080 (requerido por Cloud Run)
EXPOSE 8080

# Comando de inicio usando Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
