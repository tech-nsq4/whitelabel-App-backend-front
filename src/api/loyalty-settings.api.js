import client from './client'

export const getLoyaltySettingsApi      = ()         => client.get('/api/admin/loyalty-settings')
export const getLoyaltySettingApi       = (id)       => client.get(`/api/admin/loyalty-settings/${id}`)
export const updateLoyaltySettingApi    = (id, data) => client.put(`/api/admin/loyalty-settings/${id}`, data)
export const toggleLoyaltySettingApi    = (id)       => client.post(`/api/admin/loyalty-settings/${id}/toggle-status`)

export const getPointPriceApi           = ()         => client.get('/api/admin/loyalty-settings/point-price')
export const updatePointPriceApi        = (data)     => client.put('/api/admin/loyalty-settings/point-price', data)
