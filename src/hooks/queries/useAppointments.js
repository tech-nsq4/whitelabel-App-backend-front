import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAppointmentsApi,
  getAppointmentApi,
  createAppointmentApi,
  updateAppointmentApi,
  getAppointmentStatisticsApi,
  uploadTestResultApi,
  uploadPrescriptionImageApi,
} from "../../api/appointments.api";
import { useAuth } from "../../context/AuthContext";

export const APPOINTMENTS_KEY = ["appointments"];

export function useAppointments(params) {
  const { getClinicParams } = useAuth();
  const mergedParams = { ...getClinicParams(), ...params };
  return useQuery({
    queryKey: [...APPOINTMENTS_KEY, mergedParams],
    queryFn: () =>
      getAppointmentsApi(mergedParams).then((r) => r.data.data || []),
  });
}

export function useAppointment(id) {
  return useQuery({
    queryKey: [...APPOINTMENTS_KEY, id],
    queryFn: () => getAppointmentApi(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useCreateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => createAppointmentApi(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: APPOINTMENTS_KEY }),
  });
}

export function useUpdateAppointment() {
  return useMutation({
    mutationFn: ({ id, data }) => updateAppointmentApi(id, data),
    // no invalidate — optimistic UI handles the update locally
  });
}

export function useAppointmentStatistics() {
  return useQuery({
    queryKey: [...APPOINTMENTS_KEY, "statistics"],
    queryFn: () => getAppointmentStatisticsApi().then((r) => r.data.data),
  });
}

export function useUploadTestResult() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ appointmentId, testRequestId, formData }) =>
      uploadTestResultApi(appointmentId, testRequestId, formData),
    onSuccess: (_, { appointmentId }) => {
      qc.invalidateQueries({ queryKey: APPOINTMENTS_KEY });
      qc.invalidateQueries({ queryKey: [...APPOINTMENTS_KEY, appointmentId] });
    },
  });
}

export function useUploadPrescriptionImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ appointmentId, formData }) =>
      uploadPrescriptionImageApi(appointmentId, formData),
    onSuccess: (_, { appointmentId }) => {
      qc.invalidateQueries({ queryKey: APPOINTMENTS_KEY });
      qc.invalidateQueries({ queryKey: [...APPOINTMENTS_KEY, appointmentId] });
    },
  });
}
