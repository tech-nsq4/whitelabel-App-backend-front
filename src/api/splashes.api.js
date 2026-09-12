import client from './client'

export const getSplashesApi  = ()          => client.get('/api/admin/splashes')
export const getSplashApi    = (id)        => client.get(`/api/admin/splashes/${id}`)
export const createSplashApi = (data)      => client.post('/api/admin/splashes', data, {
  headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
})
export const updateSplashApi = (id, data)  => client.post(`/api/admin/splashes/${id}`, data, {
  headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
})
export const deleteSplashApi = (id)        => client.delete(`/api/admin/splashes/${id}`)
