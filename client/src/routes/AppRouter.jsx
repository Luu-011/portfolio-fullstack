import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import AdminLayout from '../components/layout/AdminLayout'
import ProtectedRoute from './ProtectedRoute'
import OperatorRoute from './OperatorRoute'
import Home from '../pages/public/Home'
import Login from '../pages/public/Login'
import Register from '../pages/public/Register'
import Projects from '../pages/user/Projects'
import ProjectDetail from '../pages/user/ProjectDetail'
import Dashboard from '../pages/admin/Dashboard'
import Messages from '../pages/admin/Messages'

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
            {/* Más adelante, rutas solo para admin dentro de <AdminRoute />:
                proyectos, servicios, usuarios, analytics */}
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
