# 🎓 Sistema de Asignación de Horarios# 🎓 Sistema Web para la Asignación de Horarios, Aulas, Materias y Asistencia Docente



**Monorepo** con Backend Laravel (API REST) y Frontend React (SPA)## 📌 Sprint 1 - Avance 50%



## 📁 Estructura del ProyectoSistema de gestión universitaria construido con **Laravel 11**, **React**, **Inertia.js** y **PostgreSQL**.



```---

Examen-Sistema-de-informaci-n-1/

├── backend/                    # Backend Laravel (API REST)## 🚀 Características Implementadas (Sprint 1)

│   ├── app/                   # Modelos, Controladores API, Middleware

│   ├── config/                # Configuración (CORS, Sanctum, etc.)### ✅ Autenticación y Autorización (RBAC)

│   ├── database/              # Migraciones y Seeders- Sistema de autenticación completo con Laravel Breeze

│   ├── routes/api.php         # Rutas API- 3 roles de usuario: `administrador`, `coordinador`, `docente`

│   ├── .env                   # Configuración de entorno- Middleware personalizado para control de acceso basado en roles

│   └── composer.json          # Dependencias PHP- Usuarios de prueba pre-configurados

│

├── frontend-horarios/          # Frontend React (SPA)### ✅ Gestión de Materias

│   ├── src/                   # Código fuente React- CRUD completo con validación

│   │   ├── components/       # Componentes reutilizables- Relación con carreras y facultades

│   │   ├── contexts/         # Context API (Auth)- Paginación y búsqueda

│   │   ├── pages/            # Páginas de la aplicación- Auditoría de cambios

│   │   └── services/         # Servicios API (Axios)

│   ├── package.json          # Dependencias Node### ✅ Gestión de Aulas

│   └── vite.config.js        # Configuración Vite- CRUD completo

│- Tipos: Aula Normal, Laboratorio, Auditorio, Taller

├── .git/- Control de capacidad y recursos

├── .gitignore- Auditoría de cambios

├── README.md                   # Este archivo

└── REFACTORIZACION-GUIA.md    # Guía técnica completa### ✅ Gestión de Docentes

```- CRUD completo

- Vinculación con usuarios

---- Grados académicos y tipos de contrato

- Especialidades y fechas de contratación

## 🚀 Inicio Rápido- Auditoría de cambios



### Requisitos Previos### ✅ Base de Datos Avanzada

- 14 tablas completamente normalizadas

- **PHP** 8.3+- Restricciones `EXCLUDE USING GIST` en PostgreSQL para evitar conflictos de horarios

- **Composer** 2.x- Relaciones optimizadas con foreign keys

- **Node.js** 18+ y npm- Auditoría automática con `laravel-auditing`

- **PostgreSQL** 15+

---

### 1️⃣ Backend (Laravel API)

## 🏗️ Arquitectura del Sistema

```bash

# Navegar a la carpeta backend```

cd backend├── Backend (Laravel 11)

│   ├── Modelos Eloquent (14 modelos con relaciones)

# Instalar dependencias│   ├── Controladores Inertia (MateriaController, AulaController, DocenteController)

composer install│   ├── Form Requests (Validaciones personalizadas)

│   ├── Middleware (CheckRole para RBAC)

# Configurar archivo .env│   └── Migraciones (PostgreSQL con restricciones avanzadas)

copy .env.example .env│

# Editar .env con tus credenciales de base de datos PostgreSQL├── Frontend (React + Inertia.js)

│   ├── Componentes de Materias (Index, Create, Edit)

# Generar clave de aplicación│   ├── Componentes de Aulas (Index, Create, Edit)

php artisan key:generate│   ├── Componentes de Docentes (Index, Create, Edit)

│   └── Layout autenticado con navegación basada en roles

# Ejecutar migraciones y seeders│

php artisan migrate:fresh --seed└── Base de Datos (PostgreSQL)

    ├── Restricciones GIST para horarios sin conflictos

# Iniciar servidor Laravel    ├── Auditoría automática de cambios

php artisan serve    └── Índices optimizados

``````

**Backend corriendo en:** `http://localhost:8000`

---

### 2️⃣ Frontend (React SPA)

## 📦 Tecnologías Utilizadas

```bash

# Navegar a la carpeta frontend| Categoría | Tecnología | Versión |

cd frontend-horarios|-----------|-----------|---------|

| Backend | Laravel | 11.x |

# Instalar dependencias| Frontend | React | 18.x |

npm install| Bridge | Inertia.js | 1.x |

| Base de Datos | PostgreSQL | 14+ |

# Iniciar servidor de desarrollo| Autenticación | Laravel Breeze | 2.x |

npm run dev| Auditoría | laravel-auditing | 13.x |

```| CSS | Tailwind CSS | 3.x |

**Frontend corriendo en:** `http://localhost:5173`| Build Tool | Vite | 5.x |



------



## 🔐 Credenciales de Prueba## ⚙️ Instalación



| Rol            | Email                         | Contraseña      |### 1. Clonar el Repositorio

|----------------|-------------------------------|-----------------|```powershell

| Administrador  | admin@admin.com               | Admin123.       |git clone https://github.com/DSaav22/Examen-Sistema-de-informaci-n-1.git

| Coordinador    | coordinador@coordinador.com   | Coordinador123. |cd Examen-Sistema-de-informaci-n-1

| Docente        | docente@docente.com           | Docente123.     |```



---### 2. Instalar Dependencias PHP

```powershell

## 📚 Documentacióncomposer install

```

- **[REFACTORIZACION-GUIA.md](REFACTORIZACION-GUIA.md)** - Guía completa de arquitectura API + SPA

- **[backend/GUIA_DESPLIEGUE.md](backend/GUIA_DESPLIEGUE.md)** - Despliegue en Google Cloud Platform### 3. Configurar Variables de Entorno

```powershell

---cp .env.example .env

php artisan key:generate

## 🛠️ Stack Tecnológico```



### Backend (API REST)Edita el archivo `.env` con tu configuración de PostgreSQL:

- Laravel 11.x```env

- PostgreSQL 15DB_CONNECTION=pgsql

- Laravel Sanctum (autenticación con tokens)DB_HOST=127.0.0.1

- PHP 8.3DB_PORT=5432

DB_DATABASE=sistema_horarios

### Frontend (SPA)DB_USERNAME=tu_usuario

- React 18.xDB_PASSWORD=tu_contraseña

- Vite 5.x```

- React Router v6

- Axios (cliente HTTP)### 4. Instalar Laravel Breeze y Dependencias

- Tailwind CSS```powershell

composer require laravel/breeze --dev

---php artisan breeze:install react

npm install

## 📦 API Endpoints```



**Base URL:** `http://localhost:8000/api`### 5. Instalar Laravel Auditing

```powershell

### 🔓 Autenticación (Públicas)composer require owen-it/laravel-auditing

- `POST /login` - Iniciar sesiónphp artisan vendor:publish --provider="OwenIt\Auditing\AuditingServiceProvider" --tag="config"

- `POST /register` - Registrar usuariophp artisan vendor:publish --provider="OwenIt\Auditing\AuditingServiceProvider" --tag="migrations"

```

### 🔒 Rutas Protegidas (requieren token)

### 6. Ejecutar Migraciones y Seeders

#### Autenticación```powershell

- `POST /logout` - Cerrar sesiónphp artisan migrate

- `GET /user` - Obtener usuario autenticadophp artisan db:seed

```

#### Recursos CRUD

- `/materias` - Gestión de materias### 7. Compilar Assets

- `/aulas` - Gestión de aulas```powershell

- `/docentes` - Gestión de docentesnpm run dev

- `/gestiones` - Gestión académica (semestres)```

- `/grupos` - Gestión de grupos

- `/horarios` - Gestión de horarios (con detección de conflictos)### 8. Iniciar el Servidor

```powershell

**Métodos disponibles:**php artisan serve

- `GET /recurso` - Listar (paginado)```

- `POST /recurso` - Crear

- `GET /recurso/{id}` - Ver detalleVisita: **http://localhost:8000**

- `PUT/PATCH /recurso/{id}` - Actualizar

- `DELETE /recurso/{id}` - Eliminar---



**Datos de formulario:**## 👥 Usuarios de Prueba

- `GET /materias-form-data` - Carreras disponibles

- `GET /docentes-form-data` - Usuarios disponibles| Email | Password | Rol |

- `GET /grupos-form-data` - Materias, docentes, gestiones|-------|----------|-----|

- `GET /horarios-form-data` - Aulas disponibles| admin@sistema.com | password | Administrador |

| coordinador@sistema.com | password | Coordinador |

---| docente@sistema.com | password | Docente |



## 🎯 Funcionalidades Principales---



### ✅ Gestión de Materias## 📂 Estructura del Proyecto

- CRUD completo

- Filtrado por carrera y facultad```

- Estado activo/inactivoapp/

├── Http/

### ✅ Gestión de Aulas│   ├── Controllers/

- CRUD completo│   │   ├── MateriaController.php

- Capacidad, edificio, piso│   │   ├── AulaController.php

- Disponibilidad en tiempo real│   │   └── DocenteController.php

│   ├── Middleware/

### ✅ Gestión de Docentes│   │   └── CheckRole.php

- Vinculación con usuarios│   └── Requests/

- Código de docente│       ├── StoreMateriaRequest.php

- Grado académico y especialidad│       ├── UpdateMateriaRequest.php

│       ├── StoreAulaRequest.php

### ✅ Gestión Académica│       ├── UpdateAulaRequest.php

- Periodos (I, II)│       ├── StoreDocenteRequest.php

- Fechas de inicio/fin│       └── UpdateDocenteRequest.php

- Derivación automática de año y periodo├── Models/

│   ├── Role.php

### ✅ Gestión de Grupos│   ├── User.php

- Asignación materia-docente-gestión│   ├── Facultad.php

- Número de grupo│   ├── Carrera.php

- Capacidad máxima│   ├── Materia.php (con Auditable)

│   ├── Docente.php (con Auditable)

### ✅ Gestión de Horarios ⭐│   ├── Aula.php (con Auditable)

- **Detección de conflictos de aula** (PostgreSQL GIST constraints)│   ├── GestionAcademica.php

- **Detección de conflictos de docente** (validación Laravel)│   ├── Grupo.php (con Auditable)

- Días de semana (1-7)│   ├── Horario.php (con Auditable)

- Hora inicio y fin│   ├── Asistencia.php

│   ├── TokenAsistenciaQr.php

---│   ├── PwaSubscription.php

│   └── NotificacionLog.php

## 🔒 Seguridaddatabase/

├── migrations/

- **Autenticación:** Laravel Sanctum con tokens JWT│   ├── 2025_10_24_000001_create_roles_table.php

- **Autorización:** Middleware basado en roles (admin, coordinador, docente)│   ├── 2025_10_24_000002_create_users_table.php

- **CORS:** Configurado para `localhost:5173`│   ├── ...

- **Validación:** Form Requests en todos los endpoints│   └── 2025_10_24_000014_create_notificaciones_log_table.php

- **SQL Injection:** Protección con Eloquent ORM└── seeders/

    ├── RolesSeeder.php

---    └── DatabaseSeeder.php

resources/

## 📊 Base de Datos└── js/

    └── Pages/

### Tablas Principales        ├── Materias/

- `users` - Usuarios del sistema        │   ├── Index.jsx

- `roles` - Roles (administrador, coordinador, docente)        │   ├── Create.jsx

- `facultades` - Facultades        │   └── Edit.jsx

- `carreras` - Carreras académicas        ├── Aulas/

- `materias` - Materias/asignaturas        │   ├── Index.jsx

- `docentes` - Información de docentes        │   ├── Create.jsx

- `aulas` - Aulas/salones        │   └── Edit.jsx

- `gestiones_academicas` - Periodos académicos        └── Docentes/

- `grupos` - Grupos de materia            ├── Index.jsx

- `horarios` - Asignación de horarios            ├── Create.jsx

- `asistencias` - Control de asistencia (futuro)            └── Edit.jsx

routes/

### Características Avanzadas└── web.php (Rutas protegidas con middleware)

- **GIST Exclusion Constraints** en PostgreSQL para evitar conflictos de aula```

- **Función IMMUTABLE** `time_to_interval()` para comparaciones de tiempo

- **Auditoría** con `laravel-auditing`---



---## 🔐 Sistema de Roles y Permisos



## 🚀 Despliegue### Administrador

- ✅ Acceso completo al sistema

### Desarrollo Local- ✅ Gestión de usuarios y roles

Ver sección [Inicio Rápido](#-inicio-rápido)- ✅ Gestión de materias, aulas y docentes

- ✅ Acceso a auditoría y reportes

### Producción (Google Cloud Platform)

1. **Backend:** Cloud Run + Cloud SQL (PostgreSQL)### Coordinador

2. **Frontend:** Cloud Run (contenedor Nginx estático)- ✅ Gestión de horarios y grupos

- ✅ Asignación de docentes a materias

Ver guía completa en: `backend/GUIA_DESPLIEGUE.md`- ✅ Gestión de aulas y materias

- ❌ No puede gestionar usuarios ni configuraciones del sistema

---

### Docente

## 🤝 Contribución- ✅ Ver sus horarios asignados

- ✅ Registrar asistencia de sus clases

Este es un proyecto académico para el examen de **Sistemas de Información 1**.- ✅ Generar códigos QR para asistencia

- ❌ No puede modificar horarios ni gestionar materias

**Autor:** Diego  

**Universidad:** [Tu Universidad]  ---

**Fecha:** Octubre 2025

## 🔧 Configuración Adicional

---

### Registrar el Middleware CheckRole

## 📝 Licencia

Edita `bootstrap/app.php`:

Proyecto académico - Todos los derechos reservados

```php

---->withMiddleware(function (Middleware $middleware) {

    $middleware->alias([

## 📞 Soporte        'role' => \App\Http\Middleware\CheckRole::class,

    ]);

Para preguntas o problemas, consulta la documentación técnica en:})

- [REFACTORIZACION-GUIA.md](REFACTORIZACION-GUIA.md)```

- [backend/README-OLD.md](backend/README-OLD.md) (documentación original)

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