import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminsApi,
  createAdminApi,
  updateAdminApi,
  deleteAdminApi,
} from "../../api/admins.api";

export const ADMINS_KEY = ["admins"];

export function useAdmins(params) {
  return useQuery({
    queryKey: [...ADMINS_KEY, params],
    queryFn: () => getAdminsApi(params).then((r) => r.data.data || []),
  });
}

export function useCreateAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => createAdminApi(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMINS_KEY }),
  });
}

export function useUpdateAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateAdminApi(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMINS_KEY }),
  });
}

export function useDeleteAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteAdminApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADMINS_KEY }),
  });
}
