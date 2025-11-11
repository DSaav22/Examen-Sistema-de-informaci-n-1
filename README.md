# 🎓 Sistema de Gestión de Horarios Universitarios

Sistema web completo para la asignación inteligente de horarios académicos con detección automática de conflictos, gestión de aulas, materias, docentes, control de asistencia mediante QR, exportación de reportes y funcionalidad PWA.

**Stack Tecnológico:** Laravel 11 + React 19 + PostgreSQL 17 + Ant Design + PWA

---

## 🌐 **SISTEMA DESPLEGADO EN PRODUCCIÓN**

| Componente | URL/Información |
|------------|-----------------|
| **Frontend (PWA)** | https://horarios-477719.web.app |
| **Backend API** | https://horarios-backend-101246198711.us-central1.run.app |
| **Base de Datos** | Cloud SQL PostgreSQL 17 |
| **Instancia DB** | `horarios-477719:us-central1:horarios-db-instanc` |
| **IP Pública DB** | 34.68.72.210 |
| **Estado** | ✅ **OPERATIVO** |

---

## 📋 Tabla de Contenidos

1. [Arquitectura del Sistema](#-arquitectura-del-sistema)
2. [Stack Tecnológico Detallado](#-stack-tecnológico-detallado)
3. [Base de Datos PostgreSQL](#️-base-de-datos-postgresql)
4. [Módulos y Funcionalidades](#-módulos-y-funcionalidades)
5. [Instalación Local](#-instalación-local)
6. [Credenciales de Prueba](#-credenciales-de-prueba)
7. [Despliegue en Google Cloud](#-despliegue-en-google-cloud)
8. [Documentación Adicional](#-documentación-adicional)

---

## 🏗️ Arquitectura del Sistema

### Diagrama de Arquitectura

```
┌─────────────────────────┐         ┌──────────────────────────┐         ┌─────────────────────────┐
│   FRONTEND (PWA)        │         │   BACKEND (API REST)     │         │   BASE DE DATOS         │
│                         │         │                          │         │                         │
│  React 19 + Vite        │ HTTPS   │  Laravel 11 + PHP 8.3    │  Unix   │  PostgreSQL 17          │
│  Ant Design 5.22        │◄────────►  Nginx + PHP-FPM         │ Socket  │  Cloud SQL              │
│  Service Worker PWA     │  CORS   │  Laravel Sanctum Auth    │◄────────►  sistema_horarios       │
│  @yudiel/react-qr       │         │  Eloquent ORM            │         │  17 tablas              │
│                         │         │  Docker Container        │         │  Índices optimizados    │
│                         │         │                          │         │                         │
│  Firebase Hosting       │         │  Google Cloud Run        │         │  Cloud SQL Instance     │
│  https://horarios-      │         │  us-central1             │         │  us-central1-a          │
│  477719.web.app         │         │  Auto-escalado 0-1000    │         │  db-custom-1-3840       │
│                         │         │  512 MiB RAM             │         │  1 vCPU, 3.75 GB RAM    │
└─────────────────────────┘         └──────────────────────────┘         └─────────────────────────┘
```

### Flujo de Datos

1. **Cliente → Frontend**: Usuario accede vía HTTPS a Firebase Hosting
2. **Frontend → Backend**: Peticiones API REST con token Sanctum (Bearer)
3. **Backend → Base de Datos**: Conexión via Unix Socket de Cloud SQL
4. **Backend → Frontend**: Respuestas JSON con datos procesados
5. **PWA**: Service Worker cachea assets para funcionamiento offline

---

## 💻 Stack Tecnológico Detallado

### 🔧 Backend (API REST)

| Componente | Versión/Tecnología | Descripción |
|------------|-------------------|-------------|
| **Framework** | Laravel 11.31.0 | Framework PHP moderno con Eloquent ORM |
| **Lenguaje** | PHP 8.3.0 | PHP en Alpine Linux (contenedor Docker) |
| **Base de Datos** | PostgreSQL 17.2 | RDBMS de alto rendimiento |
| **ORM** | Eloquent | Object-Relational Mapping de Laravel |
| **Autenticación** | Laravel Sanctum | Tokens Bearer para SPA |
| **Validación** | Form Requests | Validación personalizada por endpoint |
| **Exportación Excel** | Maatwebsite/Laravel-Excel | Exportación XLSX con PhpSpreadsheet |
| **Exportación PDF** | Barryvdh/Laravel-DomPDF | Generación de PDFs con DomPDF |
| **Servidor Web** | Nginx 1.24 | Proxy inverso + servidor estático |
| **Servidor de Aplicación** | PHP-FPM 8.3 | FastCGI Process Manager |
| **Conexión DB** | Unix Socket | `/cloudsql/horarios-477719:us-central1:horarios-db-instanc` |
| **Contenedor** | Docker Multi-stage | Composer 2.7 (build) + PHP 8.3-fpm-alpine (prod) |
| **Extensiones PHP** | pdo_pgsql, bcmath, gd, zip | Extensiones compiladas en imagen Docker |

### 🎨 Frontend (SPA + PWA)

| Componente | Versión/Tecnología | Descripción |
|------------|-------------------|-------------|
| **Framework** | React 19.0.2 | Biblioteca UI con Concurrent Features |
| **Build Tool** | Vite 6.0.3 | Bundler ultra-rápido con HMR |
| **UI Library** | Ant Design 5.22.6 | Componentes empresariales de alta calidad |
| **Routing** | React Router DOM v6 | Enrutamiento declarativo para SPA |
| **HTTP Client** | Axios | Cliente HTTP con interceptores |
| **Icons** | @ant-design/icons + React Icons | Paquetes de iconos |
| **QR Scanner** | @yudiel/react-qr-scanner 2.0.9 | Escaneo de códigos QR (compatible React 19) |
| **PWA Plugin** | vite-plugin-pwa 0.21.1 | Service Worker + Manifest |
| **PWA Workbox** | workbox-precaching, workbox-routing | Estrategias de caché |
| **State Management** | React Context API | Contexto global para autenticación |
| **Form Validation** | React Hooks + Ant Design Form | Validación de formularios |

### ☁️ Infraestructura (Google Cloud Platform)

#### Google Cloud Run (Backend)
```yaml
Servicio: horarios-backend
Región: us-central1
URL: https://horarios-backend-101246198711.us-central1.run.app
Imagen: us-central1-docker.pkg.dev/horarios-477719/horarios-repo/horarios-backend:latest
Configuración:
  - CPU: 1 vCPU
  - Memoria: 512 MiB
  - Timeout: 300s
  - Concurrencia: 80 peticiones
  - Min instancias: 0
  - Max instancias: 1000
  - Auto-escalado: ✅
  - Acceso: No autenticado (público)
Variables de Entorno:
  - APP_ENV: production
  - APP_KEY: base64:Bqy+n3OqOiuEXMi0CHs9e0Gh66kXfvQF7YFaYIrYfmw=
  - DB_CONNECTION: pgsql
  - DB_SOCKET: /cloudsql/horarios-477719:us-central1:horarios-db-instanc
  - DB_DATABASE: sistema_horarios
  - DB_USERNAME: laravel_user
  - DB_PASSWORD: |3cjhQB~ZH"@kY50
Cloud SQL Instances:
  - horarios-477719:us-central1:horarios-db-instanc
```

#### Firebase Hosting (Frontend)
```yaml
Proyecto: horarios-477719
URL: https://horarios-477719.web.app
CDN: Global (Firebase CDN)
HTTPS: Automático (cert. gestionado)
Configuración:
  - Rewrites: Todas las rutas a /index.html (SPA)
  - Cache: Assets estáticos con max-age
  - Redirects: www → apex
```

#### Cloud SQL for PostgreSQL
```yaml
Instancia: horarios-db-instanc
Versión: PostgreSQL 17
Región: us-central1-a
Tier: db-custom-1-3840
  - CPU: 1 vCPU compartida
  - RAM: 3.75 GB
IP Pública: 34.68.72.210
Estado: RUNNABLE
Base de Datos: sistema_horarios
Usuario: laravel_user
Conexión: Unix Socket (/cloudsql/...)
Backups: Automáticos (diarios)
```

---

## 🗄️ Base de Datos PostgreSQL

### Información de Conexión

**Para desarrollo local con Cloud SQL Proxy:**
```bash
# Descargar Cloud SQL Proxy
wget https://dl.google.com/cloudsql/cloud_sql_proxy.exe

# Ejecutar proxy
.\cloud_sql_proxy.exe -instances=horarios-477719:us-central1:horarios-db-instanc=tcp:5432

# Conectar con psql
psql "host=127.0.0.1 port=5432 dbname=sistema_horarios user=laravel_user password=|3cjhQB~ZH\"@kY50"
```

**Para Cloud Run (ya configurado):**
```env
DB_CONNECTION=pgsql
DB_SOCKET=/cloudsql/horarios-477719:us-central1:horarios-db-instanc
DB_DATABASE=sistema_horarios
DB_USERNAME=laravel_user
DB_PASSWORD=|3cjhQB~ZH"@kY50
```

### Esquema Completo (17 Tablas)

#### 1. **users** - Usuarios del Sistema
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol_id INTEGER REFERENCES roles(id),
    ci VARCHAR(20),
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```
**Datos iniciales:** 3 usuarios (admin, coordinador, docente)

#### 2. **roles** - Roles RBAC
```sql
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```
**Roles:** `administrador`, `coordinador`, `docente`

#### 3. **facultades** - Facultades Universitarias
```sql
CREATE TABLE facultades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL,
    codigo VARCHAR(20) UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```
**Ejemplo:** FICCT - Facultad de Ingeniería en Ciencias de la Computación y Telecomunicaciones

#### 4. **carreras** - Carreras Académicas
```sql
CREATE TABLE carreras (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    codigo VARCHAR(20) UNIQUE,
    facultad_id INTEGER REFERENCES facultades(id) ON DELETE CASCADE,
    nivel VARCHAR(50),
    duracion_semestres INTEGER,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```
**Ejemplos:** Ingeniería de Sistemas, Ingeniería Informática, Ingeniería en Redes y Telecomunicaciones

#### 5. **materias** - Materias/Asignaturas
```sql
CREATE TABLE materias (
    id SERIAL PRIMARY KEY,
    sigla VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    nivel INTEGER,
    creditos INTEGER NOT NULL,
    horas_teoricas INTEGER,
    horas_practicas INTEGER,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### 6. **carrera_materia** - Relación Many-to-Many (Carreras ↔ Materias)
```sql
CREATE TABLE carrera_materia (
    id SERIAL PRIMARY KEY,
    carrera_id INTEGER REFERENCES carreras(id) ON DELETE CASCADE,
    materia_id INTEGER REFERENCES materias(id) ON DELETE CASCADE,
    semestre_sugerido INTEGER,
    obligatoria BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(carrera_id, materia_id)
);
```
**Propósito:** Una materia puede ser compartida por múltiples carreras (ej: Matemáticas I en varias ingenierías)

#### 7. **docentes** - Docentes del Sistema
```sql
CREATE TABLE docentes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    ci VARCHAR(20) UNIQUE,
    telefono VARCHAR(20),
    especialidad VARCHAR(255),
    cargo VARCHAR(100), -- Ej: "Profesor Titular", "Profesor Asociado"
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### 8. **aulas** - Aulas/Salones
```sql
CREATE TABLE aulas (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100),
    capacidad INTEGER NOT NULL,
    edificio VARCHAR(50),
    piso INTEGER,
    tipo VARCHAR(50), -- Ej: "Aula Común", "Laboratorio", "Auditorio"
    equipamiento TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### 9. **gestiones_academicas** - Períodos Académicos
```sql
CREATE TABLE gestiones_academicas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL, -- Ej: "1/2024", "2/2024"
    anio INTEGER NOT NULL,
    periodo VARCHAR(20), -- Ej: "Primer Semestre", "Segundo Semestre"
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### 10. **grupos** - Grupos de Materias
```sql
CREATE TABLE grupos (
    id SERIAL PRIMARY KEY,
    materia_id INTEGER REFERENCES materias(id) ON DELETE CASCADE,
    docente_id INTEGER REFERENCES docentes(id) ON DELETE SET NULL,
    gestion_id INTEGER REFERENCES gestiones_academicas(id),
    numero INTEGER NOT NULL,
    paralelo VARCHAR(5), -- Ej: "A", "B", "C"
    cupos_ofrecidos INTEGER DEFAULT 0,
    inscritos INTEGER DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'Abierto', -- 'Abierto', 'Cerrado', 'En Curso', 'Finalizado'
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(materia_id, gestion_id, numero)
);
```

#### 11. **horarios** - Horarios de Clases
```sql
CREATE TABLE horarios (
    id SERIAL PRIMARY KEY,
    grupo_id INTEGER REFERENCES grupos(id) ON DELETE CASCADE,
    aula_id INTEGER REFERENCES aulas(id) ON DELETE SET NULL,
    docente_id INTEGER REFERENCES docentes(id) ON DELETE SET NULL,
    dia_semana VARCHAR(15) NOT NULL, -- 'Lunes', 'Martes', ..., 'Sábado'
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_horarios_grupo ON horarios(grupo_id);
CREATE INDEX idx_horarios_aula ON horarios(aula_id);
CREATE INDEX idx_horarios_dia ON horarios(dia_semana);
```
**Validaciones:**
- Rango horario académico: 7:00 - 21:00
- No solapamiento de horarios del mismo docente
- No solapamiento de horarios en la misma aula

#### 12. **asistencias** - Control de Asistencia Docente
```sql
CREATE TABLE asistencias (
    id SERIAL PRIMARY KEY,
    horario_id INTEGER REFERENCES horarios(id) ON DELETE CASCADE,
    docente_id INTEGER REFERENCES docentes(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    estado VARCHAR(20) NOT NULL, -- 'Presente', 'Ausente', 'Justificado', 'Tardanza'
    observaciones TEXT,
    registrado_por INTEGER REFERENCES users(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(horario_id, fecha)
);

CREATE INDEX idx_asistencias_docente ON asistencias(docente_id);
CREATE INDEX idx_asistencias_fecha ON asistencias(fecha);
```

#### Tablas del Sistema (Laravel/Sanctum)

**13. migrations** - Historial de Migraciones
**14. personal_access_tokens** - Tokens de Autenticación Sanctum
**15. password_reset_tokens** - Tokens de Recuperación de Contraseña
**16. sessions** - Sesiones de Usuario
**17. cache** - Sistema de Caché

### Diagrama de Relaciones ER

```
users ────▶ roles (N:1)
  │
  └─────▶ personal_access_tokens (1:N)

facultades ────▶ carreras (1:N)

carreras ◀────▶ materias (M:N via carrera_materia)

materias ────▶ grupos (1:N)

docentes ────▶ grupos (1:N)
  │
  └─────▶ horarios (1:N)
  │
  └─────▶ asistencias (1:N)

gestiones_academicas ────▶ grupos (1:N)

grupos ────▶ horarios (1:N)

aulas ────▶ horarios (1:N)

horarios ────▶ asistencias (1:N)
```

### Datos de Semilla (Seeders)

**RolesSeeder:**
- `administrador` - Acceso completo al sistema
- `coordinador` - Gestión de horarios y asignaciones
- `docente` - Consulta de horarios y registro de asistencia

**UserSeeder:**
- `admin@admin.com` / `Admin123.` (Rol: administrador)
- `coordinador@coordinador.com` / `Coordinador123.` (Rol: coordinador)
- `docente@docente.com` / `Docente123.` (Rol: docente)

**Otros Seeders:**
- FacultadSeeder (1 facultad de ejemplo)
- CarreraSeeder (3 carreras de ejemplo)
- MateriaSeeder (Materias de prueba)
- AulaSeeder (Aulas de prueba)
- DocenteSeeder (Docentes de prueba)
- GestionSeeder (Gestión académica actual)

---

## 📦 Módulos y Funcionalidades

### ✅ 1. Autenticación y Autorización (RBAC)

**Tecnología:** Laravel Sanctum + React Context API

**Funcionalidades:**
- Login con email/contraseña
- Generación de tokens Bearer (Sanctum)
- Logout y revocación de tokens
- Middleware de rol (CheckRole)
- Rutas protegidas por rol en frontend
- Manejo de sesión expirada

**Roles y Permisos:**
| Rol | Permisos |
|-----|----------|
| **Administrador** | Acceso total: CRUD de usuarios, roles, facultades, carreras, materias, docentes, aulas, grupos, horarios |
| **Coordinador** | Gestión académica: CRUD de grupos, horarios, asignaciones, reportes |
| **Docente** | Solo lectura: Ver horarios asignados, registrar asistencia propia |

---

### ✅ 2. Gestión de Facultades

**Endpoints:**
- `GET /api/facultades` - Listar (paginado, búsqueda, filtros)
- `GET /api/facultades/{id}` - Ver detalle
- `POST /api/facultades` - Crear
- `PUT /api/facultades/{id}` - Actualizar
- `DELETE /api/facultades/{id}` - Eliminar (soft delete)

**Validaciones:**
- Nombre único
- Código único (opcional)
- Descripción (opcional)

**Relaciones:**
- `hasMany(Carrera)` - Una facultad tiene múltiples carreras

---

### ✅ 3. Gestión de Carreras

**Endpoints:**
- `GET /api/carreras` - Listar con facultad
- `POST /api/carreras` - Crear
- `PUT /api/carreras/{id}` - Actualizar
- `DELETE /api/carreras/{id}` - Eliminar

**Validaciones:**
- Nombre obligatorio
- Código único
- Facultad existente
- Duración en semestres (número)

**Relaciones:**
- `belongsTo(Facultad)` - Pertenece a una facultad
- `belongsToMany(Materia)` - Relación M:N con materias (via carrera_materia)

---

### ✅ 4. Gestión de Materias

**Cambio Importante:** Migración de relación **One-to-Many** a **Many-to-Many** con Carreras.

**Endpoints:**
- `GET /api/materias` - Listar con carreras asociadas
- `POST /api/materias` - Crear con asignación a carreras
- `PUT /api/materias/{id}` - Actualizar y modificar carreras
- `DELETE /api/materias/{id}` - Eliminar

**Validaciones:**
- Sigla única (código de materia)
- Créditos obligatorios
- Carreras: array de objetos con `carrera_id`, `semestre_sugerido`, `obligatoria`

**Relaciones:**
- `belongsToMany(Carrera)` - Tabla pivot `carrera_materia`
- `hasMany(Grupo)` - Una materia puede tener múltiples grupos

**Ejemplo de Payload:**
```json
{
  "sigla": "MAT101",
  "nombre": "Matemáticas I",
  "creditos": 6,
  "horas_teoricas": 4,
  "horas_practicas": 2,
  "carreras": [
    {
      "carrera_id": 1,
      "semestre_sugerido": 1,
      "obligatoria": true
    },
    {
      "carrera_id": 2,
      "semestre_sugerido": 1,
      "obligatoria": true
    }
  ]
}
```

---

### ✅ 5. Gestión de Docentes

**Endpoints:**
- `GET /api/docentes` - Listar (paginado, búsqueda)
- `POST /api/docentes` - Crear
- `PUT /api/docentes/{id}` - Actualizar
- `DELETE /api/docentes/{id}` - Eliminar
- `POST /api/docentes/import` - Importación masiva CSV/Excel

**Campos:**
- Nombre, apellidos, email, CI, teléfono
- Especialidad (ej: "Bases de Datos")
- **Cargo:** Profesor Titular, Profesor Asociado, Profesor Auxiliar, etc.
- user_id (opcional): Vinculación con usuario del sistema

**Importación Masiva:**
- Formato: CSV o Excel (.xlsx)
- Columnas: nombre, apellidos, email, ci, telefono, especialidad, cargo
- Validación de datos en servidor
- Feedback de registros importados y errores

---

### ✅ 6. Gestión de Aulas

**Endpoints:**
- `GET /api/aulas` - Listar
- `POST /api/aulas` - Crear
- `PUT /api/aulas/{id}` - Actualizar
- `DELETE /api/aulas/{id}` - Eliminar

**Campos:**
- Código único (ej: "A301")
- Nombre descriptivo
- Capacidad (número de estudiantes)
- Edificio, piso
- Tipo: Aula Común, Laboratorio, Auditorio
- Equipamiento (texto libre)

**Validaciones:**
- Capacidad > 0
- Código único

---

### ✅ 7. Gestión de Grupos

**Endpoints:**
- `GET /api/grupos` - Listar con relaciones (materia, docente, gestión)
- `POST /api/grupos` - Crear
- `PUT /api/grupos/{id}` - Actualizar
- `DELETE /api/grupos/{id}` - Eliminar

**Campos Nuevos:**
- `cupos_ofrecidos`: Capacidad total del grupo
- `inscritos`: Número de estudiantes inscritos
- `estado`: Enum ['Abierto', 'Cerrado', 'En Curso', 'Finalizado']

**Validaciones:**
- Materia existente
- Docente existente
- Gestión académica activa
- Número de grupo único por materia/gestión

**Relaciones:**
- `belongsTo(Materia)`
- `belongsTo(Docente)`
- `belongsTo(GestionAcademica)`
- `hasMany(Horario)` - Un grupo tiene múltiples horarios

---

### ✅ 8. Asignación Inteligente de Horarios

**Endpoint Principal:**
- `POST /api/horarios/store` - Crear horario con validación de conflictos

**Validaciones Automáticas (5 tipos de conflictos):**

1. **Conflicto de Docente:**
   ```
   El docente ya está asignado en otro horario en el mismo día y hora.
   ```

2. **Conflicto de Aula:**
   ```
   El aula ya está ocupada en el mismo día y hora.
   ```

3. **Conflicto de Grupo:**
   ```
   El grupo ya tiene un horario asignado en el mismo día y hora.
   ```

4. **Rango Horario Inválido:**
   ```
   El horario debe estar entre 7:00 AM y 9:00 PM.
   ```

5. **Solapamiento de Horas:**
   ```
   El horario se solapa con otro horario existente.
   ```

**Algoritmo de Detección:**
```php
// Verificar solapamiento de rangos
WHERE dia_semana = $dia
  AND (
    (hora_inicio < $hora_fin AND hora_fin > $hora_inicio)
    OR
    (hora_inicio >= $hora_inicio AND hora_inicio < $hora_fin)
  )
```

**Interfaz Frontend:**
- Vista de calendario semanal
- Drag-and-drop para asignación
- Indicadores visuales de conflictos en tiempo real
- Modal de confirmación antes de guardar

---

### ✅ 9. Control de Asistencia Docente con QR

**Endpoints:**
- `GET /api/asistencias` - Listar asistencias (filtros: docente, fecha, estado)
- `POST /api/asistencias` - Registrar asistencia
- `GET /api/asistencias/qr/generate/{horarioId}` - Generar código QR
- `POST /api/asistencias/qr/scan` - Registrar asistencia via QR

**Estados de Asistencia:**
- `Presente` - Docente presente en horario
- `Ausente` - Docente ausente sin justificación
- `Justificado` - Ausencia justificada
- `Tardanza` - Llegada tarde

**Flujo de QR:**
1. Coordinador/Admin genera código QR para un horario específico
2. Código QR contiene: `horario_id`, `fecha`, `timestamp`
3. Docente escanea QR con la PWA
4. Sistema registra asistencia automáticamente
5. Validación de horario vigente (no pasado ni futuro lejano)

**Estadísticas:**
- Dashboard de asistencia por docente
- Porcentaje de asistencia mensual
- Reporte de ausencias justificadas/injustificadas
- Gráficos de tendencias

---

### ✅ 10. Reportes y Exportación

**Exportación a Excel:**
- `GET /api/docentes/export` - Listado de docentes con filtros
  - Formato: XLSX (PhpSpreadsheet)
  - Columnas: Nombre, Email, CI, Teléfono, Especialidad, Cargo
  - Filtros: Activos/Inactivos, Búsqueda

**Exportación a PDF:**
- `GET /api/grupos/{id}/horario/pdf` - Parrilla de horarios de un grupo
  - Formato: PDF (DomPDF)
  - Contenido: Horario semanal visual (tabla 7x6)
  - Información: Materia, docente, aula, horarios

**Parrilla Global de Horarios:**
- `GET /api/horarios/parrilla` - Vista consolidada
  - Filtros: Facultad, Carrera, Gestión Académica
  - Vista: Calendario semanal con todos los grupos
  - Exportable a PDF

**Otros Reportes:**
- Listado de grupos por gestión académica
- Carga horaria por docente
- Utilización de aulas (porcentaje de ocupación)

---

### ✅ 11. Progressive Web App (PWA)

**Tecnología:** vite-plugin-pwa + Workbox

**Características:**
- **Instalable:** Icono en pantalla de inicio (móvil/escritorio)
- **Offline:** Caché de assets estáticos con Service Worker
- **Estrategia de Caché:** NetworkFirst con fallback a caché
- **Manifest:** `manifest.json` con iconos de 192x192 y 512x512
- **Notificaciones:** (Futuro) Push notifications para recordatorios

**Configuración en `vite.config.js`:**
```javascript
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'Sistema de Horarios',
    short_name: 'Horarios',
    description: 'Gestión de horarios universitarios',
    theme_color: '#1890ff',
    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/horarios-backend-.*\.run\.app\/api\/.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 300 // 5 minutos
          }
        }
      }
    ]
  }
})
```

---

### ✅ 12. Importación Masiva de Docentes

**Endpoint:**
- `POST /api/docentes/import` (multipart/form-data)

**Formatos Soportados:**
- CSV (texto plano, delimitado por comas)
- Excel XLSX (Microsoft Excel 2007+)

**Estructura del Archivo:**
```csv
nombre,apellidos,email,ci,telefono,especialidad,cargo
Juan,Pérez,juan.perez@example.com,12345678,71234567,Bases de Datos,Profesor Titular
María,González,maria.gonzalez@example.com,87654321,72345678,Programación,Profesor Asociado
```

**Validaciones:**
- Email único (no duplicados en BD)
- CI único
- Nombre y apellidos obligatorios
- Email formato válido
- Teléfono opcional pero formato numérico

**Procesamiento:**
1. Validación de formato de archivo
2. Lectura de registros (Laravel Excel)
3. Validación individual de cada fila
4. Inserción en base de datos
5. Respuesta JSON con:
   ```json
   {
     "importados": 25,
     "errores": [
       {
         "fila": 12,
         "error": "Email duplicado"
       }
     ]
   }
   ```

**UI:**
- Drag & drop de archivo
- Barra de progreso
- Lista de errores
- Descarga de plantilla CSV

---

## 🚀 Instalación Local

### Prerrequisitos

```bash
# Verificar versiones
php -v         # PHP 8.3 o superior
composer -V    # Composer 2.7 o superior
node -v        # Node.js 18 o superior
psql --version # PostgreSQL 15+ o 17 (recomendado)
git --version  # Git
```

**Extensiones PHP necesarias:**
- pdo_pgsql
- bcmath
- gd
- zip
- mbstring
- xml

### 1️⃣ Clonar Repositorio

```powershell
git clone https://github.com/DSaav22/Examen-Sistema-de-informaci-n-1.git
cd Examen-Sistema-de-informaci-n-1
```

### 2️⃣ Configurar Backend (Laravel)

```powershell
# Navegar a backend
cd backend

# Instalar dependencias
composer install

# Copiar .env
cp .env.example .env

# Generar clave de aplicación
php artisan key:generate

# Editar .env con tu configuración de PostgreSQL
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=sistema_horarios
# DB_USERNAME=postgres
# DB_PASSWORD=tu_contraseña

# Crear base de datos (en PostgreSQL)
# psql -U postgres
# CREATE DATABASE sistema_horarios;
# \q

# Ejecutar migraciones y seeders
php artisan migrate:fresh --seed

# Iniciar servidor
php artisan serve
# Backend disponible en: http://localhost:8000
```

### 3️⃣ Configurar Frontend (React)

```powershell
# Nueva terminal, navegar a frontend
cd frontend-horarios

# Instalar dependencias
npm install

# Crear .env
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Iniciar servidor de desarrollo
npm run dev
# Frontend disponible en: http://localhost:5173
```

### 4️⃣ Acceso a la Aplicación

1. Abrir navegador: http://localhost:5173
2. Usar credenciales de prueba (ver sección siguiente)
3. Verificar que backend responda: http://localhost:8000/api/health

---

## 🔐 Credenciales de Prueba

| Rol | Email | Contraseña | Permisos |
|-----|-------|------------|----------|
| **Administrador** | admin@admin.com | Admin123. | Acceso total al sistema |
| **Coordinador** | coordinador@coordinador.com | Coordinador123. | Gestión de horarios, grupos, asignaciones |
| **Docente** | docente@docente.com | Docente123. | Ver horarios, registrar asistencia |

### Características de las Contraseñas

- Mínimo 8 caracteres
- Al menos 1 mayúscula
- Al menos 1 número
- Al menos 1 carácter especial (`.`)

---

## ☁️ Despliegue en Google Cloud

### Arquitectura de Despliegue

```
┌─────────────────────────────────────────────────────────────┐
│                  Google Cloud Platform                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐      ┌──────────────────┐             │
│  │ Firebase Hosting│      │  Cloud Run       │             │
│  │                 │      │                  │             │
│  │ React 19 SPA    │─────▶│ Laravel 11 API   │             │
│  │ PWA Enabled     │ HTTPS │ Docker Container │             │
│  │                 │      │ Auto-scaled      │             │
│  └─────────────────┘      └──────────────────┘             │
│                                     │                       │
│                                     │ Unix Socket           │
│                                     ▼                       │
│                          ┌──────────────────┐               │
│                          │  Cloud SQL       │               │
│                          │  PostgreSQL 17   │               │
│                          │  db-custom-1-3840│               │
│                          └──────────────────┘               │
│                                                             │
│  ┌─────────────────────────────────────────┐                │
│  │ Artifact Registry                       │                │
│  │ horarios-backend:latest                 │                │
│  └─────────────────────────────────────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Pasos de Despliegue

#### 1. Configurar Google Cloud Project

```bash
# Crear proyecto
gcloud projects create horarios-477719 --name="Sistema de Horarios"

# Configurar proyecto activo
gcloud config set project horarios-477719

# Habilitar APIs necesarias
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

#### 2. Crear Cloud SQL Instance

```bash
# Crear instancia PostgreSQL 17
gcloud sql instances create horarios-db-instanc \
  --database-version=POSTGRES_17 \
  --tier=db-custom-1-3840 \
  --region=us-central1 \
  --root-password=SECURE_ROOT_PASSWORD

# Crear base de datos
gcloud sql databases create sistema_horarios \
  --instance=horarios-db-instanc

# Crear usuario Laravel
gcloud sql users create laravel_user \
  --instance=horarios-db-instanc \
  --password="|3cjhQB~ZH\"@kY50"

# Obtener connection name
gcloud sql instances describe horarios-db-instanc \
  --format="value(connectionName)"
# Output: horarios-477719:us-central1:horarios-db-instanc
```

#### 3. Crear Artifact Registry Repository

```bash
gcloud artifacts repositories create horarios-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="Docker images for horarios backend"

# Configurar Docker para autenticación
gcloud auth configure-docker us-central1-docker.pkg.dev
```

#### 4. Build y Push de Docker Image (Backend)

```powershell
# Navegar a backend
cd backend

# Build de imagen
docker build -t horarios-backend-local -f Dockerfile .

# Tag para Artifact Registry
docker tag horarios-backend-local `
  us-central1-docker.pkg.dev/horarios-477719/horarios-repo/horarios-backend:latest

# Push
docker push `
  us-central1-docker.pkg.dev/horarios-477719/horarios-repo/horarios-backend:latest
```

#### 5. Deploy en Cloud Run

```bash
gcloud run deploy horarios-backend \
  --image us-central1-docker.pkg.dev/horarios-477719/horarios-repo/horarios-backend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --timeout 300 \
  --add-cloudsql-instances horarios-477719:us-central1:horarios-db-instanc \
  --set-env-vars "APP_ENV=production,APP_KEY=base64:Bqy+n3OqOiuEXMi0CHs9e0Gh66kXfvQF7YFaYIrYfmw=,APP_DEBUG=false,DB_CONNECTION=pgsql,DB_HOST=127.0.0.1,DB_PORT=5432,DB_DATABASE=sistema_horarios,DB_USERNAME=laravel_user,DB_PASSWORD=|3cjhQB~ZH\"@kY50,DB_SOCKET=/cloudsql/horarios-477719:us-central1:horarios-db-instanc"

# Output: Service URL: https://horarios-backend-101246198711.us-central1.run.app
```

#### 6. Ejecutar Migraciones en Cloud SQL

```bash
# Opción A: Usar Cloud SQL Proxy
.\cloud_sql_proxy.exe -instances=horarios-477719:us-central1:horarios-db-instanc=tcp:5432

# En otra terminal
cd backend
php artisan migrate:fresh --seed --force

# Opción B: Conectar vía Cloud Shell
gcloud sql connect horarios-db-instanc --user=laravel_user

# Ejecutar SQL manualmente o via migrate
```

#### 7. Deploy Frontend en Firebase Hosting

```powershell
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Navegar a frontend
cd frontend-horarios

# Crear .env.production con URL de Cloud Run
echo "VITE_API_URL=https://horarios-backend-101246198711.us-central1.run.app/api" > .env.production

# Build de producción
npm run build

# Inicializar Firebase (solo primera vez)
firebase init hosting
# Seleccionar proyecto: horarios-477719
# Public directory: dist
# Configure as SPA: Yes
# Overwrite index.html: No

# Deploy
firebase deploy --only hosting

# Output: Hosting URL: https://horarios-477719.web.app
```

#### 8. Configurar CORS en Backend

**Archivo:** `backend/config/cors.php`

```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'https://horarios-477719.web.app',
        'http://localhost:5173', // Para desarrollo local
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

**Rebuild y redeploy backend después de cambiar CORS.**

#### 9. Verificar Despliegue

```bash
# Test Backend API
curl https://horarios-backend-101246198711.us-central1.run.app/api/health

# Test Frontend
# Abrir https://horarios-477719.web.app

# Test Login
curl -X POST https://horarios-backend-101246198711.us-central1.run.app/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@admin.com","password":"Admin123."}'
```

### Costos Estimados (GCP)

| Servicio | Tier | Costo Mensual Estimado |
|----------|------|------------------------|
| Cloud Run | 512 MiB, 0-1000 instancias | $0 - $5 (free tier hasta 2M requests) |
| Cloud SQL | db-custom-1-3840, PostgreSQL 17 | $25 - $30/mes |
| Firebase Hosting | CDN, 10 GB transfer | $0 (free tier hasta 10 GB/mes) |
| Artifact Registry | Storage | $0.10/GB/mes |
| **TOTAL** | | **$25 - $40/mes** |

**Nota:** Free tier de Cloud Run cubre hasta 2 millones de requests/mes y 360,000 vCPU-segundos.

---

## 📚 Documentación Adicional

### Archivos de Documentación Complementaria

| Archivo | Descripción |
|---------|-------------|
| `CLOUD_DEPLOYMENT_READY.md` | Guía completa de despliegue en Google Cloud |
| `FORMATO_CSV_CARGA_HORARIA.md` | Especificación del formato CSV para importación |
| `GUIA_PRUEBAS_FUNCIONALIDADES.md` | Guía de testing manual de todas las funcionalidades |
| `IMPLEMENTACION_QR.md` | Implementación del módulo de códigos QR para asistencia |
| `INSTRUCCIONES_PWA_Y_REPORTES.md` | Configuración de PWA y sistema de reportes |
| `MODULO_ASISTENCIA_DOCENTE.md` | Documentación del módulo de control de asistencia |

### Estructura del Proyecto

```
Examen-Sistema-de-informaci-n-1/
├── backend/                          # Laravel 11 API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/     # 14 controladores API
│   │   │   ├── Requests/            # Form Requests de validación
│   │   │   └── Middleware/          # CheckRole, CORS
│   │   ├── Models/                  # 14 modelos Eloquent
│   │   └── Exports/                 # Clases de exportación (Excel, PDF)
│   ├── database/
│   │   ├── migrations/              # 17 migraciones
│   │   └── seeders/                 # 8 seeders
│   ├── routes/
│   │   └── api.php                  # 60+ rutas API
│   ├── config/
│   │   ├── database.php             # Configuración PostgreSQL
│   │   ├── cors.php                 # Configuración CORS
│   │   ├── sanctum.php              # Autenticación Sanctum
│   │   └── cache.php                # Sistema de caché
│   ├── Dockerfile                   # Multi-stage build
│   ├── docker-entrypoint.sh         # Script de inicio
│   └── .env.cloud                   # Variables de entorno Cloud Run
│
├── frontend-horarios/                # React 19 SPA
│   ├── src/
│   │   ├── pages/                   # 20+ páginas
│   │   ├── components/              # Componentes reutilizables
│   │   ├── services/
│   │   │   └── api.js               # Cliente Axios
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx     # Contexto de autenticación
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx      # Layout principal con sidebar
│   │   └── App.jsx                  # Componente raíz
│   ├── public/
│   │   ├── pwa-192x192.png         # Icono PWA
│   │   ├── pwa-512x512.png         # Icono PWA
│   │   └── manifest.json           # Manifest PWA
│   ├── vite.config.js              # Configuración Vite + PWA
│   ├── firebase.json               # Configuración Firebase Hosting
│   └── .env.production             # Variables de entorno producción
│
├── README.md                         # Este archivo
└── *.md                             # Documentación adicional
```

### Comandos Útiles

#### Backend (Laravel)

```bash
# Limpiar cachés
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Cachear para producción
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Migraciones
php artisan migrate:status
php artisan migrate:fresh --seed
php artisan migrate:rollback --step=1

# Tinker (REPL)
php artisan tinker

# Generar controlador
php artisan make:controller Api/NombreController

# Generar modelo con migración
php artisan make:model NombreModelo -m
```

#### Frontend (React)

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview build
npm run preview

# Linter
npm run lint
```

#### Docker

```bash
# Build local
docker build -t horarios-backend-local -f backend/Dockerfile ./backend

# Run local
docker run -p 8080:8080 horarios-backend-local

# Ver logs
docker logs <container_id>

# Exec en contenedor
docker exec -it <container_id> sh
```

#### Cloud Run

```bash
# Ver logs en tiempo real
gcloud run services logs tail horarios-backend \
  --region us-central1 \
  --project horarios-477719

# Actualizar variables de entorno
gcloud run services update horarios-backend \
  --update-env-vars "DB_PASSWORD=nueva_password" \
  --region us-central1

# Ver revisiones
gcloud run revisions list \
  --service horarios-backend \
  --region us-central1

# Rollback a revisión anterior
gcloud run services update-traffic horarios-backend \
  --to-revisions <revision-name>=100 \
  --region us-central1
```

#### Cloud SQL

```bash
# Conectar via proxy
.\cloud_sql_proxy.exe -instances=horarios-477719:us-central1:horarios-db-instanc=tcp:5432

# Conectar con psql
psql "host=127.0.0.1 port=5432 dbname=sistema_horarios user=laravel_user"

# Backup
gcloud sql backups create \
  --instance=horarios-db-instanc

# Restore
gcloud sql backups restore <backup_id> \
  --backup-instance=horarios-db-instanc \
  --restore-instance=horarios-db-instanc
```

---

## 🐛 Troubleshooting

### Error: "CORS policy blocked"

**Causa:** Frontend no está en `allowed_origins` de CORS.

**Solución:**
1. Editar `backend/config/cors.php`
2. Agregar URL de frontend a `allowed_origins`
3. Rebuild y redeploy backend

### Error: "Connection refused" PostgreSQL

**Causa:** Backend no puede conectarse a Cloud SQL.

**Soluciones:**
1. Verificar que Cloud SQL instance esté configurada en `--add-cloudsql-instances`
2. Verificar `DB_SOCKET` en variables de entorno
3. Verificar que usuario y contraseña sean correctos
4. Revisar logs: `gcloud run services logs read horarios-backend`

### Error: "SQLSTATE[08006] password authentication failed"

**Causa:** Contraseña incorrecta o usuario no existe.

**Solución:**
1. Verificar contraseña en Cloud SQL: `gcloud sql users list --instance=horarios-db-instanc`
2. Resetear contraseña si es necesario
3. Actualizar `DB_PASSWORD` en Cloud Run

### Error: "Token mismatch" o "Unauthenticated"

**Causa:** Sanctum no reconoce el dominio del frontend.

**Solución:**
1. Verificar `SANCTUM_STATEFUL_DOMAINS` en `.env`
2. Agregar dominio de Firebase Hosting
3. Verificar `SESSION_DOMAIN` incluya `.run.app` o `.web.app`

### Frontend no conecta con Backend

**Causa:** `VITE_API_URL` incorrecta o no incluye `/api`.

**Solución:**
1. Verificar `.env.production`: `VITE_API_URL=https://horarios-backend-xxx.run.app/api`
2. Rebuild frontend: `npm run build`
3. Redeploy: `firebase deploy --only hosting`

### PWA no se instala

**Causa:** `manifest.json` inválido o Service Worker no registrado.

**Solución:**
1. Verificar `manifest.json` en Network tab (DevTools)
2. Verificar Service Worker en Application tab (DevTools)
3. Rebuild con `npm run build`
4. Forzar actualización del Service Worker

---

## 📞 Información del Proyecto

**Desarrollador:** Diego Saavedra  
**Repositorio:** [DSaav22/Examen-Sistema-de-informaci-n-1](https://github.com/DSaav22/Examen-Sistema-de-informaci-n-1)  
**Universidad:** Universidad Católica Boliviana "San Pablo"  
**Carrera:** Ingeniería de Sistemas  
**Materia:** Sistemas de Información 1  
**Fecha:** Noviembre 2025  

---

## 📄 Licencia

Este proyecto es parte de un examen académico de la materia Sistemas de Información 1. Todos los derechos reservados.

---

## ✅ Estado del Proyecto

| Componente | Estado | URL/Info |
|------------|--------|----------|
| **Backend API** | ✅ **DESPLEGADO** | https://horarios-backend-101246198711.us-central1.run.app |
| **Frontend PWA** | ✅ **DESPLEGADO** | https://horarios-477719.web.app |
| **Base de Datos** | ✅ **OPERATIVA** | PostgreSQL 17 en Cloud SQL |
| **Docker Image** | ✅ **PUBLICADO** | us-central1-docker.pkg.dev/.../horarios-backend:latest |
| **Migraciones** | ✅ **APLICADAS** | 17 tablas creadas |
| **Seeders** | ✅ **EJECUTADOS** | Datos de prueba cargados |
| **CORS** | ✅ **CONFIGURADO** | Firebase Hosting permitido |
| **Auth** | ✅ **FUNCIONANDO** | Sanctum tokens operativos |
| **PWA** | ✅ **ACTIVO** | Service Worker + Manifest |
| **QR Scanner** | ✅ **IMPLEMENTADO** | @yudiel/react-qr-scanner |
| **Reportes** | ✅ **FUNCIONANDO** | Excel + PDF exportables |

---

## 🎯 Funcionalidades Completas

- [x] Autenticación con roles (Admin, Coordinador, Docente)
- [x] CRUD de Facultades
- [x] CRUD de Carreras
- [x] CRUD de Materias (M:N con Carreras)
- [x] CRUD de Docentes con importación masiva CSV/Excel
- [x] CRUD de Aulas
- [x] CRUD de Grupos con cupos e inscritos
- [x] Asignación de Horarios con detección de 5 tipos de conflictos
- [x] Control de Asistencia Docente con códigos QR
- [x] Dashboard de estadísticas de asistencia
- [x] Exportación a Excel (listado de docentes)
- [x] Exportación a PDF (parrilla de horarios)
- [x] Parrilla global de horarios con filtros
- [x] PWA instalable con funcionamiento offline
- [x] Escaneo de códigos QR en la PWA
- [x] Despliegue en producción (Google Cloud + Firebase)
- [x] Base de datos PostgreSQL en Cloud SQL
- [x] API REST completa con documentación

---

**¡Sistema 100% Funcional y Desplegado en Producción!** 🚀
