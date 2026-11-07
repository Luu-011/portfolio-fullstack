import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import AdminLayout from '../components/layout/AdminLayout'
import ProtectedRoute from './ProtectedRoute'
import OperatorRoute from './OperatorRoute'
import AdminRoute from './AdminRoute'
import Home from '../pages/public/Home'
import Login from '../pages/public/Login'
import Register from '../pages/public/Register'
import Projects from '../pages/user/Projects'
import ProjectDetail from '../pages/user/ProjectDetail'
import Dashboard from '../pages/admin/Dashboard'
import Messages from '../pages/admin/Messages'
import Analytics from '../pages/admin/Analytics'
import Users from '../pages/admin/Users'
import ProjectsCRUD from '../pages/admin/ProjectsCRUD'
import ServicesCRUD from '../pages/admin/ServicesCRUD'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        {/* Requiere usuario registrado */}
        <Route element={<ProtectedRoute />}>
          <Route path="/proyectos" element={<Projects />} />
          <Route path="/proyectos/:id" element={<ProjectDetail />} />
        </Route>

        {/* Requiere operador o administrador */}
        <Route element={<OperatorRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="mensajes" element={<Messages />} />
            {/* Solo administrador */}
            <Route element={<AdminRoute />}>
              <Route path="estadisticas" element={<Analytics />} />
              <Route path="usuarios" element={<Users />} />
              <Route path="proyectos" element={<ProjectsCRUD />} />
              <Route path="servicios" element={<ServicesCRUD />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
