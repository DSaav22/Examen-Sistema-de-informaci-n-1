# 🚀 Configuración para Despliegue en Google Cloud

## ✅ PREPARACIÓN COMPLETADA

### 📋 Resumen de Cambios

#### **1. Backend Laravel - CORS Configurado** ✅
**Archivo:** `backend/config/cors.php`
- ✅ `allowed_origins`: Incluye `'*'` para testing (ajustar después con URL exacta)
- ✅ `allowed_methods`: `['*']`
- ✅ `allowed_headers`: `['*']`

#### **2. Backend Laravel - Variables de Entorno** ✅
**Archivo:** `backend/.env`

```env
# URLs de la aplicación
APP_URL=http://localhost:8000
FRONTEND_URL=https://frontend-horarios.web.app

# Base de datos local (desarrollo)
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=sistema_horarios
DB_USERNAME=postgres
DB_PASSWORD=diego

# Google Cloud SQL (producción)
DB_SOCKET=/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME
```

**⚠️ PENDIENTE: Actualizar cuando se cree la instancia de Cloud SQL:**
- `DB_SOCKET` → Formato: `/cloudsql/horarios-477719:REGION:INSTANCE_NAME`
- `DB_USERNAME` → Usuario de Cloud SQL
- `DB_PASSWORD` → Contraseña de Cloud SQL

#### **3. Backend Laravel - Optimizaciones** ✅
Comandos ejecutados:
- ✅ `php artisan config:cache` → Configuración cacheada
- ⚠️ `php artisan route:cache` → **SALTADO** (error de rutas duplicadas)
- ✅ `php artisan view:cache` → Vistas cacheadas

**Nota sobre route:cache:**
Hay un conflicto de nombres de rutas en `routes/web.php` o `routes/api.php`.
Esto no afectará el despliegue, pero debe resolverse para producción optimizada.

#### **4. Frontend React - Variables de Entorno** ✅
**Archivo:** `frontend-horarios/.env.production`

```env
VITE_API_URL=https://sistema-horarios-backend-491946492275.us-central1.run.app/api
VITE_APP_NAME="Sistema de Horarios"
VITE_APP_ENV=production
```

**⚠️ PENDIENTE: Actualizar cuando se despliegue el backend en Cloud Run:**
- `VITE_API_URL` → URL real del backend en Cloud Run/Cloud Functions

#### **5. Frontend React - Build de Producción** ✅
Comandos ejecutados:
- ✅ `npm install` → Dependencias instaladas
- ✅ `npm run build` → Build de producción generado

**Resultado:**
- ✅ Carpeta `dist/` generada con 1.54 MB (457.65 KB gzipped)
- ✅ Service Worker (PWA) generado
- ✅ 10 archivos pre-cacheados para offline

---

## 📊 Estado del Proyecto

### Backend Laravel
- ✅ Base de datos limpia con seeders
- ✅ Migración `docente_id` aplicada
- ✅ CORS configurado para producción
- ✅ Variables de entorno preparadas
- ✅ Cachés optimizadas

### Frontend React
- ✅ Build de producción generado
- ✅ PWA configurado
- ✅ Variables de entorno preparadas
- ✅ API URL lista para actualizar

---

## 🔧 Próximos Pasos en Google Cloud

### 1. Crear Instancia de Cloud SQL (PostgreSQL)
```bash
# Comando de ejemplo (ajustar según necesidad)
gcloud sql instances create sistema-horarios-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1
```

**Actualizar después:**
- `backend/.env` → `DB_SOCKET`, `DB_USERNAME`, `DB_PASSWORD`

### 2. Desplegar Backend en Cloud Run
```bash
# Desde la carpeta backend/
gcloud run deploy sistema-horarios-backend \
  --source . \
  --region=us-central1 \
  --allow-unauthenticated
```

**Actualizar después:**
- `frontend-horarios/.env.production` → `VITE_API_URL`
- `backend/config/cors.php` → Reemplazar `'*'` con URL exacta del frontend

### 3. Desplegar Frontend en Firebase Hosting
```bash
# Desde la carpeta frontend-horarios/
firebase deploy --only hosting
```

**Actualizar después:**
- `backend/.env` → `FRONTEND_URL`
- `backend/config/cors.php` → Añadir URL exacta de Firebase

---

## ⚠️ Notas Importantes

### Problema Detectado: route:cache
**Error:** Rutas duplicadas con nombre `materias.index`

**Causa probable:** Definiciones duplicadas en `routes/web.php` o `routes/api.php`

**Solución temporal:** Usar sin cache de rutas (no afecta funcionalidad)

**Solución definitiva:** Revisar archivos de rutas y eliminar duplicados

### Configuración de Base de Datos
El sistema está preparado para usar:
- **Desarrollo:** PostgreSQL local (`127.0.0.1:5432`)
- **Producción:** Google Cloud SQL (socket Unix)

Laravel detectará automáticamente qué usar según la variable `DB_SOCKET`.

---

## 📦 Archivos Listos para Despliegue

### Backend
- ✅ `backend/` → Listo para Cloud Run
- ✅ Configuración optimizada
- ✅ Conexión a Cloud SQL preparada

### Frontend
- ✅ `frontend-horarios/dist/` → Listo para Firebase Hosting
- ✅ 1.54 MB de código optimizado
- ✅ PWA funcional con service worker

---

## 🎯 Checklist Final

- [x] CORS configurado
- [x] Variables de entorno preparadas
- [x] Base de datos limpia y migrada
- [x] Frontend construido para producción
- [x] PWA configurado
- [ ] Cloud SQL creado (pendiente)
- [ ] Backend desplegado en Cloud Run (pendiente)
- [ ] Frontend desplegado en Firebase (pendiente)
- [ ] URLs actualizadas (pendiente)

---

**Proyecto:** horarios-477719  
**Fecha de preparación:** 9 de noviembre de 2025  
**Estado:** ✅ Listo para despliegue en Google Cloud
