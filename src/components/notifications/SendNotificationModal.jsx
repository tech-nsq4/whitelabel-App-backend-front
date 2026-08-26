import { useState } from "react";
import Modal from "../ui/Modal";
import { useSendPushNotification } from "../../hooks/queries/usePushNotifications";
import { useToast } from "../ui/Toast";

export default function SendNotificationModal({ open, onClose }) {
  const { showToast } = useToast();
  const send = useSendPushNotification();

  const [form, setForm] = useState({
    titleAr: "",
    titleEn: "",
    descAr: "",
    descEn: "",
  });

  function set(key, val) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.titleAr.trim())
      return showToast("العنوان بالعربي مطلوب", "error");
    try {
      await send.mutateAsync({
        title: { ar: form.titleAr, en: form.titleEn || form.titleAr },
        description: { ar: form.descAr, en: form.descEn || form.descAr },
      });
      showToast("تم إرسال الإشعار بنجاح");
      setForm({ titleAr: "", titleEn: "", descAr: "", descEn: "" });
      onClose();
    } catch {
      showToast("تعذر إرسال الإشعار", "error");
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="إرسال إشعار جديد"
      subtitle="سيصل لجميع مستخدمي التطبيق فوراً"
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: "4px 2px",
        }}
      >
        <div className="field-row">
          <div className="field">
            <label className="field-label">العنوان (عربي) *</label>
            <input
              className="inp"
              value={form.titleAr}
              onChange={(e) => set("titleAr", e.target.value)}
              placeholder="مثال: عرض العيادة"
            />
          </div>
          <div className="field">
            <label className="field-label">العنوان (إنجليزي)</label>
            <input
              className="inp"
              value={form.titleEn}
              onChange={(e) => set("titleEn", e.target.value)}
              placeholder="Clinic Offer"
              dir="ltr"
            />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label className="field-label">الوصف (عربي)</label>
            <textarea
              className="inp"
              rows={3}
              value={form.descAr}
              onChange={(e) => set("descAr", e.target.value)}
              placeholder="تفاصيل الإشعار..."
              style={{ resize: "vertical" }}
            />
          </div>
          <div className="field">
            <label className="field-label">الوصف (إنجليزي)</label>
            <textarea
              className="inp"
              rows={3}
              value={form.descEn}
              onChange={(e) => set("descEn", e.target.value)}
              placeholder="Notification details..."
              dir="ltr"
              style={{ resize: "vertical" }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 4,
          }}
        >
          <button type="button" className="btn btn-q" onClick={onClose}>
            إلغاء
          </button>
          <button type="submit" className="btn btn-p" disabled={send.isPending}>
            {send.isPending ? "جارٍ الإرسال..." : "إرسال الإشعار"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
