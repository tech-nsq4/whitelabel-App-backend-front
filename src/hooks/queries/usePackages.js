import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getPackagesApi,
  getPackageApi,
  createPackageApi,
  updatePackageApi,
  deletePackageApi,
} from '../../api/packages.api'

export const PACKAGES_KEY = ['packages']

export function usePackages(params) {
  return useQuery({
    queryKey: [...PACKAGES_KEY, params],
    queryFn:  () => getPackagesApi(params).then(r => r.data.data || []),
  })
}

export function usePackage(id) {
  return useQuery({
    queryKey: [...PACKAGES_KEY, id],
    queryFn:  () => getPackageApi(id).then(r => r.data.data),
    enabled:  !!id,
  })
}

export function useCreatePackage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => createPackageApi(data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: PACKAGES_KEY }),
  })
}

export function useUpdatePackage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updatePackageApi(id, data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: PACKAGES_KEY }),
  })
}

export function useDeletePackage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => deletePackageApi(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: PACKAGES_KEY }),
  })
}
