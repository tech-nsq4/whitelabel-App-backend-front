import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getClinicsApi,
  getClinicApi,
  createClinicApi,
  updateClinicApi,
  deleteClinicApi,
  getClinicDashboardApi,
} from "../../api/clinics.api";
import { useAuth } from "../../context/AuthContext";

export const CLINICS_KEY = ["clinics"];

export function useClinics() {
  const { managesAllClinics, adminClinicIds } = useAuth();
  return useQuery({
    queryKey: [...CLINICS_KEY, { adminClinicIds }],
    // Disable when the user has manages_all_clinics:false but zero clinics
    // assigned.  Returning all clinics in that case would be a data-leak.
    enabled: managesAllClinics || adminClinicIds === null || (Array.isArray(adminClinicIds) && adminClinicIds.length > 0),
    queryFn: async () => {
      const all = await getClinicsApi().then((r) => r.data.data || []);
      // Full access — return everything the backend sent
      if (managesAllClinics || adminClinicIds === null) return all;
      // Scoped access — filter to assigned clinic IDs only
      return all.filter((c) => adminClinicIds.includes(c.id));
    },
  });
}

export function useClinic(id) {
  return useQuery({
    queryKey: [...CLINICS_KEY, id],
    queryFn: () => getClinicApi(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useClinicDashboard(id) {
  return useQuery({
    queryKey: [...CLINICS_KEY, id, "dashboard"],
    queryFn: () => getClinicDashboardApi(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useCreateClinic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => createClinicApi(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CLINICS_KEY }),
  });
}

export function useUpdateClinic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateClinicApi(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CLINICS_KEY }),
  });
}

export function useDeleteClinic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteClinicApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CLINICS_KEY }),
  });
}
