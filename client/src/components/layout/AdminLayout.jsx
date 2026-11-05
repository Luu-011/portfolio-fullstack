import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AdminLayout() {
  return (
    <div className="container admin-shell">
      <Sidebar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  )
}
