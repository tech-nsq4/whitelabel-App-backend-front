import client from './client'

export const getOffersApi  = (params)     => client.get('/api/admin/offers', { params })
export const getOfferApi   = (id)         => client.get(`/api/admin/offers/${id}`)
export const createOfferApi = (data)      => client.post('/api/admin/offers', data, {
  headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
})
export const updateOfferApi = (id, data)  => client.post(`/api/admin/offers/${id}`, data, {
  headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
})
export const deleteOfferApi = (id)        => client.delete(`/api/admin/offers/${id}`)
