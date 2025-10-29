import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MateriasIndex from './pages/Materias/Index';
import MateriasCreate from './pages/Materias/Create';
import MateriasEdit from './pages/Materias/Edit';
import AulasIndex from './pages/Aulas/Index';
import AulasCreate from './pages/Aulas/Create';
import AulasEdit from './pages/Aulas/Edit';
import UsuariosIndex from './pages/Usuarios/Index';
import UsuariosCreate from './pages/Usuarios/Create';
import UsuariosEdit from './pages/Usuarios/Edit';
import DocentesIndex from './pages/Docentes/Index';
import DocentesCreate from './pages/Docentes/Create';
import DocentesEdit from './pages/Docentes/Edit';
import GestionesIndex from './pages/Gestiones/Index';
import GestionesCreate from './pages/Gestiones/Create';
import GestionesEdit from './pages/Gestiones/Edit';
import GruposIndex from './pages/Grupos/Index';
import GruposCreate from './pages/Grupos/Create';
import GruposEdit from './pages/Grupos/Edit';
import GruposShow from './pages/Grupos/Show';
import AsignarHorarios from './pages/Horarios/AsignarHorarios';
import HorarioGlobal from './pages/Reportes/HorarioGlobal';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Materias */}
          <Route
            path="/materias"
            element={
              <ProtectedRoute>
                <MateriasIndex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/materias/crear"
            element={
              <ProtectedRoute>
                <MateriasCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/materias/:id/editar"
            element={
              <ProtectedRoute>
                <MateriasEdit />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Aulas */}
          <Route
            path="/aulas"
            element={
              <ProtectedRoute>
                <AulasIndex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/aulas/crear"
            element={
              <ProtectedRoute>
                <AulasCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/aulas/:id/editar"
            element={
              <ProtectedRoute>
                <AulasEdit />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Usuarios (Solo Admin) */}
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute>
                <UsuariosIndex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios/crear"
            element={
              <ProtectedRoute>
                <UsuariosCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios/:id/editar"
            element={
              <ProtectedRoute>
                <UsuariosEdit />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Docentes */}
          <Route
            path="/docentes"
            element={
              <ProtectedRoute>
                <DocentesIndex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/docentes/crear"
            element={
              <ProtectedRoute>
                <DocentesCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/docentes/:id/editar"
            element={
              <ProtectedRoute>
                <DocentesEdit />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Gestiones */}
          <Route
            path="/gestiones"
            element={
              <ProtectedRoute>
                <GestionesIndex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestiones/crear"
            element={
              <ProtectedRoute>
                <GestionesCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gestiones/:id/editar"
            element={
              <ProtectedRoute>
                <GestionesEdit />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Grupos y Horarios */}
          <Route
            path="/grupos"
            element={
              <ProtectedRoute>
                <GruposIndex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grupos/crear"
            element={
              <ProtectedRoute>
                <GruposCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grupos/:id/editar"
            element={
              <ProtectedRoute>
                <GruposEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grupos/:id"
            element={
              <ProtectedRoute>
                <GruposShow />
              </ProtectedRoute>
            }
          />

          {/* Ruta de Asignar Horarios (vista específica para asignación) */}
          <Route
            path="/horarios"
            element={
              <ProtectedRoute>
                <AsignarHorarios />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Reportes */}
          <Route
            path="/reportes/horarios"
            element={
              <ProtectedRoute>
                <HorarioGlobal />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
