import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getLoyaltySettingsApi,
  getLoyaltySettingApi,
  updateLoyaltySettingApi,
  toggleLoyaltySettingApi,
  getPointPriceApi,
  updatePointPriceApi,
} from '../../api/loyalty-settings.api'

export const LOYALTY_SETTINGS_KEY = ['loyalty-settings']
export const POINT_PRICE_KEY      = ['loyalty-point-price']

export function useLoyaltySettings() {
  return useQuery({
    queryKey: LOYALTY_SETTINGS_KEY,
    queryFn:  () => getLoyaltySettingsApi().then(r => r.data.data || []),
  })
}

export function useLoyaltySetting(id) {
  return useQuery({
    queryKey: [...LOYALTY_SETTINGS_KEY, id],
    queryFn:  () => getLoyaltySettingApi(id).then(r => r.data.data),
    enabled:  !!id,
  })
}

export function useUpdateLoyaltySetting() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateLoyaltySettingApi(id, data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: LOYALTY_SETTINGS_KEY }),
  })
}

export function useToggleLoyaltySetting() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => toggleLoyaltySettingApi(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: LOYALTY_SETTINGS_KEY }),
  })
}

export function usePointPrice() {
  return useQuery({
    queryKey: POINT_PRICE_KEY,
    queryFn:  () => getPointPriceApi().then(r => r.data.data),
  })
}

export function useUpdatePointPrice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => updatePointPriceApi(data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: POINT_PRICE_KEY }),
  })
}
