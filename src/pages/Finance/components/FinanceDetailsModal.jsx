import Modal from "../../../components/ui/Modal";

function Row({ label, value, mono }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <span style={{ fontSize: 12, color: "var(--ink-45)" }}>{label}</span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "var(--ink)",
          fontFamily: mono ? "'Readex Pro'" : "inherit",
        }}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

const DISCOUNT_SOURCE_LABEL = {
  promo_code: "كود خصم",
  offer: "عرض",
};

export default function FinanceDetailsModal({ open, onClose, invoice }) {
  if (!invoice) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`فاتورة #${invoice.id}`}
      subtitle="تفاصيل الفاتورة المالية"
    >
      {/* Amount header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          background: "var(--paper)",
          borderRadius: 12,
          border: "1px solid var(--line)",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontFamily: "'Readex Pro'",
            fontSize: 22,
            fontWeight: 700,
            color: "var(--ink)",
          }}
        >
          {invoice.amount}{" "}
          <span
            style={{ fontSize: 13, color: "var(--ink-45)", fontWeight: 400 }}
          >
            ر.س
          </span>
        </div>
        <span className="chip chip-ok">مكتمل</span>
      </div>

      <Row label="المريض" value={invoice.user?.name || invoice.user?.phone} />
      <Row label="الطبيب" value={invoice.doctor?.name?.ar} />
      <Row label="العيادة" value={invoice.clinic?.name?.ar} />
      <Row label="التاريخ" value={invoice.date} mono />
      <Row label="الوقت" value={invoice.time} mono />

      {invoice.has_discount && (
        <>
          <Row
            label="السعر الأصلي"
            value={`${invoice.original_price} ر.س`}
            mono
          />
          <Row
            label="قيمة الخصم"
            value={`${invoice.discount_amount} ر.س`}
            mono
          />
          <Row
            label="مصدر الخصم"
            value={
              DISCOUNT_SOURCE_LABEL[invoice.discount_source] ||
              invoice.discount_source
            }
          />
          {invoice.promo_code && (
            <Row label="كود الخصم" value={invoice.promo_code} mono />
          )}
          <Row
            label="السعر النهائي"
            value={`${invoice.final_price} ر.س`}
            mono
          />
        </>
      )}

      {invoice.family_member && (
        <Row label="فرد العائلة" value={invoice.family_member.name} />
      )}

      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}
      >
        <button className="btn btn-q" onClick={onClose}>
          إغلاق
        </button>
      </div>
    </Modal>
  );
}
