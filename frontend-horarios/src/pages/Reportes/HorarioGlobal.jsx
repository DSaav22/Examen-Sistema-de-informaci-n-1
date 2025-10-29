import { useState, useEffect } from 'react';
import Layout from '../../layouts/Layout';
import reporteService from '../../services/reporteService';

const HorarioGlobal = () => {
  const [loading, setLoading] = useState(false);
  const [loadingFiltros, setLoadingFiltros] = useState(true);
  const [gestiones, setGestiones] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [errors, setErrors] = useState({});
  
  const [filtros, setFiltros] = useState({
    gestion_id: '',
    aula_id: '',
    docente_id: '',
  });

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const horas = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

  useEffect(() => {
    loadFiltros();
  }, []);

  const loadFiltros = async () => {
    try {
      setLoadingFiltros(true);
      const data = await reporteService.getFiltros();
      setGestiones(data.gestiones || []);
      setAulas(data.aulas || []);
      setDocentes(data.docentes || []);
      
      // Seleccionar automáticamente la gestión activa
      const gestionActiva = data.gestiones?.find(g => g.activo);
      if (gestionActiva) {
        setFiltros(prev => ({ ...prev, gestion_id: gestionActiva.id }));
      }
    } catch (error) {
      console.error('Error al cargar filtros:', error);
      setErrors({ form: 'Error al cargar los filtros' });
    } finally {
      setLoadingFiltros(false);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBuscar = async () => {
    if (!filtros.gestion_id) {
      setErrors({ submit: 'Debe seleccionar una gestión académica' });
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      const data = await reporteService.getHorariosGlobal(filtros);
      setHorarios(data.horarios || []);
    } catch (error) {
      console.error('Error al cargar horarios:', error);
      setErrors({ submit: error.response?.data?.message || 'Error al cargar los horarios' });
    } finally {
      setLoading(false);
    }
  };

  const getHorarioEnCelda = (dia, hora) => {
    return horarios.filter(h => {
      const horaInicio = h.hora_inicio.substring(0, 5);
      return h.dia_semana === dia && horaInicio === hora;
    });
  };

  const getColorPorMateria = (sigla) => {
    const colors = [
      'bg-blue-100 border-blue-400 text-blue-800',
      'bg-green-100 border-green-400 text-green-800',
      'bg-purple-100 border-purple-400 text-purple-800',
      'bg-yellow-100 border-yellow-400 text-yellow-800',
      'bg-pink-100 border-pink-400 text-pink-800',
      'bg-indigo-100 border-indigo-400 text-indigo-800',
      'bg-red-100 border-red-400 text-red-800',
      'bg-teal-100 border-teal-400 text-teal-800',
    ];
    let hash = 0;
    for (let i = 0; i < sigla.length; i++) {
      hash = sigla.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (loadingFiltros) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Parrilla de Horarios</h1>
          <p className="mt-2 text-sm text-gray-700">
            Vista global de todos los horarios asignados
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>
          
          {errors.submit && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Gestión Académica */}
            <div>
              <label htmlFor="gestion_id" className="block text-sm font-semibold text-gray-700 mb-2">
                Gestión Académica <span className="text-red-500">*</span>
              </label>
              <select
                id="gestion_id"
                name="gestion_id"
                value={filtros.gestion_id}
                onChange={handleFiltroChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccione una gestión</option>
                {gestiones.map((gestion) => (
                  <option key={gestion.id} value={gestion.id}>
                    {gestion.anio}/{gestion.periodo} {gestion.activo && '(Activa)'}
                  </option>
                ))}
              </select>
            </div>

            {/* Aula (Opcional) */}
            <div>
              <label htmlFor="aula_id" className="block text-sm font-semibold text-gray-700 mb-2">
                Filtrar por Aula
              </label>
              <select
                id="aula_id"
                name="aula_id"
                value={filtros.aula_id}
                onChange={handleFiltroChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas las aulas</option>
                {aulas.map((aula) => (
                  <option key={aula.id} value={aula.id}>
                    {aula.nombre} - {aula.edificio}
                  </option>
                ))}
              </select>
            </div>

            {/* Docente (Opcional) */}
            <div>
              <label htmlFor="docente_id" className="block text-sm font-semibold text-gray-700 mb-2">
                Filtrar por Docente
              </label>
              <select
                id="docente_id"
                name="docente_id"
                value={filtros.docente_id}
                onChange={handleFiltroChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los docentes</option>
                {docentes.map((docente) => (
                  <option key={docente.id} value={docente.id}>
                    {docente.usuario?.name || docente.codigo_docente}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón Buscar */}
            <div className="flex items-end">
              <button
                onClick={handleBuscar}
                disabled={loading || !filtros.gestion_id}
                className="w-full px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cargando...
                  </span>
                ) : (
                  'Buscar'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Parrilla de Horarios */}
        {horarios.length > 0 && (
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Hora
                  </th>
                  {dias.map((dia) => (
                    <th
                      key={dia}
                      className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    >
                      {dia}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {horas.map((hora) => (
                  <tr key={hora}>
                    <td className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200 whitespace-nowrap">
                      {hora}
                    </td>
                    {dias.map((dia) => {
                      const horariosEnCelda = getHorarioEnCelda(dia, hora);
                      return (
                        <td
                          key={`${dia}-${hora}`}
                          className="px-2 py-2 text-sm border-r border-gray-200 align-top"
                          style={{ minWidth: '150px' }}
                        >
                          <div className="space-y-1">
                            {horariosEnCelda.map((horario, idx) => (
                              <div
                                key={idx}
                                className={`p-2 rounded border-l-4 text-xs ${getColorPorMateria(
                                  horario.grupo?.materia?.sigla || ''
                                )}`}
                              >
                                <div className="font-bold">
                                  {horario.grupo?.materia?.sigla || 'N/A'}
                                </div>
                                <div className="text-xs mt-1">
                                  {horario.aula?.nombre || 'Sin aula'}
                                </div>
                                <div className="text-xs">
                                  {horario.grupo?.docente?.usuario?.name || 'Sin docente'}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {horario.hora_inicio?.substring(0, 5)} - {horario.hora_fin?.substring(0, 5)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {horarios.length === 0 && !loading && filtros.gestion_id && (
          <div className="bg-white shadow-md rounded-lg p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-sm text-gray-500">
              No hay horarios asignados para los filtros seleccionados
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HorarioGlobal;
