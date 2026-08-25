import client from './client'

export const createAreaApi = (data)     => client.post('/api/admin/areas', data)
export const updateAreaApi = (id, data) => client.put(`/api/admin/areas/${id}`, data)
export const deleteAreaApi = (id)       => client.delete(`/api/admin/areas/${id}`)
