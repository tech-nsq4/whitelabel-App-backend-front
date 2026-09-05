import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRolesApi,
  createRoleApi,
  updateRoleApi,
  deleteRoleApi,
  getPermissionsApi,
} from "../../api/roles.api";

export const ROLES_KEY = ["roles"];
export const PERMISSIONS_KEY = ["permissions"];

export function useRoles() {
  return useQuery({
    queryKey: ROLES_KEY,
    queryFn: () => getRolesApi().then((r) => r.data.data),
  });
}

export function usePermissions() {
  return useQuery({
    queryKey: PERMISSIONS_KEY,
    queryFn: () => getPermissionsApi().then((r) => r.data.data),
  });
}

export function useCreateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => createRoleApi(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ROLES_KEY }),
  });
}

export function useUpdateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateRoleApi(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ROLES_KEY }),
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteRoleApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ROLES_KEY }),
  });
}
