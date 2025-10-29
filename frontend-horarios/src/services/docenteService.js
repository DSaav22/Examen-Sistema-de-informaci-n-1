import api from './api';

const docenteService = {
  // Obtener todos los docentes con paginación
  getAllDocentes: async (page = 1) => {
    const response = await api.get(`/docentes?page=${page}`);
    return response.data;
  },

  // Obtener un docente por ID
  getDocenteById: async (id) => {
    const response = await api.get(`/docentes/${id}`);
    return response.data;
  },

  // Crear un nuevo docente
  createDocente: async (data) => {
    const response = await api.post('/docentes', data);
    return response.data;
  },

  // Actualizar un docente existente
  updateDocente: async (id, data) => {
    const response = await api.put(`/docentes/${id}`, data);
    return response.data;
  },

  // Eliminar un docente
  deleteDocente: async (id) => {
    const response = await api.delete(`/docentes/${id}`);
    return response.data;
  },

  // Obtener datos del formulario (usuarios disponibles)
  getFormData: async () => {
    const response = await api.get('/docentes-form-data');
    return response.data;
  },
};

export default docenteService;
