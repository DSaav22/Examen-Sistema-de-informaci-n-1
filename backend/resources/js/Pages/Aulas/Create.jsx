import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        edificio: '',
        capacidad: '',
        tipo: 'Aula Normal',
        recursos: '',
        activo: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('aulas.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Nueva Aula
                </h2>
            }
        >
            <Head title="Nueva Aula" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="nombre" value="Nombre del Aula *" />
                                        <TextInput
                                            id="nombre"
                                            type="text"
                                            name="nombre"
                                            value={data.nombre}
                                            className="mt-1 block w-full"
                                            isFocused={true}
                                            onChange={(e) => setData('nombre', e.target.value)}
                                            placeholder="Ej: A-101, Lab-205"
                                        />
                                        <InputError message={errors.nombre} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="edificio" value="Edificio *" />
                                        <TextInput
                                            id="edificio"
                                            type="text"
                                            name="edificio"
                                            value={data.edificio}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('edificio', e.target.value)}
                                            placeholder="Ej: Edificio A, Bloque Principal"
                                        />
                                        <InputError message={errors.edificio} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="tipo" value="Tipo de Aula *" />
                                        <select
                                            id="tipo"
                                            name="tipo"
                                            value={data.tipo}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            onChange={(e) => setData('tipo', e.target.value)}
                                        >
                                            <option value="Aula Normal">Aula Normal</option>
                                            <option value="Laboratorio">Laboratorio</option>
                                            <option value="Auditorio">Auditorio</option>
                                            <option value="Taller">Taller</option>
                                        </select>
                                        <InputError message={errors.tipo} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="capacidad" value="Capacidad *" />
                                        <TextInput
                                            id="capacidad"
                                            type="number"
                                            name="capacidad"
                                            value={data.capacidad}
                                            className="mt-1 block w-full"
                                            min="1"
                                            max="500"
                                            onChange={(e) => setData('capacidad', e.target.value)}
                                            placeholder="Número de estudiantes"
                                        />
                                        <InputError message={errors.capacidad} className="mt-2" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="recursos" value="Recursos Disponibles" />
                                        <textarea
                                            id="recursos"
                                            name="recursos"
                                            value={data.recursos}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            rows="3"
                                            onChange={(e) => setData('recursos', e.target.value)}
                                            placeholder="Ej: Proyector, Pizarra digital, Aire acondicionado, 30 computadoras"
                                        />
                                        <InputError message={errors.recursos} className="mt-2" />
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
                                        href={route('aulas.index')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400 focus:bg-gray-400 active:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Cancelar
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Guardando...' : 'Guardar Aula'}
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
