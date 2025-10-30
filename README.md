# 🎓 Sistema de Gestión de Horarios Universitarios# 🎓 Sistema de Gestión de Horarios Universitarios



Sistema web completo para la asignación de horarios, gestión de aulas, materias, docentes y control académico.Sistema web completo para la asignación de horarios, gestión de aulas, materias, docentes y control académico.



**Stack Tecnológico**: Laravel 11 + React 18 + PostgreSQL 15 + Tailwind CSS**Stack Tecnológico**: Laravel 11 + React 18 + PostgreSQL 15 + Tailwind CSS



---



## 📋 Tabla de Contenidos```---



1. [Arquitectura y Stack](#1-arquitectura-y-stack)Examen-Sistema-de-informaci-n-1/

2. [Instrucciones de Ejecución Local](#2-instrucciones-de-ejecución-local)

3. [Credenciales de Prueba](#3-credenciales-de-prueba)├── backend/                    # Backend Laravel (API REST)## 🚀 Características Implementadas (Sprint 1)

4. [Estructura de Módulos](#4-estructura-de-módulos-status-actual)

5. [Notas de Despliegue (GCP)](#5-notas-de-despliegue-gcp)│   ├── app/                   # Modelos, Controladores API, Middleware



---│   ├── config/                # Configuración (CORS, Sanctum, etc.)### ✅ Autenticación y Autorización (RBAC)



## 1. Arquitectura y Stack│   ├── database/              # Migraciones y Seeders- Sistema de autenticación completo con Laravel Breeze



### 🏗️ Estructura del Proyecto│   ├── routes/api.php         # Rutas API- 3 roles de usuario: `administrador`, `coordinador`, `docente`



```│   ├── .env                   # Configuración de entorno- Middleware personalizado para control de acceso basado en roles

Examen-Sistema-de-informaci-n-1/

├── backend/                      # API REST con Laravel 11│   └── composer.json          # Dependencias PHP- Usuarios de prueba pre-configurados

│   ├── app/

│   │   ├── Http/│

│   │   │   ├── Controllers/Api/  # Controladores API REST

│   │   │   ├── Requests/         # Form Request Validation├── frontend-horarios/          # Frontend React (SPA)### ✅ Gestión de Materias

│   │   │   └── Middleware/       # CheckRole, CORS

│   │   └── Models/              # 14 modelos Eloquent│   ├── src/                   # Código fuente React- CRUD completo con validación

│   ├── database/

│   │   ├── migrations/          # 17 migraciones (tablas + auditoría)│   │   ├── components/       # Componentes reutilizables- Relación con carreras y facultades

│   │   └── seeders/             # Datos iniciales

│   ├── routes/api.php           # Rutas API REST│   │   ├── contexts/         # Context API (Auth)- Paginación y búsqueda

│   └── .env                     # Configuración backend

││   │   ├── pages/            # Páginas de la aplicación- Auditoría de cambios

├── frontend-horarios/            # SPA con React 18 + Vite

│   ├── src/│   │   └── services/         # Servicios API (Axios)

│   │   ├── components/          # Componentes reutilizables

│   │   ├── contexts/            # AuthContext (Context API)│   ├── package.json          # Dependencias Node### ✅ Gestión de Aulas

│   │   ├── layouts/             # Layout principal con navbar

│   │   ├── pages/               # Páginas por módulo│   └── vite.config.js        # Configuración Vite- CRUD completo

│   │   │   ├── Auth/            # Login

│   │   │   ├── Usuarios/        # CRUD Usuarios│- Tipos: Aula Normal, Laboratorio, Auditorio, Taller

│   │   │   ├── Docentes/        # CRUD Docentes

│   │   │   ├── Materias/        # CRUD Materias├── .git/- Control de capacidad y recursos

│   │   │   ├── Aulas/           # CRUD Aulas

│   │   │   ├── Grupos/          # CRUD Grupos + Asignación├── .gitignore- Auditoría de cambios

│   │   │   ├── Horarios/        # Vista de Asignación

│   │   │   ├── Gestiones/       # CRUD Gestiones Académicas├── README.md                   # Este archivo

│   │   │   └── Reportes/        # Parrilla Global de Horarios

│   │   └── services/            # Axios API clients└── REFACTORIZACION-GUIA.md    # Guía técnica completa### ✅ Gestión de Docentes

│   ├── package.json

│   └── vite.config.js```- CRUD completo

│

└── README.md                     # Este archivo- Vinculación con usuarios

```

---- Grados académicos y tipos de contrato

### 🔧 Tecnologías Utilizadas

- Especialidades y fechas de contratación

#### Backend

- **Laravel 11.x** - Framework PHP moderno## 🚀 Inicio Rápido- Auditoría de cambios

- **Laravel Sanctum** - Autenticación API con tokens

- **PostgreSQL 15+** - Base de datos relacional

- **GIST Constraints** - Prevención de conflictos de horarios

- **Laravel Auditing** - Registro de cambios (auditoría)### Requisitos Previos### ✅ Base de Datos Avanzada

- **PHP 8.3+** - Lenguaje del servidor

- 14 tablas completamente normalizadas

#### Frontend

- **React 18.x** - Librería UI- **PHP** 8.3+- Restricciones `EXCLUDE USING GIST` en PostgreSQL para evitar conflictos de horarios

- **Vite 5.x** - Bundler rápido

- **React Router v6** - Navegación SPA- **Composer** 2.x- Relaciones optimizadas con foreign keys

- **Axios** - Cliente HTTP

- **Tailwind CSS 3.x** - Framework CSS utility-first- **Node.js** 18+ y npm- Auditoría automática con `laravel-auditing`

- **Context API** - Gestión de estado global (auth)

- **PostgreSQL** 15+

#### Base de Datos

- **PostgreSQL 15+** - RDBMS principal---

- **14 Tablas Normalizadas** - Diseño relacional optimizado

- **EXCLUDE USING GIST** - Restricciones de exclusión temporal para evitar solapamiento de horarios### 1️⃣ Backend (Laravel API)



---## 🏗️ Arquitectura del Sistema



## 2. Instrucciones de Ejecución Local```bash



### ✅ Requisitos Previos# Navegar a la carpeta backend```



- **PHP 8.3+** con extensiones: `pdo_pgsql`, `pgsql`, `mbstring`, `openssl`, `json`cd backend├── Backend (Laravel 11)

- **Composer 2.x**

- **Node.js 18+** y npm│   ├── Modelos Eloquent (14 modelos con relaciones)

- **PostgreSQL 15+**

- **Git**# Instalar dependencias│   ├── Controladores Inertia (MateriaController, AulaController, DocenteController)



---composer install│   ├── Form Requests (Validaciones personalizadas)



### 🚀 Instalación Paso a Paso│   ├── Middleware (CheckRole para RBAC)



#### **PASO 1: Clonar el Repositorio**# Configurar archivo .env│   └── Migraciones (PostgreSQL con restricciones avanzadas)



```powershellcopy .env.example .env│

git clone https://github.com/DSaav22/Examen-Sistema-de-informaci-n-1.git

cd Examen-Sistema-de-informaci-n-1# Editar .env con tus credenciales de base de datos PostgreSQL├── Frontend (React + Inertia.js)

```

│   ├── Componentes de Materias (Index, Create, Edit)

#### **PASO 2: Configurar el Backend**

# Generar clave de aplicación│   ├── Componentes de Aulas (Index, Create, Edit)

```powershell

cd backendphp artisan key:generate│   ├── Componentes de Docentes (Index, Create, Edit)



# Instalar dependencias PHP│   └── Layout autenticado con navegación basada en roles

composer install

# Ejecutar migraciones y seeders│

# Copiar archivo de configuración

copy .env.example .envphp artisan migrate:fresh --seed└── Base de Datos (PostgreSQL)



# Generar clave de aplicación    ├── Restricciones GIST para horarios sin conflictos

php artisan key:generate

```# Iniciar servidor Laravel    ├── Auditoría automática de cambios



Edita el archivo `.env` con tu configuración:php artisan serve    └── Índices optimizados



```env``````

APP_NAME="Sistema de Horarios"

APP_ENV=local**Backend corriendo en:** `http://localhost:8000`

APP_DEBUG=true

APP_TIMEZONE=America/La_Paz---

APP_URL=http://localhost:8000

### 2️⃣ Frontend (React SPA)

DB_CONNECTION=pgsql

DB_HOST=127.0.0.1## 📦 Tecnologías Utilizadas

DB_PORT=5432

DB_DATABASE=sistema_horarios```bash

DB_USERNAME=postgres

DB_PASSWORD=tu_password# Navegar a la carpeta frontend| Categoría | Tecnología | Versión |



# Frontend URL para CORScd frontend-horarios|-----------|-----------|---------|

FRONTEND_URL=http://localhost:5173

```| Backend | Laravel | 11.x |



#### **PASO 3: Crear la Base de Datos**# Instalar dependencias| Frontend | React | 18.x |



```sqlnpm install| Bridge | Inertia.js | 1.x |

-- Conectar a PostgreSQL

psql -U postgres| Base de Datos | PostgreSQL | 14+ |



-- Crear la base de datos# Iniciar servidor de desarrollo| Autenticación | Laravel Breeze | 2.x |

CREATE DATABASE sistema_horarios;

npm run dev| Auditoría | laravel-auditing | 13.x |

-- Salir

\q```| CSS | Tailwind CSS | 3.x |

```

**Frontend corriendo en:** `http://localhost:5173`| Build Tool | Vite | 5.x |

#### **PASO 4: Ejecutar Migraciones y Seeders**



```powershell

# Ejecutar todas las migraciones (17 tablas)------

php artisan migrate



# Poblar datos iniciales

php artisan db:seed## 🔐 Credenciales de Prueba## ⚙️ Instalación

```



Esto crea:

- ✅ 3 roles (administrador, coordinador, docente)| Rol            | Email                         | Contraseña      |### 1. Clonar el Repositorio

- ✅ 6 usuarios de prueba

- ✅ 1 facultad (Ingeniería)|----------------|-------------------------------|-----------------|```powershell

- ✅ 3 carreras (Sistemas, Civil, Industrial)

- ✅ 5 aulas| Administrador  | admin@admin.com               | Admin123.       |git clone https://github.com/DSaav22/Examen-Sistema-de-informaci-n-1.git

- ✅ 5 materias

- ✅ 3 docentes| Coordinador    | coordinador@coordinador.com   | Coordinador123. |cd Examen-Sistema-de-informaci-n-1



#### **PASO 5: Configurar el Frontend**| Docente        | docente@docente.com           | Docente123.     |```



```powershell

cd ../frontend-horarios

---### 2. Instalar Dependencias PHP

# Instalar dependencias

npm install```powershell



# Copiar archivo de configuración (si existe .env.example)## 📚 Documentacióncomposer install

# O crear uno nuevo

``````



Crea un archivo `.env` en `frontend-horarios/` si es necesario:- **[REFACTORIZACION-GUIA.md](REFACTORIZACION-GUIA.md)** - Guía completa de arquitectura API + SPA



```env- **[backend/GUIA_DESPLIEGUE.md](backend/GUIA_DESPLIEGUE.md)** - Despliegue en Google Cloud Platform### 3. Configurar Variables de Entorno

VITE_API_URL=http://localhost:8000/api

``````powershell



#### **PASO 6: Iniciar los Servidores**---cp .env.example .env



Abre **2 terminales**:php artisan key:generate



**Terminal 1 - Backend Laravel:**## 🛠️ Stack Tecnológico```

```powershell

cd backend

php artisan serve

```### Backend (API REST)Edita el archivo `.env` con tu configuración de PostgreSQL:

✅ Backend corriendo en: `http://localhost:8000`

- Laravel 11.x```env

**Terminal 2 - Frontend React:**

```powershell- PostgreSQL 15DB_CONNECTION=pgsql

cd frontend-horarios

npm run dev- Laravel Sanctum (autenticación con tokens)DB_HOST=127.0.0.1

```

✅ Frontend corriendo en: `http://localhost:5173`- PHP 8.3DB_PORT=5432



#### **PASO 7: Acceder al Sistema**DB_DATABASE=sistema_horarios



Abre tu navegador en: **http://localhost:5173**### Frontend (SPA)DB_USERNAME=tu_usuario



---- React 18.xDB_PASSWORD=tu_contraseña



## 3. Credenciales de Prueba- Vite 5.x```



Usa estas cuentas para probar el sistema:- React Router v6



| Email | Password | Rol | Permisos |- Axios (cliente HTTP)### 4. Instalar Laravel Breeze y Dependencias

|-------|----------|-----|----------|

| `admin@sistema.com` | `password` | Administrador | Acceso completo a todos los módulos |- Tailwind CSS```powershell

| `coordinador@sistema.com` | `password` | Coordinador | Gestión de horarios, grupos, materias |

| `docente@sistema.com` | `password` | Docente | Solo lectura de horarios propios |composer require laravel/breeze --dev



**Usuarios adicionales:**---php artisan breeze:install react

- `docente1@sistema.com` / `password`

- `docente2@sistema.com` / `password`npm install

- `docente3@sistema.com` / `password`

## 📦 API Endpoints```

---



## 4. Estructura de Módulos (Status Actual)

**Base URL:** `http://localhost:8000/api`### 5. Instalar Laravel Auditing

### ✅ Módulos Completados

```powershell

#### 🔐 **Autenticación y Autorización**

- [x] Login con Laravel Sanctum### 🔓 Autenticación (Públicas)composer require owen-it/laravel-auditing

- [x] RBAC (3 roles: administrador, coordinador, docente)

- [x] Middleware `CheckRole` para protección de rutas- `POST /login` - Iniciar sesiónphp artisan vendor:publish --provider="OwenIt\Auditing\AuditingServiceProvider" --tag="config"

- [x] Context API para gestión de sesión en React

- `POST /register` - Registrar usuariophp artisan vendor:publish --provider="OwenIt\Auditing\AuditingServiceProvider" --tag="migrations"

#### 👥 **Gestión de Usuarios**

- [x] CRUD completo```

- [x] Asignación de roles

- [x] Activación/Desactivación de cuentas### 🔒 Rutas Protegidas (requieren token)

- [x] Validación de campos únicos (email)

- [x] Paginación y búsqueda### 6. Ejecutar Migraciones y Seeders



#### 👨‍🏫 **Gestión de Docentes**#### Autenticación```powershell

- [x] CRUD completo

- [x] Vinculación con usuarios- `POST /logout` - Cerrar sesiónphp artisan migrate

- [x] Grados académicos (Licenciatura, Maestría, Doctorado)

- [x] Tipos de contrato (Tiempo completo, Medio tiempo, Por horas)- `GET /user` - Obtener usuario autenticadophp artisan db:seed

- [x] Especialidades

- [x] Fecha de contratación```

- [x] Auditoría de cambios

#### Recursos CRUD

#### 📚 **Gestión de Materias**

- [x] CRUD completo- `/materias` - Gestión de materias### 7. Compilar Assets

- [x] Relación con carreras y facultades

- [x] Código único de materia- `/aulas` - Gestión de aulas```powershell

- [x] Sigla (abreviatura)

- [x] Número de horas teóricas y prácticas- `/docentes` - Gestión de docentesnpm run dev

- [x] Validación de campos

- [x] Paginación y búsqueda- `/gestiones` - Gestión académica (semestres)```



#### 🏢 **Gestión de Aulas**- `/grupos` - Gestión de grupos

- [x] CRUD completo

- [x] Tipos: Aula Normal, Laboratorio, Auditorio, Taller- `/horarios` - Gestión de horarios (con detección de conflictos)### 8. Iniciar el Servidor

- [x] Control de capacidad

- [x] Recursos disponibles (proyector, computadoras, etc.)```powershell

- [x] Edificio y piso

- [x] Auditoría de cambios**Métodos disponibles:**php artisan serve



#### 🗓️ **Gestión de Gestiones Académicas**- `GET /recurso` - Listar (paginado)```

- [x] CRUD completo

- [x] Nombre/período (ej: "Gestión 2024-I")- `POST /recurso` - Crear

- [x] Fechas de inicio y fin

- [x] Marcado de gestión activa (solo una a la vez)- `GET /recurso/{id}` - Ver detalleVisita: **http://localhost:8000**

- [x] Validación de fechas

- `PUT/PATCH /recurso/{id}` - Actualizar

#### 👥 **Gestión de Grupos**

- [x] CRUD completo- `DELETE /recurso/{id}` - Eliminar---

- [x] Asignación de: Materia, Docente, Gestión Académica

- [x] Nombre del grupo (ej: "Grupo A")

- [x] Cupo máximo de estudiantes

- [x] Vista detallada con horarios asignados**Datos de formulario:**## 👥 Usuarios de Prueba

- [x] Navegación desde tabla principal

- `GET /materias-form-data` - Carreras disponibles

#### 🕐 **Asignación de Horarios**

- [x] Vista de tarjetas (`/horarios`) con información completa del grupo- `GET /docentes-form-data` - Usuarios disponibles| Email | Password | Rol |

- [x] Vista detallada por grupo (`/grupos/{id}`)

- [x] Formulario de asignación con validaciones- `GET /grupos-form-data` - Materias, docentes, gestiones|-------|----------|-----|

- [x] **Prevención de Conflictos Automática:**

  - ❌ Aula ocupada en el mismo horario- `GET /horarios-form-data` - Aulas disponibles| admin@sistema.com | password | Administrador |

  - ❌ Docente con otra clase al mismo tiempo

- [x] Detección via **GIST Constraints** en PostgreSQL| coordinador@sistema.com | password | Coordinador |

- [x] Tabla de horarios asignados

- [x] Eliminación de horarios---| docente@sistema.com | password | Docente |

- [x] Selección de día (Lunes-Domingo)

- [x] Selección de aula con información de capacidad

- [x] Horas de inicio y fin (input tipo `time`)

## 🎯 Funcionalidades Principales---

#### 📊 **Reportes de Horarios**

- [x] Parrilla global de horarios (`/reportes/horarios`)

- [x] Filtros por:

  - Gestión Académica (obligatorio)### ✅ Gestión de Materias## 📂 Estructura del Proyecto

  - Aula (opcional)

  - Docente (opcional)- CRUD completo

- [x] Visualización en grid día/hora

- [x] Información detallada por celda:- Filtrado por carrera y facultad```

  - Sigla de la materia

  - Nombre del grupo- Estado activo/inactivoapp/

  - Aula asignada

  - Nombre del docente├── Http/

- [x] Colores diferenciados por materia

- [x] Auto-carga con gestión activa### ✅ Gestión de Aulas│   ├── Controllers/



### 🔄 **Características Transversales**- CRUD completo│   │   ├── MateriaController.php



- [x] **Auditoría completa** con `laravel-auditing`- Capacidad, edificio, piso│   │   ├── AulaController.php

- [x] **Validación robusta** con Form Requests

- [x] **Manejo de errores** con try-catch y logging- Disponibilidad en tiempo real│   │   └── DocenteController.php

- [x] **Mensajes flash** para feedback al usuario

- [x] **Paginación** en todas las listas│   ├── Middleware/

- [x] **Búsqueda** en todas las tablas principales

- [x] **Responsive design** con Tailwind CSS### ✅ Gestión de Docentes│   │   └── CheckRole.php

- [x] **API REST** completa con JSON responses

- [x] **CORS** configurado para desarrollo local- Vinculación con usuarios│   └── Requests/



---- Código de docente│       ├── StoreMateriaRequest.php



## 5. Notas de Despliegue (GCP)- Grado académico y especialidad│       ├── UpdateMateriaRequest.php



### ☁️ Despliegue en Google Cloud Platform│       ├── StoreAulaRequest.php



Esta sección proporciona una guía para desplegar el sistema en **Google Cloud Platform (GCP)**.### ✅ Gestión Académica│       ├── UpdateAulaRequest.php



#### **Arquitectura Recomendada:**- Periodos (I, II)│       ├── StoreDocenteRequest.php



```- Fechas de inicio/fin│       └── UpdateDocenteRequest.php

┌─────────────────────────────────────┐

│  Cloud Load Balancer (HTTPS)       │- Derivación automática de año y periodo├── Models/

└──────────────┬──────────────────────┘

               ││   ├── Role.php

       ┌───────┴────────┐

       │                │### ✅ Gestión de Grupos│   ├── User.php

┌──────▼──────┐  ┌─────▼──────┐

│  App Engine  │  │  Cloud SQL │- Asignación materia-docente-gestión│   ├── Facultad.php

│  (Laravel)   │  │ (PostgreSQL)│

└──────────────┘  └────────────┘- Número de grupo│   ├── Carrera.php

       │

┌──────▼──────┐- Capacidad máxima│   ├── Materia.php (con Auditable)

│ Cloud Storage│

│   (Assets)   ││   ├── Docente.php (con Auditable)

└──────────────┘

```### ✅ Gestión de Horarios ⭐│   ├── Aula.php (con Auditable)



#### **PASO 1: Configurar Cloud SQL (PostgreSQL)**- **Detección de conflictos de aula** (PostgreSQL GIST constraints)│   ├── GestionAcademica.php



```bash- **Detección de conflictos de docente** (validación Laravel)│   ├── Grupo.php (con Auditable)

# Crear instancia de Cloud SQL

gcloud sql instances create sistema-horarios-db \- Días de semana (1-7)│   ├── Horario.php (con Auditable)

  --database-version=POSTGRES_15 \

  --tier=db-f1-micro \- Hora inicio y fin│   ├── Asistencia.php

  --region=us-central1 \

  --root-password=TU_PASSWORD_SEGURO│   ├── TokenAsistenciaQr.php



# Crear la base de datos---│   ├── PwaSubscription.php

gcloud sql databases create sistema_horarios \

  --instance=sistema-horarios-db│   └── NotificacionLog.php



# Crear usuario de aplicación## 🔒 Seguridaddatabase/

gcloud sql users create app_user \

  --instance=sistema-horarios-db \├── migrations/

  --password=APP_PASSWORD_SEGURO

```- **Autenticación:** Laravel Sanctum con tokens JWT│   ├── 2025_10_24_000001_create_roles_table.php



#### **PASO 2: Conectar con Cloud SQL Proxy (Desarrollo Local)**- **Autorización:** Middleware basado en roles (admin, coordinador, docente)│   ├── 2025_10_24_000002_create_users_table.php



```powershell- **CORS:** Configurado para `localhost:5173`│   ├── ...

# Descargar Cloud SQL Proxy

# https://cloud.google.com/sql/docs/postgres/sql-proxy- **Validación:** Form Requests en todos los endpoints│   └── 2025_10_24_000014_create_notificaciones_log_table.php



# Iniciar el proxy- **SQL Injection:** Protección con Eloquent ORM└── seeders/

./cloud-sql-proxy your-project:us-central1:sistema-horarios-db

```    ├── RolesSeeder.php



Actualiza tu `.env`:---    └── DatabaseSeeder.php



```envresources/

DB_CONNECTION=pgsql

DB_HOST=127.0.0.1## 📊 Base de Datos└── js/

DB_PORT=5432

DB_DATABASE=sistema_horarios    └── Pages/

DB_USERNAME=app_user

DB_PASSWORD=APP_PASSWORD_SEGURO### Tablas Principales        ├── Materias/

DB_SOCKET=/cloudsql/your-project:us-central1:sistema-horarios-db

```- `users` - Usuarios del sistema        │   ├── Index.jsx



#### **PASO 3: Preparar la Aplicación para Producción**- `roles` - Roles (administrador, coordinador, docente)        │   ├── Create.jsx



##### Backend (Laravel)- `facultades` - Facultades        │   └── Edit.jsx



Edita `.env` para producción:- `carreras` - Carreras académicas        ├── Aulas/



```env- `materias` - Materias/asignaturas        │   ├── Index.jsx

APP_ENV=production

APP_DEBUG=false- `docentes` - Información de docentes        │   ├── Create.jsx

APP_URL=https://tu-dominio.com

- `aulas` - Aulas/salones        │   └── Edit.jsx

# Cloud SQL Socket

DB_CONNECTION=pgsql- `gestiones_academicas` - Periodos académicos        └── Docentes/

DB_SOCKET=/cloudsql/your-project:us-central1:sistema-horarios-db

DB_DATABASE=sistema_horarios- `grupos` - Grupos de materia            ├── Index.jsx

DB_USERNAME=app_user

DB_PASSWORD=APP_PASSWORD_SEGURO- `horarios` - Asignación de horarios            ├── Create.jsx



# Frontend URL- `asistencias` - Control de asistencia (futuro)            └── Edit.jsx

FRONTEND_URL=https://tu-dominio.com

```routes/



##### Frontend (React)### Características Avanzadas└── web.php (Rutas protegidas con middleware)



Edita `.env.production`:- **GIST Exclusion Constraints** en PostgreSQL para evitar conflictos de aula```



```env- **Función IMMUTABLE** `time_to_interval()` para comparaciones de tiempo

VITE_API_URL=https://tu-dominio.com/api

```- **Auditoría** con `laravel-auditing`---



Compila los assets:



```bash---## 🔐 Sistema de Roles y Permisos

cd frontend-horarios

npm run build

```

## 🚀 Despliegue### Administrador

Copia los archivos de `dist/` a la carpeta `public/` del backend.

- ✅ Acceso completo al sistema

#### **PASO 4: Desplegar en App Engine**

### Desarrollo Local- ✅ Gestión de usuarios y roles

Crea el archivo `app.yaml` en la raíz del backend:

Ver sección [Inicio Rápido](#-inicio-rápido)- ✅ Gestión de materias, aulas y docentes

```yaml

runtime: php83- ✅ Acceso a auditoría y reportes



env_variables:### Producción (Google Cloud Platform)

  APP_KEY: "base64:TU_APP_KEY_AQUI"

  APP_ENV: production1. **Backend:** Cloud Run + Cloud SQL (PostgreSQL)### Coordinador

  APP_DEBUG: false

  LOG_CHANNEL: errorlog2. **Frontend:** Cloud Run (contenedor Nginx estático)- ✅ Gestión de horarios y grupos

  

  DB_CONNECTION: pgsql- ✅ Asignación de docentes a materias

  DB_SOCKET: "/cloudsql/your-project:us-central1:sistema-horarios-db"

  DB_DATABASE: sistema_horariosVer guía completa en: `backend/GUIA_DESPLIEGUE.md`- ✅ Gestión de aulas y materias

  DB_USERNAME: app_user

  DB_PASSWORD: APP_PASSWORD_SEGURO- ❌ No puede gestionar usuarios ni configuraciones del sistema



handlers:---

  - url: /.*

    secure: always### Docente

    script: auto

## 🤝 Contribución- ✅ Ver sus horarios asignados

automatic_scaling:

  min_instances: 1- ✅ Registrar asistencia de sus clases

  max_instances: 5

```Este es un proyecto académico para el examen de **Sistemas de Información 1**.- ✅ Generar códigos QR para asistencia



Despliega la aplicación:- ❌ No puede modificar horarios ni gestionar materias



```bash**Autor:** Diego  

cd backend

gcloud app deploy**Universidad:** [Tu Universidad]  ---

```

**Fecha:** Octubre 2025

#### **PASO 5: Ejecutar Migraciones en Producción**

## 🔧 Configuración Adicional

Conéctate via SSH y ejecuta:

---

```bash

gcloud app ssh### Registrar el Middleware CheckRole



# Dentro del contenedor## 📝 Licencia

cd /workspace

php artisan migrate --forceEdita `bootstrap/app.php`:

php artisan db:seed --force

php artisan config:cacheProyecto académico - Todos los derechos reservados

php artisan route:cache

php artisan view:cache```php

```

---->withMiddleware(function (Middleware $middleware) {

#### **PASO 6: Configurar HTTPS y Dominio Personalizado**

    $middleware->alias([

```bash

# Mapear dominio personalizado## 📞 Soporte        'role' => \App\Http\Middleware\CheckRole::class,

gcloud app domain-mappings create "tu-dominio.com" \

  --certificate-management=automatic    ]);

```

Para preguntas o problemas, consulta la documentación técnica en:})

#### **Variables de Entorno Críticas para GCP**

- [REFACTORIZACION-GUIA.md](REFACTORIZACION-GUIA.md)```

| Variable | Descripción | Ejemplo |

|----------|-------------|---------|- [backend/README-OLD.md](backend/README-OLD.md) (documentación original)

| `APP_KEY` | Clave de encriptación Laravel | `base64:...` |

| `DB_SOCKET` | Socket de Cloud SQL | `/cloudsql/project:region:instance` |### Compartir datos de rol en Inertia

| `DB_DATABASE` | Nombre de la base de datos | `sistema_horarios` |

| `DB_USERNAME` | Usuario de la aplicación | `app_user` |Edita `app/Http/Middleware/HandleInertiaRequests.php`:

| `DB_PASSWORD` | Contraseña segura | (usar Secret Manager) |

| `FRONTEND_URL` | URL del frontend | `https://tu-dominio.com` |```php

public function share(Request $request): array

#### **Seguridad en Producción:**{

    return [

1. **Usar Secret Manager** para contraseñas y claves:        ...parent::share($request),

   ```bash        'auth' => [

   gcloud secrets create db-password --data-file=-            'user' => $request->user() ? [

   ```                'id' => $request->user()->id,

                'name' => $request->user()->name,

2. **Configurar firewall** para Cloud SQL:                'email' => $request->user()->email,

   ```bash                'role' => $request->user()->role,

   gcloud sql instances patch sistema-horarios-db \            ] : null,

     --authorized-networks=0.0.0.0/0 \        ],

     --require-ssl    ];

   ```}

```

3. **Habilitar auditoría** en Cloud SQL:

   ```bash---

   gcloud sql instances patch sistema-horarios-db \

     --database-flags=log_statement=all## 📊 Modelo de Base de Datos

   ```

### Tablas Principales

4. **Backups automáticos**:- **roles**: Roles del sistema

   ```bash- **users**: Usuarios con rol asignado

   gcloud sql instances patch sistema-horarios-db \- **facultades**: Facultades universitarias

     --backup-start-time=03:00- **carreras**: Carreras por facultad

   ```- **materias**: Materias por carrera (con auditoría)

- **docentes**: Docentes vinculados a usuarios (con auditoría)

---- **aulas**: Aulas con capacidad y recursos (con auditoría)

- **gestiones_academicas**: Periodos académicos

## 📚 Documentación Adicional- **grupos**: Grupos de materia + docente + gestión (con auditoría)

- **horarios**: Horarios con restricciones GIST (con auditoría)

### Comandos Útiles de Laravel- **asistencias**: Registro de asistencias

- **tokens_asistencia_qr**: Tokens QR para asistencia

```bash- **pwa_subscriptions**: Suscripciones push

# Limpiar caché- **notificaciones_log**: Log de notificaciones

php artisan cache:clear

php artisan config:clear---

php artisan route:clear

php artisan view:clear## 🎯 Próximos Pasos (Sprint 2)



# Ver rutas- [ ] Gestión de Grupos y Horarios

php artisan route:list- [ ] Sistema de asistencia con QR

- [ ] Notificaciones push (PWA)

# Ver logs- [ ] Reportes y dashboards

tail -f storage/logs/laravel.log- [ ] Exportación a PDF/Excel

- [ ] Sistema de notificaciones en tiempo real

# Refrescar base de datos (¡CUIDADO! Borra todo)- [ ] Gestión de conflictos de horarios

php artisan migrate:fresh --seed

```---



### Comandos Útiles del Frontend## 📝 Documentación Adicional



```bash- [INSTALACION.md](INSTALACION.md) - Guía de instalación detallada

# Modo desarrollo- [NAVEGACION.md](NAVEGACION.md) - Configuración del menú de navegación

npm run dev

---

# Build para producción

npm run build## 👨‍💻 Autor



# Preview del build**Diego Saavedra**

npm run preview- GitHub: [@DSaav22](https://github.com/DSaav22)



# Linter---

npm run lint

```## 📄 Licencia



---Este proyecto es parte de un examen universitario para el curso de Sistemas de Información 1.



## 🐛 Solución de Problemas---



### Error: "SQLSTATE[08006] [7] could not connect to server"## 🐛 Soporte



**Solución**: Verifica que PostgreSQL esté corriendo y que las credenciales en `.env` sean correctas.Si encuentras algún problema o tienes preguntas:

1. Revisa la documentación en `INSTALACION.md`

```powershell2. Verifica que todos los comandos se ejecutaron correctamente

# Windows - Verificar servicio PostgreSQL3. Asegúrate de que PostgreSQL esté corriendo

services.msc4. Revisa los logs en `storage/logs/laravel.log`
# Buscar "postgresql" y asegurar que esté en "Running"
```

### Error: "Failed to load resource: net::ERR_CONNECTION_REFUSED"

**Solución**: Asegúrate de que ambos servidores estén corriendo:
- Backend: `php artisan serve` (puerto 8000)
- Frontend: `npm run dev` (puerto 5173)

### Error: "Access denied for user 'postgres'@'localhost'"

**Solución**: Restablece la contraseña de PostgreSQL:

```powershell
# Editar pg_hba.conf para permitir conexiones sin password temporalmente
# Ubicación típica: C:\Program Files\PostgreSQL\15\data\pg_hba.conf
# Cambiar 'md5' a 'trust' temporalmente

# Reiniciar servicio
# Luego cambiar password:
psql -U postgres
ALTER USER postgres PASSWORD 'nueva_password';
```

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solución**: Verifica la configuración de CORS en `backend/config/cors.php` y asegúrate de que `FRONTEND_URL` esté en `.env`.

---

## 👥 Contribución

Este es un proyecto académico. Para contribuir:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).

---

## 📧 Contacto

**Desarrollador**: Diego Saavedra  
**Email**: dsaav22@gmail.com  
**GitHub**: [@DSaav22](https://github.com/DSaav22)

---

**Última actualización**: Octubre 2025  
**Versión**: 1.0.0
