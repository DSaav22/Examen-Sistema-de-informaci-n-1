# 🔧 CONFIGURACIÓN FINAL DEL MIDDLEWARE

## Registrar el Middleware CheckRole en bootstrap/app.php

Después de instalar Breeze, necesitas registrar el middleware personalizado `CheckRole`.

### Edita el archivo: `bootstrap/app.php`

Busca la sección `withMiddleware` y añade el alias:

```php
<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Añade el alias del middleware personalizado
        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
        ]);
        
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
```

---

## Configurar HandleInertiaRequests para compartir datos de rol

### Edita el archivo: `app/Http/Middleware/HandleInertiaRequests.php`

Modifica el método `share` para incluir la información del rol:

```php
<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role, // ⭐ Añade esto para compartir el rol
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
```

---

## ✅ Verificación

Después de hacer estos cambios:

1. **Reinicia el servidor de desarrollo:**
   ```powershell
   # Detén el servidor con Ctrl+C
   php artisan serve
   ```

2. **Verifica que las rutas estén protegidas:**
   ```powershell
   php artisan route:list
   ```

3. **Prueba el acceso basado en roles:**
   - Inicia sesión como `admin@sistema.com`
   - Deberías ver los enlaces a Materias, Aulas y Docentes
   - Inicia sesión como `docente@sistema.com`
   - NO deberías ver esos enlaces (solo Dashboard)

---

## 🔥 Comandos Útiles

```powershell
# Limpiar caché
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Ver todas las rutas
php artisan route:list

# Ver todos los middlewares registrados
php artisan route:list --columns=uri,name,middleware
```
