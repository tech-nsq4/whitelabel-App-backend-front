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

const EMPTY_SUB = { ar: "", en: "", descAr: "", descEn: "" };

export default function ClinicEditModal({ open, onClose, specialty, onSave }) {
  const { showToast } = useToast();
  const [tab, setTab] = useState("info");
  const [form, setForm] = useState({ nameAr: "", nameEn: "" });
  const [saving, setSaving] = useState(false);

  const [subs, setSubs] = useState([]);
  const [subModal, setSubModal] = useState(null);
  const [subForm, setSubForm] = useState(EMPTY_SUB);
  const [subEditId, setSubEditId] = useState(null);
  const [subSaving, setSubSaving] = useState(false);
  const [subDeleting, setSubDeleting] = useState(null);

  useEffect(() => {
    if (specialty) {
      setForm({
        nameAr: specialty.title?.ar || specialty.nameAr || "",
        nameEn: specialty.title?.en || specialty.nameEn || "",
      });
      loadSubs();
    }
  }, [specialty]);

  function loadSubs() {
    if (!specialty?.id) return;
    getSubSpecializationsApi(specialty.id)
      .then(({ data }) => setSubs(data.data || []))
      .catch(() => {});
  }

  if (!specialty) return null;

  async function handleSaveInfo() {
    setSaving(true);
    try {
      await updateSpecializationApi(specialty.id, {
        title: { ar: form.nameAr, en: form.nameEn },
      });
      showToast("تم حفظ التغييرات");
      onSave && onSave();
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
    setSubModal("create");
  }
  function openSubEdit(sub) {
    setSubForm({
      ar: sub.title?.ar || "",
      en: sub.title?.en || "",
      descAr: sub.description?.ar || "",
      descEn: sub.description?.en || "",
    });
    setSubEditId(sub.id);
    setSubModal("edit");
  }
  async function handleSubSave() {
    if (!subForm.ar.trim() || !subForm.en.trim())
      return showToast("أدخل الاسم بالعربي والإنجليزي", "error");
    setSubSaving(true);
    try {
      if (subModal === "create") {
        await createSubSpecializationApi({
          specialization_id: specialty.id,
          title: { ar: subForm.ar, en: subForm.en },
          description: { ar: subForm.descAr || subForm.ar, en: subForm.descEn || subForm.en },
        });
        showToast("تم إضافة التخصص الفرعي");
      } else {
        await updateSubSpecializationApi(subEditId, {
          specialization_id: specialty.id,
          title: { ar: subForm.ar, en: subForm.en },
          description: { ar: subForm.descAr || subForm.ar, en: subForm.descEn || subForm.en },
        });
        showToast("تم تحديث التخصص الفرعي");
      }
      setSubModal(null);
      loadSubs();
      onSave && onSave();
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
      onSave && onSave();
    } catch (err) {
      showToast(err.response?.data?.message || "تعذر الحذف", "error");
    } finally {
      setSubDeleting(null);
    }
  }

  const TAB_STYLE = (active) => ({
    padding: "7px 16px",
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    borderRadius: "var(--radius-md)",
    border: "none",
    cursor: "pointer",
    background: active ? "var(--brand)" : "transparent",
    color: active ? "#fff" : "var(--ink-45)",
  });

  return (
    <>
      <Modal
        open={open && !subModal}
        onClose={onClose}
        title="تعديل التخصص"
        subtitle={`${form.nameAr} — ${form.nameEn}`}
      >
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 20,
            background: "var(--paper)",
            borderRadius: "var(--radius-md)",
            padding: 4,
          }}
        >
          <button
            style={TAB_STYLE(tab === "info")}
            onClick={() => setTab("info")}
          >
            المعلومات
          </button>
          <button
            style={TAB_STYLE(tab === "subs")}
            onClick={() => setTab("subs")}
          >
            التخصصات الفرعية
            {subs.length > 0 && (
              <span
                style={{
                  marginRight: 6,
                  background: "rgba(255,255,255,.25)",
                  borderRadius: 10,
                  padding: "1px 7px",
                  fontSize: 11,
                }}
              >
                {subs.length}
              </span>
            )}
          </button>
        </div>

        {tab === "info" && (
          <>
            <div className="field-row">
              <div className="field">
                <label className="field-label">اسم التخصص (عربي)</label>
                <input
                  className="inp"
                  value={form.nameAr}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, nameAr: e.target.value }))
                  }
                />
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
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "flex-end",
                marginTop: 6,
              }}
            >
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
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 12,
              }}
            >
              <button
                className="btn btn-p"
                style={{ padding: "7px 14px" }}
                onClick={openSubCreate}
              >
                <Plus size={14} /> إضافة تخصص فرعي
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {subs.length === 0 && (
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--ink-45)",
                    textAlign: "center",
                    padding: "20px 0",
                  }}
                >
                  لا توجد تخصصات فرعية
                </div>
              )}
              {subs.map((sub) => (
                <div
                  key={sub.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 0",
                    borderBottom: "1px dashed var(--line)",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {sub.title?.ar}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--ink-45)" }}>
                      {sub.title?.en}
                    </div>
                  </div>
                  <button
                    className="btn btn-q"
                    style={{ padding: "5px 9px" }}
                    onClick={() => openSubEdit(sub)}
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    className="btn"
                    style={{
                      padding: "5px 9px",
                      color: "var(--danger)",
                      background: "rgba(179,64,47,.07)",
                      border: "none",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSubDelete(sub.id)}
                    disabled={subDeleting === sub.id}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 16,
              }}
            >
              <button className="btn btn-q" onClick={onClose}>
                إغلاق
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* Sub Specialization Modal */}
      <Modal
        open={!!subModal}
        onClose={() => setSubModal(null)}
        title={subModal === "create" ? "تخصص فرعي جديد" : "تعديل التخصص الفرعي"}
      >
        <div className="field">
          <label className="field-label">الاسم بالعربي</label>
          <input
            className="inp"
            value={subForm.ar}
            onChange={(e) => setSubForm((p) => ({ ...p, ar: e.target.value }))}
            placeholder="مثال: جراحة العمود الفقري"
          />
        </div>
        <div className="field">
          <label className="field-label">الاسم بالإنجليزي</label>
          <input
            className="inp"
            dir="ltr"
            value={subForm.en}
            onChange={(e) => setSubForm((p) => ({ ...p, en: e.target.value }))}
            placeholder="e.g. Spinal Surgery"
          />
        </div>
        <div className="field">
          <label className="field-label">الوصف بالعربي</label>
          <input
            className="inp"
            value={subForm.descAr}
            onChange={(e) => setSubForm((p) => ({ ...p, descAr: e.target.value }))}
            placeholder="وصف مختصر للتخصص"
          />
        </div>
        <div className="field">
          <label className="field-label">الوصف بالإنجليزي</label>
          <input
            className="inp"
            dir="ltr"
            value={subForm.descEn}
            onChange={(e) => setSubForm((p) => ({ ...p, descEn: e.target.value }))}
            placeholder="Brief description"
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            marginTop: 6,
          }}
        >
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
