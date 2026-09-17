import { useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal";
import { useValidation } from "../../../hooks/useValidation";
import PhoneInput, { normalizeSaudiPhone } from "../../../components/ui/PhoneInput";

export default function BranchEditModal({ branch, onClose, onSave }) {
  const [form, setForm] = useState(branch);
  const { errors, validate, clearError, resetErrors } = useValidation();
  useEffect(() => {
    if (!branch) { setForm(branch); return; }
    setForm({
      ...branch,
      name: branch.name?.ar || branch.name || '',
      address: branch.address?.ar || branch.address || '',
      phone: normalizeSaudiPhone(branch.phone || ''),
    });
  }, [branch]);
  if (!branch || !form) return null;
  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    clearError(field);
  };
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
          className={`inp${errors.name ? ' inp--error' : ''}`}
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
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
        <PhoneInput id="branch-phone" value={form.phone || ''} onChange={v => update("phone", v)} />
      </div>
      <div className="branch-modal-actions">
        <button className="btn btn-q" onClick={onClose}>
          إلغاء
        </button>
        <button className="btn btn-p" onClick={() => {
          const ok = validate(form, { name: 'اسم الفرع مطلوب' });
          if (!ok) return;
          resetErrors();
          onSave(form);
        }}>
          حفظ التغييرات
        </button>
      </div>
    </Modal>
  );
}
