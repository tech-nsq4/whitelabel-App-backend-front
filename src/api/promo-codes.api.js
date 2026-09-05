import client from './client'

export const getPromoCodesApi  = (params)    => client.get('/api/admin/promo-codes', { params })
export const getPromoCodeApi   = (id)        => client.get(`/api/admin/promo-codes/${id}`)
export const createPromoCodeApi = (data)     => client.post('/api/admin/promo-codes', data)
export const updatePromoCodeApi = (id, data) => client.put(`/api/admin/promo-codes/${id}`, data)
export const deletePromoCodeApi = (id)       => client.delete(`/api/admin/promo-codes/${id}`)
