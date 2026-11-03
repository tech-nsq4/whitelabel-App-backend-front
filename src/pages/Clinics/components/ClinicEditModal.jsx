import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import { updateSpecializationApi } from "../../../api/specializations.api";
import {
  getSubSpecializationsApi,
  createSubSpecializationApi,
  updateSubSpecializationApi,
  deleteSubSpecializationApi,
} from "../../../api/sub-specializations.api";
import { useToast } from "../../../components/ui/Toast";
import { useValidation } from "../../../hooks/useValidation";
import "../styles/ClinicModals.css";

const EMPTY_SUB = { ar: "", en: "", descAr: "", descEn: "", online: false };

export default function ClinicEditModal({ open, onClose, specialty, onSave }) {
  const { showToast } = useToast();
  const [tab, setTab] = useState("info");
  const [form, setForm] = useState({ nameAr: "", nameEn: "", online: false });
  const [saving, setSaving] = useState(false);
  const [subs, setSubs] = useState([]);
  const [subModal, setSubModal] = useState(null);
  const [subForm, setSubForm] = useState(EMPTY_SUB);
  const [subEditId, setSubEditId] = useState(null);
  const [subSaving, setSubSaving] = useState(false);
  const [subDeleting, setSubDeleting] = useState(null);
  const { errors: infoErrors, validate: validateInfo, clearError: clearInfoError } = useValidation();
  const { errors: subErrors, validate: validateSub, clearError: clearSubError, resetErrors: resetSubErrors } = useValidation();

  useEffect(() => {
    if (open && specialty) {
      setForm({
        nameAr: specialty.title?.ar || specialty.nameAr || "",
        nameEn: specialty.title?.en || specialty.nameEn || "",
        online: specialty.online ?? false,
      });
      loadSubs();
    }
  }, [open, specialty]);

  function loadSubs() {
    if (!specialty?.id) return;
    getSubSpecializationsApi(specialty.id)
      .then(({ data }) => setSubs(data.data || []))
      .catch(() => {});
  }

  if (!specialty) return null;

  async function handleSaveInfo() {
    const ok = validateInfo(form, { nameAr: 'اسم التخصص (عربي) مطلوب' });
    if (!ok) return;
    setSaving(true);
    try {
      await updateSpecializationApi(specialty.id, {
        title: { ar: form.nameAr, en: form.nameEn },
        online: form.online,
      });
      showToast("تم حفظ التغييرات");
      onSave?.({ online: form.online, title: { ar: form.nameAr, en: form.nameEn } });
      onClose();
    } catch {
      showToast("تعذر حفظ التغييرات", "error");
    } finally {
      setSaving(false);
    }
  }

  function openSubCreate() {
    setSubForm(EMPTY_SUB);
    setSubEditId(null);
    resetSubErrors();
    setSubModal("create");
  }
  function openSubEdit(sub) {
    setSubForm({
      ar: sub.title?.ar || "",
      en: sub.title?.en || "",
      descAr: sub.description?.ar || "",
      descEn: sub.description?.en || "",
      online: sub.online ?? false,
    });
    setSubEditId(sub.id);
    resetSubErrors();
    setSubModal("edit");
  }

  async function handleSubSave() {
    const ok = validateSub(subForm, { ar: 'الاسم بالعربي مطلوب', en: 'الاسم بالإنجليزي مطلوب' });
    if (!ok) return;
    setSubSaving(true);
    try {
      const payload = {
        specialization_id: specialty.id,
        title: { ar: subForm.ar, en: subForm.en },
        description: {
          ar: subForm.descAr || subForm.ar,
          en: subForm.descEn || subForm.en,
        },
        online: subForm.online,
      };
      if (subModal === "create") {
        await createSubSpecializationApi(payload);
        showToast("تم إضافة التخصص الفرعي");
      } else {
        await updateSubSpecializationApi(subEditId, payload);
        showToast("تم تحديث التخصص الفرعي");
      }
      setSubModal(null);
      loadSubs();
      onSave?.();
    } catch {
      showToast("حدث خطأ", "error");
    } finally {
      setSubSaving(false);
    }
  }

  async function handleSubDelete(id) {
    setSubDeleting(id);
    try {
      await deleteSubSpecializationApi(id);
      showToast("تم حذف التخصص الفرعي");
      setSubs((prev) => prev.filter((s) => s.id !== id));
      onSave?.();
    } catch (err) {
      const msg = err.response?.data?.message || ''
      const arabicMsg = msg.toLowerCase().includes('doctors')
        ? 'لا يمكن الحذف لأن هناك أطباء مرتبطون بهذا التخصص'
        : msg.toLowerCase().includes('appointments')
        ? 'لا يمكن الحذف لأن هناك مواعيد مرتبطة بهذا التخصص'
        : 'تعذر حذف التخصص الفرعي'
      showToast(arabicMsg, "error");
    } finally {
      setSubDeleting(null);
    }
  }

  return (
    <>
      <Modal
        open={open && !subModal}
        onClose={onClose}
        title="تعديل التخصص"
        subtitle={`${form.nameAr} — ${form.nameEn}`}
      >
        {/* Tabs */}
        <div className="cm-tabs">
          <button
            className={`cm-tab${tab === "info" ? " active" : ""}`}
            onClick={() => setTab("info")}
          >
            المعلومات
          </button>
          <button
            className={`cm-tab${tab === "subs" ? " active" : ""}`}
            onClick={() => setTab("subs")}
          >
            التخصصات الفرعية
            {subs.length > 0 && (
              <span className="cm-tab-badge">{subs.length}</span>
            )}
          </button>
        </div>

        {tab === "info" && (
          <>
            <div className="field-row">
              <div className="field">
                <label className="field-label">اسم التخصص (عربي)</label>
                <input
                  className={`inp${infoErrors.nameAr ? ' inp--error' : ''}`}
                  value={form.nameAr}
                  onChange={(e) => { setForm((p) => ({ ...p, nameAr: e.target.value })); clearInfoError('nameAr'); }}
                />
                {infoErrors.nameAr && <span className="field-error">{infoErrors.nameAr}</span>}
              </div>
              <div className="field">
                <label className="field-label">اسم التخصص (إنجليزي)</label>
                <input
                  className="inp"
                  dir="ltr"
                  value={form.nameEn}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, nameEn: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="field">
              <label className="field-label" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
                <div
                  role="switch"
                  aria-checked={form.online}
                  onClick={() => setForm((p) => ({ ...p, online: !p.online }))}
                  style={{
                    width: 42,
                    height: 24,
                    borderRadius: 12,
                    background: form.online ? "var(--primary, #0F6B5C)" : "#d1d5db",
                    position: "relative",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 3,
                      left: form.online ? 21 : 3,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#fff",
                      transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
                يقبل حجوزات أونلاين
              </label>
            </div>
            <div className="cm-footer">
              <button className="btn btn-q" onClick={onClose}>
                إلغاء
              </button>
              <button
                className="btn btn-p"
                onClick={handleSaveInfo}
                disabled={saving}
              >
                حفظ التغييرات
              </button>
            </div>
          </>
        )}

        {tab === "subs" && (
          <>
            <div className="cm-subs-header">
              <button
                className="btn btn-p cm-add-sub-btn"
                onClick={openSubCreate}
              >
                <Plus size={14} /> إضافة تخصص فرعي
              </button>
            </div>
            <div className="cm-sub-list">
              {subs.length === 0 && (
                <div className="cm-sub-empty">لا توجد تخصصات فرعية</div>
              )}
              {subs.map((sub) => (
                <div key={sub.id} className="cm-sub-row">
                  <div className="cm-sub-names">
                    <div className="cm-sub-name-ar">
                      {sub.title?.ar}
                      {sub.online && (
                        <span style={{ marginRight: 6, fontSize: 11, color: "#0F6B5C", fontWeight: 600 }}>• أونلاين</span>
                      )}
                    </div>
                    <div className="cm-sub-name-en">{sub.title?.en}</div>
                  </div>
                  <button
                    className="btn btn-q cm-sub-edit-btn"
                    onClick={() => openSubEdit(sub)}
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    className="btn cm-sub-delete-btn"
                    onClick={() => handleSubDelete(sub.id)}
                    disabled={subDeleting === sub.id}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
            <div className="cm-footer-end">
              <button className="btn btn-q" onClick={onClose}>
                إغلاق
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* Sub Modal */}
      <Modal
        open={!!subModal}
        onClose={() => setSubModal(null)}
        title={subModal === "create" ? "تخصص فرعي جديد" : "تعديل التخصص الفرعي"}
      >
        <div className="field">
          <label className="field-label">الاسم بالعربي</label>
          <input
            className={`inp${subErrors.ar ? ' inp--error' : ''}`}
            value={subForm.ar}
            onChange={(e) => { setSubForm((p) => ({ ...p, ar: e.target.value })); clearSubError('ar'); }}
            placeholder="مثال: جراحة العمود الفقري"
          />
          {subErrors.ar && <span className="field-error">{subErrors.ar}</span>}
        </div>
        <div className="field">
          <label className="field-label">الاسم بالإنجليزي</label>
          <input
            className={`inp${subErrors.en ? ' inp--error' : ''}`}
            dir="ltr"
            value={subForm.en}
            onChange={(e) => { setSubForm((p) => ({ ...p, en: e.target.value })); clearSubError('en'); }}
            placeholder="e.g. Spinal Surgery"
          />
          {subErrors.en && <span className="field-error">{subErrors.en}</span>}
        </div>
        <div className="field">
          <label className="field-label">الوصف بالعربي</label>
          <input
            className="inp"
            value={subForm.descAr}
            onChange={(e) =>
              setSubForm((p) => ({ ...p, descAr: e.target.value }))
            }
            placeholder="وصف مختصر للتخصص"
          />
        </div>
        <div className="field">
          <label className="field-label">الوصف بالإنجليزي</label>
          <input
            className="inp"
            dir="ltr"
            value={subForm.descEn}
            onChange={(e) =>
              setSubForm((p) => ({ ...p, descEn: e.target.value }))
            }
            placeholder="Brief description"
          />
        </div>
        <div className="field">
          <label className="field-label" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
            <div
              role="switch"
              aria-checked={subForm.online}
              onClick={() => setSubForm((p) => ({ ...p, online: !p.online }))}
              style={{
                width: 42, height: 24, borderRadius: 12,
                background: subForm.online ? "var(--primary, #0F6B5C)" : "#d1d5db",
                position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0,
              }}
            >
              <span style={{
                position: "absolute", top: 3,
                left: subForm.online ? 21 : 3,
                width: 18, height: 18, borderRadius: "50%",
                background: "#fff", transition: "left 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }} />
            </div>
            يقبل حجوزات أونلاين
          </label>
        </div>
        <div className="cm-footer">
          <button className="btn btn-q" onClick={() => setSubModal(null)}>
            إلغاء
          </button>
          <button
            className="btn btn-p"
            onClick={handleSubSave}
            disabled={subSaving}
          >
            {subModal === "create" ? "إضافة" : "حفظ"}
          </button>
        </div>
      </Modal>
    </>
  );
}
