import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getClinicsApi, createClinicApi, updateClinicApi, deleteClinicApi } from '../../api/clinics.api'

export const CLINICS_KEY = ['clinics']

export function useClinics() {
  return useQuery({
    queryKey: CLINICS_KEY,
    queryFn: () => getClinicsApi().then(r => r.data.data || []),
  })
}

export function useCreateClinic() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => createClinicApi(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CLINICS_KEY }),
  })
}

export function useUpdateClinic() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateClinicApi(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CLINICS_KEY }),
  })
}

export function useDeleteClinic() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteClinicApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CLINICS_KEY }),
  })
}
