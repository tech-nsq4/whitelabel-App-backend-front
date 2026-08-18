import { useState } from 'react'
import InsuranceDetailsModal from './InsuranceDetailsModal'

const COMPANY_COLORS = [
  'linear-gradient(135deg, #0F6B5C, #0A4F44)',
  'linear-gradient(135deg, #2C6DAA, #1e4f7e)',
  'linear-gradient(135deg, #7C3AED, #5B21B6)',
  'linear-gradient(135deg, #C9A227, #a07d12)',
]

export default function InsuranceTable({ companies }) {
  const [detailsModal, setDetailsModal] = useState({ open: false, company: null })

  return (
    <>
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-head">
          <div className="panel-title">شركات التأمين المتعاقدة</div>
        </div>
        <table className="data">
          <thead>
            <tr>
              <th>الشركة</th>
              <th>المطالبات الفعالة</th>
              <th>معتمدة</th>
              <th>مرفوضة</th>
              <th>بانتظار</th>
              <th>القيمة الإجمالية</th>
              <th/>
            </tr>
          </thead>
          <tbody>
            {companies.map((co, idx) => {
              const approvalRate = Math.round((co.approved / co.active) * 100)
              const avatarBg = COMPANY_COLORS[idx % COMPANY_COLORS.length]
              return (
                <tr key={co.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: avatarBg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                        {co.name.charAt(0)}
                      </div>
                      <div>
                        <div className="td-name">{co.name}</div>
                        <div className="td-sub">{approvalRate}% نسبة القبول</div>
                      </div>
                    </div>
                  </td>
                  <td className="num" style={{ fontWeight: 600 }}>{co.active}</td>
                  <td>
                    <span className="num" style={{ fontWeight: 700, color: 'var(--ok)' }}>{co.approved}</span>
                  </td>
                  <td>
                    <span className="num" style={{ fontWeight: 700, color: 'var(--danger)' }}>{co.rejected}</span>
                  </td>
                  <td>
                    <span className="num" style={{ fontWeight: 700, color: 'var(--warn)' }}>{co.pending}</span>
                  </td>
                  <td>
                    <span className="num" style={{ fontWeight: 700 }}>{co.totalValue}</span>
                    <span style={{ fontSize: 11, color: 'var(--ink-45)', marginRight: 3 }}>ر.س</span>
                  </td>
                  <td>
                    <button
                      className="btn btn-q"
                      style={{ padding: '5px 14px', fontSize: 12 }}
                      onClick={() => setDetailsModal({ open: true, company: co })}
                    >
                      التفاصيل
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <InsuranceDetailsModal
        open={detailsModal.open}
        onClose={() => setDetailsModal({ open: false, company: null })}
        company={detailsModal.company}
      />
    </>
  )
}
