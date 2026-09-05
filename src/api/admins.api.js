import client from './client'

export const getAdminsApi  = (params)    => client.get('/api/admin/admins', { params })
export const getAdminApi   = (id)        => client.get(`/api/admin/admins/${id}`)
export const createAdminApi = (data)     => client.post('/api/admin/admins', data)
export const updateAdminApi = (id, data) => client.put(`/api/admin/admins/${id}`, data)
export const deleteAdminApi = (id)       => client.delete(`/api/admin/admins/${id}`)
