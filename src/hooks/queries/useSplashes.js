import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getSplashesApi,
  getSplashApi,
  createSplashApi,
  updateSplashApi,
  deleteSplashApi,
} from '../../api/splashes.api'

export const SPLASHES_KEY = ['splashes']

export function useSplashes() {
  return useQuery({
    queryKey: SPLASHES_KEY,
    queryFn: () => getSplashesApi().then((r) => r.data.data || []),
    staleTime: 0,
  })
}

export function useSplash(id) {
  return useQuery({
    queryKey: [...SPLASHES_KEY, id],
    queryFn: () => getSplashApi(id).then((r) => r.data.data),
    enabled: !!id,
    staleTime: 0,
  })
}

export function useCreateSplash() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => createSplashApi(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: SPLASHES_KEY }),
  })
}

export function useUpdateSplash() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateSplashApi(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: SPLASHES_KEY }),
  })
}

export function useDeleteSplash() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteSplashApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SPLASHES_KEY }),
  })
}
