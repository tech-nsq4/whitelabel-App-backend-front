import { useState, useMemo } from 'react'
import QueueStats from './components/QueueStats'
import QueueFilters from './components/QueueFilters'
import QueueTable from './components/QueueTable'
import WalkInModal from './components/WalkInModal'
import { queueEntries } from './queue.data'
import { useToast } from '../../components/ui/Toast'
import './Queue.css'

export default function Queue() {
  const { showToast } = useToast()

  const [entries, setEntries]           = useState(queueEntries)
  const [activeClinic, setActiveClinic] = useState('all_clinics')
  const [activeBranch, setActiveBranch] = useState('all_branches')
  const [walkInOpen, setWalkInOpen]     = useState(false)

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const clinicMatch = activeClinic === 'all_clinics' || e.clinic === activeClinic
      const branchMatch = activeBranch === 'all_branches' || e.branch === activeBranch
      return clinicMatch && branchMatch
    })
  }, [entries, activeClinic, activeBranch])

  function handleCallPatient(id) {
    const entry = entries.find((e) => e.id === id)
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'called' } : e))
    )
    showToast(`نودي ${entry?.name}`)
  }

  function handleFinishExam(id) {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'done' } : e))
    )
    showToast('تم إنهاء الكشف')
  }

  function handleDefer(id) {
    showToast('تم التأجيل')
    // Move deferred patient to end of list
    setEntries((prev) => {
      const entry = prev.find((e) => e.id === id)
      const rest  = prev.filter((e) => e.id !== id)
      return [...rest, { ...entry, waitNote: null }]
    })
  }

  function handleWalkInSubmit(data) {
    const newEntry = {
      id:        Date.now(),
      initial:   data.name.charAt(0),
      name:      data.name,
      fileNo:    `ملف #${Math.floor(Math.random() * 10000 + 20000)}`,
      doctor:    data.doctor,
      clinic:    'internal',
      branch:    'olaya',
      arrivedAt: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      waitNote:  null,
      status:    'waiting',
    }
    setEntries((prev) => [...prev, newEntry])
    showToast(`تم تسجيل حضور ${data.name}`)
    setWalkInOpen(false)
  }

  return (
    <div className="queue-page" style={{ animation: 'fadeIn .3s ease' }}>
      {/* Page header */}
      <div className="page-head">
        <div>
          <h1>طابور اليوم</h1>
          <div className="sub">18 مريضاً في الانتظار · متوسط الانتظار 12 دقيقة</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-q" onClick={() => showToast('جارٍ تصدير الطابور...')}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path d="M12 15V4M12 15l-4-4M12 15l4-4"/>
              <path d="M4 17v2.5A1.5 1.5 0 005.5 21h13a1.5 1.5 0 001.5-1.5V17"/>
            </svg>
            تصدير الطابور
          </button>
          <button className="btn btn-p" onClick={() => setWalkInOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path d="M12 5.5v13M5.5 12h13"/>
            </svg>
            تسجيل حضور
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <QueueStats />

      {/* Filters */}
      <QueueFilters
        activeClinic={activeClinic}
        activeBranch={activeBranch}
        onClinicChange={setActiveClinic}
        onBranchChange={setActiveBranch}
      />

      {/* Queue table */}
      <QueueTable
        entries={filtered}
        onCallPatient={handleCallPatient}
        onFinishExam={handleFinishExam}
        onDefer={handleDefer}
      />

      {/* Walk-in modal */}
      <WalkInModal
        open={walkInOpen}
        onClose={() => setWalkInOpen(false)}
        onSubmit={handleWalkInSubmit}
      />
    </div>
  )
}
