# 🔧 CONFIGURACIÓN DE PHP PARA BASES DE DATOS

## ⚠️ Problema Actual
PHP no tiene habilitadas las extensiones de base de datos (ni PostgreSQL ni SQLite).

## ✅ SOLUCIÓN RÁPIDA (Habilitar extensiones en php.ini)

### Paso 1: Abrir php.ini

1. Abre el archivo: **`C:\php-8.4.7\php.ini`** con un editor de texto
   - Puedes usar Notepad, Notepad++, o VS Code
   - Si VS Code, ejecuta: `code C:\php-8.4.7\php.ini`

### Paso 2: Habilitar SQLite (MÁS FÁCIL para empezar)

Busca estas líneas y **quita el punto y coma** (`;`) del inicio:

```ini
;extension=pdo_sqlite
;extension=sqlite3
```

Déjalas así (SIN punto y coma):

```ini
extension=pdo_sqlite
extension=sqlite3
```

### Paso 3: (OPCIONAL) Habilitar PostgreSQL

Si quieres usar PostgreSQL, también busca y descomenta:

```ini
;extension=pdo_pgsql
;extension=pgsql
```

Déjalas así:

```ini
extension=pdo_pgsql
extension=pgsql
```

### Paso 4: Guardar y Reiniciar

1. **Guarda** el archivo `php.ini`
2. **Cierra todas las terminales** de PowerShell y VS Code
3. **Abre una nueva terminal**

### Paso 5: Verificar

Ejecuta este comando para verificar que SQLite está habilitado:

```powershell
php -m | findstr sqlite
```

Deberías ver:
```
pdo_sqlite
sqlite3
```

---

## 🚀 DESPUÉS DE CONFIGURAR PHP

Una vez que hayas habilitado las extensiones y reiniciado la terminal:

### Si usas SQLite:
```powershell
php artisan migrate
php artisan db:seed
npm run dev
```

En otra terminal:
```powershell
php artisan serve
```

### Si usas PostgreSQL:
1. Edita `.env` y cambia `DB_CONNECTION=sqlite` por `DB_CONNECTION=pgsql`
2. Configura los datos de conexión (host, database, username, password)
3. Ejecuta:
```powershell
php artisan migrate
php artisan db:seed
npm run dev
```

---

## ℹ️ NOTA IMPORTANTE

Las extensiones **`pdo_sqlite`** y **`sqlite3`** ya deberían estar incluidas en tu instalación de PHP.
Si no las encuentras en el `php.ini`, busca el archivo **`php.ini-development`** o **`php.ini-production`** 
en la carpeta `C:\php-8.4.7\` y cópialo como `php.ini`.

