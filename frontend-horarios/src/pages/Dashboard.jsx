import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Layout from '../layouts/Layout';

const Dashboard = () => {
  const { user, isAdmin, isCoordinador, isDocente } = useAuth();

  const getRoleName = () => {
    if (isAdmin()) return 'Administrador';
    if (isCoordinador()) return 'Coordinador';
    if (isDocente()) return 'Docente';
    return 'Usuario';
  };

  const modules = [
    {
      name: 'Materias',
      description: 'Gestionar materias del sistema',
      href: '/materias',
      roles: [1, 2],
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      name: 'Aulas',
      description: 'Gestionar aulas y espacios',
      href: '/aulas',
      roles: [1, 2],
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      name: 'Docentes',
      description: 'Gestionar información de docentes',
      href: '/docentes',
      roles: [1],
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      name: 'Grupos',
      description: 'Gestionar grupos académicos',
      href: '/grupos',
      roles: [1, 2],
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      name: 'Horarios',
      description: 'Gestionar horarios de clases',
      href: '/horarios',
      roles: [1, 2],
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: 'Gestión Académica',
      description: 'Gestionar periodos académicos',
      href: '/gestiones',
      roles: [1, 2],
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const filteredModules = modules.filter((module) =>
    module.roles.includes(user?.rol_id)
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Bienvenida */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Bienvenido al Sistema de Horarios
          </h2>
          <p className="text-gray-600">
            Has iniciado sesión como <strong>{user?.name}</strong> ({getRoleName()}).
          </p>
        </div>

        {/* Módulos */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Módulos Disponibles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModules.map((module) => (
              <Link
                key={module.name}
                to={module.href}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-3">
                  <div className="text-blue-600">{module.icon}</div>
                  <h4 className="ml-3 font-semibold text-lg text-gray-900">
                    {module.name}
                  </h4>
                </div>
                <p className="text-sm text-gray-600">{module.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {isDocente() && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Mis Horarios</h3>
            <p className="text-sm text-blue-700">
              Aquí podrás ver los horarios de clases asignados.
            </p>
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Nota:</strong> Selecciona un módulo del menú lateral o de las tarjetas
            superiores para comenzar a trabajar.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
