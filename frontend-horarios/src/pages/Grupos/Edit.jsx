import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '../../layouts/Layout';
import grupoService from '../../services/grupoService';

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(true);
  const [materias, setMaterias] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [gestiones, setGestiones] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    materia_id: '',
    docente_id: '',
    gestion_academica_id: '',
    nombre_grupo: '',
    cupos_ofrecidos: 30,
    inscritos: 0,
    estado: 'Abierto',
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoadingForm(true);
      const [grupoResponse, formDataResponse] = await Promise.all([
        grupoService.getGrupoById(id),
        grupoService.getFormData()
      ]);

      // Extraer el grupo de la respuesta (backend devuelve { data: {...} })
      const grupoData = grupoResponse.data || grupoResponse;

      setFormData({
        materia_id: grupoData.materia_id ? grupoData.materia_id.toString() : '',
        docente_id: grupoData.docente_id ? grupoData.docente_id.toString() : '',
        gestion_academica_id: grupoData.gestion_academica_id ? grupoData.gestion_academica_id.toString() : '',
        nombre_grupo: grupoData.nombre_grupo || '',
        cupos_ofrecidos: grupoData.cupos_ofrecidos || 30,
        inscritos: grupoData.inscritos || 0,
        estado: grupoData.estado || 'Abierto',
      });

      setMaterias(formDataResponse.materias || []);
      setDocentes(formDataResponse.docentes || []);
      setGestiones(formDataResponse.gestiones || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setErrors({ form: 'Error al cargar los datos del grupo.' });
    } finally {
      setLoadingForm(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await grupoService.updateGrupo(id, formData);
      navigate('/grupos');
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors({ form: error.response.data.message });
      } else {
        setErrors({ form: 'Error al actualizar el grupo. Por favor, intenta nuevamente.' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingForm) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando datos del grupo...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar Grupo
            </h1>
            <p className="text-blue-100 text-sm mt-1">Modifique los datos del grupo académico</p>
          </div>

          {/* Mensaje de error general */}
          {errors.form && (
            <div className="mx-6 mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">{errors.form}</p>
                </div>
              </div>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Sección: Información Académica */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Información Académica
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Materia */}
                <div>
                  <label htmlFor="materia_id" className="block text-sm font-semibold text-gray-700 mb-2">
                    Materia <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="materia_id"
                    name="materia_id"
                    value={formData.materia_id}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.materia_id
                        ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } shadow-sm focus:ring-2 focus:outline-none transition-colors duration-150`}
                    required
                  >
                    <option value="">Seleccione una materia</option>
                    {materias.map(materia => (
                      <option key={materia.id} value={materia.id}>
                        {materia.sigla} - {materia.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.materia_id && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.materia_id[0]}
                    </p>
                  )}
                </div>

                {/* Nombre del Grupo */}
                <div>
                  <label htmlFor="nombre_grupo" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre del Grupo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombre_grupo"
                    name="nombre_grupo"
                    value={formData.nombre_grupo}
                    onChange={handleChange}
                    maxLength={50}
                    placeholder="Ej: A, B, 1A, Grupo-01"
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.nombre_grupo
                        ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } shadow-sm focus:ring-2 focus:outline-none transition-colors duration-150`}
                    required
                  />
                  {errors.nombre_grupo && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.nombre_grupo[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sección: Asignación */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Asignación de Docente y Gestión
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Docente */}
                <div>
                  <label htmlFor="docente_id" className="block text-sm font-semibold text-gray-700 mb-2">
                    Docente <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="docente_id"
                    name="docente_id"
                    value={formData.docente_id}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.docente_id
                        ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } shadow-sm focus:ring-2 focus:outline-none transition-colors duration-150`}
                    required
                  >
                    <option value="">Seleccione un docente</option>
                    {docentes.map(docente => (
                      <option key={docente.id} value={docente.id}>
                        {docente.usuario?.name || 'Sin nombre'} - {docente.especialidad || 'Sin especialidad'}
                      </option>
                    ))}
                  </select>
                  {errors.docente_id && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.docente_id[0]}
                    </p>
                  )}
                </div>

                {/* Gestión */}
                <div>
                  <label htmlFor="gestion_academica_id" className="block text-sm font-semibold text-gray-700 mb-2">
                    Gestión Académica <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gestion_academica_id"
                    name="gestion_academica_id"
                    value={formData.gestion_academica_id}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.gestion_academica_id
                        ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } shadow-sm focus:ring-2 focus:outline-none transition-colors duration-150`}
                    required
                  >
                    <option value="">Seleccione una gestión</option>
                    {gestiones.map(gestion => (
                      <option key={gestion.id} value={gestion.id}>
                        {gestion.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.gestion_academica_id && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.gestion_academica_id[0]}
                    </p>
                  )}
                </div>

                {/* Nuevos Campos: Cupos, Inscritos, Estado */}
                {/* Cupos Ofrecidos */}
                <div>
                  <label htmlFor="cupos_ofrecidos" className="block text-sm font-semibold text-gray-700 mb-2">
                    Cupos Ofrecidos
                  </label>
                  <input
                    type="number"
                    id="cupos_ofrecidos"
                    name="cupos_ofrecidos"
                    value={formData.cupos_ofrecidos}
                    onChange={handleChange}
                    min="1"
                    max="200"
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.cupos_ofrecidos
                        ? 'border-red-300 bg-red-50 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    } shadow-sm focus:ring-2 focus:outline-none`}
                    placeholder="Ej: 30"
                  />
                  {errors.cupos_ofrecidos && (
                    <p className="mt-2 text-sm text-red-600">{errors.cupos_ofrecidos[0]}</p>
                  )}
                </div>

                {/* Inscritos */}
                <div>
                  <label htmlFor="inscritos" className="block text-sm font-semibold text-gray-700 mb-2">
                    Inscritos
                  </label>
                  <input
                    type="number"
                    id="inscritos"
                    name="inscritos"
                    value={formData.inscritos}
                    onChange={handleChange}
                    min="0"
                    max="200"
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.inscritos
                        ? 'border-red-300 bg-red-50 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    } shadow-sm focus:ring-2 focus:outline-none`}
                    placeholder="Ej: 0"
                  />
                  {errors.inscritos && (
                    <p className="mt-2 text-sm text-red-600">{errors.inscritos[0]}</p>
                  )}
                </div>

                {/* Estado */}
                <div>
                  <label htmlFor="estado" className="block text-sm font-semibold text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.estado
                        ? 'border-red-300 bg-red-50 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    } shadow-sm focus:ring-2 focus:outline-none`}
                  >
                    <option value="Abierto">Abierto</option>
                    <option value="Cerrado">Cerrado</option>
                    <option value="En Curso">En Curso</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                  {errors.estado && (
                    <p className="mt-2 text-sm text-red-600">{errors.estado[0]}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                to="/grupos"
                className="px-6 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-150 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center shadow-sm"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Actualizando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Actualizar Grupo
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Edit;
