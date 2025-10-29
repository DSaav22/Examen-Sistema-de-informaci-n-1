import api from './api';

const gestionService = {
  // Obtener todas las gestiones con paginación
  getAllGestiones: async (page = 1) => {
    const response = await api.get(`/gestiones?page=${page}`);
    return response.data;
  },

  // Obtener una gestión por ID
  getGestionById: async (id) => {
    const response = await api.get(`/gestiones/${id}`);
    return response.data;
  },

  // Crear nueva gestión
  createGestion: async (data) => {
    const response = await api.post('/gestiones', data);
    return response.data;
  },

  // Actualizar gestión existente
  updateGestion: async (id, data) => {
    const response = await api.put(`/gestiones/${id}`, data);
    return response.data;
  },

  // Eliminar gestión
  deleteGestion: async (id) => {
    const response = await api.delete(`/gestiones/${id}`);
    return response.data;
  },
};

export default gestionService;
