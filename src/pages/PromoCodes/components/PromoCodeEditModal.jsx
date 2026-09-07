import { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import { useToast } from "../../../components/ui/Toast";
import { useUpdatePromoCode } from "../../../hooks/queries/usePromoCodes";
import PromoCodeForm, { buildPromoPayload, promoToForm } from "./PromoCodeForm";
import { useValidation } from "../../../hooks/useValidation";

export default function PromoCodeEditModal({ open, promo, onClose }) {
  const { showToast } = useToast();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const update = useUpdatePromoCode();
  const { errors, validate, clearError, resetErrors } = useValidation();

  useEffect(() => {
    if (promo) setForm(promoToForm(promo));
  }, [promo]);

  function set(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
    clearError(k);
  }

  async function handleSave() {
    const ok = validate(form, {
      code: 'كود الخصم مطلوب',
      discount_value: 'قيمة الخصم مطلوبة',
    });
    if (!ok) return;
    setSaving(true);
    try {
      await update.mutateAsync({ id: promo.id, data: buildPromoPayload(form) });
      showToast("تم حفظ التغييرات", "success");
      resetErrors();
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || "تعذر الحفظ", "error");
    } finally {
      setSaving(false);
    }
  }

  if (!promo) return null;

  return (
    <Modal open={open} onClose={() => { resetErrors(); onClose(); }} title="تعديل الكود" subtitle={promo.code}>
      <PromoCodeForm form={form} set={set} errors={errors} />
      <div className="modal-footer">
        <button className="btn btn-q" onClick={() => { resetErrors(); onClose(); }}>إلغاء</button>
        <button className="btn btn-p" onClick={handleSave} disabled={saving}>
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>
    </Modal>
  );
}
