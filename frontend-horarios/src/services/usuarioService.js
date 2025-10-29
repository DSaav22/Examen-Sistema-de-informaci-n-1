import api from './api';

const usuarioService = {
  // Obtener todos los usuarios con paginación
  getAllUsuarios: async (page = 1) => {
    const response = await api.get(`/usuarios?page=${page}`);
    return response.data;
  },

  // Obtener un usuario por ID
  getUsuarioById: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  // Crear un nuevo usuario
  createUsuario: async (data) => {
    const response = await api.post('/usuarios', data);
    return response.data;
  },

  // Actualizar un usuario existente
  updateUsuario: async (id, data) => {
    const response = await api.put(`/usuarios/${id}`, data);
    return response.data;
  },

  // Eliminar un usuario
  deleteUsuario: async (id) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },

  // Obtener datos del formulario (roles disponibles)
  getFormData: async () => {
    const response = await api.get('/usuarios-form-data');
    return response.data;
  },
};

export default usuarioService;
