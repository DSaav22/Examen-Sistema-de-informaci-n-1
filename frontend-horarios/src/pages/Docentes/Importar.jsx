import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../layouts/Layout';
import docenteService from '../../services/docenteService';

const Importar = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setErrors({});
    setSuccess(null);
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(null);
    setResult(null);

    if (!file) {
      setErrors({ file: ['Debe seleccionar un archivo.'] });
      setLoading(false);
      return;
    }

    try {
      const response = await docenteService.importDocentes(file);
      
      setSuccess(response.message || 'Importación completada exitosamente');
      setResult({
        created: response.created || 0,
        updated: response.updated || 0,
        errors: response.errors || [],
      });
      
      // Limpiar el input file
      setFile(null);
      document.getElementById('file-input').value = '';

    } catch (error) {
      console.error('Error al importar docentes:', error);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ submit: [error.response?.data?.message || 'Error al importar el archivo'] });
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    // Crear CSV template
    const csvContent = 'nombre,email,ci,telefono,especialidad,grado_academico\n' +
                       'Juan Pérez,juan.perez@example.com,12345678,72345678,Matemáticas,Licenciado\n' +
                       'María López,maria.lopez@example.com,87654321,73456789,Física,Magíster';
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'plantilla_docentes.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex mb-4 text-sm" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/docentes" className="text-gray-700 hover:text-blue-600">
                Docentes
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-500">Importar</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Importar Docentes</h1>
          <p className="mt-2 text-gray-600">
            Cargue un archivo CSV o Excel con la información de los docentes para crear múltiples registros a la vez.
          </p>
        </div>

        {/* Instrucciones */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Formato del archivo</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>El archivo debe ser CSV o Excel (.csv, .xlsx, .xls)</li>
                  <li>La primera fila debe contener los encabezados de las columnas</li>
                  <li>Columnas requeridas: <strong>nombre, email, ci</strong></li>
                  <li>Columnas opcionales: <strong>telefono, especialidad, grado_academico</strong></li>
                  <li>Si el email ya existe, se actualizará el registro del docente</li>
                  <li>La contraseña por defecto será: <strong>Docente123.</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de descarga de plantilla */}
        <div className="mb-6">
          <button
            type="button"
            onClick={downloadTemplate}
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar Plantilla CSV
          </button>
        </div>

        {/* Formulario de importación */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            {/* Input de archivo */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Archivo <span className="text-red-500">*</span>
              </label>
              <input
                id="file-input"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className={`block w-full text-sm text-gray-900 border ${
                  errors.file ? 'border-red-500' : 'border-gray-300'
                } rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-blue-500 p-2.5`}
              />
              {errors.file && (
                <p className="mt-2 text-sm text-red-600">{errors.file[0]}</p>
              )}
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Archivo seleccionado: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>

            {/* Mensajes de error general */}
            {errors.submit && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errors.submit[0]}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Mensaje de éxito */}
            {success && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Resultados de la importación */}
            {result && (
              <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Resultados:</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>✅ Docentes creados: <strong>{result.created}</strong></li>
                  <li>🔄 Docentes actualizados: <strong>{result.updated}</strong></li>
                </ul>
                
                {result.errors && result.errors.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-red-700 mb-1">Errores encontrados:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                      {result.errors.map((error, index) => (
                        <li key={index}>
                          Fila {error.row}: {error.errors.join(', ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex items-center justify-between pt-4">
              <Link
                to="/docentes"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver
              </Link>

              <button
                type="submit"
                disabled={loading || !file}
                className={`inline-flex items-center px-6 py-2 rounded-lg text-white font-medium transition-colors duration-200 ${
                  loading || !file
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Importando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Importar Docentes
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

export default Importar;
