import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAppointments } from '../../../hooks/queries/useAppointments'

const STATUS_MAP = {
  confirmed:   { cls: 'ok',     label: 'مؤكد' },
  pending:     { cls: 'warn',   label: 'في الانتظار' },
  arrived:     { cls: 'info',   label: 'وصل' },
  cancelled:   { cls: 'danger', label: 'ملغي' },
  completed:   { cls: 'ok',     label: 'مكتمل' },
  in_progress: { cls: 'info',   label: 'في الكشف' },
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  }).format(d)
}

export default function RecentAppointments() {
  const navigate = useNavigate()
  const { data, isLoading } = useAppointments({ per_page: 6, sort: '-created_at' })

  const appointments = Array.isArray(data) ? data : (data?.data ?? [])

  return (
    <div className="panel dashboard-panel dashboard-table-panel">
      <div className="panel-head">
        <div>
          <div className="panel-title">آخر المواعيد</div>
          <div className="panel-sub">آخر 6 مواعيد من كل الفروع</div>
        </div>
        <button className="btn btn-g" onClick={() => navigate('/calendar')}>
          عرض الكل
          <ArrowLeft size={13} strokeWidth={2} />
        </button>
      </div>
      <div className="dashboard-table-scroll">
        <table className="data">
          <thead>
            <tr>
              <th>المريض</th>
              <th>الطبيب</th>
              <th>الفرع</th>
              <th>الموعد</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--ink-45)', padding: '24px' }}>جاري التحميل...</td></tr>
            )}
            {!isLoading && appointments.map((appt) => {
              const patientName = appt.family_member?.name || appt.user?.name || '—'
              const initial     = patientName !== '—' ? patientName.charAt(0) : '؟'
              const doctorName  = appt.doctor?.name?.ar || '—'
              const specialty   = appt.doctor?.specializations?.[0]?.title?.ar || '—'
              const branch      = appt.doctor?.clinic?.name?.ar || '—'
              const time        = formatDateTime(appt.date || appt.appointment_date || appt.created_at)
              const st          = STATUS_MAP[appt.status] || { cls: 'info', label: appt.status || '—' }

              return (
                <tr key={appt.id}>
                  <td>
                    <div className="td-lead">
                      <div className="avatar">{initial}</div>
                      <div>
                        <div className="td-name">{patientName}</div>
                        <div className="td-sub num">رقم #{appt.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="td-name">{doctorName}</div>
                    <div className="td-sub">{specialty}</div>
                  </td>
                  <td style={{ color: 'var(--ink-70)', fontSize: '12px' }}>{branch}</td>
                  <td className="num" style={{ fontSize: '11.5px' }}>{time}</td>
                  <td><span className={`chip ${st.cls}`}>{st.label}</span></td>
                </tr>
              )
            })}
            {!isLoading && appointments.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--ink-45)', padding: '24px' }}>لا توجد مواعيد</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
