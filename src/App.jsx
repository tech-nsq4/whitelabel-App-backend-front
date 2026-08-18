import { useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/ui/Toast'
import DashboardLayout from './components/layout/DashboardLayout'
import AppRoutes from './routes'

// Pages that render without the dashboard shell
const PUBLIC_PATHS = ['/login']

function AppShell() {
  const location = useLocation()
  const isPublic = PUBLIC_PATHS.includes(location.pathname)

  if (isPublic) return <AppRoutes />

  return (
    <DashboardLayout>
      <AppRoutes />
    </DashboardLayout>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppShell />
      </ToastProvider>
    </AuthProvider>
  )
}
