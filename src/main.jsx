import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'
import { colorPalettes } from './pages/Branding/branding.data'

// Restore saved palette on load
const savedId = localStorage.getItem('brandingPalette')
if (savedId) {
  const saved = colorPalettes.find(p => p.id === savedId)
  if (saved) {
    Object.entries(saved.vars).forEach(([key, val]) => {
      document.documentElement.style.setProperty(key, val)
    })
  }
}

const rootEl = document.getElementById('root')
console.log('root element:', rootEl)

try {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  )
} catch (e) {
  console.error('RENDER ERROR:', e)
  rootEl.innerHTML = '<div style="color:red;padding:20px;font-size:16px">Error: ' + e.message + '</div>'
}
