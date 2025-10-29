import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ auth, materias, docentes, gestiones }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre_grupo: '',
        materia_id: '',
        docente_id: '',
        gestion_academica_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('grupos.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Nuevo Grupo
                </h2>
            }
        >
            <Head title="Nuevo Grupo" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6">
                            <div className="mb-4">
                                <InputLabel htmlFor="nombre_grupo" value="Nombre del Grupo" />
                                <TextInput
                                    id="nombre_grupo"
                                    type="text"
                                    name="nombre_grupo"
                                    value={data.nombre_grupo}
                                    className="mt-1 block w-full"
                                    placeholder="Ej: SA, SB, SC"
                                    onChange={(e) => setData('nombre_grupo', e.target.value)}
                                />
                                <InputError message={errors.nombre_grupo} className="mt-2" />
                            </div>

                            <div className="mb-4">
                                <InputLabel htmlFor="materia_id" value="Materia" />
                                <select
                                    id="materia_id"
                                    name="materia_id"
                                    value={data.materia_id}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    onChange={(e) => setData('materia_id', e.target.value)}
                                >
                                    <option value="">Seleccione una materia</option>
                                    {materias.map((materia) => (
                                        <option key={materia.id} value={materia.id}>
                                            {materia.codigo} - {materia.nombre}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.materia_id} className="mt-2" />
                            </div>

                            <div className="mb-4">
                                <InputLabel htmlFor="docente_id" value="Docente" />
                                <select
                                    id="docente_id"
                                    name="docente_id"
                                    value={data.docente_id}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    onChange={(e) => setData('docente_id', e.target.value)}
                                >
                                    <option value="">Seleccione un docente</option>
                                    {docentes.map((docente) => (
                                        <option key={docente.id} value={docente.id}>
                                            {docente.nombre} {docente.especialidad && `(${docente.especialidad})`}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.docente_id} className="mt-2" />
                            </div>

                            <div className="mb-4">
                                <InputLabel htmlFor="gestion_academica_id" value="Gestión Académica" />
                                <select
                                    id="gestion_academica_id"
                                    name="gestion_academica_id"
                                    value={data.gestion_academica_id}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    onChange={(e) => setData('gestion_academica_id', e.target.value)}
                                >
                                    <option value="">Seleccione una gestión</option>
                                    {gestiones.map((gestion) => (
                                        <option key={gestion.id} value={gestion.id}>
                                            {gestion.nombre}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.gestion_academica_id} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end mt-6 space-x-2">
                                <Link
                                    href={route('grupos.index')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400 focus:bg-gray-400 active:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Cancelar
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    {processing ? 'Guardando...' : 'Guardar'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
