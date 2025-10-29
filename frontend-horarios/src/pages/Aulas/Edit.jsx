import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from '../../layouts/Layout';
import aulaService from '../../services/aulaService';

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nombre: '',
    edificio: '',
    capacidad: '',
    tipo: '',
    recursos: '',
  });

  const tiposAula = ['Aula Normal', 'Laboratorio', 'Auditorio', 'Taller'];

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const aulaResponse = await aulaService.getAulaById(id);
      const aula = aulaResponse.aula || aulaResponse;
      
      setFormData({
        nombre: aula.nombre || '',
        edificio: aula.edificio || '',
        capacidad: aula.capacidad || '',
        tipo: aula.tipo || 'Aula Normal',
        recursos: aula.recursos || '',
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar el aula');
      navigate('/aulas');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      await aulaService.updateAula(id, formData);
      navigate('/aulas');
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        alert('Error al actualizar el aula');
      }
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/aulas"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a Aulas
          </Link>
        </div>

        {/* Card del Formulario */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <div>
                <h2 className="text-2xl font-bold text-white">Editar Aula</h2>
                <p className="text-blue-100 text-sm mt-1">Modifique los campos que desea actualizar</p>
              </div>
            </div>
          </div>

          {/* Body del formulario */}
          <div className="px-6 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre del Aula */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del Aula <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`block w-full border ${
                    errors.nombre ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm`}
                  placeholder="Ej: Aula 101, Lab 3, Auditorio A"
                />
                {errors.nombre && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.nombre[0]}
                  </p>
                )}
              </div>

              {/* Campo Edificio */}
              <div>
                <label htmlFor="edificio" className="block text-sm font-semibold text-gray-700 mb-2">
                  Edificio <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="edificio"
                  name="edificio"
                  value={formData.edificio}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.edificio ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Ej: Edificio A"
                />
                {errors.edificio && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.edificio[0]}
                  </p>
                )}
              </div>

              {/* Grid para Capacidad y Tipo */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Información del Aula
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Capacidad */}
                  <div>
                    <label htmlFor="capacidad" className="block text-sm font-semibold text-gray-700 mb-2">
                      Capacidad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="capacidad"
                      id="capacidad"
                      required
                      min="1"
                      max="500"
                      value={formData.capacidad}
                      onChange={handleChange}
                      className={`block w-full border ${
                        errors.capacidad ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      } rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm`}
                      placeholder="Ej: 30"
                    />
                    {errors.capacidad && (
                      <p className="mt-2 text-sm text-red-600">{errors.capacidad[0]}</p>
                    )}
                  </div>

                  {/* Tipo */}
                  <div>
                    <label htmlFor="tipo" className="block text-sm font-semibold text-gray-700 mb-2">
                      Tipo de Aula <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="tipo"
                      id="tipo"
                      required
                      value={formData.tipo}
                      onChange={handleChange}
                      className={`block w-full border ${
                        errors.tipo ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      } rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm`}
                    >
                      {tiposAula.map((tipo) => (
                        <option key={tipo} value={tipo}>
                          {tipo}
                        </option>
                      ))}
                    </select>
                    {errors.tipo && (
                      <p className="mt-2 text-sm text-red-600">{errors.tipo[0]}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Campo Recursos */}
              <div>
                <label htmlFor="recursos" className="block text-sm font-semibold text-gray-700 mb-2">
                  Recursos
                </label>
                <textarea
                  id="recursos"
                  name="recursos"
                  value={formData.recursos}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.recursos ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Ej: Proyector, Pizarra inteligente, Aire acondicionado"
                />
                {errors.recursos && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.recursos[0]}
                  </p>
                )}
              </div>

              {/* Botones de Acción */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Link
                  to="/aulas"
                  className="inline-flex items-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
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
                      Actualizar Aula
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Edit;
