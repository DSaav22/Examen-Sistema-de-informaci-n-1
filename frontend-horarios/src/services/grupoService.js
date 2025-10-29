import api from './api';

const grupoService = {
  // Obtener todos los grupos con paginación
  getAll: async (page = 1, search = '') => {
    const response = await api.get(`/grupos?page=${page}&search=${search}`);
    return response.data;
  },

  // Obtener todos los grupos con paginación (alias)
  getAllGrupos: async (page = 1) => {
    const response = await api.get(`/grupos?page=${page}`);
    return response.data;
  },

  // Obtener un grupo por ID
  getGrupoById: async (id) => {
    const response = await api.get(`/grupos/${id}`);
    return response.data;
  },

  // Crear nuevo grupo
  createGrupo: async (data) => {
    const response = await api.post('/grupos', data);
    return response.data;
  },

  // Actualizar grupo existente
  updateGrupo: async (id, data) => {
    const response = await api.put(`/grupos/${id}`, data);
    return response.data;
  },

  // Eliminar grupo
  deleteGrupo: async (id) => {
    const response = await api.delete(`/grupos/${id}`);
    return response.data;
  },

  // Obtener datos para el formulario (materias, docentes, gestiones)
  getFormData: async () => {
    const response = await api.get('/grupos-form-data');
    return response.data;
  },

  // Asignar horario a un grupo (usa /horarios directamente)
  assignHorario: async (grupoId, data) => {
    // Agregar grupo_id al objeto data
    const horarioData = {
      ...data,
      grupo_id: grupoId
    };
    const response = await api.post('/horarios', horarioData);
    return response.data;
  },

  // Eliminar horario (usa /horarios directamente)
  deleteHorario: async (grupoId, horarioId) => {
    const response = await api.delete(`/horarios/${horarioId}`);
    return response.data;
  },
};

export default grupoService;
