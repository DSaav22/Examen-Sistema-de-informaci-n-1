import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '../../layouts/Layout';
import gestionService from '../../services/gestionService';

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(true);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nombre: '',
    fecha_inicio: '',
    fecha_fin: '',
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoadingForm(true);
      const data = await gestionService.getGestionById(id);

      setFormData({
        nombre: data.nombre || '',
        fecha_inicio: data.fecha_inicio || '',
        fecha_fin: data.fecha_fin || '',
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setErrors({ form: 'Error al cargar los datos de la gestión académica.' });
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
      await gestionService.updateGestion(id, formData);
      navigate('/gestiones');
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors({ form: error.response.data.message });
      } else {
        setErrors({ form: 'Error al actualizar la gestión académica. Por favor, intenta nuevamente.' });
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
          <p className="text-gray-600 font-medium">Cargando datos de la gestión académica...</p>
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
              Editar Gestión Académica
            </h1>
            <p className="text-blue-100 text-sm mt-1">Modifique los datos del período académico</p>
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
            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                maxLength={100}
                placeholder="Ej: Gestión 2024-1, Semestre Primavera 2024"
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.nombre
                    ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                } shadow-sm focus:ring-2 focus:outline-none transition-colors duration-150`}
                required
              />
              {errors.nombre && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.nombre[0]}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">Identificador único de la gestión académica</p>
            </div>

            {/* Sección con grid para Fechas */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Período Académico
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Fecha de Inicio */}
                <div>
                  <label htmlFor="fecha_inicio" className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha de Inicio <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="fecha_inicio"
                      name="fecha_inicio"
                      value={formData.fecha_inicio}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.fecha_inicio
                          ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } shadow-sm focus:ring-2 focus:outline-none transition-colors duration-150`}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  {errors.fecha_inicio && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.fecha_inicio[0]}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Fecha de inicio del período</p>
                </div>

                {/* Fecha de Fin */}
                <div>
                  <label htmlFor="fecha_fin" className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha de Fin <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="fecha_fin"
                      name="fecha_fin"
                      value={formData.fecha_fin}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.fecha_fin
                          ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } shadow-sm focus:ring-2 focus:outline-none transition-colors duration-150`}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  {errors.fecha_fin && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.fecha_fin[0]}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Fecha de finalización del período</p>
                </div>
              </div>

              {/* Información de duración calculada */}
              {formData.fecha_inicio && formData.fecha_fin && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Duración del período:</p>
                      <p className="mt-1">
                        {(() => {
                          const inicio = new Date(formData.fecha_inicio);
                          const fin = new Date(formData.fecha_fin);
                          const dias = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
                          const meses = Math.floor(dias / 30);
                          
                          if (dias < 0) {
                            return <span className="text-red-600 font-semibold">⚠️ La fecha de fin debe ser posterior a la fecha de inicio</span>;
                          }
                          
                          return (
                            <span className="font-semibold">
                              {dias} días ({meses} {meses === 1 ? 'mes' : 'meses'} aproximadamente)
                            </span>
                          );
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                to="/gestiones"
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
                    Actualizar Gestión
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
