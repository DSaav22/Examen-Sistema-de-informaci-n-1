# Formato del Archivo CSV - Carga Horaria

## Columnas Requeridas (13 en total)

El archivo CSV o Excel debe contener **exactamente** las siguientes columnas con estos nombres (respetando mayúsculas/minúsculas):

1. **facultad** - Nombre de la facultad (ej: "Facultad de Tecnología")
2. **carrera** - Nombre de la carrera (ej: "Ingeniería de Sistemas")
3. **sigla_materia** - Código único de la materia (ej: "SIS101")
4. **nombre_materia** - Nombre completo de la materia (ej: "Programación I")
5. **nivel** - Nivel o semestre sugerido (número entero, ej: 1, 2, 3...)
6. **creditos** - Créditos de la materia (número entero, ej: 4)
7. **horas_programadas** - Horas semanales (número entero, ej: 4)
8. **codigo_docente** - Código único del docente (ej: "DOC001")
9. **nombre_docente** - Nombre completo del docente (ej: "Juan Pérez")
10. **cargo** - Cargo del docente (ej: "Docente Titular", "Docente Auxiliar")
11. **nombre_grupo** - Nombre del grupo (ej: "A", "B", "Grupo 1")
12. **cupos_ofrecidos** - Cupos disponibles (número entero, ej: 40)
13. **inscritos** - Estudiantes inscritos (número entero, ej: 35)
14. **estado** - Estado del grupo (ej: "Abierto", "Cerrado", "En Proceso")

## Ejemplo de Archivo CSV

```csv
facultad,carrera,sigla_materia,nombre_materia,nivel,creditos,horas_programadas,codigo_docente,nombre_docente,cargo,nombre_grupo,cupos_ofrecidos,inscritos,estado
Facultad de Tecnología,Ingeniería de Sistemas,SIS101,Programación I,1,4,4,DOC001,Juan Pérez,Docente Titular,A,40,35,Abierto
Facultad de Tecnología,Ingeniería de Sistemas,SIS102,Matemáticas I,1,4,4,DOC002,María López,Docente Auxiliar,B,40,38,Abierto
Facultad de Tecnología,Ingeniería de Sistemas,SIS201,Bases de Datos,2,5,6,DOC003,Carlos Gómez,Docente Titular,A,35,30,Abierto
Facultad de Tecnología,Ingeniería Industrial,IND101,Introducción a la Ingeniería,1,3,3,DOC004,Ana Martínez,Docente Asociado,A,45,42,Abierto
```

## Consideraciones Importantes

### Datos Automáticos
El sistema creará automáticamente:
- **Facultades**: Si no existen, se crean con un código generado (primeras 3 letras)
- **Carreras**: Si no existen, se crean asociadas a su facultad
- **Docentes**: Si no existen, se crea usuario + docente con password por defecto: `password123`
- **Materias**: Si no existen por sigla, se crean con los datos proporcionados
- **Grupos**: Siempre se crean nuevos o actualizan existentes
- **Relación M:N**: Se vincula cada materia con su carrera automáticamente

### Actualización de Registros Existentes
- **Docentes**: Si existe por `codigo_docente`, solo se actualiza el **cargo**
- **Materias**: Si existe por `sigla`, NO se actualiza (se usa la existente)
- **Grupos**: Si existe un grupo con mismo docente, materia, gestión y nombre, se **actualizan** cupos_ofrecidos, inscritos y estado

### Validaciones
- Los campos **sigla_materia** y **codigo_docente** son **OBLIGATORIOS**
- Los números deben ser enteros válidos (nivel, creditos, horas, cupos, inscritos)
- El email del docente se genera automáticamente: `nombre.apellido@docente.com`

### Gestión Académica
- Se usa la **gestión activa actual** en la base de datos
- Si no hay gestión activa, se crea una por defecto para el año actual

## Recomendaciones

1. **Use la plantilla**: Descargue la plantilla desde el sistema y complete los datos
2. **Codificación**: Guarde el archivo con codificación UTF-8 para caracteres especiales
3. **Sin espacios extras**: Evite espacios al inicio/final de cada celda
4. **Nombres únicos**: Use códigos únicos para materias (sigla_materia) y docentes (codigo_docente)
5. **Prueba inicial**: Importe primero un archivo pequeño (5-10 filas) para verificar formato

## Ejemplo Real (Formato Excel/CSV)

| facultad | carrera | sigla_materia | nombre_materia | nivel | creditos | horas_programadas | codigo_docente | nombre_docente | cargo | nombre_grupo | cupos_ofrecidos | inscritos | estado |
|----------|---------|---------------|----------------|-------|----------|-------------------|----------------|----------------|-------|--------------|-----------------|-----------|--------|
| Facultad de Tecnología | Ingeniería de Sistemas | SIS101 | Programación I | 1 | 4 | 4 | DOC001 | Juan Pérez | Docente Titular | A | 40 | 35 | Abierto |
| Facultad de Tecnología | Ingeniería de Sistemas | SIS102 | Matemáticas I | 1 | 4 | 4 | DOC002 | María López | Docente Auxiliar | B | 40 | 38 | Abierto |

---

**Nota**: Este formato está diseñado para procesar el archivo "CARGA HORARIA HISTORICA.pdf" después de convertirlo a CSV/Excel.
