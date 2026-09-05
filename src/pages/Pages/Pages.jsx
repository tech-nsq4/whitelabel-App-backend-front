import { useState } from "react";
import { Pencil, FileText } from "lucide-react";
import { usePages, useUpdatePage } from "../../hooks/queries/usePages";
import { useToast } from "../../components/ui/Toast";
import Modal from "../../components/ui/Modal";

export default function Pages() {
  const { data: pages = [], isLoading } = usePages();
  const { mutate: updatePage, isPending } = useUpdatePage();
  const { showToast } = useToast();

  const [modal, setModal] = useState(null); // { page }
  const [form, setForm] = useState({
    title_ar: "",
    title_en: "",
    desc_ar: "",
    desc_en: "",
  });

  function openEdit(page) {
    setForm({
      title_ar: page.title?.ar || "",
      title_en: page.title?.en || "",
      desc_ar: page.description?.ar || "",
      desc_en: page.description?.en || "",
    });
    setModal({ page });
  }

  function handleSave() {
    updatePage(
      {
        id: modal.page.id,
        data: {
          title: { ar: form.title_ar, en: form.title_en },
          description: { ar: form.desc_ar, en: form.desc_en },
        },
      },
      {
        onSuccess: () => {
          showToast("تم حفظ الصفحة بنجاح", "success");
          setModal(null);
        },
        onError: (err) => {
          showToast(err?.response?.data?.message || "حدث خطأ", "error");
        },
      },
    );
  }

  return (
    <div className="page-fade">
      <div className="page-head">
        <div>
          <h1>الصفحات</h1>
          <div className="sub">{pages.length} صفحة</div>
        </div>
      </div>

      <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
        {isLoading &&
          [1, 2].map((n) => (
            <div
              key={n}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "18px 20px",
                gap: 12,
                borderBottom: "1px solid var(--line)",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "var(--line)",
                  animation: "pulse 1.2s ease infinite",
                }}
              />
              <div
                style={{
                  width: 160,
                  height: 14,
                  borderRadius: 6,
                  background: "var(--line)",
                  animation: "pulse 1.2s ease infinite",
                }}
              />
            </div>
          ))}

        {!isLoading &&
          pages.map((page, i) => (
            <div
              key={page.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "16px 20px",
                gap: 14,
                borderBottom:
                  i < pages.length - 1 ? "1px solid var(--line)" : "none",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(var(--brand-rgb),.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--brand)",
                  flexShrink: 0,
                }}
              >
                <FileText size={16} strokeWidth={1.8} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {page.title?.ar}
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-45)" }}>
                  {page.title?.en}
                </div>
              </div>

              <span
                className="chip"
                style={{
                  fontSize: 11,
                  background: "var(--line)",
                  color: "var(--ink-65)",
                }}
              >
                {page.slug}
              </span>

              <button
                className="btn btn-q"
                style={{ padding: "7px 12px", gap: 6 }}
                onClick={() => openEdit(page)}
              >
                <Pencil size={13} /> تعديل
              </button>
            </div>
          ))}

        {!isLoading && pages.length === 0 && (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "var(--ink-45)",
              fontSize: 14,
            }}
          >
            لا توجد صفحات
          </div>
        )}
      </div>

      {modal && (
        <Modal
          title={`تعديل: ${modal.page.title?.ar}`}
          onClose={() => setModal(null)}
          size="lg"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div className="field">
                <label className="field-label">العنوان بالعربي</label>
                <input
                  className="inp"
                  value={form.title_ar}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title_ar: e.target.value }))
                  }
                />
              </div>
              <div className="field">
                <label className="field-label">العنوان بالإنجليزي</label>
                <input
                  className="inp"
                  dir="ltr"
                  value={form.title_en}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title_en: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="field">
              <label className="field-label">المحتوى بالعربي</label>
              <textarea
                className="inp"
                rows={6}
                value={form.desc_ar}
                onChange={(e) =>
                  setForm((p) => ({ ...p, desc_ar: e.target.value }))
                }
                style={{ resize: "vertical" }}
              />
            </div>

            <div className="field">
              <label className="field-label">المحتوى بالإنجليزي</label>
              <textarea
                className="inp"
                rows={6}
                dir="ltr"
                value={form.desc_en}
                onChange={(e) =>
                  setForm((p) => ({ ...p, desc_en: e.target.value }))
                }
                style={{ resize: "vertical" }}
              />
            </div>

            <div
              style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
            >
              <button className="btn btn-q" onClick={() => setModal(null)}>
                إلغاء
              </button>
              <button
                className="btn btn-p"
                onClick={handleSave}
                disabled={isPending}
              >
                {isPending ? "جاري الحفظ..." : "حفظ"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
