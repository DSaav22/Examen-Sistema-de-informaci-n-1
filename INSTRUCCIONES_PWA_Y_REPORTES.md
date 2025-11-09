# Instrucciones para completar la configuración PWA

## ✅ Pasos Completados

1. ✅ Configuración de `vite.config.js` con el plugin `vite-plugin-pwa`
2. ✅ Manifest configurado con nombre, descripción y tema
3. ✅ Validación anti-conflictos implementada en el backend (Aula, Docente, Grupo)
4. ✅ Rutas de reportes agregadas al backend
5. ✅ Componentes de React para reportes creados

## 📋 Pasos Pendientes (Manuales)

### 1. Instalar el plugin PWA

Abre una terminal en la carpeta `frontend-horarios` y ejecuta:

```bash
cd frontend-horarios
npm install vite-plugin-pwa -D
```

### 2. Crear los íconos PWA

Necesitas crear 2 imágenes PNG y colocarlas en `frontend-horarios/public/`:

- **pwa-192x192.png** - Ícono de 192x192 píxeles
- **pwa-512x512.png** - Ícono de 512x512 píxeles

Puedes usar cualquier herramienta de diseño o un generador online de íconos PWA como:
- https://www.pwabuilder.com/imageGenerator
- https://realfavicongenerator.net/

### 3. Agregar las rutas de los reportes al router

En el archivo `frontend-horarios/src/routes/AppRouter.jsx` (o similar), agrega estas rutas:

```javascript
import ReporteAsistencia from '../pages/Reportes/ReporteAsistencia';
import AulasDisponibles from '../pages/Reportes/AulasDisponibles';

// Dentro de tus rutas:
<Route path="/reportes/asistencia" element={<ReporteAsistencia />} />
<Route path="/reportes/aulas-disponibles" element={<AulasDisponibles />} />
```

### 4. Agregar enlaces en el menú (opcional)

Si tienes un menú lateral o de navegación, agrega enlaces a:
- `/reportes/asistencia`
- `/reportes/aulas-disponibles`

## 🎯 Funcionalidades Implementadas

### Backend

#### 1. Validación Anti-Conflictos (HorarioController)
- ✅ Valida conflictos de **Aula**
- ✅ Valida conflictos de **Docente**
- ✅ Valida conflictos de **Grupo**
- Retorna error 422 con mensaje específico cuando detecta conflictos

#### 2. Reportes (ReporteController)
- ✅ `GET /api/reportes/asistencia-docente` - Reporte de asistencia filtrado por docente, grupo y fechas
- ✅ `GET /api/reportes/aulas-disponibles` - Lista de aulas disponibles según día y horario

### Frontend

#### 1. Componentes de Reportes
- ✅ `ReporteAsistencia.jsx` - Interfaz con filtros para ver asistencias
- ✅ `AulasDisponibles.jsx` - Búsqueda de aulas libres por día y hora

#### 2. PWA
- ✅ Configuración de manifest (nombre, íconos, tema)
- ✅ Service Worker automático (autoUpdate)
- ⏳ Pendiente: Crear íconos PNG
- ⏳ Pendiente: Instalar dependencia npm

## 🧪 Cómo Probar

### Validación Anti-Conflictos
1. Intenta crear un horario para un aula que ya está ocupada en ese día/hora
2. Deberías recibir un error 422 con mensaje "¡Conflicto de Aula!"

### Reporte de Asistencia
1. Navega a `/reportes/asistencia`
2. Selecciona filtros opcionales (docente, grupo, fechas)
3. Click en "Buscar"

### Aulas Disponibles
1. Navega a `/reportes/aulas-disponibles`
2. Selecciona día de la semana
3. Selecciona rango de horas
4. Click en "Buscar Aulas"

### PWA (después de crear los íconos)
1. Ejecuta `npm run build` en frontend-horarios
2. Sirve el build con un servidor local
3. Abre la app en Chrome
4. Deberías ver un botón "Instalar" en la barra de direcciones

## 📝 Notas Importantes

- Los íconos PWA deben ser **cuadrados** y de alta calidad
- El manifest ya está configurado con los colores del tema
- La validación anti-conflictos funciona **antes** de insertar en la base de datos
- Los reportes incluyen todas las relaciones necesarias (eager loading)

## ✨ Siguiente Paso

Ejecuta estos comandos para finalizar la instalación:

```bash
cd frontend-horarios
npm install vite-plugin-pwa -D
```

Luego crea los íconos manualmente y agrega las rutas al router.
