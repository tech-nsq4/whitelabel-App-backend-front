import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useToast } from '../ui/Toast'

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const { showToast } = useToast()

  return (
    <div className="app">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <div className="main">
        <Topbar onToast={showToast} />
        <div className="content">{children}</div>
      </div>
    </div>
  )
}
