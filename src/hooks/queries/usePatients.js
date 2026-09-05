import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPatientsApi,
  getPatientApi,
  getPatientHistory,
  createPatientApi,
  updatePatientApi,
  deletePatientApi,
} from "../../api/patients.api";

export const PATIENTS_KEY = ["patients"];

export function usePatients(params) {
  return useQuery({
    queryKey: [...PATIENTS_KEY, params],
    queryFn: () => getPatientsApi(params).then((r) => r.data.data || []),
  });
}

export function usePatient(id) {
  return useQuery({
    queryKey: [...PATIENTS_KEY, id],
    queryFn: () => getPatientApi(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function usePatientHistory(id) {
  return useQuery({
    queryKey: [...PATIENTS_KEY, id, "history"],
    queryFn: () => getPatientHistory(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => createPatientApi(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PATIENTS_KEY }),
  });
}

export function useUpdatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updatePatientApi(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PATIENTS_KEY }),
  });
}

export function useDeletePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deletePatientApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PATIENTS_KEY }),
  });
}
