# 🎓 Sistema Web para la Asignación de Horarios, Aulas, Materias y Asistencia Docente

## 📌 Sprint 1 - Avance 50%

Sistema de gestión universitaria construido con **Laravel 11**, **React**, **Inertia.js** y **PostgreSQL**.

---

## 🚀 Características Implementadas (Sprint 1)

### ✅ Autenticación y Autorización (RBAC)
- Sistema de autenticación completo con Laravel Breeze
- 3 roles de usuario: `administrador`, `coordinador`, `docente`
- Middleware personalizado para control de acceso basado en roles
- Usuarios de prueba pre-configurados

### ✅ Gestión de Materias
- CRUD completo con validación
- Relación con carreras y facultades
- Paginación y búsqueda
- Auditoría de cambios

### ✅ Gestión de Aulas
- CRUD completo
- Tipos: Aula Normal, Laboratorio, Auditorio, Taller
- Control de capacidad y recursos
- Auditoría de cambios

### ✅ Gestión de Docentes
- CRUD completo
- Vinculación con usuarios
- Grados académicos y tipos de contrato
- Especialidades y fechas de contratación
- Auditoría de cambios

### ✅ Base de Datos Avanzada
- 14 tablas completamente normalizadas
- Restricciones `EXCLUDE USING GIST` en PostgreSQL para evitar conflictos de horarios
- Relaciones optimizadas con foreign keys
- Auditoría automática con `laravel-auditing`

---

## 🏗️ Arquitectura del Sistema

```
├── Backend (Laravel 11)
│   ├── Modelos Eloquent (14 modelos con relaciones)
│   ├── Controladores Inertia (MateriaController, AulaController, DocenteController)
│   ├── Form Requests (Validaciones personalizadas)
│   ├── Middleware (CheckRole para RBAC)
│   └── Migraciones (PostgreSQL con restricciones avanzadas)
│
├── Frontend (React + Inertia.js)
│   ├── Componentes de Materias (Index, Create, Edit)
│   ├── Componentes de Aulas (Index, Create, Edit)
│   ├── Componentes de Docentes (Index, Create, Edit)
│   └── Layout autenticado con navegación basada en roles
│
└── Base de Datos (PostgreSQL)
    ├── Restricciones GIST para horarios sin conflictos
    ├── Auditoría automática de cambios
    └── Índices optimizados
```

---

## 📦 Tecnologías Utilizadas

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| Backend | Laravel | 11.x |
| Frontend | React | 18.x |
| Bridge | Inertia.js | 1.x |
| Base de Datos | PostgreSQL | 14+ |
| Autenticación | Laravel Breeze | 2.x |
| Auditoría | laravel-auditing | 13.x |
| CSS | Tailwind CSS | 3.x |
| Build Tool | Vite | 5.x |

---

## ⚙️ Instalación

### 1. Clonar el Repositorio
```powershell
git clone https://github.com/DSaav22/Examen-Sistema-de-informaci-n-1.git
cd Examen-Sistema-de-informaci-n-1
```

### 2. Instalar Dependencias PHP
```powershell
composer install
```

### 3. Configurar Variables de Entorno
```powershell
cp .env.example .env
php artisan key:generate
```

Edita el archivo `.env` con tu configuración de PostgreSQL:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=sistema_horarios
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
```

### 4. Instalar Laravel Breeze y Dependencias
```powershell
composer require laravel/breeze --dev
php artisan breeze:install react
npm install
```

### 5. Instalar Laravel Auditing
```powershell
composer require owen-it/laravel-auditing
php artisan vendor:publish --provider="OwenIt\Auditing\AuditingServiceProvider" --tag="config"
php artisan vendor:publish --provider="OwenIt\Auditing\AuditingServiceProvider" --tag="migrations"
```

### 6. Ejecutar Migraciones y Seeders
```powershell
php artisan migrate
php artisan db:seed
```

### 7. Compilar Assets
```powershell
npm run dev
```

### 8. Iniciar el Servidor
```powershell
php artisan serve
```

Visita: **http://localhost:8000**

---

## 👥 Usuarios de Prueba

| Email | Password | Rol |
|-------|----------|-----|
| admin@sistema.com | password | Administrador |
| coordinador@sistema.com | password | Coordinador |
| docente@sistema.com | password | Docente |

---

## 📂 Estructura del Proyecto

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── MateriaController.php
│   │   ├── AulaController.php
│   │   └── DocenteController.php
│   ├── Middleware/
│   │   └── CheckRole.php
│   └── Requests/
│       ├── StoreMateriaRequest.php
│       ├── UpdateMateriaRequest.php
│       ├── StoreAulaRequest.php
│       ├── UpdateAulaRequest.php
│       ├── StoreDocenteRequest.php
│       └── UpdateDocenteRequest.php
├── Models/
│   ├── Role.php
│   ├── User.php
│   ├── Facultad.php
│   ├── Carrera.php
│   ├── Materia.php (con Auditable)
│   ├── Docente.php (con Auditable)
│   ├── Aula.php (con Auditable)
│   ├── GestionAcademica.php
│   ├── Grupo.php (con Auditable)
│   ├── Horario.php (con Auditable)
│   ├── Asistencia.php
│   ├── TokenAsistenciaQr.php
│   ├── PwaSubscription.php
│   └── NotificacionLog.php
database/
├── migrations/
│   ├── 2025_10_24_000001_create_roles_table.php
│   ├── 2025_10_24_000002_create_users_table.php
│   ├── ...
│   └── 2025_10_24_000014_create_notificaciones_log_table.php
└── seeders/
    ├── RolesSeeder.php
    └── DatabaseSeeder.php
resources/
└── js/
    └── Pages/
        ├── Materias/
        │   ├── Index.jsx
        │   ├── Create.jsx
        │   └── Edit.jsx
        ├── Aulas/
        │   ├── Index.jsx
        │   ├── Create.jsx
        │   └── Edit.jsx
        └── Docentes/
            ├── Index.jsx
            ├── Create.jsx
            └── Edit.jsx
routes/
└── web.php (Rutas protegidas con middleware)
```

---

## 🔐 Sistema de Roles y Permisos

### Administrador
- ✅ Acceso completo al sistema
- ✅ Gestión de usuarios y roles
- ✅ Gestión de materias, aulas y docentes
- ✅ Acceso a auditoría y reportes

### Coordinador
- ✅ Gestión de horarios y grupos
- ✅ Asignación de docentes a materias
- ✅ Gestión de aulas y materias
- ❌ No puede gestionar usuarios ni configuraciones del sistema

### Docente
- ✅ Ver sus horarios asignados
- ✅ Registrar asistencia de sus clases
- ✅ Generar códigos QR para asistencia
- ❌ No puede modificar horarios ni gestionar materias

---

## 🔧 Configuración Adicional

### Registrar el Middleware CheckRole

Edita `bootstrap/app.php`:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'role' => \App\Http\Middleware\CheckRole::class,
    ]);
})
```

### Compartir datos de rol en Inertia

Edita `app/Http/Middleware/HandleInertiaRequests.php`:

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
                'role' => $request->user()->role,
            ] : null,
        ],
    ];
}
```

---

## 📊 Modelo de Base de Datos

### Tablas Principales
- **roles**: Roles del sistema
- **users**: Usuarios con rol asignado
- **facultades**: Facultades universitarias
- **carreras**: Carreras por facultad
- **materias**: Materias por carrera (con auditoría)
- **docentes**: Docentes vinculados a usuarios (con auditoría)
- **aulas**: Aulas con capacidad y recursos (con auditoría)
- **gestiones_academicas**: Periodos académicos
- **grupos**: Grupos de materia + docente + gestión (con auditoría)
- **horarios**: Horarios con restricciones GIST (con auditoría)
- **asistencias**: Registro de asistencias
- **tokens_asistencia_qr**: Tokens QR para asistencia
- **pwa_subscriptions**: Suscripciones push
- **notificaciones_log**: Log de notificaciones

---

## 🎯 Próximos Pasos (Sprint 2)

- [ ] Gestión de Grupos y Horarios
- [ ] Sistema de asistencia con QR
- [ ] Notificaciones push (PWA)
- [ ] Reportes y dashboards
- [ ] Exportación a PDF/Excel
- [ ] Sistema de notificaciones en tiempo real
- [ ] Gestión de conflictos de horarios

---

## 📝 Documentación Adicional

- [INSTALACION.md](INSTALACION.md) - Guía de instalación detallada
- [NAVEGACION.md](NAVEGACION.md) - Configuración del menú de navegación

---

## 👨‍💻 Autor

**Diego Saavedra**
- GitHub: [@DSaav22](https://github.com/DSaav22)

---

## 📄 Licencia

Este proyecto es parte de un examen universitario para el curso de Sistemas de Información 1.

---

## 🐛 Soporte

Si encuentras algún problema o tienes preguntas:
1. Revisa la documentación en `INSTALACION.md`
2. Verifica que todos los comandos se ejecutaron correctamente
3. Asegúrate de que PostgreSQL esté corriendo
4. Revisa los logs en `storage/logs/laravel.log`