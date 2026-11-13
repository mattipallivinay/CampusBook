import { Outlet } from 'react-router-dom'
import Sidebar from '../components/sidebar/Sidebar'
import Header from '../components/dashboard/Header'

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <Header />

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout