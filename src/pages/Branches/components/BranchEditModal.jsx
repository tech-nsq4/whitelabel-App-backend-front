import { useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal";

export default function BranchEditModal({ branch, onClose, onSave }) {
  const [form, setForm] = useState(branch);
  useEffect(() => setForm(branch), [branch]);
  if (!branch || !form) return null;
  const update = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));
  return (
    <Modal
      open={Boolean(branch)}
      onClose={onClose}
      title="تعديل الفرع"
      subtitle="تحديث بيانات الفرع ومعلومات التواصل"
    >
      <div className="field">
        <label className="field-label" htmlFor="branch-name">
          اسم الفرع
        </label>
        <input
          id="branch-name"
          className="inp"
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
        />
      </div>
      <div className="field">
        <label className="field-label" htmlFor="branch-address">
          العنوان
        </label>
        <input
          id="branch-address"
          className="inp"
          value={form.address}
          onChange={(event) => update("address", event.target.value)}
        />
      </div>
      <div className="field">
        <label className="field-label" htmlFor="branch-phone">
          الهاتف
        </label>
        <input
          id="branch-phone"
          className="inp num"
          dir="ltr"
          value={form.phone}
          onChange={(event) => update("phone", event.target.value)}
        />
      </div>
      <div className="branch-modal-actions">
        <button className="btn btn-q" onClick={onClose}>
          إلغاء
        </button>
        <button className="btn btn-p" onClick={() => onSave(form)}>
          حفظ التغييرات
        </button>
      </div>
    </Modal>
  );
}
