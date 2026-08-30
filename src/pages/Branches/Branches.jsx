import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import BranchCard from "./components/BranchCard";
import ClinicDetailsPage from "./components/ClinicDetailsPage";
import BranchEditModal from "./components/BranchEditModal";
import NewBranchModal from "./components/NewBranchModal";

import { useToast } from "../../components/ui/Toast";
import { SkeletonCards } from "../../components/ui/Skeleton";

import {
  useClinics,
  useCreateClinic,
  useUpdateClinic,
  useDeleteClinic,
} from "../../hooks/queries/useClinics";

import { useDoctors } from "../../hooks/queries/useDoctors";

import "./styles/Branches.css";

export default function Branches() {
  const { showToast } = useToast();

  const [searchParams, setSearchParams] = useSearchParams();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  // ================================
  // URL / Selected Clinic
  // ================================

  const selectedClinicId = searchParams.get("clinic");

  // ================================
  // Queries
  // ================================

  const { data: branchList = [], isLoading: loading } = useClinics();

  const { data: allDoctors = [] } = useDoctors();

  // ================================
  // Mutations
  // ================================

  const createClinic = useCreateClinic();
  const updateClinic = useUpdateClinic();
  const deleteClinic = useDeleteClinic();

  // ================================
  // Selected Clinic
  // ================================

  const selectedClinic = useMemo(
    () =>
      branchList.find((clinic) => String(clinic.id) === selectedClinicId) ||
      null,
    [branchList, selectedClinicId],
  );

  // ================================
  // Navigation
  // ================================

  function openClinic(clinic) {
    setSearchParams({
      clinic: String(clinic.id),
    });
  }

  function closeClinic() {
    setSearchParams({});
  }

  // ================================
  // Doctors Count
  // ================================

  const doctorsCountMap = useMemo(() => {
    const map = {};

    allDoctors.forEach((doctor) => {
      if (!doctor.clinic_id) return;

      map[doctor.clinic_id] = (map[doctor.clinic_id] || 0) + 1;
    });

    return map;
  }, [allDoctors]);

  // ================================
  // Group Clinics By City
  // ================================

  const grouped = useMemo(() => {
    const map = {};

    branchList.forEach((clinic) => {
      const cityAr = clinic.location?.city?.name?.ar || "غير محدد";

      const cityId = clinic.location?.city?.id || 0;

      if (!map[cityId]) {
        map[cityId] = {
          cityAr,
          cityId,
          clinics: [],
        };
      }

      map[cityId].clinics.push({
        ...clinic,
        doctorsCount: doctorsCountMap[clinic.id] || 0,
      });
    });

    return Object.values(map);
  }, [branchList, doctorsCountMap]);

  // ================================
  // Add Branch
  // ================================

  async function handleAddBranch(data) {
    if (!data.name?.trim()) {
      showToast("من فضلك اكتب اسم العيادة أولاً");
      return;
    }

    try {
      await createClinic.mutateAsync({
        name: {
          ar: data.name,
          en: data.name,
        },

        address: {
          ar: data.address || "",
          en: data.address || "",
        },

        location_id: data.location_id || null,

        lat: 0,
        lng: 0,
      });

      showToast("تم إضافة العيادة بنجاح");

      setModalOpen(false);
    } catch {
      showToast("تعذر إضافة العيادة", "error");
    }
  }

  // ================================
  // Edit Branch
  // ================================

  async function handleEditBranch(updatedBranch) {
    try {
      await updateClinic.mutateAsync({
        id: updatedBranch.id,

        data: {
          name: {
            ar: updatedBranch.name?.ar || updatedBranch.name,

            en: updatedBranch.name?.en || updatedBranch.name,
          },

          address: {
            ar: updatedBranch.address?.ar || updatedBranch.address || "",

            en: updatedBranch.address?.en || updatedBranch.address || "",
          },

          location_id: updatedBranch.location_id,
        },
      });

      setEditingBranch(null);

      showToast("تم تحديث بيانات العيادة");
    } catch {
      showToast("تعذر تحديث العيادة", "error");
    }
  }

  // ================================
  // Delete Branch
  // ================================

  async function handleDelete(id) {
    try {
      await deleteClinic.mutateAsync(id);

      showToast("تم حذف العيادة");
    } catch (err) {
      showToast(err.response?.data?.message || "تعذر الحذف", "error");
    }
  }

  // ================================
  // Render
  // ================================

  return (
    <div className="branches-page" style={{ animation: "fadeIn .3s ease" }}>
      {selectedClinic ? (
        <ClinicDetailsPage clinic={selectedClinic} onBack={closeClinic} />
      ) : (
        <>
          {/* Page Header */}

          <div className="page-head">
            <div>
              <h1>الفروع</h1>

              <div className="sub">
                {grouped.length} فرع · {branchList.length} عيادة
              </div>
            </div>

            <div className="page-actions">
              <button
                type="button"
                className="btn btn-p"
                onClick={() => setModalOpen(true)}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 5.5v13" />
                  <path d="M5.5 12h13" />
                </svg>
                فرع جديد
              </button>
            </div>
          </div>

          {/* Branches List */}

          {loading ? (
            <SkeletonCards count={3} />
          ) : (
            <div className="row c3 branches-grid" style={{ marginBottom: 0 }}>
              {grouped.map((group) => (
                <BranchCard
                  key={group.cityId}
                  group={group}
                  onDetails={openClinic}
                  onEdit={setEditingBranch}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* New Branch Modal */}

      <NewBranchModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddBranch}
      />

      {/* Edit Branch Modal */}

      <BranchEditModal
        branch={editingBranch}
        onClose={() => setEditingBranch(null)}
        onSave={handleEditBranch}
      />
    </div>
  );
}
