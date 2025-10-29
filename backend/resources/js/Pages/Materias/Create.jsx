import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ auth, carreras }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        codigo: '',
        carrera_id: '',
        nivel: '',
        creditos: 4,
        horas_semanales: 4,
        descripcion: '',
        activo: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('materias.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Nueva Materia
                </h2>
            }
        >
            <Head title="Nueva Materia" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Nombre */}
                                    <div>
                                        <InputLabel htmlFor="nombre" value="Nombre de la Materia *" />
                                        <TextInput
                                            id="nombre"
                                            type="text"
                                            name="nombre"
                                            value={data.nombre}
                                            className="mt-1 block w-full"
                                            isFocused={true}
                                            onChange={(e) => setData('nombre', e.target.value)}
                                        />
                                        <InputError message={errors.nombre} className="mt-2" />
                                    </div>

                                    {/* Código */}
                                    <div>
                                        <InputLabel htmlFor="codigo" value="Código *" />
                                        <TextInput
                                            id="codigo"
                                            type="text"
                                            name="codigo"
                                            value={data.codigo}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('codigo', e.target.value)}
                                        />
                                        <InputError message={errors.codigo} className="mt-2" />
                                    </div>

                                    {/* Carrera */}
                                    <div>
                                        <InputLabel htmlFor="carrera_id" value="Carrera *" />
                                        <select
                                            id="carrera_id"
                                            name="carrera_id"
                                            value={data.carrera_id}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            onChange={(e) => setData('carrera_id', e.target.value)}
                                        >
                                            <option value="">Seleccione una carrera</option>
                                            {carreras.map((carrera) => (
                                                <option key={carrera.id} value={carrera.id}>
                                                    {carrera.nombre} - {carrera.facultad?.nombre}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.carrera_id} className="mt-2" />
                                    </div>

                                    {/* Nivel */}
                                    <div>
                                        <InputLabel htmlFor="nivel" value="Nivel/Semestre *" />
                                        <TextInput
                                            id="nivel"
                                            type="number"
                                            name="nivel"
                                            value={data.nivel}
                                            className="mt-1 block w-full"
                                            min="1"
                                            max="12"
                                            onChange={(e) => setData('nivel', e.target.value)}
                                        />
                                        <InputError message={errors.nivel} className="mt-2" />
                                    </div>

                                    {/* Créditos */}
                                    <div>
                                        <InputLabel htmlFor="creditos" value="Créditos *" />
                                        <TextInput
                                            id="creditos"
                                            type="number"
                                            name="creditos"
                                            value={data.creditos}
                                            className="mt-1 block w-full"
                                            min="1"
                                            max="10"
                                            onChange={(e) => setData('creditos', e.target.value)}
                                        />
                                        <InputError message={errors.creditos} className="mt-2" />
                                    </div>

                                    {/* Horas Semanales */}
                                    <div>
                                        <InputLabel htmlFor="horas_semanales" value="Horas por Semana *" />
                                        <TextInput
                                            id="horas_semanales"
                                            type="number"
                                            name="horas_semanales"
                                            value={data.horas_semanales}
                                            className="mt-1 block w-full"
                                            min="1"
                                            max="20"
                                            onChange={(e) => setData('horas_semanales', e.target.value)}
                                        />
                                        <InputError message={errors.horas_semanales} className="mt-2" />
                                    </div>

                                    {/* Descripción */}
                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="descripcion" value="Descripción" />
                                        <textarea
                                            id="descripcion"
                                            name="descripcion"
                                            value={data.descripcion}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            rows="3"
                                            onChange={(e) => setData('descripcion', e.target.value)}
                                        />
                                        <InputError message={errors.descripcion} className="mt-2" />
                                    </div>

                                    {/* Estado Activo */}
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
                                        href={route('materias.index')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400 focus:bg-gray-400 active:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Cancelar
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Guardando...' : 'Guardar Materia'}
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
