import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import asistenciaService from '../services/asistenciaService';
import { Scanner } from '@yudiel/react-qr-scanner';

/**
 * Verifica si la hora actual está dentro de la ventana de +/- 15 min de la hora de inicio de la clase.
 */
const isWithinWindow = (horaInicioStr) => {
  if (!horaInicioStr || !horaInicioStr.includes(':')) return false; // Safety check

  try {
    const [hours, minutes] = horaInicioStr.split(':').map(Number);
    const now = new Date(); // Hora local actual

    // Crea un objeto Date para la hora de inicio de la clase HOY
    const startTime = new Date();
    startTime.setHours(hours, minutes, 0, 0); 

    // Calcula la ventana de 15 minutos
    const windowStart = new Date(startTime.getTime() - 15 * 60000); // 15 mins antes
    const windowEnd = new Date(startTime.getTime() + 15 * 60000);   // 15 mins después

    // Comprueba si la hora actual está dentro de la ventana
    return now >= windowStart && now <= windowEnd;
  } catch (error) {
    console.error("Error en isWithinWindow:", error);
    return false;
  }
};

const Dashboard = () => {
  const { user, isAdmin, isCoordinador, isDocente } = useAuth();
  const [clasesHoy, setClasesHoy] = useState([]);
  const [loadingClases, setLoadingClases] = useState(false);
  const [registrandoAsistencia, setRegistrandoAsistencia] = useState({});
  const [errorClases, setErrorClases] = useState(null);
  const [diaActual, setDiaActual] = useState('');
  
  // Estados para el escáner QR
  const [isScanning, setIsScanning] = useState(false);
  const [selectedHorario, setSelectedHorario] = useState(null);

  useEffect(() => {
    if (isDocente()) {
      loadClasesDeHoy();
    }
  }, []);

  const loadClasesDeHoy = async () => {
    try {
      setLoadingClases(true);
      setErrorClases(null);
      const data = await asistenciaService.getClasesDeHoy();
      setClasesHoy(data.clases || []);
      setDiaActual(data.dia || '');
    } catch (error) {
      console.error('Error al cargar clases de hoy:', error);
      setErrorClases('Error al cargar las clases de hoy');
    } finally {
      setLoadingClases(false);
    }
  };

  const handleRegistrarAsistencia = async (horarioId) => {
    try {
      setRegistrandoAsistencia(prev => ({ ...prev, [horarioId]: true }));
      await asistenciaService.registrarAsistencia(horarioId);
      // Recargar las clases para actualizar el estado
      await loadClasesDeHoy();
      alert('✅ Asistencia registrada exitosamente');
    } catch (error) {
      console.error('Error al registrar asistencia:', error);
      const message = error.response?.data?.message || 'Error al registrar la asistencia';
      
      // Verificar si es error de ventana de tiempo
      if (error.response?.data?.fuera_de_ventana) {
        const data = error.response.data;
        alert(
          `⚠️ ${message}\n\n` +
          `Hora de inicio: ${data.hora_inicio}\n` +
          `Hora límite: ${data.hora_limite}\n` +
          `Hora actual: ${data.hora_actual}`
        );
      } else {
        alert(`❌ ${message}`);
      }
    } finally {
      setRegistrandoAsistencia(prev => ({ ...prev, [horarioId]: false }));
    }
  };

  // Funciones para el escáner QR
  const handleScanClick = (horario) => {
    setSelectedHorario(horario);
    setIsScanning(true);
  };

  const handleCancelScan = () => {
    setIsScanning(false);
    setSelectedHorario(null);
  };

  const handleScan = async (result) => {
    if (!result || !selectedHorario) return;

    setIsScanning(false); // Cierra el escáner
    let qrData;

    // 1. Validar el QR
    try {
      qrData = JSON.parse(result.text);
      if (!qrData.aula_id) {
        throw new Error('QR no válido.');
      }
    } catch (error) {
      alert('❌ Error: Este no es un QR de aula válido.');
      setSelectedHorario(null);
      return;
    }

    // 2. Llamar a la API de Backend (la nueva ruta con validaciones)
    try {
      const response = await asistenciaService.registrarQr({
        horario_id: selectedHorario.id,
        aula_id_qr: qrData.aula_id
      });

      alert(`✅ ${response.message || 'Asistencia registrada exitosamente'}`);
      // Recarga las clases para mostrar la marca de asistencia
      await loadClasesDeHoy();

    } catch (error) {
      console.error('Error al registrar asistencia por QR:', error);
      // Muestra el error específico que viene del backend
      const errorMsg = error.response?.data?.error || 'Error desconocido al registrar.';
      const details = error.response?.data;
      
      let alertMessage = `❌ ${errorMsg}`;
      
      // Agregar detalles adicionales si están disponibles
      if (details?.aula_esperada && details?.aula_escaneada) {
        alertMessage += `\n\nAula esperada: ${details.aula_esperada}\nAula escaneada: ${details.aula_escaneada}`;
      }
      if (details?.ventana_permitida) {
        alertMessage += `\n\nVentana permitida: ${details.ventana_permitida}\nHora actual: ${details.hora_actual}`;
      }
      
      alert(alertMessage);
    } finally {
      setSelectedHorario(null);
    }
  };

  // Verificar si la clase ya pasó
  const yaTermino = (horaFin) => {
    if (!horaFin) return false;
    
    const now = new Date();
    const [hours, minutes] = horaFin.split(':').map(Number);
    
    const fin = new Date();
    fin.setHours(hours, minutes, 0, 0);
    
    return now > fin;
  };

  const getRoleName = () => {
    if (isAdmin()) return 'Administrador';
    if (isCoordinador()) return 'Coordinador';
    if (isDocente()) return 'Docente';
    return 'Usuario';
  };

  const modules = [
    {
      name: 'Materias',
      description: 'Gestionar materias del sistema',
      href: '/materias',
      roles: [1, 2],
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      name: 'Aulas',
      description: 'Gestionar aulas y espacios',
      href: '/aulas',
      roles: [1, 2],
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      name: 'Docentes',
      description: 'Gestionar información de docentes',
      href: '/docentes',
      roles: [1],
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      name: 'Grupos',
      description: 'Gestionar grupos académicos',
      href: '/grupos',
      roles: [1, 2],
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      name: 'Horarios',
      description: 'Gestionar horarios de clases',
      href: '/horarios',
      roles: [1, 2],
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: 'Gestión Académica',
      description: 'Gestionar periodos académicos',
      href: '/gestiones',
      roles: [1, 2],
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const filteredModules = modules.filter((module) =>
    module.roles.includes(user?.rol_id)
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Bienvenida */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Bienvenido al Sistema de Horarios
          </h2>
          <p className="text-gray-600">
            Has iniciado sesión como <strong>{user?.name}</strong> ({getRoleName()}).
          </p>
        </div>

        {/* Vista para Docentes: Mis Clases de Hoy */}
        {isDocente() && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Mis Clases de Hoy</h3>
              <span className="text-sm text-gray-600 font-medium">
                {diaActual} - {new Date().toLocaleDateString('es-BO')}
              </span>
            </div>

            {loadingClases ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : errorClases ? (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-sm text-red-700">{errorClases}</p>
              </div>
            ) : clasesHoy.length === 0 ? (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      No tienes clases programadas para hoy.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {clasesHoy.map((clase) => {
                  const dentroVentana = isWithinWindow(clase.hora_inicio);
                  const termino = yaTermino(clase.hora_fin);
                  const puedeRegistrar = !clase.asistencia_registrada && dentroVentana && !termino;
                  
                  return (
                    <div
                      key={clase.id}
                      className={`border rounded-lg p-4 transition-all duration-200 ${
                        clase.asistencia_registrada
                          ? 'bg-green-50 border-green-200 shadow-sm'
                          : dentroVentana
                          ? 'bg-blue-50 border-blue-300 shadow-md ring-2 ring-blue-200'
                          : termino
                          ? 'bg-gray-50 border-gray-300'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {clase.materia.sigla} - {clase.materia.nombre}
                            </h4>
                            {clase.asistencia_registrada && (
                              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                ✓ Registrada
                              </span>
                            )}
                            {!clase.asistencia_registrada && dentroVentana && (
                              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 animate-pulse">
                                🔔 Disponible ahora
                              </span>
                            )}
                            {termino && !clase.asistencia_registrada && (
                              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                                ⏰ Terminada
                              </span>
                            )}
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span>Grupo: {clase.grupo.nombre}</span>
                            </div>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className={dentroVentana ? 'font-semibold text-blue-700' : ''}>
                                Horario: {clase.hora_inicio} - {clase.hora_fin}
                                {dentroVentana && <span className="ml-2 text-blue-600">(Ventana de registro activa)</span>}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <span>
                                Aula: {clase.aula.nombre}
                                {clase.aula.edificio && ` - ${clase.aula.edificio}`}
                              </span>
                            </div>
                          </div>

                          {clase.asistencia && (
                            <div className="mt-2 text-xs text-green-700 font-medium">
                              ✅ Registrada a las {clase.asistencia.hora_registro}
                            </div>
                          )}
                        </div>

                        <div className="ml-4">
                          {clase.asistencia_registrada ? (
                            <button
                              disabled
                              className="inline-flex items-center px-4 py-2 border border-green-300 rounded-lg text-sm font-medium text-green-700 bg-green-100 cursor-not-allowed"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Asistencia Registrada
                            </button>
                          ) : puedeRegistrar ? (
                            <button
                              onClick={() => handleScanClick(clase)}
                              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl"
                            >
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                              </svg>
                              📸 Escanear QR para Asistir
                            </button>
                          ) : (
                            <button
                              disabled
                              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-500 bg-gray-100 cursor-not-allowed"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {termino ? 'Clase Terminada' : 'Fuera de Ventana'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Módulos (para Admin y Coordinador) */}
        {!isDocente() && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Módulos Disponibles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredModules.map((module) => (
                <Link
                  key={module.name}
                  to={module.href}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center mb-3">
                    <div className="text-blue-600">{module.icon}</div>
                    <h4 className="ml-3 font-semibold text-lg text-gray-900">
                      {module.name}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600">{module.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Nota:</strong> {isDocente() 
              ? 'Puedes registrar tu asistencia escaneando el código QR del aula dentro de los 15 minutos antes y después del inicio de clase. Las clases disponibles ahora se destacarán con un borde azul.'
              : 'Selecciona un módulo del menú lateral o de las tarjetas superiores para comenzar a trabajar.'
            }
          </p>
        </div>
      </div>

      {/* Modal del Escáner QR */}
      {isScanning && selectedHorario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                Escanear QR para Asistencia
              </h2>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {selectedHorario.materia?.sigla || selectedHorario.grupo?.materia?.sigla} - {selectedHorario.materia?.nombre || selectedHorario.grupo?.materia?.nombre}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>🏫 Aula: {selectedHorario.aula?.nombre}</p>
                  <p>⏰ Horario: {selectedHorario.hora_inicio} - {selectedHorario.hora_fin}</p>
                </div>
              </div>

              <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4 mb-4">
                <p className="text-sm text-purple-800 font-medium mb-2">
                  📍 Instrucciones:
                </p>
                <ol className="text-xs text-purple-700 space-y-1 list-decimal list-inside">
                  <li>Coloca tu cámara frente al código QR del aula</li>
                  <li>El sistema validará que estés en el aula correcta</li>
                  <li>Tu asistencia se registrará automáticamente</li>
                </ol>
              </div>

              {/* Escáner QR */}
              <div className="bg-black rounded-lg overflow-hidden mb-4">
                <Scanner
                  onScan={(decodedResults) => {
                    // La nueva librería devuelve un array, tomamos el primer resultado
                    if (decodedResults && decodedResults.length > 0) {
                      // Nuestra función 'handleScan' espera un objeto { text: '...' }
                      // El resultado de la nueva librería está en 'rawValue'
                      const resultParaHandleScan = {
                        text: decodedResults[0].rawValue
                      };
                      // Llamamos a nuestra función existente con el formato que espera
                      handleScan(resultParaHandleScan);
                    }
                  }}
                  onError={(error) => {
                    console.error('Error del Escáner QR:', error?.message);
                  }}
                  options={{
                    // Añadimos un pequeño retraso para optimizar
                    delayBetweenScanAttempts: 500,
                    delayBetweenScanSuccess: 500,
                  }}
                  styles={{
                    container: { width: '100%' }
                  }}
                />
              </div>

              {/* Botón Cancelar */}
              <button
                onClick={handleCancelScan}
                className="w-full bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
