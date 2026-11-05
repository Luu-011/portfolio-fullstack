import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'
import Home from '../pages/public/Home'
import Login from '../pages/public/Login'
import Register from '../pages/public/Register'
import Projects from '../pages/user/Projects'
import Dashboard from '../pages/admin/Dashboard'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/proyectos" element={<Projects />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
