import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Demo credentials — replace with real API calls later
const DEMO_USERS = [
  { email: 'admin@alshifa.sa',  password: 'admin123',  name: 'ناصر السالم',  role: 'مدير النظام' },
  { email: 'doctor@alshifa.sa', password: 'doctor123', name: 'د. سارة العمري', role: 'طبيب' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('auth_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  function login(email, password) {
    const found = DEMO_USERS.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password
    )
    if (!found) return false
    const userData = { email: found.email, name: found.name, role: found.role }
    localStorage.setItem('auth_user', JSON.stringify(userData))
    setUser(userData)
    return true
  }

  function logout() {
    localStorage.removeItem('auth_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
