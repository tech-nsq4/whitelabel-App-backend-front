import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Search, HelpCircle, Bell, ChevronDown,
  User, ArrowLeftRight, LogOut
} from 'lucide-react'
import NotificationDropdown from '../notifications/NotificationDropdown'
import SendNotificationModal from '../notifications/SendNotificationModal'
import GlobalSearch from '../search/GlobalSearch'
import { PAGE_TITLES } from '../../constants'
import { useAuth } from '../../context/AuthContext'
import { useBranding } from '../../hooks/useBranding'
import './Topbar.css'

export default function Topbar({ onToast }) {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { user, logout } = useAuth()
  const { nameAr } = useBranding()

  const [notifOpen,   setNotifOpen]   = useState(false)
  const [composeOpen, setComposeOpen] = useState(false)
  const [searchOpen,  setSearchOpen]  = useState(false)
  const [userOpen,    setUserOpen]    = useState(false)

  const notifRef = useRef(null)
  const userRef  = useRef(null)

  const pageTitle   = PAGE_TITLES[location.pathname] || ''
  const userInitial = user?.name ? user.name.trim()[0] : 'م'

  useEffect(() => {
    function handle(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
      if (userRef.current  && !userRef.current.contains(e.target))  setUserOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  useEffect(() => {
    function handle(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [])

  return (
    <>
      <div className="topbar">
        {/* Breadcrumb */}
        <div className="crumb">
          <span>{nameAr}</span>
          <span className="sep">/</span>
          <strong>{pageTitle}</strong>
        </div>

        <div className="top-actions">
          {/* Search */}
          <button className="search-box" onClick={() => setSearchOpen(true)} aria-label="البحث في النظام">
            <Search size={14} strokeWidth={1.8} />
            <span className="search-placeholder">ابحث في النظام...</span>
            <span className="kbd">⌘K</span>
          </button>

          {/* Help */}
          <button className="icon-btn" title="المساعدة" aria-label="المساعدة"
            onClick={() => onToast('مركز المساعدة قيد التطوير')}>
            <HelpCircle size={17} strokeWidth={1.7} />
          </button>

          {/* Notifications */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button className="icon-btn" aria-label="الإشعارات"
              onClick={() => setNotifOpen((v) => !v)}>
              <Bell size={17} strokeWidth={1.7} />
              <span className="dot" />
            </button>
            <NotificationDropdown
              open={notifOpen}
              onMarkAllRead={() => { onToast('تم تعليم الكل كمقروء'); setNotifOpen(false) }}
              onCompose={() => { setNotifOpen(false); setComposeOpen(true) }}
            />
          </div>

          {/* User menu */}
          <div className="user-menu" ref={userRef}>
            <button
              className={`role-pill${userOpen ? ' open' : ''}`}
              onClick={() => setUserOpen((v) => !v)}
              aria-label="قائمة المستخدم"
              aria-expanded={userOpen}
            >
              <div className="avatar">{userInitial}</div>
              <div className="role-info">
                <div className="role-name">{user?.role  || 'مدير النظام'}</div>
                <div className="role-sub">{user?.name   || 'المستخدم'}</div>
              </div>
              <ChevronDown size={13} strokeWidth={2} className="role-chevron" />
            </button>

            {userOpen && (
              <div className="user-dropdown" role="menu">
                <div className="user-dropdown-head">
                  <div className="avatar user-dropdown-avatar">{userInitial}</div>
                  <div>
                    <div className="user-dropdown-name">{user?.name  || 'المستخدم'}</div>
                    <div className="user-dropdown-role">{user?.role  || 'مدير النظام'}</div>
                  </div>
                </div>
                <div className="user-dropdown-body">
                  <button className="user-dropdown-item" role="menuitem"
                    onClick={() => { navigate('/account'); setUserOpen(false) }}>
                    <User size={15} strokeWidth={1.7} /> إدارة الحساب
                  </button>
                  <button className="user-dropdown-item" role="menuitem"
                    onClick={() => { navigate('/roles'); setUserOpen(false) }}>
                    <ArrowLeftRight size={15} strokeWidth={1.7} /> تبديل الدور
                  </button>
                  <div className="user-dropdown-divider" />
                  <button className="user-dropdown-item user-dropdown-item--danger" role="menuitem"
                    onClick={() => { logout(); navigate('/login'); setUserOpen(false) }}>
                    <LogOut size={15} strokeWidth={1.7} /> تسجيل الخروج
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <SendNotificationModal open={composeOpen} onClose={() => setComposeOpen(false)} />
    </>
  )
}
