# 🧪 GUÍA COMPLETA DE PRUEBAS - FUNCIONALIDADES IMPLEMENTADAS

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de que:
- ✅ Backend corriendo: `http://localhost:8000`
- ✅ Frontend corriendo: `http://localhost:5173`
- ✅ Base de datos con seeders: `php artisan migrate:fresh --seed`

---

## 🧪 TEST CASE 1: CARGA MASIVA DE DOCENTES (CSV/Excel)

### 🎯 Objetivo
Validar la importación masiva de docentes mediante archivos CSV/Excel.

### 📝 Pasos Detallados

#### PASO 1: Acceder al Módulo de Importación

```
1. Abrir navegador: http://localhost:5173
2. Iniciar sesión como Administrador:
   📧 Email: admin@example.com
   🔑 Contraseña: password
3. En el menú lateral izquierdo, hacer clic en "Docentes"
4. En la página de listado de docentes, buscar el botón "Importar Docentes" 
   (esquina superior derecha, botón morado)
5. Hacer clic en "Importar Docentes"
```

**✅ Resultado Esperado:**
- Se abre una página con título "Importar Docentes"
- Hay un botón "Descargar Plantilla CSV"
- Hay un área para arrastrar/seleccionar archivo

---

#### PASO 2: Descargar la Plantilla

```
1. Hacer clic en el botón verde "Descargar Plantilla CSV"
2. Se descargará un archivo: plantilla_docentes.csv
3. Abrir el archivo con Excel, LibreOffice o Notepad
```

**Contenido de la Plantilla:**
```csv
nombre,apellidos,email,telefono,ci,especialidad,cargo
Juan,Pérez García,juan.perez@universidad.edu,+591 70000001,1234567 LP,Ingeniería de Software,Profesor Titular
María,López Rodríguez,maria.lopez@universidad.edu,+591 70000002,2345678 CB,Base de Datos,Profesor Asociado
```

---

#### PASO 3: Crear Archivo CSV de Prueba

**Crear un nuevo archivo:** `docentes_test.csv`

**Copiar y pegar este contenido:**
```csv
nombre,apellidos,email,telefono,ci,especialidad,cargo
Roberto,Sánchez Morales,roberto.sanchez@test.edu,+591 71234567,5555555 LP,Inteligencia Artificial,Profesor Titular
Laura,Mendoza Castro,laura.mendoza@test.edu,+591 72345678,6666666 CB,Seguridad Informática,Profesor Asociado
Fernando,Quispe Torres,fernando.quispe@test.edu,+591 73456789,7777777 SC,Desarrollo Web,Profesor Auxiliar
Sofía,Rojas Pardo,sofia.rojas@test.edu,+591 74567890,8888888 LP,Machine Learning,Profesor Titular
```

**💡 Notas Importantes:**
- Todos los campos son obligatorios
- El email debe ser único (no puede existir en la base de datos)
- El CI debe ser único
- El formato debe ser exactamente como se muestra

---

#### PASO 4: Subir el Archivo

```
1. Volver a la página de "Importar Docentes"
2. Opción A: Arrastrar el archivo docentes_test.csv al área punteada
   Opción B: Hacer clic en "Seleccionar archivo" y elegir docentes_test.csv
3. Verificar que aparezca el nombre del archivo seleccionado
4. Hacer clic en el botón morado "Importar Docentes"
5. Esperar el proceso (puede tardar unos segundos)
```

**✅ Resultado Esperado:**
- Mensaje de éxito: "Se importaron 4 docentes exitosamente"
- Redirección automática a la lista de docentes
- Los 4 nuevos docentes aparecen en la tabla

---

#### PASO 5: Verificar los Datos Importados

```
1. En la lista de docentes, usar la barra de búsqueda (arriba de la tabla)
2. Buscar: "Roberto"
3. Verificar que aparezca: Roberto Sánchez Morales
4. Hacer clic en el botón "Ver" (ícono de ojo)
5. Verificar los datos completos:
   - Nombre: Roberto Sánchez Morales
   - Email: roberto.sanchez@test.edu
   - Teléfono: +591 71234567
   - CI: 5555555 LP
   - Especialidad: Inteligencia Artificial
   - Cargo: Profesor Titular
```

---

#### PASO 6: Prueba de Validación (Errores)

**Crear archivo:** `docentes_error.csv`

```csv
nombre,apellidos,email,telefono,ci,especialidad,cargo
,Sin Nombre,error1@test.com,+591 71111111,1111111 LP,Test,Titular
Pedro,Pérez,admin@example.com,+591 72222222,2222222 LP,Test,Asociado
Ana,López,ana@test.com,TELEFONO_INVALIDO,3333333 LP,Test,Auxiliar
```

**Subir este archivo:**

**✅ Resultado Esperado:**
- ❌ Fila 1: Error "El campo nombre es obligatorio"
- ❌ Fila 2: Error "El email ya está registrado" (admin@example.com existe)
- ⚠️ Fila 3: Se importa (el teléfono no tiene validación estricta)
- Sistema muestra mensaje de error detallado
- NO se importan registros con errores

---

### ✅ Checklist Final - Carga Masiva

- [ ] Plantilla CSV se descarga correctamente
- [ ] Archivo válido se importa sin errores (4 docentes)
- [ ] Docentes aparecen en la lista con todos los campos
- [ ] Campo "Cargo" se muestra correctamente
- [ ] Sistema detecta emails duplicados
- [ ] Sistema detecta campos vacíos
- [ ] Mensaje de éxito indica cantidad correcta
- [ ] Búsqueda encuentra docentes importados

---

## 🧪 TEST CASE 2: CONTROL DE ASISTENCIA DOCENTE

### 🎯 Objetivo
Registrar y visualizar la asistencia de docentes a sus clases programadas.

### 🔧 PREPARACIÓN PREVIA (IMPORTANTE)

**Necesitas crear datos de prueba primero:**

#### OPCIÓN A: Crear desde el Frontend (Recomendado)

```
1. Iniciar sesión como Administrador (admin@example.com / password)

2. Crear un Docente de Prueba:
   - Ir a "Docentes" → "Crear Docente"
   - Completar formulario:
     * Usuario: Seleccionar "Coordinador Usuario" (coordinador@example.com)
     * Nombre: Profesor
     * Apellidos: De Prueba
     * Teléfono: +591 70000000
     * CI: 9999999 LP
     * Especialidad: Testing
     * Cargo: Profesor Titular
   - Guardar

3. Crear un Grupo:
   - Ir a "Grupos" → "Crear Grupo"
   - Completar formulario:
     * Nombre: GRUPO-TEST-01
     * Materia: Seleccionar cualquier materia
     * Docente: Seleccionar "Profesor De Prueba"
     * Gestión Académica: Seleccionar la gestión activa
     * Cupos: 30
     * Estado: Abierto
   - Guardar

4. Asignar Horario para HOY:
   - Ir a "Asignar Horarios"
   - Buscar el grupo "GRUPO-TEST-01"
   - Hacer clic en "Asignar Horarios"
   - Agregar un horario:
     * Día: Seleccionar el día de HOY (ej: Domingo si hoy es domingo)
     * Hora Inicio: 08:00
     * Hora Fin: 10:00
     * Aula: Seleccionar cualquier aula
   - Guardar
```

#### OPCIÓN B: Usar Tinker (Rápido)

```powershell
cd backend
php artisan tinker
```

```php
// Crear usuario docente
$user = App\Models\User::where('email', 'coordinador@example.com')->first();

// Crear docente
$docente = App\Models\Docente::create([
    'usuario_id' => $user->id,
    'nombre' => 'Profesor',
    'apellidos' => 'De Prueba',
    'telefono' => '+591 70000000',
    'ci' => '9999999 LP',
    'especialidad' => 'Testing',
    'cargo' => 'Profesor Titular'
]);

// Crear grupo
$materia = App\Models\Materia::first();
$gestion = App\Models\GestionAcademica::first();

$grupo = App\Models\Grupo::create([
    'nombre' => 'GRUPO-TEST-01',
    'materia_id' => $materia->id,
    'docente_id' => $docente->id,
    'gestion_academica_id' => $gestion->id,
    'cupos_ofrecidos' => 30,
    'inscritos' => 0,
    'estado' => 'Abierto'
]);

// Crear horario para HOY
$diaSemana = now()->dayOfWeek; // 0=Domingo, 1=Lunes, etc.
$aula = App\Models\Aula::first();

App\Models\Horario::create([
    'grupo_id' => $grupo->id,
    'aula_id' => $aula->id,
    'dia_semana' => $diaSemana,
    'hora_inicio' => '08:00:00',
    'hora_fin' => '10:00:00'
]);

echo "✅ Datos de prueba creados para hoy: " . now()->format('l d/m/Y');
```

---

### 📝 Pasos de Prueba

#### PASO 1: Acceder al Dashboard de Asistencia

```
1. Cerrar sesión del Administrador
2. Iniciar sesión como Coordinador (es docente):
   📧 Email: coordinador@example.com
   🔑 Contraseña: password
3. En el menú lateral, buscar "Control de Asistencia" o "Asistencia"
4. Hacer clic en "Dashboard de Asistencia"
```

**✅ Resultado Esperado:**
- Se muestra una página con título "Control de Asistencia Docente"
- Hay un selector de fecha (por defecto: fecha de hoy)
- Se lista al menos 1 horario para el día de hoy

---

#### PASO 2: Ver Horarios del Día

```
1. Verificar que la fecha seleccionada sea HOY
2. En la lista de horarios, deberías ver:
   - Materia del grupo
   - Horario: 08:00 - 10:00
   - Aula asignada
   - Estado: "Pendiente" (naranja)
```

**✅ Resultado Esperado:**
- Card del horario con fondo blanco
- Botón "Registrar Asistencia" visible y habilitado
- Información completa del horario

---

#### PASO 3: Registrar Asistencia - Presente

```
1. Hacer clic en el botón verde "Registrar Asistencia"
2. Se abre un modal/formulario
3. Seleccionar estado: "Presente"
4. Dejar observaciones vacías (opcional)
5. Hacer clic en "Guardar Asistencia"
```

**✅ Resultado Esperado:**
- Mensaje de éxito: "Asistencia registrada correctamente"
- El card del horario cambia:
  * Estado: "Presente" (verde)
  * Botón cambia a "Editar Asistencia"
  * Aparece badge verde con "✓ Presente"

---

#### PASO 4: Editar Asistencia - Tardanza

```
1. Hacer clic en el botón amarillo "Editar Asistencia"
2. Se abre el modal con datos actuales
3. Cambiar estado a: "Tardanza"
4. Agregar observación: "Llegué 15 minutos tarde por tráfico"
5. Guardar cambios
```

**✅ Resultado Esperado:**
- Mensaje: "Asistencia actualizada correctamente"
- Estado cambia a "Tardanza" (amarillo/naranja)
- Observación se guarda correctamente

---

#### PASO 5: Ver Estadísticas

```
1. En la parte superior del dashboard, buscar sección de estadísticas
2. Verificar:
   - Total de clases del día: 1
   - Asistencias registradas: 1
   - Porcentaje de asistencia: 100%
```

**✅ Resultado Esperado:**
- Cards con estadísticas actualizadas
- Gráficos (si los hay) reflejan los datos

---

#### PASO 6: Probar Otros Estados

**Crear más horarios (si es necesario) y probar:**

```
Estado: Ausente
- Seleccionar "Ausente"
- Observación: "Enfermedad justificada"
- Verificar badge rojo

Estado: Justificado
- Seleccionar "Justificado"
- Observación: "Reunión académica aprobada"
- Verificar badge azul
```

---

### ✅ Checklist Final - Control de Asistencia

- [ ] Dashboard muestra horarios del día actual
- [ ] Puede registrar asistencia "Presente"
- [ ] Puede editar asistencia a "Tardanza"
- [ ] Puede registrar asistencia "Ausente"
- [ ] Puede registrar asistencia "Justificado"
- [ ] Observaciones se guardan correctamente
- [ ] Estados se reflejan visualmente (colores)
- [ ] Estadísticas se actualizan en tiempo real
- [ ] No puede registrar asistencia de otros docentes

---

## 🧪 TEST CASE 3: REPORTES Y EXPORTACIÓN

### 🎯 Objetivo
Generar y exportar reportes de docentes y parrillas de horarios en formato PDF y Excel.

### 📝 PARTE A: Exportación de Docentes (Excel/PDF)

#### PASO 1: Exportar Lista de Docentes a Excel

```
1. Iniciar sesión como Administrador (admin@example.com / password)
2. Ir a "Docentes" en el menú lateral
3. En la lista de docentes, buscar los botones de exportación (arriba a la derecha)
4. Hacer clic en el botón verde "Exportar Excel" o ícono de Excel
5. Esperar la descarga
```

**✅ Resultado Esperado:**
- Se descarga un archivo: `docentes_YYYY-MM-DD_HHMMSS.xlsx`
- Al abrir el archivo en Excel:
  * Encabezados: Nombre, Apellidos, Email, Teléfono, CI, Especialidad, Cargo
  * Todos los docentes de la base de datos
  * Formato limpio y legible

---

#### PASO 2: Exportar Lista de Docentes a PDF

```
1. En la misma página de "Docentes"
2. Hacer clic en el botón rojo "Exportar PDF" o ícono de PDF
3. Esperar la descarga
```

**✅ Resultado Esperado:**
- Se descarga un archivo: `docentes_YYYY-MM-DD.pdf`
- Al abrir el PDF:
  * Título: "Listado de Docentes"
  * Fecha de generación
  * Tabla con todos los docentes
  * Logo o encabezado institucional (si está configurado)

---

### 📝 PARTE B: Parrilla Global de Horarios

#### PASO 1: Acceder a la Parrilla Global

```
1. Mantenerse como Administrador
2. En el menú lateral, buscar "Reportes" o "Horarios"
3. Hacer clic en "Parrilla de Horarios" o "Horarios Global"
4. Si no está visible, ir directamente a: http://localhost:5173/horarios/parrilla-global
```

**✅ Resultado Esperado:**
- Se muestra una página con título "Parrilla Global de Horarios"
- Hay filtros en la parte superior:
  * Gestión Académica (dropdown)
  * Facultad (dropdown, opcional)
  * Carrera (dropdown, opcional)

---

#### PASO 2: Aplicar Filtros

```
1. Seleccionar Gestión Académica: "Gestión 2024-1" (o la gestión activa)
2. (Opcional) Seleccionar Facultad: "Tecnología"
3. (Opcional) Seleccionar Carrera: "Ingeniería de Sistemas"
4. Hacer clic en "Aplicar Filtros" o "Buscar"
```

**✅ Resultado Esperado:**
- Se muestra una tabla tipo parrilla/grid
- Columnas: Días de la semana (Lunes, Martes, Miércoles, etc.)
- Filas: Bloques horarios (07:00-08:00, 08:00-09:00, etc.)
- Celdas: Información de clases programadas

---

#### PASO 3: Verificar Datos en la Parrilla

```
1. Buscar el horario de prueba creado anteriormente (08:00-10:00)
2. Verificar que la celda muestre:
   - Nombre del grupo
   - Materia (sigla o nombre)
   - Docente
   - Aula
3. Verificar que no haya conflictos (celdas con múltiples horarios superpuestos)
```

**✅ Resultado Esperado:**
- Los horarios se visualizan en las celdas correctas
- Información completa y legible
- Colores diferenciados por carrera o facultad (si aplica)

---

#### PASO 4: Exportar Parrilla a PDF

```
1. En la misma página de Parrilla Global
2. Buscar botón "Exportar PDF" o "Descargar PDF"
3. Hacer clic y esperar la descarga
```

**✅ Resultado Esperado:**
- Se descarga: `parrilla_horarios_YYYY-MM-DD.pdf`
- Al abrir el PDF:
  * Título: "Parrilla de Horarios"
  * Filtros aplicados (Gestión, Facultad, Carrera)
  * Tabla completa en formato horizontal/landscape
  * Todos los horarios visibles

---

#### PASO 5: Exportar Parrilla a Excel (si está disponible)

```
1. Si hay botón "Exportar Excel", hacer clic
2. Abrir el archivo descargado
```

**✅ Resultado Esperado:**
- Excel con formato de parrilla
- Una hoja por cada carrera o una hoja consolidada
- Datos completos y formateados

---

### 📝 PARTE C: Reporte de Horarios por Grupo

#### PASO 1: Ver Horarios de un Grupo Específico

```
1. Ir a "Grupos" en el menú
2. Seleccionar un grupo de la lista (ej: el grupo de prueba creado)
3. Hacer clic en "Ver" (ícono de ojo)
4. En la página de detalle, buscar sección "Horarios Asignados"
```

**✅ Resultado Esperado:**
- Lista de todos los horarios del grupo
- Información: Día, Hora Inicio, Hora Fin, Aula
- Si no hay horarios, mensaje: "No hay horarios asignados"

---

#### PASO 2: Exportar Horarios del Grupo a PDF

```
1. En la misma página de detalle del grupo
2. Buscar botón "Exportar PDF" o "Descargar Horarios PDF"
3. Hacer clic y descargar
```

**✅ Resultado Esperado:**
- PDF con:
  * Título: "Horarios del Grupo [NOMBRE]"
  * Información del grupo (Materia, Docente, Gestión)
  * Tabla con todos los horarios
  * Información del aula para cada horario

---

### ✅ Checklist Final - Reportes y Exportación

**Excel - Docentes:**
- [ ] Archivo .xlsx se descarga correctamente
- [ ] Contiene todos los docentes con campo "Cargo"
- [ ] Formato legible en Excel/LibreOffice

**PDF - Docentes:**
- [ ] Archivo .pdf se descarga correctamente
- [ ] Tabla bien formateada
- [ ] Todos los datos visibles

**Parrilla Global:**
- [ ] Filtros funcionan (Gestión, Facultad, Carrera)
- [ ] Grid muestra horarios correctamente
- [ ] Días y horas alineados
- [ ] Información completa en cada celda

**PDF - Parrilla:**
- [ ] PDF en formato horizontal/landscape
- [ ] Tabla completa visible
- [ ] Sin texto cortado

**Horarios por Grupo:**
- [ ] Lista de horarios visible en detalle del grupo
- [ ] PDF del grupo descarga correctamente
- [ ] Información completa del grupo y horarios

---

## 🎉 RESUMEN DE VALIDACIÓN

Si todos los checklists están marcados ✅, las **3 funcionalidades están completamente operativas**:

1. ✅ **Carga Masiva:** Importación CSV/Excel de docentes con validaciones
2. ✅ **Control de Asistencia:** Registro y edición de asistencia docente
3. ✅ **Reportes:** Exportación Excel/PDF y parrilla global de horarios

---

## 🐛 Troubleshooting Común

### Problema: "No hay horarios para hoy"
**Solución:** Verificar que creaste un horario con `dia_semana` correcto (0-6)

### Problema: "Error al importar CSV"
**Solución:** Verificar que el archivo tenga codificación UTF-8 y formato correcto

### Problema: "PDF no se descarga"
**Solución:** Verificar que `barryvdh/laravel-dompdf` esté instalado: `composer require barryvdh/laravel-dompdf`

### Problema: "Excel muestra caracteres raros"
**Solución:** Abrir el archivo con Excel usando "Importar datos" y seleccionar UTF-8

---

**📅 Fecha:** Noviembre 3, 2025  
**👨‍💻 Sistema:** Gestión de Horarios Universitarios  
**✅ Estado:** Listo para Pruebas y Presentación
