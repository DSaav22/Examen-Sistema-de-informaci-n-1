import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../layouts/Layout';
import grupoService from '../../services/grupoService';

function AsignarHorarios() {
  const navigate = useNavigate();
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadGrupos();
  }, [currentPage, search]);

  const loadGrupos = async () => {
    try {
      setLoading(true);
      const data = await grupoService.getAll(currentPage, search);
      setGrupos(data.data || []);
      setTotalPages(data.last_page || 1);
      setCurrentPage(data.current_page || 1);
    } catch (err) {
      setError('Error al cargar los grupos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadGrupos();
  };

  const handleAsignarHorario = (grupoId) => {
    navigate(`/grupos/${grupoId}`);
  };

  return (
    <Layout>
      <div className="p-4 sm:p-6">
        {/* Encabezado */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-2">
            Asignar Horarios
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Selecciona un grupo para asignar o modificar sus horarios de clase
          </p>
        </div>

        {/* Barra de búsqueda */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por materia, docente o gestión..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Buscar
            </button>
          </form>
        </div>

        {/* Lista de grupos */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Cargando grupos...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : grupos.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <p className="text-gray-600 text-lg">No hay grupos disponibles</p>
            <p className="text-gray-500 text-sm mt-2">
              Crea grupos desde la sección de Grupos para poder asignarles horarios
            </p>
          </div>
        ) : (
          <>
            {/* Cards de grupos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {grupos.map((grupo) => (
                <div
                  key={grupo.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-5 border border-gray-200"
                >
                  {/* Materia */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-purple-700 mb-1">
                      {grupo.materia?.sigla || 'N/A'}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {grupo.materia?.nombre || 'Sin materia'}
                    </p>
                  </div>

                  {/* Información del grupo */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">👨‍🏫 Docente:</span>
                      <span className="text-gray-700 font-medium">
                        {grupo.docente?.usuario?.name || 'Sin docente'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">📅 Gestión:</span>
                      <span className="text-gray-700 font-medium">
                        {grupo.gestionAcademica?.nombre || 'Sin gestión'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">📊 Horarios:</span>
                      <span className={`font-medium ${grupo.horarios?.length > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                        {grupo.horarios?.length || 0} asignados
                      </span>
                    </div>
                  </div>

                  {/* Botón de acción */}
                  <button
                    onClick={() => handleAsignarHorario(grupo.id)}
                    className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    {grupo.horarios?.length > 0 ? 'Ver/Editar Horarios' : 'Asignar Horarios'}
                  </button>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default AsignarHorarios;
