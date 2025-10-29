import api from './api';

export const materiaService = {
  // Obtener todas las materias con paginación
  getAllMaterias: async (page = 1) => {
    try {
      const response = await api.get(`/materias?page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener materias:', error);
      throw error;
    }
  },

  // Obtener una materia por ID
  getMateriaById: async (id) => {
    try {
      const response = await api.get(`/materias/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener materia:', error);
      throw error;
    }
  },

  // Crear una nueva materia
  createMateria: async (data) => {
    try {
      const response = await api.post('/materias', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear materia:', error);
      throw error;
    }
  },

  // Actualizar una materia
  updateMateria: async (id, data) => {
    try {
      const response = await api.put(`/materias/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar materia:', error);
      throw error;
    }
  },

  // Eliminar una materia
  deleteMateria: async (id) => {
    try {
      const response = await api.delete(`/materias/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar materia:', error);
      throw error;
    }
  },

  // Obtener datos de formulario (carreras para el select)
  getFormData: async () => {
    try {
      const response = await api.get('/materias-form-data');
      return response.data;
    } catch (error) {
      console.error('Error al obtener datos de formulario:', error);
      throw error;
    }
  },
};

export default materiaService;
