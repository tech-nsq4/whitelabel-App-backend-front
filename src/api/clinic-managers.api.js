import client from './client'

export const getClinicManagersApi  = (params)     => client.get('/api/admin/clinic-managers', { params })
export const getClinicManagerApi   = (id)         => client.get(`/api/admin/clinic-managers/${id}`)
export const createClinicManagerApi = (data)      => client.post('/api/admin/clinic-managers', data)
export const updateClinicManagerApi = (id, data)  => client.put(`/api/admin/clinic-managers/${id}`, data)
export const deleteClinicManagerApi = (id)        => client.delete(`/api/admin/clinic-managers/${id}`)
