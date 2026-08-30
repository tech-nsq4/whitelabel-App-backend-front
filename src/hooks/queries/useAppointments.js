import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAppointmentsApi, getAppointmentApi, updateAppointmentApi, getAppointmentStatisticsApi, uploadTestResultApi, uploadPrescriptionImageApi } from '../../api/appointments.api'

export const APPOINTMENTS_KEY = ['appointments']

export function useAppointments(params) {
  return useQuery({
    queryKey: [...APPOINTMENTS_KEY, params],
    queryFn: () => getAppointmentsApi(params).then(r => r.data.data || []),
  })
}

export function useAppointment(id) {
  return useQuery({
    queryKey: [...APPOINTMENTS_KEY, id],
    queryFn: () => getAppointmentApi(id).then(r => r.data.data),
    enabled: !!id,
  })
}

export function useUpdateAppointment() {
  return useMutation({
    mutationFn: ({ id, data }) => updateAppointmentApi(id, data),
    // no invalidate — optimistic UI handles the update locally
  })
}

export function useAppointmentStatistics() {
  return useQuery({
    queryKey: [...APPOINTMENTS_KEY, 'statistics'],
    queryFn: () => getAppointmentStatisticsApi().then(r => r.data.data),
  })
}

export function useUploadTestResult() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ appointmentId, testRequestId, formData }) =>
      uploadTestResultApi(appointmentId, testRequestId, formData),
    onSuccess: (_, { appointmentId }) => {
      qc.invalidateQueries({ queryKey: APPOINTMENTS_KEY })
      qc.invalidateQueries({ queryKey: [...APPOINTMENTS_KEY, appointmentId] })
    },
  })
}

export function useUploadPrescriptionImage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ appointmentId, formData }) =>
      uploadPrescriptionImageApi(appointmentId, formData),
    onSuccess: (_, { appointmentId }) => {
      qc.invalidateQueries({ queryKey: APPOINTMENTS_KEY })
      qc.invalidateQueries({ queryKey: [...APPOINTMENTS_KEY, appointmentId] })
    },
  })
}
