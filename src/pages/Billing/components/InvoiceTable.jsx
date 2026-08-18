import { useState, useRef, useEffect } from 'react'
import { useToast } from '../../../components/ui/Toast'
import { STATUS_CONFIG } from '../billing.data'
import InvoiceDetailsModal from './InvoiceDetailsModal'

const S = { stroke: 'currentColor', fill: 'none', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' }

const FILE_ICON  = <svg width="13" height="13" viewBox="0 0 24 24" {...S}><path d="M13.5 3H6.5A1.5 1.5 0 005 4.5v15A1.5 1.5 0 006.5 21h11a1.5 1.5 0 001.5-1.5V8.5z"/><path d="M13.5 3v5.5H19"/></svg>
const MORE_ICON  = <svg width="14" height="14" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></svg>

const METHOD_COLORS = {
  'نقدي':      { bg: 'rgba(15,107,92,0.08)',  color: 'var(--ok)'   },
  'مدى':       { bg: 'rgba(44,109,170,0.1)',  color: 'var(--info)' },
  'Apple Pay': { bg: 'rgba(10,31,27,0.07)',   color: 'var(--ink)'  },
  'تأمين':     { bg: 'rgba(169,118,18,0.1)',  color: 'var(--warn)' },
}

function RowMenu({ inv, onView }) {
  const [open, setOpen] = useState(false)
  const [pos,  setPos]  = useState({ top: 0, left: 0 })
  const btnRef  = useRef(null)
  const menuRef = useRef(null)
  const { showToast } = useToast()

  useEffect(() => {
    if (!open) return
    const h = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          btnRef.current  && !btnRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  function handleOpen() {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + 4, left: r.left })
    }
    setOpen(v => !v)
  }

  const items = [
    { label: 'عرض الفاتورة',  action: () => { onView();                          setOpen(false) } },
    { label: 'طباعة',          action: () => { showToast('جارٍ الطباعة...');       setOpen(false) } },
    { label: 'إرسال للمريض',  action: () => { showToast('تم الإرسال');            setOpen(false) } },
    { label: 'استرجاع',        action: () => { showToast('تم طلب الاسترجاع');      setOpen(false) }, danger: true },
  ]

  return (
    <>
      <button ref={btnRef} className="icon-btn" style={{ width: 32, height: 32 }} onClick={handleOpen} aria-label="المزيد">
        {MORE_ICON}
      </button>
      {open && (
        <div ref={menuRef} style={{
          position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999,
          background: 'var(--card)', border: '1px solid var(--line)',
          borderRadius: 10, boxShadow: '0 8px 24px rgba(10,31,27,0.12)',
          minWidth: 155, overflow: 'hidden',
        }}>
          {items.map((item) => (
            <button key={item.label} onClick={item.action}
              style={{ width: '100%', textAlign: 'right', padding: '10px 14px', fontSize: 12.5, background: 'none', border: 'none', cursor: 'pointer', color: item.danger ? 'var(--danger)' : 'var(--ink)', display: 'block' }}
              onMouseEnter={e => e.currentTarget.style.background = item.danger ? 'rgba(179,64,47,0.06)' : 'var(--paper)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </>
  )
}

export default function InvoiceTable({ invoices }) {
  const { showToast } = useToast()
  const [detailsModal, setDetailsModal] = useState({ open: false, invoice: null })

  return (
    <>
      <div className="panel">
        <table className="data">
          <thead>
            <tr>
              <th>#</th>
              <th>المريض</th>
              <th>الخدمة</th>
              <th>الطبيب</th>
              <th>التاريخ</th>
              <th>المبلغ</th>
              <th>الطريقة</th>
              <th>الحالة</th>
              <th/>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => {
              const st     = STATUS_CONFIG[inv.status]
              const method = METHOD_COLORS[inv.method] || { bg: 'var(--paper)', color: 'var(--ink-70)' }
              return (
                <tr key={inv.id}>
                  <td>
                    <span className="num" style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand)' }}>{inv.number}</span>
                  </td>
                  <td>
                    <div className="td-name">{inv.patient}</div>
                  </td>
                  <td style={{ fontSize: 12.5, color: 'var(--ink-70)' }}>{inv.service}</td>
                  <td style={{ fontSize: 12.5, color: 'var(--ink-70)' }}>{inv.doctor}</td>
                  <td className="num" style={{ fontSize: 12.5 }}>{inv.date}</td>
                  <td>
                    <span className="num" style={{ fontWeight: 700, fontSize: 13 }}>{inv.amount}</span>
                    <span style={{ color: 'var(--ink-45)', fontSize: 11, marginRight: 3 }}>ر.س</span>
                  </td>
                  <td>
                    <span style={{ fontSize: 11.5, fontWeight: 600, padding: '3px 9px', borderRadius: 99, background: method.bg, color: method.color }}>
                      {inv.method}
                    </span>
                  </td>
                  <td>
                    <span className={`chip ${st.cls}`}>{st.label}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                      <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => setDetailsModal({ open: true, invoice: inv })} aria-label="عرض">
                        {FILE_ICON}
                      </button>
                      <RowMenu inv={inv} onView={() => setDetailsModal({ open: true, invoice: inv })} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <InvoiceDetailsModal
        open={detailsModal.open}
        onClose={() => setDetailsModal({ open: false, invoice: null })}
        invoice={detailsModal.invoice}
      />
    </>
  )
}
