import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDoctorsApi, createDoctorApi, updateDoctorApi, deleteDoctorApi } from '../../api/doctors.api'

export const DOCTORS_KEY = ['doctors']

export function useDoctors(params) {
  return useQuery({
    queryKey: [...DOCTORS_KEY, params],
    queryFn: () => getDoctorsApi(params).then(r => r.data.data || []),
  })
}

export function useCreateDoctor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => createDoctorApi(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: DOCTORS_KEY }),
  })
}

export function useUpdateDoctor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateDoctorApi(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: DOCTORS_KEY }),
  })
}

export function useDeleteDoctor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteDoctorApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: DOCTORS_KEY }),
  })
}
