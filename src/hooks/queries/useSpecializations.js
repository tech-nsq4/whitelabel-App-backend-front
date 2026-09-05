import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSpecializationsApi,
  createSpecializationApi,
  updateSpecializationApi,
  deleteSpecializationApi,
} from "../../api/specializations.api";
import {
  getSubSpecializationsApi,
  createSubSpecializationApi,
  updateSubSpecializationApi,
  deleteSubSpecializationApi,
} from "../../api/sub-specializations.api";

export const SPECIALIZATIONS_KEY = ["specializations"];
export const SUB_SPECIALIZATIONS_KEY = ["sub-specializations"];

export function useSpecializations() {
  return useQuery({
    queryKey: SPECIALIZATIONS_KEY,
    queryFn: () => getSpecializationsApi().then((r) => r.data.data || []),
  });
}

export function useCreateSpecialization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => createSpecializationApi(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: SPECIALIZATIONS_KEY }),
  });
}

export function useUpdateSpecialization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateSpecializationApi(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: SPECIALIZATIONS_KEY }),
  });
}

export function useDeleteSpecialization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteSpecializationApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SPECIALIZATIONS_KEY }),
  });
}

export function useSubSpecializations(specializationId) {
  return useQuery({
    queryKey: [...SUB_SPECIALIZATIONS_KEY, specializationId],
    queryFn: () =>
      getSubSpecializationsApi(specializationId).then((r) => r.data.data || []),
  });
}

export function useCreateSubSpecialization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => createSubSpecializationApi(data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: SUB_SPECIALIZATIONS_KEY }),
  });
}

export function useUpdateSubSpecialization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateSubSpecializationApi(id, data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: SUB_SPECIALIZATIONS_KEY }),
  });
}

export function useDeleteSubSpecialization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteSubSpecializationApi(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: SUB_SPECIALIZATIONS_KEY }),
  });
}
