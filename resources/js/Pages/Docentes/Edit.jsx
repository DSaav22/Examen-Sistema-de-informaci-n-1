import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ auth, docente, usuarios }) {
    const { data, setData, put, processing, errors } = useForm({
        usuario_id: docente.usuario_id || '',
        codigo_docente: docente.codigo_docente || '',
        especialidad: docente.especialidad || '',
        grado_academico: docente.grado_academico || 'Licenciatura',
        fecha_contratacion: docente.fecha_contratacion || '',
        tipo_contrato: docente.tipo_contrato || 'Tiempo Completo',
        activo: docente.activo ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('docentes.update', docente.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Editar Docente: {docente.usuario?.name}
                </h2>
            }
        >
            <Head title={`Editar Docente - ${docente.usuario?.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="usuario_id" value="Usuario *" />
                                        <select
                                            id="usuario_id"
                                            name="usuario_id"
                                            value={data.usuario_id}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            onChange={(e) => setData('usuario_id', e.target.value)}
                                        >
                                            <option value="">Seleccione un usuario</option>
                                            {usuarios.map((usuario) => (
                                                <option key={usuario.id} value={usuario.id}>
                                                    {usuario.name} - {usuario.email}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.usuario_id} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="codigo_docente" value="Código Docente *" />
                                        <TextInput
                                            id="codigo_docente"
                                            type="text"
                                            name="codigo_docente"
                                            value={data.codigo_docente}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('codigo_docente', e.target.value)}
                                        />
                                        <InputError message={errors.codigo_docente} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="especialidad" value="Especialidad" />
                                        <TextInput
                                            id="especialidad"
                                            type="text"
                                            name="especialidad"
                                            value={data.especialidad}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('especialidad', e.target.value)}
                                        />
                                        <InputError message={errors.especialidad} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="grado_academico" value="Grado Académico *" />
                                        <select
                                            id="grado_academico"
                                            name="grado_academico"
                                            value={data.grado_academico}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            onChange={(e) => setData('grado_academico', e.target.value)}
                                        >
                                            <option value="Licenciatura">Licenciatura</option>
                                            <option value="Maestría">Maestría</option>
                                            <option value="Doctorado">Doctorado</option>
                                        </select>
                                        <InputError message={errors.grado_academico} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="fecha_contratacion" value="Fecha de Contratación" />
                                        <TextInput
                                            id="fecha_contratacion"
                                            type="date"
                                            name="fecha_contratacion"
                                            value={data.fecha_contratacion}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('fecha_contratacion', e.target.value)}
                                        />
                                        <InputError message={errors.fecha_contratacion} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="tipo_contrato" value="Tipo de Contrato *" />
                                        <select
                                            id="tipo_contrato"
                                            name="tipo_contrato"
                                            value={data.tipo_contrato}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            onChange={(e) => setData('tipo_contrato', e.target.value)}
                                        >
                                            <option value="Tiempo Completo">Tiempo Completo</option>
                                            <option value="Medio Tiempo">Medio Tiempo</option>
                                            <option value="Por Horas">Por Horas</option>
                                        </select>
                                        <InputError message={errors.tipo_contrato} className="mt-2" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="activo"
                                                checked={data.activo}
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                onChange={(e) => setData('activo', e.target.checked)}
                                            />
                                            <span className="ml-2 text-sm text-gray-600">Activo</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-6 space-x-3">
                                    <Link
                                        href={route('docentes.index')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400 focus:bg-gray-400 active:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Cancelar
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Actualizando...' : 'Actualizar Docente'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
