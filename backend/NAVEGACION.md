# 📋 ACTUALIZACIÓN DEL LAYOUT DE NAVEGACIÓN

Como Laravel Breeze aún no está instalado, el archivo `AuthenticatedLayout.jsx` se generará cuando ejecutes:

```powershell
php artisan breeze:install react
```

## Después de instalar Breeze, modifica el archivo:

**Ruta:** `resources/js/Layouts/AuthenticatedLayout.jsx`

### Añade los enlaces de navegación dentro del componente:

Busca la sección del menú de navegación (usualmente dentro de `<nav>`) y añade los siguientes enlaces:

```jsx
{/* Enlaces para Administrador y Coordinador */}
{(auth.user.role?.nombre === 'administrador' || auth.user.role?.nombre === 'coordinador') && (
    <>
        <NavLink href={route('materias.index')} active={route().current('materias.*')}>
            Materias
        </NavLink>
        <NavLink href={route('aulas.index')} active={route().current('aulas.*')}>
            Aulas
        </NavLink>
        <NavLink href={route('docentes.index')} active={route().current('docentes.*')}>
            Docentes
        </NavLink>
    </>
)}
```

### Para el menú responsive (hamburguesa), añade también:

```jsx
{/* Enlaces responsive para Administrador y Coordinador */}
{(auth.user.role?.nombre === 'administrador' || auth.user.role?.nombre === 'coordinador') && (
    <>
        <ResponsiveNavLink href={route('materias.index')} active={route().current('materias.*')}>
            Materias
        </ResponsiveNavLink>
        <ResponsiveNavLink href={route('aulas.index')} active={route().current('aulas.*')}>
            Aulas
        </ResponsiveNavLink>
        <ResponsiveNavLink href={route('docentes.index')} active={route().current('docentes.*')}>
            Docentes
        </ResponsiveNavLink>
    </>
)}
```

## Nota Importante:

Para que `auth.user.role` esté disponible en el componente, necesitas compartir esta información globalmente. 

Añade esto en `app/Http/Middleware/HandleInertiaRequests.php`:

```php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'auth' => [
            'user' => $request->user() ? [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'role' => $request->user()->role, // Añade esto
            ] : null,
        ],
    ];
}
```
