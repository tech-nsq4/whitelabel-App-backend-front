import { useState, useMemo } from "react";
import {
  usePromoCodes,
  useDeletePromoCode,
} from "../../hooks/queries/usePromoCodes";
import { useToast } from "../../components/ui/Toast";
import { SkeletonTable } from "../../components/ui/Skeleton";
import NewPromoCodeModal from "./components/NewPromoCodeModal";
import PromoCodeEditModal from "./components/PromoCodeEditModal";
import "./PromoCodes.css";

const DISCOUNT_CFG = {
  percentage: { label: "نسبة %", color: "#7C3AED", bg: "rgba(124,58,237,0.1)" },
  fixed: { label: "خصم ثابت", color: "#2C6DAA", bg: "rgba(44,109,170,0.1)" },
  special_price: {
    label: "سعر خاص",
    color: "#0F6B5C",
    bg: "rgba(15,107,92,0.1)",
  },
};

const SCOPE_LABELS = {
  all: "كل العيادات",
  clinics: "عيادات محددة",
  doctors: "أطباء محددون",
  specializations: "تخصصات محددة",
  first_visit: "الزيارة الأولى",
};

function getStatus(p) {
  if (p.status === "inactive" || p.status === "paused") return "inactive";
  if (p.ends_at && new Date(p.ends_at) < new Date()) return "expired";
  if (p.max_uses && p.uses_count >= p.max_uses) return "expired";
  return "active";
}

const STATUS_CFG = {
  active: { label: "نشط", color: "#0F6B5C", bg: "rgba(15,107,92,0.08)" },
  inactive: { label: "متوقف", color: "#6B7280", bg: "rgba(107,114,128,0.08)" },
  expired: { label: "منتهي", color: "#B3402F", bg: "rgba(179,64,47,0.08)" },
};

function CodeBadge({ code }) {
  const { showToast } = useToast();
  function copy() {
    navigator.clipboard.writeText(code);
    showToast("تم نسخ الكود");
  }
  return (
    <button className="promo-code-badge" onClick={copy} title="انسخ الكود">
      <span>{code}</span>
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
      </svg>
    </button>
  );
}

function PromoCard({ promo, onEdit, onDelete }) {
  const status = getStatus(promo);
  const sCfg = STATUS_CFG[status];
  const dCfg = DISCOUNT_CFG[promo.discount_type] || DISCOUNT_CFG.fixed;

  const discountDisplay =
    promo.discount_type === "percentage"
      ? `${promo.discount_value}%`
      : `${promo.discount_value} ج.م`;

  const usagePct = promo.max_uses
    ? Math.min((promo.uses_count / promo.max_uses) * 100, 100)
    : null;

  return (
    <div className="promo-card">
      {/* Status strip */}
      <div className="promo-strip" style={{ background: sCfg.color }}>
        <span className="promo-strip-dot" />
        {sCfg.label}
      </div>

      <div className="promo-card-body">
        {/* Code */}
        <div className="promo-card-top">
          <CodeBadge code={promo.code} />
          <span
            className="promo-discount-badge"
            style={{ color: dCfg.color, background: dCfg.bg }}
          >
            {dCfg.label} · {discountDisplay}
          </span>
        </div>

        {/* Scope */}
        <div className="promo-scope">
          {SCOPE_LABELS[promo.scope] || promo.scope}
          {promo.min_amount && (
            <span className="promo-min">حد أدنى {promo.min_amount} ج.م</span>
          )}
        </div>

        {/* Dates */}
        <div className="promo-meta">
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          {promo.starts_at} → {promo.ends_at || "∞"}
        </div>

        {/* Usage bar */}
        <div className="promo-usage">
          <div className="promo-usage-row">
            <span>الاستخدام</span>
            <span>
              {promo.uses_count}
              {promo.max_uses ? ` / ${promo.max_uses}` : ""}
            </span>
          </div>
          {usagePct !== null && (
            <div className="promo-bar">
              <div
                className="promo-bar-fill"
                style={{
                  width: `${usagePct}%`,
                  background:
                    usagePct >= 90
                      ? "#B3402F"
                      : usagePct >= 60
                        ? "#D97706"
                        : "#0F6B5C",
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="promo-card-footer">
        <button
          className="btn btn-q"
          style={{ flex: 1, fontSize: 12 }}
          onClick={() => onEdit(promo)}
        >
          تعديل
        </button>
        <button className="promo-del-btn" onClick={() => onDelete(promo.id)}>
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

export default function PromoCodes() {
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatus] = useState("all");
  const [newOpen, setNewOpen] = useState(false);
  const [editPromo, setEditPromo] = useState(null);

  const { data: promos = [], isLoading } = usePromoCodes();
  const deletePromo = useDeletePromoCode();

  async function handleDelete(id) {
    if (!confirm("هل تريد حذف الكود؟")) return;
    try {
      await deletePromo.mutateAsync(id);
      showToast("تم حذف الكود");
    } catch (err) {
      showToast(err.response?.data?.message || "تعذر الحذف", "error");
    }
  }

  const filtered = useMemo(
    () =>
      promos.filter((p) => {
        const s = getStatus(p);
        const matchStatus = statusFilter === "all" || s === statusFilter;
        const q = search.trim().toLowerCase();
        const matchSearch = !q || p.code.toLowerCase().includes(q);
        return matchStatus && matchSearch;
      }),
    [promos, search, statusFilter],
  );

  const stats = useMemo(
    () => ({
      total: promos.length,
      active: promos.filter((p) => getStatus(p) === "active").length,
      expired: promos.filter((p) => getStatus(p) === "expired").length,
    }),
    [promos],
  );

  return (
    <div className="page-fade">
      <div className="page-head">
        <div>
          <h1>أكواد الخصم</h1>
          <div className="sub">{promos.length} كود</div>
        </div>
        <button className="btn btn-p" onClick={() => setNewOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24">
            <path d="M12 5.5v13M5.5 12h13" />
          </svg>
          كود جديد
        </button>
      </div>

      {/* Stats */}
      <div className="promo-stats-row">
        {[
          {
            label: "إجمالي الأكواد",
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
            label: "منتهي",
            value: stats.expired,
            color: "#B3402F",
            bg: "rgba(179,64,47,0.08)",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="promo-stat-card"
            style={{ background: s.bg, borderColor: s.color + "22" }}
          >
            <span className="promo-stat-val" style={{ color: s.color }}>
              {s.value}
            </span>
            <span className="promo-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="panel promo-filters">
        <input
          className="inp"
          style={{ flex: 1, minWidth: 180 }}
          placeholder="ابحث بالكود..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div style={{ display: "flex", gap: 6 }}>
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
              onClick={() => setStatus(f.v)}
            >
              {f.l}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <SkeletonTable rows={2} cols={3} />
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
          لا توجد أكواد
        </div>
      ) : (
        <div className="promo-grid">
          {filtered.map((p) => (
            <PromoCard
              key={p.id}
              promo={p}
              onEdit={setEditPromo}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <NewPromoCodeModal open={newOpen} onClose={() => setNewOpen(false)} />
      <PromoCodeEditModal
        open={!!editPromo}
        promo={editPromo}
        onClose={() => setEditPromo(null)}
      />
    </div>
  );
}
