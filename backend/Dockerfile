# --- Etapa 1: "El Constructor" (Instala dependencias) ---
# Usamos una imagen oficial de Composer (la herramienta de PHP)
FROM composer:2.7 as builder

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos solo los archivos de dependencias
COPY composer.json composer.lock ./

# Instalamos las dependencias de producción (sin --dev)
# --no-scripts previene que se ejecuten scripts antes de tener el .env
RUN composer install --no-dev --no-interaction --no-scripts --optimize-autoloader --ignore-platform-req=ext-gd

# Copiamos el resto del código de la aplicación
COPY . .

# Ejecutamos los scripts de composer (como key:generate si fuera necesario)
RUN composer dump-autoload --optimize 


# --- Etapa 2: "La Aplicación Final" (La que se ejecuta) ---
# Usamos una imagen ligera de PHP 8.3 con FPM (FastCGI Process Manager)
FROM php:8.3-fpm-alpine

# Establecemos el directorio de trabajo
WORKDIR /var/www/html

# Instalar dependencias del sistema para gd, zip y postgresql
RUN apk add --no-cache \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    postgresql-dev \
    postgresql-client \
&& docker-php-ext-configure gd --with-freetype --with-jpeg \
&& docker-php-ext-install gd zip pdo pdo_pgsql bcmath

# Copiamos las dependencias instaladas de la Etapa 1
COPY --from=builder /app/vendor /var/www/html/vendor

# Copiamos el código de la aplicación de la Etapa 1
COPY --from=builder /app .

# Copiamos el script de inicio
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Damos permisos a Laravel para que pueda escribir en sus carpetas
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache && \
    chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Exponemos el puerto 8080, que es el que Cloud Run espera
EXPOSE 8080

# Usar el script de inicio que maneja migraciones, seeders y servidor
CMD ["/usr/local/bin/docker-entrypoint.sh"]
