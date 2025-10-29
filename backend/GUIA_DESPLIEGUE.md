# 🚀 GUÍA DE DESPLIEGUE - Sistema de Horarios

Esta guía te permite desplegar el sistema en cualquier servidor o equipo nuevo.

---

## 📋 **Requisitos Previos**

### **Software necesario:**
- ✅ **PHP 8.2 o superior** con extensiones:
  - pdo_pgsql
  - pgsql
  - mbstring
  - openssl
  - json
  - tokenizer
- ✅ **Composer** 2.x
- ✅ **Node.js** 18.x o superior + npm
- ✅ **PostgreSQL** 15 o superior
- ✅ **Git** (para clonar el repositorio)

---

## 🔧 **PASO 1: Clonar el Repositorio**

```powershell
# Clonar desde GitHub
git clone https://github.com/DSaav22/Examen-Sistema-de-informaci-n-1.git

# O si tienes el proyecto comprimido, descomprimirlo
cd Examen-Sistema-de-informaci-n-1
```

---

## 📦 **PASO 2: Instalar Dependencias**

### **Backend (Composer)**
```powershell
# Instalar paquetes PHP
composer install
```

### **Frontend (NPM)**
```powershell
# Instalar paquetes Node.js
npm install
```

---

## ⚙️ **PASO 3: Configurar el Archivo .env**

```powershell
# Copiar el archivo de ejemplo
copy .env.example .env

# Editar .env con tu editor (VS Code, Notepad++, etc.)
code .env
```

### **Configuración importante en `.env`:**

```env
# Aplicación
APP_NAME="Sistema de Horarios"
APP_ENV=production
APP_DEBUG=false
APP_TIMEZONE=America/La_Paz
APP_URL=http://tu-dominio.com

# Base de Datos PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=sistema_horarios
DB_USERNAME=tu_usuario_postgres
DB_PASSWORD=tu_contraseña_postgres

# Otros (dejar por defecto)
BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
SESSION_DRIVER=database
CACHE_STORE=database
```

---

## 🔑 **PASO 4: Generar la Clave de Aplicación**

```powershell
php artisan key:generate
```

Este comando genera automáticamente el `APP_KEY` en tu archivo `.env`.

---

## 🗄️ **PASO 5: Preparar la Base de Datos**

### **Crear la base de datos en PostgreSQL:**

```sql
-- Conectar a PostgreSQL como superusuario
psql -U postgres

-- Crear la base de datos
CREATE DATABASE sistema_horarios;

-- Crear usuario (opcional, si no tienes uno)
CREATE USER tu_usuario WITH PASSWORD 'tu_contraseña';

-- Dar permisos
GRANT ALL PRIVILEGES ON DATABASE sistema_horarios TO tu_usuario;

-- Salir
\q
```

### **Ejecutar las migraciones:**

```powershell
# Ejecutar TODAS las migraciones (crea las 17 tablas)
php artisan migrate
```

**Salida esperada:**
```
✔ 2025_10_24_000001_create_roles_table
✔ 2025_10_24_000002_create_users_table
✔ 2025_10_24_000003_create_facultades_table
... (14 tablas más)
✔ 2025_10_25_183953_create_audits_table
```

---

## 🌱 **PASO 6: Poblar Datos Iniciales (Seeders)**

```powershell
# Ejecutar TODOS los seeders
php artisan db:seed
```

Esto crea:
- ✅ 3 roles (administrador, coordinador, docente)
- ✅ 6 usuarios de prueba
- ✅ 1 facultad (Ingeniería)
- ✅ 3 carreras (Sistemas, Civil, Industrial)
- ✅ 5 aulas
- ✅ 5 materias
- ✅ 3 docentes

### **Usuarios creados:**

| Email | Password | Rol |
|-------|----------|-----|
| admin@sistema.com | password | administrador |
| coordinador@sistema.com | password | coordinador |
| docente@sistema.com | password | docente |
| docente1@sistema.com | password | docente |
| docente2@sistema.com | password | docente |
| docente3@sistema.com | password | docente |

---

## 🎨 **PASO 7: Compilar Assets del Frontend**

### **Desarrollo (con hot-reload):**
```powershell
npm run dev
```

### **Producción (optimizado y minificado):**
```powershell
npm run build
```

---

## 🚀 **PASO 8: Iniciar el Servidor**

### **Desarrollo (localhost):**
```powershell
# Terminal 1: Laravel
php artisan serve

# Terminal 2: Vite (solo en desarrollo)
npm run dev
```

Visita: `http://localhost:8000`

### **Producción (con Nginx/Apache):**

Configura tu servidor web para apuntar a la carpeta `public/` del proyecto.

**Ejemplo de configuración Nginx:**
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/sistema-horarios/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

---

## ✅ **PASO 9: Verificación del Despliegue**

### **Verificar migraciones:**
```powershell
php artisan migrate:status
```

Todas deben mostrar **[✓] Ran**.

### **Verificar tablas en PostgreSQL:**
```powershell
psql -U tu_usuario -d sistema_horarios -c "\dt"
```

Debes ver 17 tablas:
- roles, users, facultades, carreras, materias, docentes, aulas
- gestiones_academicas, grupos, horarios
- asistencias, tokens_asistencia_qr, pwa_subscriptions, notificaciones_log
- cache, jobs, audits

### **Verificar usuarios:**
```powershell
psql -U tu_usuario -d sistema_horarios -c "SELECT email, name FROM users;"
```

Debes ver 6 usuarios.

---

## 🔒 **PASO 10: Seguridad en Producción**

1. **Cambiar las contraseñas de los usuarios de prueba:**
   ```powershell
   php artisan tinker
   ```
   ```php
   $user = User::where('email', 'admin@sistema.com')->first();
   $user->password = Hash::make('tu_nueva_contraseña_segura');
   $user->save();
   ```

2. **Deshabilitar el registro público** (si no lo necesitas):
   - Edita `routes/auth.php` y comenta la ruta de registro

3. **Configurar permisos de archivos:**
   ```bash
   chmod -R 755 storage bootstrap/cache
   ```

4. **Configurar HTTPS** con Let's Encrypt (recomendado):
   ```bash
   certbot --nginx -d tu-dominio.com
   ```

---

## 🛠️ **Comandos Útiles**

### **Limpiar caché:**
```powershell
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### **Optimizar para producción:**
```powershell
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### **Ver logs de errores:**
```powershell
Get-Content storage/logs/laravel.log -Tail 50
```

### **Rollback de migraciones (CUIDADO):**
```powershell
# Deshacer la última migración
php artisan migrate:rollback

# Deshacer todas las migraciones
php artisan migrate:reset
```

---

## 📁 **Estructura de Archivos Importantes**

```
proyecto/
├── app/
│   ├── Http/Controllers/       # Controladores (MateriaController, AulaController, etc.)
│   ├── Models/                 # Modelos Eloquent (User, Materia, Horario, etc.)
│   ├── Http/Middleware/        # CheckRole.php (RBAC)
│   └── Http/Requests/          # Form Requests (validaciones)
├── database/
│   ├── migrations/             # 17 archivos de migración (NO ELIMINAR)
│   └── seeders/                # Seeders para datos iniciales
├── resources/
│   └── js/
│       ├── Pages/              # Vistas React (Materias/, Aulas/, Grupos/, etc.)
│       ├── Layouts/            # AuthenticatedLayout.jsx (navegación)
│       └── Components/         # Componentes reutilizables
├── routes/
│   └── web.php                 # Rutas del sistema
├── public/                     # Carpeta pública (index.php, assets compilados)
├── .env                        # Configuración (NO SUBIR A GIT)
└── composer.json / package.json # Dependencias
```

---

## 🐛 **Solución de Problemas Comunes**

### **Error: "No existe la relación 'audits'"**
```powershell
php artisan vendor:publish --provider="OwenIt\Auditing\AuditingServiceProvider" --tag="migrations"
php artisan migrate
```

### **Error: extensión PHP pdo_pgsql no encontrada**
```ini
# Editar php.ini y descomentar:
extension=pdo_pgsql
extension=pgsql
```

### **Error: SQLSTATE[42501] permission denied**
```sql
-- Dar permisos completos al usuario
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tu_usuario;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tu_usuario;
```

### **Error: npm run dev no funciona**
```powershell
# Eliminar node_modules y reinstalar
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

## 📞 **Soporte**

- **Repositorio:** https://github.com/DSaav22/Examen-Sistema-de-informaci-n-1
- **Documentación Laravel:** https://laravel.com/docs
- **Documentación Inertia.js:** https://inertiajs.com
- **Documentación React:** https://react.dev

---

## ✅ **Checklist de Despliegue Exitoso**

- [ ] PHP 8.2+ instalado con extensiones
- [ ] PostgreSQL 15+ instalado y corriendo
- [ ] Composer instalado
- [ ] Node.js 18+ instalado
- [ ] Repositorio clonado
- [ ] `composer install` ejecutado
- [ ] `npm install` ejecutado
- [ ] `.env` configurado correctamente
- [ ] `php artisan key:generate` ejecutado
- [ ] Base de datos creada en PostgreSQL
- [ ] `php artisan migrate` ejecutado (17 tablas creadas)
- [ ] `php artisan db:seed` ejecutado (6 usuarios creados)
- [ ] `npm run build` ejecutado (producción)
- [ ] Servidor web configurado (Nginx/Apache)
- [ ] Puedes hacer login con admin@sistema.com / password
- [ ] RBAC funciona (navegación diferente por rol)
- [ ] Puedes crear/editar Materias, Aulas, Docentes
- [ ] Puedes asignar horarios y detecta conflictos

---

**🎉 ¡Sistema Desplegado Exitosamente!**
