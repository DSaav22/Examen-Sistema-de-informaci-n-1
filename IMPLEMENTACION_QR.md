# 📱 Implementación del Sistema de Asistencia por QR

## ✅ Backend Completado

### Ruta Nueva
- `POST /api/asistencia/registrar-qr` ✅

### Validaciones Implementadas
1. ✅ **Pertenencia**: El horario debe pertenecer al docente
2. ✅ **Día Correcto**: La clase debe ser hoy
3. ✅ **Lugar Correcto**: Debe escanear el QR del aula correcta
4. ✅ **Ventana de Tiempo**: ±15 minutos del inicio de clase
5. ✅ **Sin Duplicados**: No puede marcar dos veces

### Servicio de API
- ✅ `asistenciaService.registrarQr(data)` agregado

---

## 🎨 Frontend - Pendiente de Implementación

### PASO 1: Instalar Dependencias

```bash
cd frontend-horarios
npm install react-qr-reader
```

### PASO 2: Componente de Admin - Ver QR de Aulas

**Archivo**: `frontend-horarios/src/pages/Aulas/Index.jsx`

**Agregar**:
1. Estado para el modal:
```javascript
const [qrModalVisible, setQrModalVisible] = useState(false);
const [selectedAula, setSelectedAula] = useState(null);
```

2. Botón "Ver QR" en cada fila de la tabla:
```jsx
<button
  onClick={() => {
    setSelectedAula(aula);
    setQrModalVisible(true);
  }}
  className="text-blue-600 hover:text-blue-800"
>
  📱 Ver QR
</button>
```

3. Modal con el QR:
```jsx
{qrModalVisible && selectedAula && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Código QR - {selectedAula.nombre}</h2>
      <div className="flex justify-center mb-4">
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(JSON.stringify({ aula_id: selectedAula.id }))}`}
          alt="QR Code"
          className="border-4 border-gray-300 rounded"
        />
      </div>
      <p className="text-center text-gray-600 mb-4">
        Los docentes deben escanear este código para marcar asistencia en esta aula.
      </p>
      <button
        onClick={() => setQrModalVisible(false)}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Cerrar
      </button>
    </div>
  </div>
)}
```

### PASO 3: Componente de Docente - Escanear QR

**Archivo**: `frontend-horarios/src/pages/Docente/Dashboard.jsx` (o similar)

**Importar**:
```javascript
import { QrReader } from 'react-qr-reader';
import asistenciaService from '../../services/asistenciaService';
```

**Agregar Estados**:
```javascript
const [isScanning, setIsScanning] = useState(false);
const [selectedHorario, setSelectedHorario] = useState(null);
```

**Modificar el botón "Marcar Asistencia"**:
```javascript
const handleScanClick = (horario) => {
  setSelectedHorario(horario);
  setIsScanning(true);
};
```

**Agregar función para procesar el escaneo**:
```javascript
const handleScan = async (result) => {
  setIsScanning(false);
  
  let qrData;
  try {
    qrData = JSON.parse(result.text);
    if (!qrData.aula_id) {
      throw new Error('QR no válido.');
    }
  } catch (error) {
    alert('Error: Este no es un código QR de aula válido.');
    return;
  }

  try {
    const response = await asistenciaService.registrarQr({
      horario_id: selectedHorario.id,
      aula_id_qr: qrData.aula_id
    });
    
    alert(`✅ ${response.message}`);
    // Recargar las clases
    loadClasesDeHoy();
  } catch (error) {
    const errorMsg = error.response?.data?.error || 'Error al registrar asistencia';
    alert(`❌ ${errorMsg}`);
  }
};
```

**Renderizar el escáner en el JSX**:
```jsx
{isScanning ? (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-bold mb-4">Escanea el QR del Aula</h2>
    <QrReader
      onResult={(result, error) => {
        if (!!result) {
          handleScan(result);
        }
        if (!!error) {
          console.info(error);
        }
      }}
      style={{ width: '100%' }}
      constraints={{ facingMode: 'environment' }}
    />
    <button
      onClick={() => setIsScanning(false)}
      className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Cancelar
    </button>
  </div>
) : (
  // Tu lista de "Clases de Hoy" aquí
  <div>
    {clases.map(clase => (
      <div key={clase.id}>
        {/* ... información de la clase ... */}
        <button
          onClick={() => handleScanClick(clase)}
          disabled={clase.asistencia_registrada}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {clase.asistencia_registrada ? '✅ Asistencia Marcada' : '📱 Marcar con QR'}
        </button>
      </div>
    ))}
  </div>
)}
```

---

## 🧪 Pruebas

### Como Administrador:
1. Ve a la página de Aulas
2. Haz clic en "Ver QR" de cualquier aula
3. Imprime o muestra el QR en pantalla

### Como Docente:
1. Inicia sesión como docente
2. Ve al Dashboard
3. Haz clic en "Marcar con QR" en una clase de hoy
4. Apunta la cámara al QR del aula correcta
5. Verifica que:
   - ✅ Si es el aula correcta y estás en el horario → Se marca
   - ❌ Si es otra aula → Mensaje: "Aula incorrecta"
   - ❌ Si no es el día → Mensaje: "Esta clase no es hoy"
   - ❌ Si estás fuera de horario → Mensaje: "Estás fuera del horario permitido"

---

## 📋 Resumen de Cambios

### Backend ✅
- `routes/api.php` - Nueva ruta
- `AsistenciaController.php` - Nuevo método `registrarAsistenciaQr`
- `asistenciaService.js` - Nueva función `registrarQr`

### Frontend ⏳ (Por implementar)
- `Aulas/Index.jsx` - Botón y modal para ver QR
- `Docente/Dashboard.jsx` - Escáner QR y lógica de validación
- Instalar `react-qr-reader`

---

## 🎯 Ventajas del Sistema

1. **Seguridad**: El docente debe estar físicamente en el aula correcta
2. **Precisión**: Ventana de tiempo de ±15 minutos evita marcas anticipadas
3. **Auditoría**: Se registra el método (QR vs manual) en la BD
4. **UX Mejorada**: Mensajes de error específicos guían al docente
5. **Sin Duplicados**: No puede marcar dos veces el mismo día

