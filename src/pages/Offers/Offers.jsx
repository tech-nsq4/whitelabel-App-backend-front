import { useState, useMemo } from "react";
import { useOffers, useDeleteOffer } from "../../hooks/queries/useOffers";
import { useToast } from "../../components/ui/Toast";
import { SkeletonTable } from "../../components/ui/Skeleton";
import NewOfferModal from "./components/NewOfferModal";
import OfferEditModal from "./components/OfferEditModal";
import "./Offers.css";

const DISCOUNT_CFG = {
  percentage: {
    label: "نسبة مئوية",
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.1)",
    icon: "%",
  },
  fixed: {
    label: "خصم ثابت",
    color: "#2C6DAA",
    bg: "rgba(44,109,170,0.1)",
    icon: "ج",
  },
  special_price: {
    label: "سعر خاص",
    color: "#0F6B5C",
    bg: "rgba(15,107,92,0.1)",
    icon: "★",
  },
};

const SCOPE_LABELS = {
  all: { label: "كل العيادات", color: "#0F6B5C" },
  clinics: { label: "عيادات محددة", color: "#2C6DAA" },
  doctors: { label: "أطباء محددون", color: "#7C3AED" },
  specializations: { label: "تخصصات محددة", color: "#D97706" },
};

function getStatus(offer) {
  if (offer.status === "inactive") return "inactive";
  if (offer.ends_at && new Date(offer.ends_at) < new Date()) return "expired";
  return "active";
}

const STATUS_CFG = {
  active: { label: "نشط", color: "#0F6B5C", bg: "rgba(15,107,92,0.1)" },
  inactive: { label: "متوقف", color: "#6B7280", bg: "rgba(107,114,128,0.1)" },
  expired: { label: "منتهي", color: "#B3402F", bg: "rgba(179,64,47,0.1)" },
};

const CARD_GRADIENTS = [
  "linear-gradient(135deg,#0F6B5C,#0A4F44)",
  "linear-gradient(135deg,#2C6DAA,#1e4f7e)",
  "linear-gradient(135deg,#7C3AED,#5B21B6)",
  "linear-gradient(135deg,#D97706,#b45309)",
  "linear-gradient(135deg,#DB2777,#9d174d)",
  "linear-gradient(135deg,#0891B2,#0e7490)",
  "linear-gradient(135deg,#059669,#047857)",
  "linear-gradient(135deg,#9333EA,#7e22ce)",
];

function OfferCard({ offer, index, onEdit, onDelete }) {
  const status = getStatus(offer);
  const sCfg = STATUS_CFG[status];
  const dCfg = DISCOUNT_CFG[offer.discount_type] || DISCOUNT_CFG.fixed;
  const scopeCfg = SCOPE_LABELS[offer.scope] || SCOPE_LABELS.all;
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  const discountDisplay =
    offer.discount_type === "percentage"
      ? `${offer.discount_value}%`
      : `${offer.discount_value} ج.م`;

  const usageDisplay = offer.max_uses
    ? `${offer.uses_count} / ${offer.max_uses}`
    : `${offer.uses_count} استخدام`;

  return (
    <div className="offer-card">
      {/* Status strip */}
      <div className="offer-card-strip" style={{ background: sCfg.color }}>
        <span className="offer-strip-dot" />
        {sCfg.label}
      </div>

      {/* Header */}
      <div className="offer-card-header">
        <div
          className="offer-card-icon"
          style={{ background: dCfg.bg, color: dCfg.color }}
        >
          {dCfg.icon}
        </div>
        <div className="offer-card-header-info">
          <div className="offer-card-name">{offer.name?.ar}</div>
          <div className="offer-card-desc">{offer.description?.ar}</div>
        </div>
      </div>

      {/* Body */}
      <div className="offer-card-body">
        {/* Discount badge */}
        <div
          className="offer-card-discount"
          style={{ color: dCfg.color, background: dCfg.bg }}
        >
          <span className="offer-card-discount-type">{dCfg.label}</span>
          <span className="offer-card-discount-val">{discountDisplay}</span>
          {offer.max_discount_amount && (
            <span className="offer-card-discount-max">
              حد أقصى {offer.max_discount_amount} ج.م
            </span>
          )}
        </div>

        {/* Meta row */}
        <div className="offer-card-meta">
          <div className="offer-card-meta-item">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <span>
              {offer.starts_at} → {offer.ends_at || "∞"}
            </span>
          </div>
          <div className="offer-card-meta-item">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
            <span>{usageDisplay}</span>
          </div>
        </div>

        {/* Scope */}
        <div className="offer-card-scope" style={{ color: scopeCfg.color }}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          {scopeCfg.label}
          {offer.show_on_home && (
            <span className="offer-home-badge">الصفحة الرئيسية</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="offer-card-footer">
        <button
          className="btn btn-q"
          style={{ flex: 1, fontSize: 12 }}
          onClick={() => onEdit(offer)}
        >
          تعديل
        </button>
        <button className="offer-del-btn" onClick={() => onDelete(offer.id)}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function Offers() {
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newOpen, setNewOpen] = useState(false);
  const [editOffer, setEditOffer] = useState(null);

  const { data: offers = [], isLoading } = useOffers();
  const deleteOffer = useDeleteOffer();

  async function handleDelete(id) {
    if (!confirm("هل تريد حذف العرض؟")) return;
    try {
      await deleteOffer.mutateAsync(id);
      showToast("تم حذف العرض");
    } catch (err) {
      showToast(err.response?.data?.message || "تعذر الحذف", "error");
    }
  }

  const filtered = useMemo(
    () =>
      offers.filter((o) => {
        const status = getStatus(o);
        const matchStatus = statusFilter === "all" || status === statusFilter;
        const q = search.trim().toLowerCase();
        const matchSearch =
          !q ||
          (o.name?.ar || "").toLowerCase().includes(q) ||
          (o.description?.ar || "").toLowerCase().includes(q);
        return matchStatus && matchSearch;
      }),
    [offers, search, statusFilter],
  );

  const stats = useMemo(
    () => ({
      total: offers.length,
      active: offers.filter((o) => getStatus(o) === "active").length,
      inactive: offers.filter((o) => getStatus(o) === "inactive").length,
      expired: offers.filter((o) => getStatus(o) === "expired").length,
    }),
    [offers],
  );

  return (
    <div className="page-fade">
      <div className="page-head">
        <div>
          <h1>العروض والخصومات</h1>
          <div className="sub">{offers.length} عرض</div>
        </div>
        <button className="btn btn-p" onClick={() => setNewOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24">
            <path d="M12 5.5v13M5.5 12h13" />
          </svg>
          عرض جديد
        </button>
      </div>

      {/* Stats */}
      <div className="offer-stats-row">
        {[
          {
            label: "إجمالي العروض",
            value: stats.total,
            color: "#7C3AED",
            bg: "rgba(124,58,237,0.08)",
          },
          {
            label: "نشط",
            value: stats.active,
            color: "#0F6B5C",
            bg: "rgba(15,107,92,0.08)",
          },
          {
            label: "متوقف",
            value: stats.inactive,
            color: "#6B7280",
            bg: "rgba(107,114,128,0.08)",
          },
          {
            label: "منتهي",
            value: stats.expired,
            color: "#B3402F",
            bg: "rgba(179,64,47,0.08)",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="offer-stat-card"
            style={{ background: s.bg, borderColor: s.color + "22" }}
          >
            <span className="offer-stat-val" style={{ color: s.color }}>
              {s.value}
            </span>
            <span className="offer-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="panel offer-filters">
        <input
          className="inp"
          style={{ flex: 1, minWidth: 200 }}
          placeholder="ابحث باسم العرض أو الوصف..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="offer-filter-btns">
          {[
            { v: "all", l: "الكل" },
            { v: "active", l: "نشط" },
            { v: "inactive", l: "متوقف" },
            { v: "expired", l: "منتهي" },
          ].map((f) => (
            <button
              key={f.v}
              className={`btn ${statusFilter === f.v ? "btn-p" : "btn-q"}`}
              style={{ padding: "6px 16px", fontSize: 12 }}
              onClick={() => setStatusFilter(f.v)}
            >
              {f.l}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <SkeletonTable rows={3} cols={3} />
      ) : filtered.length === 0 ? (
        <div
          className="panel"
          style={{
            padding: "48px 24px",
            textAlign: "center",
            color: "var(--ink-45)",
            fontSize: 13,
          }}
        >
          لا توجد عروض مطابقة
        </div>
      ) : (
        <div className="offer-grid">
          {filtered.map((offer, i) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              index={i}
              onEdit={setEditOffer}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <NewOfferModal open={newOpen} onClose={() => setNewOpen(false)} />
      <OfferEditModal
        open={!!editOffer}
        offer={editOffer}
        onClose={() => setEditOffer(null)}
      />
    </div>
  );
}
