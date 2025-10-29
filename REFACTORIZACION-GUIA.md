# 🚀 Guía de Refactorización Laravel + React (API + SPA)

## ✅ FASE 1 COMPLETADA: Backend API Laravel

### Archivos Creados/Modificados:

#### 1. **Configuración**
- ✅ `config/cors.php` - Configuración CORS para localhost:5173
- ✅ `app/Models/User.php` - Agregado trait `HasApiTokens`
- ✅ Sanctum instalado y configurado

#### 2. **Controladores API** (en `app/Http/Controllers/Api/`)
- ✅ `AuthController.php` - login, register, logout, user
- ✅ `MateriaController.php` - CRUD + formData
- ✅ `AulaController.php` - CRUD
- ✅ `DocenteController.php` - CRUD + formData
- ✅ `GestionAcademicaController.php` - CRUD
- ✅ `GrupoController.php` - CRUD + formData
- ✅ `HorarioController.php` - CRUD + formData + validación de conflictos

#### 3. **Rutas**
- ✅ `routes/api.php` - Todas las rutas API con middleware `auth:sanctum`

---

## 📋 FASE 2: Frontend React SPA

### Pasos para Crear el Frontend:

#### 1. Crear Proyecto React en carpeta separada

```bash
# Desde la raíz del proyecto
cd ..
npx create-vite@latest frontend-horarios --template react
cd frontend-horarios
npm install
```

#### 2. Instalar Dependencias Necesarias

```bash
npm install axios react-router-dom
npm install @headlessui/react @heroicons/react
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### 3. Configurar Tailwind CSS

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 4. Configurar Axios

**src/services/api.js:**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: false, // Cambiar a true si usas cookies de Sanctum
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### 5. Crear Context de Autenticación

**src/contexts/AuthContext.jsx:**
```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay usuario en localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('auth_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      const { user: userData, token } = response.data;
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al iniciar sesión' 
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const isAdmin = () => user?.rol_id === 1;
  const isCoordinador = () => user?.rol_id === 2;
  const isDocente = () => user?.rol_id === 3;

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin, isCoordinador, isDocente }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

#### 6. Crear Componente de Rutas Protegidas

**src/components/ProtectedRoute.jsx:**
```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.rol_id !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
```

#### 7. Crear Página de Login

**src/pages/Login.jsx:**
```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sistema de Horarios
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Inicia sesión para continuar
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

#### 8. Crear App.jsx Principal

**src/App.jsx:**
```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Materias from './pages/Materias';
import Aulas from './pages/Aulas';
import Docentes from './pages/Docentes';
import Gestiones from './pages/Gestiones';
import Grupos from './pages/Grupos';
import Horarios from './pages/Horarios';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/materias/*"
            element={
              <ProtectedRoute>
                <Materias />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/aulas/*"
            element={
              <ProtectedRoute>
                <Aulas />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/docentes/*"
            element={
              <ProtectedRoute>
                <Docentes />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/gestiones/*"
            element={
              <ProtectedRoute>
                <Gestiones />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/grupos/*"
            element={
              <ProtectedRoute>
                <Grupos />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/horarios/*"
            element={
              <ProtectedRoute>
                <Horarios />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

---

## 🎯 INSTRUCCIONES PARA EJECUCIÓN

### Backend (Laravel API):

```bash
# En la carpeta backend del proyecto
cd C:\Users\diego\Desktop\si1\examen\Examen-Sistema-de-informaci-n-1\backend

# Iniciar servidor Laravel
php artisan serve
# Backend corriendo en: http://localhost:8000
```

### Frontend (React SPA):

```bash
# En la carpeta frontend-horarios del proyecto
cd C:\Users\diego\Desktop\si1\examen\Examen-Sistema-de-informaci-n-1\frontend-horarios

# Instalar dependencias (primera vez)
npm install

# Iniciar servidor de desarrollo
npm run dev
# Frontend corriendo en: http://localhost:5173
```

---

## 🔐 Credenciales de Prueba:

- **Administrador**: admin@admin.com / Admin123.
- **Coordinador**: coordinador@coordinador.com / Coordinador123.
- **Docente**: docente@docente.com / Docente123.

---

## 📝 Próximos Pasos:

1. ✅ Backend API completamente funcional
2. ⏳ Crear todos los componentes React para cada módulo (Materias, Aulas, etc.)
3. ⏳ Migrar la lógica de los formularios de Inertia a React
4. ⏳ Implementar paginación, búsqueda y filtros
5. ⏳ Crear componentes reutilizables (Table, Modal, Form, etc.)

---

## 🚀 Ventajas de esta Arquitectura:

- ✅ **Backend y Frontend completamente desacoplados**
- ✅ **Fácil despliegue en Cloud Run** (dos servicios separados)
- ✅ **Escalabilidad independiente**
- ✅ **API RESTful estándar** que puede ser consumida por cualquier cliente
- ✅ **Autenticación con tokens** de Sanctum
- ✅ **CORS configurado** correctamente

---

**Nota**: La estructura del frontend React es básica. Necesitarás crear los componentes específicos para cada módulo (índice, crear, editar) copiando la lógica de los archivos actuales de `resources/js/Pages` y adaptándolos para usar `axios` en lugar de `useForm` de Inertia.
