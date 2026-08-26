import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAppointmentsApi, getAppointmentApi, updateAppointmentApi } from '../../api/appointments.api'

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
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateAppointmentApi(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: APPOINTMENTS_KEY }),
  })
}
