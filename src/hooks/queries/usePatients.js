import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPatientsApi,
  getPatientApi,
  getPatientHistory,
  createPatientApi,
  updatePatientApi,
  deletePatientApi,
} from "../../api/patients.api";
import { useAuth } from "../../context/AuthContext";

export const PATIENTS_KEY = ["patients"];

export function usePatients(params) {
  const { getClinicParams } = useAuth();
  const clinicParams = getClinicParams();
  const mergedParams = clinicParams !== null ? { ...clinicParams, ...params } : params;
  return useQuery({
    queryKey: [...PATIENTS_KEY, mergedParams],
    enabled: clinicParams !== null,
    queryFn: () => getPatientsApi(mergedParams).then((r) => r.data.data || []),
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
