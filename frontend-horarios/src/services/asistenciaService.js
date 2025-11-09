import api from './api';

const asistenciaService = {
  // Obtener las clases de hoy para el docente autenticado
  getClasesDeHoy: async () => {
    const response = await api.get('/asistencia/hoy');
    return response.data;
  },

  // Registrar asistencia para un horario específico
  registrarAsistencia: async (horarioId) => {
    const response = await api.post('/asistencia/registrar', {
      horario_id: horarioId,
    });
    return response.data;
  },

  // Registrar asistencia mediante código QR
  registrarQr: async (data) => {
    const response = await api.post('/asistencia/registrar-qr', {
      horario_id: data.horario_id,
      aula_id_qr: data.aula_id_qr,
    });
    return response.data;
  },
};

export default asistenciaService;

