import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useToast } from '../../components/ui/Toast'
import { useLocations, useCreateLocation, useUpdateLocation, useDeleteLocation } from '../../hooks/queries/useLocations'
import { useCities } from '../../hooks/queries/useCities'
import { SkeletonList } from '../../components/ui/Skeleton'
import Modal from '../../components/ui/Modal'

const EMPTY = { ar: '', en: '', city_id: '', area_id: '' }

export default function Locations() {
  const { showToast } = useToast()
  const [areas, setAreas]         = useState([])
  const [saving, setSaving]       = useState(false)
  const [deleting, setDeleting]   = useState(null)
  const [modal, setModal]         = useState(null)
  const [form, setForm]           = useState(EMPTY)
  const [editId, setEditId]       = useState(null)

  const { data: locations = [], isLoading: loading } = useLocations()
  const { data: cities = [] }                        = useCities()
  const createLocation                               = useCreateLocation()
  const updateLocation                               = useUpdateLocation()
  const deleteLocation                               = useDeleteLocation()

  function handleCityChange(cityId) {
    const city = cities.find((c) => c.id === Number(cityId))
    setAreas(city?.areas || [])
    setForm((p) => ({ ...p, city_id: Number(cityId), area_id: city?.areas?.[0]?.id || '' }))
  }

  function openCreate() {
    const firstCity = cities[0]
    setAreas(firstCity?.areas || [])
    setForm({ ar: '', en: '', city_id: firstCity?.id || '', area_id: firstCity?.areas?.[0]?.id || '' })
    setEditId(null)
    setModal('create')
  }

  function openEdit(loc) {
    const city = cities.find((c) => c.id === loc.city_id)
    setAreas(city?.areas || [])
    setForm({ ar: loc.name.ar, en: loc.name.en, city_id: loc.city_id, area_id: loc.area_id })
    setEditId(loc.id)
    setModal('edit')
  }

  async function handleSave() {
    if (!form.ar.trim() || !form.en.trim()) return showToast('أدخل الاسم بالعربي والإنجليزي', 'error')
    setSaving(true)
    try {
      const payload = { name: { ar: form.ar, en: form.en }, city_id: form.city_id, area_id: form.area_id }
      if (modal === 'create') {
        await createLocation.mutateAsync(payload)
        showToast('تم إضافة الموقع')
      } else {
        await updateLocation.mutateAsync({ id: editId, data: payload })
        showToast('تم تحديث الموقع')
      }
      setModal(null)
    } catch { showToast('حدث خطأ', 'error') }
    finally { setSaving(false) }
  }

  async function handleDelete(id) {
    setDeleting(id)
    try {
      await deleteLocation.mutateAsync(id)
      showToast('تم حذف الموقع')
    } catch (err) {
      showToast(err.response?.data?.message || 'تعذر الحذف', 'error')
    } finally { setDeleting(null) }
  }

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <div className="page-head">
        <div>
          <h1>المواقع</h1>
          <div className="sub">{locations.length} موقع</div>
        </div>
        <button className="btn btn-p" onClick={openCreate}>
          <Plus size={15} /> موقع جديد
        </button>
      </div>

      {loading
        ? <SkeletonList rows={4} />
        : <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
            {locations.length === 0 && (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--ink-45)', fontSize: 13 }}>لا توجد مواقع</div>
            )}
            {locations.map((loc, i) => (
              <div key={loc.id} style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', gap: 12, borderBottom: i < locations.length - 1 ? '1px solid var(--line)' : 'none' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{loc.name.ar}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-45)' }}>{loc.name.en}</div>
                </div>
                <span className="chip mut" style={{ fontSize: 11 }}>{loc.city?.name?.ar}</span>
                <span className="chip mut" style={{ fontSize: 11 }}>{loc.area?.name?.ar}</span>
                <span className="chip ok" style={{ fontSize: 11 }}>{loc.clinics_count} عيادة</span>
                <button className="btn btn-q" style={{ padding: '6px 10px' }} onClick={() => openEdit(loc)}>
                  <Pencil size={13} />
                </button>
                <button
                  className="btn"
                  style={{ padding: '6px 10px', color: 'var(--danger)', background: 'rgba(179,64,47,.07)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                  onClick={() => handleDelete(loc.id)}
                  disabled={deleting === loc.id}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
      }

      <Modal open={modal !== null} onClose={() => setModal(null)} title={modal === 'create' ? 'موقع جديد' : 'تعديل الموقع'}>
        <div className="field-row">
          <div className="field">
            <label className="field-label">الاسم بالعربي</label>
            <input className="inp" value={form.ar} onChange={(e) => setForm((p) => ({ ...p, ar: e.target.value }))} placeholder="مثال: موقع المعادي الطبي" />
          </div>
          <div className="field">
            <label className="field-label">الاسم بالإنجليزي</label>
            <input className="inp" dir="ltr" value={form.en} onChange={(e) => setForm((p) => ({ ...p, en: e.target.value }))} placeholder="e.g. Maadi Medical Location" />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label className="field-label">المدينة</label>
            <select className="inp" value={form.city_id} onChange={(e) => handleCityChange(e.target.value)}>
              {cities.map((c) => <option key={c.id} value={c.id}>{c.name?.ar}</option>)}
            </select>
          </div>
          <div className="field">
            <label className="field-label">المنطقة</label>
            <select className="inp" value={form.area_id} onChange={(e) => setForm((p) => ({ ...p, area_id: Number(e.target.value) }))}>
              {areas.map((a) => <option key={a.id} value={a.id}>{a.name?.ar}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
          <button className="btn btn-q" onClick={() => setModal(null)}>إلغاء</button>
          <button className="btn btn-p" onClick={handleSave} disabled={saving}>{modal === 'create' ? 'إضافة' : 'حفظ'}</button>
        </div>
      </Modal>
    </div>
  )
}
