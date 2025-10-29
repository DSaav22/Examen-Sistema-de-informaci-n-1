import api from './api';

const aulaService = {
  // Obtener todas las aulas con paginación
  getAllAulas: async (page = 1) => {
    const response = await api.get(`/aulas?page=${page}`);
    return response.data;
  },

  // Obtener una aula por ID
  getAulaById: async (id) => {
    const response = await api.get(`/aulas/${id}`);
    return response.data;
  },

  // Crear una nueva aula
  createAula: async (data) => {
    const response = await api.post('/aulas', data);
    return response.data;
  },

  // Actualizar un aula existente
  updateAula: async (id, data) => {
    const response = await api.put(`/aulas/${id}`, data);
    return response.data;
  },

  // Eliminar un aula
  deleteAula: async (id) => {
    const response = await api.delete(`/aulas/${id}`);
    return response.data;
  },
};

export default aulaService;
