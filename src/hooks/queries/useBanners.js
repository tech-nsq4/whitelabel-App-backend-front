import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getBannersApi,
  getBannerApi,
  createBannerApi,
  updateBannerApi,
  deleteBannerApi,
} from '../../api/banners.api'

export const BANNERS_KEY = ['banners']

export function useBanners() {
  return useQuery({
    queryKey: BANNERS_KEY,
    queryFn: () => getBannersApi().then((r) => r.data.data || []),
    staleTime: 0,
  })
}

export function useBanner(id) {
  return useQuery({
    queryKey: [...BANNERS_KEY, id],
    queryFn: () => getBannerApi(id).then((r) => r.data.data),
    enabled: !!id,
    staleTime: 0,
  })
}

export function useCreateBanner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => createBannerApi(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: BANNERS_KEY }),
  })
}

export function useUpdateBanner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateBannerApi(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: BANNERS_KEY }),
  })
}

export function useDeleteBanner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteBannerApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: BANNERS_KEY }),
  })
}
