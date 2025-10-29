# 🔧 GUÍA DE INSTALACIÓN PREVIA

## ❗ REQUISITOS PREVIOS QUE NECESITAS INSTALAR

Antes de ejecutar el proyecto, necesitas tener instaladas estas herramientas:

---

## 1️⃣ **Instalar Composer** (Gestor de paquetes PHP)

### Descargar e instalar:
1. Ve a: https://getcomposer.org/download/
2. Descarga **Composer-Setup.exe** para Windows
3. Ejecuta el instalador y sigue el asistente
4. Reinicia tu PowerShell después de instalarlo

### Verificar instalación:
```powershell
composer --version
# Deberías ver algo como: Composer version 2.x.x
```

---

## 2️⃣ **Instalar Node.js y npm** (Para compilar React)

### Descargar e instalar:
1. Ve a: https://nodejs.org/
2. Descarga la versión **LTS (Long Term Support)**
3. Ejecuta el instalador (acepta todas las opciones por defecto)
4. Reinicia tu PowerShell después de instalarlo

### Verificar instalación:
```powershell
node --version
# Deberías ver algo como: v20.x.x

npm --version
# Deberías ver algo como: 10.x.x
```

---

## 3️⃣ **Instalar PostgreSQL** (Base de datos)

### Descargar e instalar:
1. Ve a: https://www.postgresql.org/download/windows/
2. Descarga el instalador para Windows
3. Durante la instalación:
   - **Puerto:** Deja el puerto por defecto (5432)
   - **Contraseña del superusuario:** Anótala bien (ej: "admin123")
   - **Instalación de componentes:** Instala todo

### Crear la base de datos:
1. Abre **pgAdmin 4** (se instaló con PostgreSQL)
2. Conéctate con tu contraseña
3. Click derecho en "Databases" → "Create" → "Database"
4. Nombre: `sistema_horarios`
5. Click en "Save"

---

## 4️⃣ **Instalar Git** (Control de versiones - opcional pero recomendado)

### Descargar e instalar:
1. Ve a: https://git-scm.com/download/win
2. Descarga e instala Git para Windows
3. Usa las opciones por defecto

---

## ✅ **VERIFICACIÓN COMPLETA**

Después de instalar todo, abre una **nueva ventana de PowerShell** y verifica:

```powershell
php --version       # ✅ Ya tienes PHP 8.4.7
composer --version  # ⚠️ Necesitas instalar Composer
node --version      # ⚠️ Necesitas instalar Node.js
npm --version       # ⚠️ Viene con Node.js
psql --version      # ⚠️ Necesitas instalar PostgreSQL
```

---

## 🎯 **UNA VEZ QUE TENGAS TODO INSTALADO**

Regresa a este proyecto y ejecuta los comandos de instalación en orden:

1. `composer install`
2. `npm install`
3. `php artisan migrate`
4. `php artisan db:seed`
5. `npm run dev` (en una terminal)
6. `php artisan serve` (en otra terminal)

---

## 💡 **ALTERNATIVA RÁPIDA: LARAVEL HERD (RECOMENDADO PARA WINDOWS)**

Si quieres evitar instalar todo manualmente, puedes usar **Laravel Herd**:

1. Ve a: https://herd.laravel.com/windows
2. Descarga e instala Laravel Herd
3. Herd incluye PHP, Composer y Node.js automáticamente
4. Solo necesitarás instalar PostgreSQL por separado

---

## 📞 **¿PROBLEMAS?**

Si tienes problemas con la instalación de alguna herramienta:
- Asegúrate de **reiniciar PowerShell** después de cada instalación
- Ejecuta PowerShell **como Administrador**
- Verifica que las herramientas estén en el PATH del sistema
