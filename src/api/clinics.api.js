import client from './client'

export const getClinicsApi        = ()           => client.get('/api/admin/clinics')
export const getClinicApi         = (id)         => client.get(`/api/admin/clinics/${id}`)
export const getClinicDashboardApi = (id, count = 10) => client.get(`/api/admin/clinics/${id}/dashboard`, { params: { count } })
export const getClinicsStatsApi   = ()           => client.get('/api/admin/clinics/stats')
export const createClinicApi      = (data)       => client.post('/api/admin/clinics', data)
export const updateClinicApi      = (id, data)   => client.put(`/api/admin/clinics/${id}`, data)
export const deleteClinicApi      = (id)         => client.delete(`/api/admin/clinics/${id}`)
