import { useState } from 'react'
import { useToast } from '../../components/ui/Toast'
import '../Account/UserPages.css'

const roles = [
  { id: 'admin', title: 'مدير النظام', description: 'وصول كامل لإدارة الفروع والمستخدمين والإعدادات.', icon: 'إ' },
  { id: 'manager', title: 'مدير فرع', description: 'إدارة تشغيل الفرع والمواعيد والتقارير الخاصة به.', icon: 'ف' },
  { id: 'reception', title: 'موظف استقبال', description: 'إدارة المرضى والحجوزات والطابور اليومي.', icon: 'ا' },
]

export default function Roles() {
  const { showToast } = useToast()
  const [activeRole, setActiveRole] = useState('admin')

  return (
    <div className="user-page" style={{ animation: 'fadeIn .3s ease' }}>
      <div className="page-head">
        <div><h1>تبديل الدور</h1><div className="sub">اختر الصلاحية التي تريد استخدامها في هذه الجلسة</div></div>
        <button className="btn btn-p" onClick={() => showToast('تم تفعيل الدور المحدد')}>تفعيل الدور</button>
      </div>
      <section className="panel role-panel">
        <div className="panel-head"><div><div className="panel-title">الأدوار المتاحة</div><div className="panel-sub">يتم تحديد الصلاحيات وفق الدور النشط</div></div></div>
        <div className="panel-body role-grid">
          {roles.map((role) => (
            <button key={role.id} className={`role-card${activeRole === role.id ? ' active' : ''}`} onClick={() => setActiveRole(role.id)}>
              <span className="role-card-icon">{role.icon}</span>
              <span className="role-card-content"><strong>{role.title}</strong><small>{role.description}</small></span>
              {activeRole === role.id && <span className="role-card-check">✓</span>}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
