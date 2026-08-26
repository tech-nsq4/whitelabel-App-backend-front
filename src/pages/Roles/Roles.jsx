import { useState } from 'react'
import { useToast } from '../../components/ui/Toast'
import { useAuth } from '../../context/AuthContext'
import '../Account/UserPages.css'

const ROLE_TRANSLATIONS = {
  'super-admin':  { name: 'مدير النظام',   description: 'وصول كامل للوحة الإدارة' },
  'branch-manager': { name: 'مدير فرع',    description: 'إدارة تشغيل الفرع والمواعيد والتقارير' },
  'receptionist': { name: 'موظف استقبال', description: 'إدارة المرضى والحجوزات والطابور اليومي' },
}

export default function Roles() {
  const { showToast } = useToast()
  const { user } = useAuth()
  const roles = user?.roles ?? []
  const [activeRole, setActiveRole] = useState(roles[0]?.id ?? null)

  function getInitial(name) {
    return name?.trim().charAt(0) ?? '؟'
  }

  function getRoleDisplay(role) {
    const t = ROLE_TRANSLATIONS[role.slug]
    return {
      name: t?.name ?? role.name,
      description: t?.description ?? role.description ?? role.slug,
    }
  }

  return (
    <div className="user-page" style={{ animation: 'fadeIn .3s ease' }}>
      <div className="page-head">
        <div>
          <h1>تبديل الدور</h1>
          <div className="sub">اختر الصلاحية التي تريد استخدامها في هذه الجلسة</div>
        </div>
        <button className="btn btn-p" onClick={() => showToast('تم تفعيل الدور المحدد')}>تفعيل الدور</button>
      </div>
      <section className="panel role-panel">
        <div className="panel-head">
          <div>
            <div className="panel-title">الأدوار المتاحة</div>
            <div className="panel-sub">يتم تحديد الصلاحيات وفق الدور النشط</div>
          </div>
        </div>
        <div className="panel-body role-grid">
          {roles.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--ink-45)', fontSize: 13 }}>
              لا توجد أدوار مخصصة لهذا الحساب
            </div>
          ) : roles.map((role) => {
            const display = getRoleDisplay(role)
            return (
            <button
              key={role.id}
              className={`role-card${activeRole === role.id ? ' active' : ''}`}
              onClick={() => setActiveRole(role.id)}
            >
              <span className="role-card-icon">{getInitial(display.name)}</span>
              <span className="role-card-content">
                <strong>{display.name}</strong>
                <small>{display.description}</small>
              </span>
              {activeRole === role.id && <span className="role-card-check">✓</span>}
            </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
