import client from './client'

export const getAppointmentsApi  = (params) => client.get('/api/admin/appointments', { params })
export const getAppointmentApi   = (id)     => client.get(`/api/admin/appointments/${id}`)
export const updateAppointmentApi = (id, data) => client.put(`/api/admin/appointments/${id}`, data)
