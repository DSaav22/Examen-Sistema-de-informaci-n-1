import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '../../layouts/Layout';
import docenteService from '../../services/docenteService';

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    usuario_id: '',
    codigo_docente: '',
    especialidad: '',
    grado_academico: '',
    tipo_contrato: '',
    fecha_contratacion: '',
  });

  const gradosAcademicos = ['Licenciatura', 'Maestría', 'Doctorado'];
  const tiposContrato = ['Tiempo Completo', 'Medio Tiempo', 'Por Horas'];

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoadingForm(true);
      const [docenteData, formDataResponse] = await Promise.all([
        docenteService.getDocenteById(id),
        docenteService.getFormData()
      ]);

      // Formatear fecha a YYYY-MM-DD si existe
      let fechaFormateada = '';
      if (docenteData.fecha_contratacion) {
        const fecha = new Date(docenteData.fecha_contratacion);
        fechaFormateada = fecha.toISOString().split('T')[0];
      }

      setFormData({
        usuario_id: docenteData.usuario_id ? docenteData.usuario_id.toString() : '',
        codigo_docente: docenteData.codigo_docente || '',
        especialidad: docenteData.especialidad || '',
        grado_academico: docenteData.grado_academico || '',
        tipo_contrato: docenteData.tipo_contrato || '',
        fecha_contratacion: fechaFormateada,
      });

      // Incluir el usuario actual del docente en la lista si no está
      let usuariosDisponibles = formDataResponse.usuarios || [];
      const usuarioActual = docenteData.usuario;
      
      if (usuarioActual && !usuariosDisponibles.find(u => u.id === usuarioActual.id)) {
        usuariosDisponibles = [usuarioActual, ...usuariosDisponibles];
      }

      setUsuarios(usuariosDisponibles);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setErrors({ form: 'Error al cargar los datos del docente.' });
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
      await docenteService.updateDocente(id, formData);
      navigate('/docentes');
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors({ form: error.response.data.message });
      } else {
        setErrors({ form: 'Error al actualizar el docente. Por favor, intenta nuevamente.' });
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
          <p className="text-gray-600 font-medium">Cargando datos del docente...</p>
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
              Editar Docente
            </h1>
            <p className="text-blue-100 text-sm mt-1">Modifique los datos del docente</p>
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
            {/* Usuario */}
            <div>
              <label htmlFor="usuario_id" className="block text-sm font-semibold text-gray-700 mb-2">
                Usuario <span className="text-red-500">*</span>
              </label>
              <select
                id="usuario_id"
                name="usuario_id"
                value={formData.usuario_id}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.usuario_id
                    ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                } shadow-sm focus:ring-2 focus:outline-none transition-colors duration-150`}
                required
              >
                <option value="">Seleccione un usuario</option>
                {usuarios.map(usuario => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.name} - {usuario.email}
                  </option>
                ))}
              </select>
              {errors.usuario_id && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.usuario_id[0]}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">Seleccione el usuario asociado al docente</p>
            </div>

            {/* Sección con grid para Código y Especialidad */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Información Académica
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Código de Docente */}
                <div>
                  <label htmlFor="codigo_docente" className="block text-sm font-semibold text-gray-700 mb-2">
                    Código de Docente <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="codigo_docente"
                    name="codigo_docente"
                    value={formData.codigo_docente}
                    onChange={handleChange}
                    maxLength={20}
                    placeholder="Ej: DOC-2024-001"
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.codigo_docente
                        ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } shadow-sm focus:ring-2 focus:outline-none transition-colors duration-150`}
                    required
                  />
                  {errors.codigo_docente && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.codigo_docente[0]}
                    </p>
                  )}
                </div>

                {/* Especialidad */}
                <div>
                  <label htmlFor="especialidad" className="block text-sm font-semibold text-gray-700 mb-2">
                    Especialidad
                  </label>
                  <input
                    type="text"
                    id="especialidad"
                    name="especialidad"
                    value={formData.especialidad}
                    onChange={handleChange}
                    maxLength={100}
                    placeholder="Ej: Ingeniería de Software"
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.especialidad
                        ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } shadow-sm focus:ring-2 focus:outline-none transition-colors duration-150`}
                  />
                  {errors.especialidad && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.especialidad[0]}
                    </p>
                  )}
                </div>

                {/* Grado Académico */}
                <div>
                  <label htmlFor="grado_academico" className="block text-sm font-semibold text-gray-700 mb-2">
                    Grado Académico <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="grado_academico"
                    name="grado_academico"
                    value={formData.grado_academico}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.grado_academico
                        ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } shadow-sm focus:ring-2 focus:outline-none transition-colors duration-150`}
                    required
                  >
                    <option value="">Seleccione un grado</option>
                    {gradosAcademicos.map((grado) => (
                      <option key={grado} value={grado}>
                        {grado}
                      </option>
                    ))}
                  </select>
                  {errors.grado_academico && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.grado_academico[0]}
                    </p>
                  )}
                </div>

                {/* Tipo de Contrato */}
                <div>
                  <label htmlFor="tipo_contrato" className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de Contrato <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="tipo_contrato"
                    name="tipo_contrato"
                    value={formData.tipo_contrato}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.tipo_contrato
                        ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } shadow-sm focus:ring-2 focus:outline-none transition-colors duration-150`}
                    required
                  >
                    <option value="">Seleccione un tipo</option>
                    {tiposContrato.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                  {errors.tipo_contrato && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.tipo_contrato[0]}
                    </p>
                  )}
                </div>

                {/* Fecha de Contratación */}
                <div>
                  <label htmlFor="fecha_contratacion" className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha de Contratación
                  </label>
                  <input
                    type="date"
                    id="fecha_contratacion"
                    name="fecha_contratacion"
                    value={formData.fecha_contratacion}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.fecha_contratacion
                        ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } shadow-sm focus:ring-2 focus:outline-none transition-colors duration-150`}
                  />
                  {errors.fecha_contratacion && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.fecha_contratacion[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                to="/docentes"
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
                    Actualizar Docente
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
