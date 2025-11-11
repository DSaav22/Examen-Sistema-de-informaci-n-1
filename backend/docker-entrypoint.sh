#!/bin/sh
set -e

echo "🚀 Iniciando aplicación Laravel en Cloud Run..."

# 1. Eliminar completamente los archivos de caché (más agresivo que config:clear)
echo "📋 Eliminando archivos de caché de Laravel..."
rm -rf /var/www/html/bootstrap/cache/*.php
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# 2. Ejecutar migraciones (idempotente - solo aplica las que faltan)
echo "🔧 Ejecutando migraciones..."
php artisan migrate --force --no-interaction || {
    echo "⚠️  Advertencia: Las migraciones fallaron, continuando..."
}

# 3. Ejecutar seeders (SIEMPRE - son idempotentes)
echo "📦 Ejecutando seeders..."
php artisan db:seed --force --no-interaction || {
    echo "⚠️  Advertencia: Seeders fallaron, continuando..."
}

# 4. Iniciar el servidor (sin cachés para leer env vars en tiempo real)
echo "🎉 Iniciando servidor Laravel en puerto 8080..."
exec php artisan serve --host=0.0.0.0 --port=8080
