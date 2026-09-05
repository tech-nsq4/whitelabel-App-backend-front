import { useState } from "react";
import { useAdmins, useDeleteAdmin } from "../../hooks/queries/useAdmins";
import { useToast } from "../../components/ui/Toast";
import { SkeletonTable } from "../../components/ui/Skeleton";
import NewStaffModal from "./components/NewStaffModal";
import StaffEditModal from "./components/StaffEditModal";
import StaffStats from "./components/StaffStats";
import "./Staff.css";

const BG_COLORS = [
  "linear-gradient(135deg,#0F6B5C,#0A4F44)",
  "linear-gradient(135deg,#2C6DAA,#1e4f7e)",
  "linear-gradient(135deg,#7C3AED,#5B21B6)",
  "linear-gradient(135deg,#D97706,#b45309)",
  "linear-gradient(135deg,#DB2777,#9d174d)",
  "linear-gradient(135deg,#0891B2,#0e7490)",
];

export default function Staff() {
  const { showToast } = useToast();
  const [newOpen, setNewOpen] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);

  const { data: admins = [], isLoading } = useAdmins();
  const deleteAdmin = useDeleteAdmin();

  async function handleDelete(id) {
    if (!confirm("هل تريد حذف هذا المستخدم؟")) return;
    try {
      await deleteAdmin.mutateAsync(id);
      showToast("تم حذف المستخدم");
    } catch (err) {
      showToast(err.response?.data?.message || "تعذر الحذف", "error");
    }
  }

  return (
    <div className="page-fade">
      <div className="page-head">
        <div>
          <h1>المستخدمون الإداريون</h1>
          <div className="sub">{admins.length} مستخدم</div>
        </div>
        <button className="btn btn-p" onClick={() => setNewOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24">
            <path d="M12 5.5v13M5.5 12h13" />
          </svg>
          مستخدم جديد
        </button>
      </div>

      <StaffStats />

      {isLoading ? (
        <SkeletonTable rows={5} cols={5} />
      ) : (
        <div className="panel">
          {admins.length === 0 ? (
            <div className="staff-empty">لا يوجد مستخدمين</div>
          ) : (
            <table className="data">
              <thead>
                <tr>
                  <th>المستخدم</th>
                  <th>الدور</th>
                  <th>العيادات</th>
                  <th>النطاق</th>
                  <th>الحالة</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, idx) => {
                  const initial = (admin.name || admin.email || "?").charAt(0);
                  const clinicNames = admin.manages_all_clinics
                    ? "كل العيادات"
                    : admin.clinics
                        ?.map((c) => c.name?.ar || c.name)
                        .join("، ") || "-";
                  const roleName = admin.roles?.[0]?.name || "-";

                  return (
                    <tr key={admin.id}>
                      <td>
                        <div className="staff-cell-user">
                          <div
                            className="staff-avatar"
                            style={{
                              background: BG_COLORS[idx % BG_COLORS.length],
                            }}
                          >
                            {initial}
                          </div>
                          <div>
                            <div className="td-name">{admin.name || "-"}</div>
                            <div className="td-sub">{admin.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="chip mut">{roleName}</span>
                      </td>
                      <td className="staff-cell-clinics">{clinicNames}</td>
                      <td>
                        <span
                          className={`staff-scope-chip ${admin.manages_all_clinics ? "all" : "limited"}`}
                        >
                          {admin.manages_all_clinics
                            ? "كل العيادات"
                            : "عيادات محددة"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={admin.is_active ? "chip ok" : "chip mut"}
                        >
                          {admin.is_active ? "نشط" : "متوقف"}
                        </span>
                      </td>
                      <td>
                        <div className="staff-row-actions">
                          <button
                            className="btn btn-q"
                            style={{ padding: "5px 12px", fontSize: 12 }}
                            onClick={() => setEditAdmin(admin)}
                          >
                            تعديل
                          </button>
                          <button
                            className="staff-del-btn"
                            onClick={() => handleDelete(admin.id)}
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      <NewStaffModal open={newOpen} onClose={() => setNewOpen(false)} />
      <StaffEditModal
        open={!!editAdmin}
        admin={editAdmin}
        onClose={() => setEditAdmin(null)}
      />
    </div>
  );
}
