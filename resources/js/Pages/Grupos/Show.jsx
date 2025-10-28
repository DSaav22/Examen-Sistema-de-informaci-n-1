import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ auth, grupo, horarios, aulas }) {
    const [deleting, setDeleting] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        grupo_id: grupo.id,
        aula_id: '',
        dia_semana: '',
        hora_inicio: '',
        hora_fin: '',
    });

    const diasSemana = {
        1: 'Lunes',
        2: 'Martes',
        3: 'Miércoles',
        4: 'Jueves',
        5: 'Viernes',
        6: 'Sábado',
        7: 'Domingo',
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('horarios.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('aula_id', 'dia_semana', 'hora_inicio', 'hora_fin');
            },
        });
    };

    const handleDelete = (horarioId) => {
        if (confirm('¿Estás seguro de que deseas eliminar este horario?')) {
            setDeleting(horarioId);
            router.delete(route('horarios.destroy', horarioId), {
                preserveScroll: true,
                onFinish: () => setDeleting(null),
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Asignación de Horarios - {grupo.nombre_grupo}
                    </h2>
                    <Link
                        href={route('grupos.index')}
                        className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        Volver a Grupos
                    </Link>
                </div>
            }
        >
            <Head title={`Horarios - ${grupo.nombre_grupo}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Sección 1: Detalles del Grupo */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                📚 Detalles del Grupo
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Materia:</span>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {grupo.materia?.nombre}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Código: {grupo.materia?.codigo}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Docente:</span>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {grupo.docente?.usuario?.name}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Gestión Académica:</span>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {grupo.gestion_academica?.nombre}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección 2: Horarios Asignados */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                🕒 Horarios Asignados
                            </h3>
                            
                            {horarios.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No hay horarios asignados a este grupo.</p>
                                    <p className="text-sm text-gray-400 mt-2">
                                        Utiliza el formulario abajo para asignar horarios.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Día
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Hora Inicio
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Hora Fin
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aula
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {horarios.map((horario) => (
                                                <tr key={horario.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {diasSemana[horario.dia_semana]}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {horario.hora_inicio}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {horario.hora_fin}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {horario.aula?.nombre}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {horario.aula?.edificio}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() => handleDelete(horario.id)}
                                                            disabled={deleting === horario.id}
                                                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                        >
                                                            {deleting === horario.id ? 'Eliminando...' : '🗑️ Eliminar'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sección 3: Asignar Nuevo Horario */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                ➕ Asignar Nuevo Horario
                            </h3>

                            {/* Mostrar errores generales */}
                            {errors.general && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">
                                                {errors.general}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Día de la Semana */}
                                    <div>
                                        <label htmlFor="dia_semana" className="block text-sm font-medium text-gray-700">
                                            Día de la Semana *
                                        </label>
                                        <select
                                            id="dia_semana"
                                            value={data.dia_semana}
                                            onChange={(e) => setData('dia_semana', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        >
                                            <option value="">Seleccionar día...</option>
                                            {Object.entries(diasSemana).map(([value, label]) => (
                                                <option key={value} value={value}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.dia_semana && (
                                            <p className="mt-1 text-sm text-red-600">{errors.dia_semana}</p>
                                        )}
                                    </div>

                                    {/* Aula */}
                                    <div>
                                        <label htmlFor="aula_id" className="block text-sm font-medium text-gray-700">
                                            Aula *
                                        </label>
                                        <select
                                            id="aula_id"
                                            value={data.aula_id}
                                            onChange={(e) => setData('aula_id', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        >
                                            <option value="">Seleccionar aula...</option>
                                            {aulas.map((aula) => (
                                                <option key={aula.id} value={aula.id}>
                                                    {aula.nombre} - {aula.edificio} (Cap: {aula.capacidad})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.aula_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.aula_id}</p>
                                        )}
                                    </div>

                                    {/* Hora Inicio */}
                                    <div>
                                        <label htmlFor="hora_inicio" className="block text-sm font-medium text-gray-700">
                                            Hora Inicio *
                                        </label>
                                        <input
                                            type="time"
                                            id="hora_inicio"
                                            value={data.hora_inicio}
                                            onChange={(e) => setData('hora_inicio', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        />
                                        {errors.hora_inicio && (
                                            <p className="mt-1 text-sm text-red-600">{errors.hora_inicio}</p>
                                        )}
                                    </div>

                                    {/* Hora Fin */}
                                    <div>
                                        <label htmlFor="hora_fin" className="block text-sm font-medium text-gray-700">
                                            Hora Fin *
                                        </label>
                                        <input
                                            type="time"
                                            id="hora_fin"
                                            value={data.hora_fin}
                                            onChange={(e) => setData('hora_fin', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        />
                                        {errors.hora_fin && (
                                            <p className="mt-1 text-sm text-red-600">{errors.hora_fin}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500">
                                        * Campos requeridos
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                                    >
                                        {processing ? 'Guardando...' : '💾 Guardar Horario'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
