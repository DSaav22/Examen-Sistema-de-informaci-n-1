import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '../../layouts/Layout';
import usuarioService from '../../services/usuarioService';

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(true);
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    ci: '',
    telefono: '',
    rol_id: '',
    password: '',
    password_confirmation: '',
    activo: true,
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoadingForm(true);
      const [usuarioData, formDataResponse] = await Promise.all([
        usuarioService.getUsuarioById(id),
        usuarioService.getFormData()
      ]);

      setFormData({
        name: usuarioData.usuario.name || '',
        email: usuarioData.usuario.email || '',
        ci: usuarioData.usuario.ci || '',
        telefono: usuarioData.usuario.telefono || '',
        rol_id: usuarioData.usuario.rol_id || '',
        password: '',
        password_confirmation: '',
        activo: usuarioData.usuario.activo ?? true,
      });

      setRoles(formDataResponse.roles || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setErrors({ form: 'Error al cargar los datos del usuario.' });
    } finally {
      setLoadingForm(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      // Si la contraseña está vacía, no la enviamos
      const dataToSend = { ...formData };
      if (!dataToSend.password) {
        delete dataToSend.password;
        delete dataToSend.password_confirmation;
      }

      await usuarioService.updateUsuario(id, dataToSend);
      navigate('/usuarios');
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ submit: error.response?.data?.message || 'Error al actualizar el usuario' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingForm) {
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
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/usuarios"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a Usuarios
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Editar Usuario</h1>
          <p className="mt-2 text-sm text-gray-600">
            Modifique los datos del usuario
          </p>
        </div>

        {/* Error general */}
        {errors.submit && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="ml-3 text-sm text-red-700">{errors.submit}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
          {/* Información Personal */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Información Personal</h2>

            {/* Nombre Completo */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre Completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder="Ej: Juan Pérez González"
                required
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name[0]}
                </p>
              )}
            </div>

            {/* Grid: Email y CI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="correo@ejemplo.com"
                  required
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email[0]}</p>
                )}
              </div>

              {/* CI */}
              <div>
                <label htmlFor="ci" className="block text-sm font-semibold text-gray-700 mb-2">
                  Cédula de Identidad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="ci"
                  name="ci"
                  value={formData.ci}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.ci ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Ej: 12345678"
                  required
                />
                {errors.ci && (
                  <p className="mt-2 text-sm text-red-600">{errors.ci[0]}</p>
                )}
              </div>
            </div>

            {/* Grid: Teléfono y Rol */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teléfono */}
              <div>
                <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.telefono ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Ej: 70123456"
                />
                {errors.telefono && (
                  <p className="mt-2 text-sm text-red-600">{errors.telefono[0]}</p>
                )}
              </div>

              {/* Rol */}
              <div>
                <label htmlFor="rol_id" className="block text-sm font-semibold text-gray-700 mb-2">
                  Rol <span className="text-red-500">*</span>
                </label>
                <select
                  id="rol_id"
                  name="rol_id"
                  value={formData.rol_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.rol_id ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  required
                >
                  <option value="">Seleccione un rol</option>
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
                {errors.rol_id && (
                  <p className="mt-2 text-sm text-red-600">{errors.rol_id[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Seguridad */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Seguridad</h2>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <div className="flex">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="ml-3 text-sm text-blue-700">
                  Deje los campos de contraseña en blanco para no cambiarla
                </p>
              </div>
            </div>

            {/* Grid: Contraseñas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contraseña */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Mínimo 8 caracteres (opcional)"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password[0]}</p>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Repita la contraseña (opcional)"
                />
              </div>
            </div>

            {/* Estado Activo */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="activo"
                name="activo"
                checked={formData.activo}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="activo" className="ml-2 block text-sm text-gray-700">
                Usuario activo
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Link
              to="/usuarios"
              className="inline-flex items-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
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
                  Actualizar Usuario
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Edit;
