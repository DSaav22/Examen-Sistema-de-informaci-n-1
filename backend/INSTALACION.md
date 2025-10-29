# 📦 COMANDOS DE INSTALACIÓN - FASE 3

## 1️⃣ Instalar Laravel Breeze con React + Inertia

```powershell
# Instalar Laravel Breeze
composer require laravel/breeze --dev

# Instalar Breeze con stack React
php artisan breeze:install react

# Instalar dependencias de Node
npm install

# Compilar assets
npm run dev
```

## 2️⃣ Instalar Laravel Auditing

```powershell
# Instalar el paquete de auditoría
composer require owen-it/laravel-auditing

# Publicar la configuración
php artisan vendor:publish --provider="OwenIt\Auditing\AuditingServiceProvider" --tag="config"

# Publicar las migraciones de auditoría
php artisan vendor:publish --provider="OwenIt\Auditing\AuditingServiceProvider" --tag="migrations"

# Ejecutar las migraciones de auditoría
php artisan migrate
```

## 3️⃣ Configurar PostgreSQL en .env

Asegúrate de que tu archivo `.env` tenga la configuración correcta de PostgreSQL:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=sistema_horarios
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
```

## 4️⃣ Ejecutar Migraciones y Seeders

```powershell
# Ejecutar todas las migraciones
php artisan migrate

# Ejecutar los seeders (roles y usuarios por defecto)
php artisan db:seed
```

## 5️⃣ Registrar el Middleware CheckRole

Abre el archivo `bootstrap/app.php` y añade el middleware personalizado:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'role' => \App\Http\Middleware\CheckRole::class,
    ]);
})
```

## 🎯 Usuarios de Prueba

Después de ejecutar los seeders, tendrás estos usuarios disponibles:

| Email | Password | Rol |
|-------|----------|-----|
| admin@sistema.com | password | administrador |
| coordinador@sistema.com | password | coordinador |
| docente@sistema.com | password | docente |

## ✅ Verificación

Para verificar que todo está instalado correctamente:

```powershell
# Verificar las tablas creadas
php artisan migrate:status

# Iniciar el servidor de desarrollo
php artisan serve

# En otra terminal, iniciar Vite
npm run dev
```

Visita: `http://localhost:8000` y deberías ver la página de login de Breeze.
