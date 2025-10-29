import api from './api';

const reporteService = {
  // Obtener filtros para la parrilla de horarios
  getFiltros: async () => {
    const response = await api.get('/reportes/horarios-filtros');
    return response.data;
  },

  // Obtener horarios globales con filtros
  getHorariosGlobal: async (params) => {
    const response = await api.get('/reportes/horarios-global', { params });
    return response.data;
  },
};

export default reporteService;
