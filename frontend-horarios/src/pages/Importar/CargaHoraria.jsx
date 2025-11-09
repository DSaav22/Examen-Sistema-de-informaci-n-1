import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layouts/Layout';
import api from '../../services/api';

const CargaHoraria = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    // Manejar cambio de archivo
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            validateAndSetFile(selectedFile);
        }
    };

    // Validar y establecer archivo
    const validateAndSetFile = (selectedFile) => {
        // Validar tipo de archivo
        const allowedTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        
        if (!allowedTypes.includes(selectedFile.type)) {
            setError('El archivo debe ser CSV, XLS o XLSX');
            setFile(null);
            return;
        }

        // Validar tamaño (máximo 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (selectedFile.size > maxSize) {
            setError('El archivo no debe superar los 5MB');
            setFile(null);
            return;
        }

        setFile(selectedFile);
        setError(null);
        setResult(null);
    };

    // Manejar drag and drop
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    // Enviar archivo
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setError('Debe seleccionar un archivo');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/importar/carga-horaria', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setResult({
                success: true,
                message: response.data.message,
                imported: response.data.imported,
                skipped: response.data.skipped,
                errors: response.data.errors || [],
            });

            // Limpiar archivo después de 3 segundos
            setTimeout(() => {
                setFile(null);
            }, 3000);

        } catch (err) {
            console.error('Error al importar:', err);
            
            if (err.response?.data) {
                setError(err.response.data.message || 'Error al importar el archivo');
                if (err.response.data.errors) {
                    setResult({
                        success: false,
                        errors: err.response.data.errors,
                    });
                }
            } else {
                setError('Error de conexión con el servidor');
            }
        } finally {
            setLoading(false);
        }
    };

    // Descargar plantilla
    const downloadTemplate = () => {
        const headers = [
            'facultad',
            'carrera',
            'sigla_materia',
            'nombre_materia',
            'nivel',
            'creditos',
            'horas_programadas',
            'codigo_docente',
            'nombre_docente',
            'cargo',
            'nombre_grupo',
            'cupos_ofrecidos',
            'inscritos',
            'estado'
        ];

        const csvContent = headers.join(',') + '\n' +
            'Facultad de Tecnología,Ingeniería de Sistemas,SIS101,Programación I,1,4,4,DOC001,Juan Pérez,Docente Titular,A,40,35,Abierto\n' +
            'Facultad de Tecnología,Ingeniería de Sistemas,SIS102,Matemáticas I,1,4,4,DOC002,María López,Docente Auxiliar,B,40,38,Abierto';

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'plantilla_carga_horaria.csv');
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                {/* Encabezado */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-4 text-blue-600 hover:text-blue-700 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver
                    </button>

                    <h1 className="text-3xl font-bold text-gray-900">Importar Carga Horaria</h1>
                    <p className="text-gray-600 mt-2">
                        Importe datos de carga horaria desde archivos CSV o Excel
                    </p>
                </div>

                {/* Instrucciones */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Instrucciones
                    </h2>
                    <ul className="space-y-2 text-blue-800 text-sm">
                        <li className="flex items-start gap-2">
                            <span className="font-semibold mt-0.5">1.</span>
                            <span>El archivo debe contener las siguientes columnas: facultad, carrera, sigla_materia, nombre_materia, nivel, creditos, horas_programadas, codigo_docente, nombre_docente, cargo, nombre_grupo, cupos_ofrecidos, inscritos, estado</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-semibold mt-0.5">2.</span>
                            <span>Descargue la plantilla de ejemplo y utilícela como referencia</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-semibold mt-0.5">3.</span>
                            <span>El sistema creará automáticamente carreras, docentes, materias y grupos según los datos</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-semibold mt-0.5">4.</span>
                            <span>Si un registro ya existe (por código o sigla), se actualizará en lugar de duplicarse</span>
                        </li>
                    </ul>

                    <button
                        onClick={downloadTemplate}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Descargar Plantilla
                    </button>
                </div>

                {/* Formulario de carga */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit}>
                        {/* Área de drop */}
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                dragActive
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400'
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                id="file-upload"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileChange}
                                className="hidden"
                                disabled={loading}
                            />

                            {!file ? (
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <div className="flex flex-col items-center">
                                        <svg
                                            className="w-16 h-16 text-gray-400 mb-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                            />
                                        </svg>
                                        <p className="text-lg font-medium text-gray-700 mb-2">
                                            Haga clic o arrastre el archivo aquí
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Archivos CSV, XLS o XLSX (Máximo 5MB)
                                        </p>
                                    </div>
                                </label>
                            ) : (
                                <div className="flex items-center justify-center gap-3">
                                    <svg
                                        className="w-10 h-10 text-green-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">{file.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {(file.size / 1024).toFixed(2)} KB
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFile(null)}
                                        className="ml-4 text-red-500 hover:text-red-700"
                                        disabled={loading}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mensajes de error */}
                        {error && (
                            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <svg
                                        className="w-5 h-5 text-red-500 mt-0.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="font-medium text-red-900">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Resultado de la importación */}
                        {result && (
                            <div
                                className={`mt-4 border rounded-lg p-4 ${
                                    result.success
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-yellow-50 border-yellow-200'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <svg
                                        className={`w-5 h-5 mt-0.5 ${
                                            result.success ? 'text-green-500' : 'text-yellow-500'
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <div className="flex-1">
                                        <p
                                            className={`font-medium ${
                                                result.success ? 'text-green-900' : 'text-yellow-900'
                                            }`}
                                        >
                                            {result.message}
                                        </p>
                                        {result.success && (
                                            <div className="mt-2 space-y-1 text-sm text-green-800">
                                                <p>✓ Registros importados: {result.imported}</p>
                                                {result.skipped > 0 && (
                                                    <p>⚠ Registros omitidos: {result.skipped}</p>
                                                )}
                                            </div>
                                        )}
                                        {result.errors && result.errors.length > 0 && (
                                            <div className="mt-3">
                                                <p className="font-medium text-red-900 mb-2">Errores:</p>
                                                <ul className="text-sm text-red-800 space-y-1 max-h-40 overflow-y-auto">
                                                    {result.errors.map((err, idx) => (
                                                        <li key={idx} className="flex items-start gap-2">
                                                            <span className="text-red-500">•</span>
                                                            <span>{err}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Botón de importar */}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={!file || loading}
                                className={`px-6 py-2 rounded-lg text-white font-medium transition-colors flex items-center gap-2 ${
                                    !file || loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        <span>Importando...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                            />
                                        </svg>
                                        <span>Importar Archivo</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default CargaHoraria;
