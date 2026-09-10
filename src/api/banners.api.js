import client from './client'

export const getBannersApi  = ()          => client.get('/api/admin/banners')
export const getBannerApi   = (id)        => client.get(`/api/admin/banners/${id}`)
export const createBannerApi = (data)     => client.post('/api/admin/banners', data, {
  headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
})
export const updateBannerApi = (id, data) => client.post(`/api/admin/banners/${id}`, data, {
  headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
})
export const deleteBannerApi = (id)       => client.delete(`/api/admin/banners/${id}`)
