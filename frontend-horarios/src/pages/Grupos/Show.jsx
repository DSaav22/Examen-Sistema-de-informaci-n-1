import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../layouts/Layout';
import grupoService from '../../services/grupoService';

const diasSemana = [
    { id: 1, nombre: 'Lunes' },
    { id: 2, nombre: 'Martes' },
    { id: 3, nombre: 'Miércoles' },
    { id: 4, nombre: 'Jueves' },
    { id: 5, nombre: 'Viernes' },
    { id: 6, nombre: 'Sábado' },
    { id: 7, nombre: 'Domingo' },
];

function GruposShow() {
    const { id: grupoId } = useParams();
    const [grupo, setGrupo] = useState(null);
    const [horariosAsignados, setHorariosAsignados] = useState([]);
    const [aulas, setAulas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);

    const [newHorarioData, setNewHorarioData] = useState({
        dia_semana: '1',
        aula_id: '',
        hora_inicio: '08:00',
        hora_fin: '10:00',
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            setHorariosAsignados([]);
            setGrupo(null);
            try {
                const [grupoResponse, formDataResponse] = await Promise.all([
                    grupoService.getGrupoById(grupoId),
                    grupoService.getFormData()
                ]);

                if (grupoResponse.data) {
                    setGrupo(grupoResponse.data);
                    setHorariosAsignados(grupoResponse.data.horarios || []);
                } else {
                    throw new Error('No se recibió información del grupo.');
                }

                const aulasData = formDataResponse.data.aulas || [];
                setAulas(aulasData);
                if (aulasData.length > 0) {
                    setNewHorarioData(prev => ({ ...prev, aula_id: aulasData[0].id.toString() }));
                } else {
                    setNewHorarioData(prev => ({ ...prev, aula_id: '' }));
                }

            } catch (err) {
                console.error("Error al cargar datos Show Grupo:", err);
                let detailedError = 'Error al cargar los datos.';
                if (err.response) {
                    if (err.response.status === 404) {
                        detailedError = `Error: Grupo con ID ${grupoId} no encontrado.`;
                    } else {
                        detailedError = `Error del servidor (${err.response.status}): ${err.response.data?.message || err.message}`;
                    }
                } else {
                    detailedError = err.message;
                }
                setError(detailedError);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [grupoId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewHorarioData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setFormErrors({});
        setSuccess(null);

        if (newHorarioData.hora_fin <= newHorarioData.hora_inicio) {
            setFormErrors({ general: 'La hora de fin debe ser posterior a la hora de inicio.' });
            setIsSubmitting(false);
            return;
        }
        if (!newHorarioData.aula_id) {
            setFormErrors({ general: 'Debe seleccionar un aula.' });
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await grupoService.assignHorario(grupoId, newHorarioData);
            setHorariosAsignados(prev => [...prev, response.data.horario]);
            setSuccess(response.data.message || 'Horario asignado con éxito.');
            setNewHorarioData({
                dia_semana: '1',
                aula_id: aulas.length > 0 ? aulas[0].id.toString() : '',
                hora_inicio: '08:00',
                hora_fin: '10:00',
            });
            setTimeout(() => setSuccess(null), 3000);

        } catch (err) {
            console.error("Error al asignar horario:", err);
            const apiErrors = err.response?.data?.errors;
            const message = err.response?.data?.message || 'Error al asignar el horario.';
            if (apiErrors) {
                if (apiErrors.general) {
                    setError(apiErrors.general);
                } else {
                    setFormErrors(apiErrors);
                    setError('Corrija los errores.');
                }
            } else {
                setError(message);
            }
            setTimeout(() => {
                setError(null);
                setFormErrors({});
            }, 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteHorario = async (horarioId) => {
        if (!window.confirm('¿Estás seguro?')) return;
        setIsDeleting(horarioId);
        setError(null);
        setSuccess(null);

        try {
            await grupoService.deleteHorario(grupoId, horarioId);
            setHorariosAsignados(prevHorarios => prevHorarios.filter(h => h.id !== horarioId));
            setSuccess('Horario eliminado con éxito.');
            setTimeout(() => setSuccess(null), 3000);

        } catch (err) {
            console.error("Error al eliminar horario:", err);
            setError(err.response?.data?.message || 'Error al eliminar el horario.');
            setTimeout(() => setError(null), 5000);
        } finally {
            setIsDeleting(null);
        }
    };

    const getNombreDia = (diaNum) => {
        const diaInt = parseInt(diaNum);
        const dia = diasSemana.find(d => d.id === diaInt);
        return dia ? dia.nombre : `Día ${diaNum}?`;
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
                </div>
            </Layout>
        );
    }

    if (error && !grupo) {
        return (
            <Layout>
                <div className="text-red-600 font-bold text-center mt-10 p-4 bg-red-100 border border-red-400 rounded">
                    {error}
                </div>
            </Layout>
        );
    }

    if (!grupo && !loading && !error) {
        return (
            <Layout>
                <div className="text-gray-600 font-bold text-center mt-10">
                    No se pudo cargar la información del grupo.
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Banners de Error y Éxito */}
                {error && (
                    <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm" role="alert">
                        <p className="font-bold">⚠️ Error</p>
                        <p>{error}</p>
                    </div>
                )}
                {success && (
                    <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-sm" role="alert">
                        <p className="font-bold">✅ Éxito</p>
                        <p>{success}</p>
                    </div>
                )}

                {/* Header con Detalles del Grupo */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6 rounded-lg shadow-lg mb-8 relative">
                    <h1 className="text-3xl font-bold mb-2">📅 Gestión de Horarios</h1>
                    <p className="text-purple-200 mb-6">Asigne y administre los horarios del grupo</p>
                    <Link to="/grupos" className="absolute top-6 right-6 bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 font-medium">
                        ← Volver
                    </Link>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-800">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <span className="text-2xl">📚</span>
                            <div>
                                <span className="text-xs text-gray-500 block">MATERIA</span>
                                <strong className="text-lg block">{grupo?.materia?.sigla || 'N/A'}</strong>
                                <span className="text-sm text-gray-600">{grupo?.materia?.nombre || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <span className="text-2xl">👥</span>
                            <div>
                                <span className="text-xs text-gray-500 block">GRUPO</span>
                                <strong className="text-lg block">{grupo?.nombre_grupo || 'N/A'}</strong>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <span className="text-2xl">👨‍🏫</span>
                            <div>
                                <span className="text-xs text-gray-500 block">DOCENTE</span>
                                <strong className="text-lg block">{grupo?.docente?.usuario?.name || 'N/A'}</strong>
                                <span className="text-sm text-gray-600">{grupo?.docente?.especialidad || ''}</span>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <span className="text-2xl">📅</span>
                            <div>
                                <span className="text-xs text-gray-500 block">GESTIÓN</span>
                                <strong className="text-lg block">{grupo?.gestion_academica?.nombre || 'N/A'}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección Horarios Asignados */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-bold text-purple-700 mb-4">📋 Horarios Asignados</h2>
                    {horariosAsignados.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <span className="text-6xl mb-4 block">⏰</span>
                            <p>No hay horarios asignados.</p>
                            <p className="text-sm text-gray-400 mt-2">Asigne uno nuevo abajo.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Día</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inicio</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fin</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aula</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {[...horariosAsignados]
                                        .sort((a, b) => a.dia_semana - b.dia_semana || a.hora_inicio.localeCompare(b.hora_inicio))
                                        .map((horario) => (
                                            <tr key={horario.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {getNombreDia(horario.dia_semana)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {horario.hora_inicio.substring(0, 5)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {horario.hora_fin.substring(0, 5)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    📍 {horario.aula?.nombre || 'N/A'} (Cap: {horario.aula?.capacidad || 'N/A'})
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleDeleteHorario(horario.id)}
                                                        disabled={isDeleting === horario.id}
                                                        className={`text-red-600 hover:text-red-900 ${isDeleting === horario.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        title="Eliminar"
                                                    >
                                                        {isDeleting === horario.id ? '⏳' : '🗑️'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Formulario Asignar Nuevo Horario */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-4">➕ Asignar Nuevo Horario</h2>
                    {formErrors.general && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            <p className="font-semibold">{formErrors.general}</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            {/* Día */}
                            <div>
                                <label htmlFor="dia_semana" className="block text-sm font-medium text-white mb-2">
                                    Día de la Semana *
                                </label>
                                <select
                                    id="dia_semana"
                                    name="dia_semana"
                                    value={newHorarioData.dia_semana}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                                >
                                    {diasSemana.map(dia => (
                                        <option key={dia.id} value={dia.id}>{dia.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Aula */}
                            <div>
                                <label htmlFor="aula_id" className="block text-sm font-medium text-white mb-2">
                                    Aula *
                                </label>
                                <select
                                    id="aula_id"
                                    name="aula_id"
                                    value={newHorarioData.aula_id}
                                    onChange={handleInputChange}
                                    required
                                    disabled={aulas.length === 0}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-200"
                                >
                                    {aulas.length === 0 ? (
                                        <option value="">No hay aulas disponibles</option>
                                    ) : (
                                        aulas.map(aula => (
                                            <option key={aula.id} value={aula.id}>
                                                {aula.nombre} (Cap: {aula.capacidad})
                                            </option>
                                        ))
                                    )}
                                </select>
                                {formErrors.aula_id && <p className="text-red-200 text-sm mt-1">{formErrors.aula_id}</p>}
                            </div>
                            {/* Hora Inicio */}
                            <div>
                                <label htmlFor="hora_inicio" className="block text-sm font-medium text-white mb-2">
                                    Hora de Inicio *
                                </label>
                                <input
                                    type="time"
                                    id="hora_inicio"
                                    name="hora_inicio"
                                    value={newHorarioData.hora_inicio}
                                    onChange={handleInputChange}
                                    required
                                    step="1800"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                                {formErrors.hora_inicio && <p className="text-red-200 text-sm mt-1">{formErrors.hora_inicio}</p>}
                            </div>
                            {/* Hora Fin */}
                            <div>
                                <label htmlFor="hora_fin" className="block text-sm font-medium text-white mb-2">
                                    Hora de Fin *
                                </label>
                                <input
                                    type="time"
                                    id="hora_fin"
                                    name="hora_fin"
                                    value={newHorarioData.hora_fin}
                                    onChange={handleInputChange}
                                    required
                                    step="1800"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                                {formErrors.hora_fin && <p className="text-red-200 text-sm mt-1">{formErrors.hora_fin}</p>}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting || aulas.length === 0}
                                className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting ? '⏳ Asignando...' : '➕ Asignar Horario'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default GruposShow;
