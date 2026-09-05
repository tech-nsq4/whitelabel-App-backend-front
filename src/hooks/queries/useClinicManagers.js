import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getClinicManagersApi,
  createClinicManagerApi,
  updateClinicManagerApi,
  deleteClinicManagerApi,
} from "../../api/clinic-managers.api";

export const CLINIC_MANAGERS_KEY = ["clinic-managers"];

export function useClinicManagers(params) {
  return useQuery({
    queryKey: [...CLINIC_MANAGERS_KEY, params],
    queryFn: () => getClinicManagersApi(params).then((r) => r.data.data || []),
  });
}

export function useCreateClinicManager() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => createClinicManagerApi(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CLINIC_MANAGERS_KEY }),
  });
}

export function useUpdateClinicManager() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateClinicManagerApi(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CLINIC_MANAGERS_KEY }),
  });
}

export function useDeleteClinicManager() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteClinicManagerApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CLINIC_MANAGERS_KEY }),
  });
}
