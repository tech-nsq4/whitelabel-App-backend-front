import client from './client'

export const getVisualIdentityApi    = ()       => client.get('/api/admin/visual-identity')
export const updateVisualIdentityApi = (data) => client.post('/api/admin/visual-identity', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
