import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from '../../layouts/Layout';
import materiaService from '../../services/materiaService';

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [carreras, setCarreras] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    sigla: '',
    nombre: '',
    nivel: '',
    creditos: '',
    horas_semanales: '',
    carreras: [], // Cambiado de carrera_id a carreras (array)
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Cargar datos del formulario (carreras)
      const formDataResponse = await materiaService.getFormData();
      setCarreras(formDataResponse.carreras || []);

      // Cargar datos de la materia
      const materiaResponse = await materiaService.getMateriaById(id);
      const materia = materiaResponse.materia || materiaResponse;
      
      // Mapear carreras asociadas a formato del formulario
      const carrerasData = (materia.carreras || []).map((carrera) => ({
        carrera_id: carrera.id,
        semestre_sugerido: carrera.pivot?.semestre_sugerido || null,
        obligatoria: carrera.pivot?.obligatoria ?? true,
      }));

      setFormData({
        sigla: materia.sigla || '',
        nombre: materia.nombre || '',
        nivel: materia.nivel || '',
        creditos: materia.creditos || '',
        horas_semanales: materia.horas_semanales || '',
        carreras: carrerasData,
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar la materia');
      navigate('/materias');
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
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Nueva función para manejar la selección de carreras (múltiple)
  const handleCarreraToggle = (carreraId) => {
    setFormData((prev) => {
      const isSelected = prev.carreras.some((c) => c.carrera_id === carreraId);
      
      if (isSelected) {
        // Desmarcar: eliminar de la lista
        return {
          ...prev,
          carreras: prev.carreras.filter((c) => c.carrera_id !== carreraId),
        };
      } else {
        // Marcar: agregar a la lista con datos por defecto
        return {
          ...prev,
          carreras: [
            ...prev.carreras,
            {
              carrera_id: carreraId,
              semestre_sugerido: null,
              obligatoria: true,
            },
          ],
        };
      }
    });

    // Limpiar error de carreras
    if (errors.carreras) {
      setErrors((prev) => ({ ...prev, carreras: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      await materiaService.updateMateria(id, formData);
      navigate('/materias');
    } catch (error) {
      if (error.response?.status === 422) {
        // Errores de validación de Laravel
        setErrors(error.response.data.errors || {});
      } else {
        alert('Error al actualizar la materia');
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
        {/* Breadcrumb / Volver */}
        <div className="mb-6">
          <Link
            to="/materias"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver a Materias
          </Link>
        </div>

        {/* Card del Formulario */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
            <div className="flex items-center">
              <svg
                className="w-8 h-8 text-white mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <div>
                <h2 className="text-2xl font-bold text-white">Editar Materia</h2>
                <p className="text-blue-100 text-sm mt-1">Modifique los campos que desea actualizar</p>
              </div>
            </div>
          </div>

          {/* Body del formulario */}
          <div className="px-6 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Sigla */}
              <div>
                <label
                  htmlFor="sigla"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Sigla de la Materia <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="sigla"
                  id="sigla"
                  required
                  value={formData.sigla}
                  onChange={handleChange}
                  className={`block w-full border ${
                    errors.sigla ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm`}
                  placeholder="Ej: MAT-101, FIS-205, INF-110"
                />
                {errors.sigla && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.sigla[0]}
                  </p>
                )}
              </div>

              {/* Nombre */}
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Nombre de la Materia <span className="text-red-500">*</span>
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
                  placeholder="Ej: Matemáticas I, Física II, Programación"
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

              {/* Grid para campos numéricos */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Información Académica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Nivel */}
                  <div>
                    <label
                      htmlFor="nivel"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Nivel <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="nivel"
                      id="nivel"
                      required
                      min="1"
                      max="12"
                      value={formData.nivel}
                      onChange={handleChange}
                      className={`block w-full border ${
                        errors.nivel ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      } rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm`}
                      placeholder="1-12"
                    />
                    {errors.nivel && (
                      <p className="mt-2 text-sm text-red-600">{errors.nivel[0]}</p>
                    )}
                  </div>

                  {/* Créditos */}
                  <div>
                    <label
                      htmlFor="creditos"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Créditos <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="creditos"
                      id="creditos"
                      required
                      min="1"
                      max="10"
                      value={formData.creditos}
                      onChange={handleChange}
                      className={`block w-full border ${
                        errors.creditos ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      } rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm`}
                      placeholder="Ej: 4"
                    />
                    {errors.creditos && (
                      <p className="mt-2 text-sm text-red-600">{errors.creditos[0]}</p>
                    )}
                  </div>

                  {/* Horas Semanales */}
                  <div>
                    <label
                      htmlFor="horas_semanales"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Horas/Semana <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="horas_semanales"
                      id="horas_semanales"
                      required
                      min="1"
                      max="20"
                      value={formData.horas_semanales}
                      onChange={handleChange}
                      className={`block w-full border ${
                        errors.horas_semanales ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      } rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm`}
                      placeholder="Ej: 6"
                    />
                    {errors.horas_semanales && (
                      <p className="mt-2 text-sm text-red-600">{errors.horas_semanales[0]}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Carreras (Selección Múltiple) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Carreras Asociadas <span className="text-red-500">*</span>
                </label>
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-2 max-h-64 overflow-y-auto">
                  {carreras.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No hay carreras disponibles
                    </p>
                  ) : (
                    carreras.map((carrera) => {
                      const isSelected = formData.carreras.some(
                        (c) => c.carrera_id === carrera.id
                      );
                      return (
                        <label
                          key={carrera.id}
                          className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-blue-100 border-2 border-blue-400'
                              : 'bg-white border border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleCarreraToggle(carrera.id)}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-sm font-medium text-gray-900">
                            {carrera.nombre}
                          </span>
                          {carrera.facultad && (
                            <span className="ml-auto text-xs text-gray-500">
                              {carrera.facultad.nombre}
                            </span>
                          )}
                        </label>
                      );
                    })
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Seleccione una o más carreras a las que pertenece esta materia
                </p>
                {formData.carreras.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.carreras.map((carreraData) => {
                      const carrera = carreras.find((c) => c.id === carreraData.carrera_id);
                      return (
                        <span
                          key={carreraData.carrera_id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {carrera?.nombre}
                          <button
                            type="button"
                            onClick={() => handleCarreraToggle(carreraData.carrera_id)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
                {errors.carreras && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.carreras[0]}
                  </p>
                )}
              </div>

              {/* Botones de Acción */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Link
                  to="/materias"
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
                      Actualizar Materia
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
