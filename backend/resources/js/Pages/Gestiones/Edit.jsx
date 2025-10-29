import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ auth, gestion }) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: gestion.nombre || '',
        fecha_inicio: gestion.fecha_inicio || '',
        fecha_fin: gestion.fecha_fin || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('gestiones.update', gestion.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Editar Gestión Académica
                </h2>
            }
        >
            <Head title="Editar Gestión" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6">
                            <div className="mb-4">
                                <InputLabel htmlFor="nombre" value="Nombre de la Gestión" />
                                <TextInput
                                    id="nombre"
                                    type="text"
                                    name="nombre"
                                    value={data.nombre}
                                    className="mt-1 block w-full"
                                    placeholder="Ej: Gestión II-2025"
                                    onChange={(e) => setData('nombre', e.target.value)}
                                />
                                <InputError message={errors.nombre} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <InputLabel htmlFor="fecha_inicio" value="Fecha de Inicio" />
                                    <TextInput
                                        id="fecha_inicio"
                                        type="date"
                                        name="fecha_inicio"
                                        value={data.fecha_inicio}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('fecha_inicio', e.target.value)}
                                    />
                                    <InputError message={errors.fecha_inicio} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="fecha_fin" value="Fecha de Fin" />
                                    <TextInput
                                        id="fecha_fin"
                                        type="date"
                                        name="fecha_fin"
                                        value={data.fecha_fin}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('fecha_fin', e.target.value)}
                                    />
                                    <InputError message={errors.fecha_fin} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex items-center justify-end mt-6 space-x-2">
                                <Link
                                    href={route('gestiones.index')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400 focus:bg-gray-400 active:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Cancelar
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    {processing ? 'Actualizando...' : 'Actualizar'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
