import client from './client'

export const getPatientsApi    = (params)     => client.get('/api/admin/users', { params })
export const getPatientApi     = (id)         => client.get(`/api/admin/users/${id}`)
export const getPatientHistory = (id)         => client.get(`/api/admin/users/${id}/medical-history`)
export const createPatientApi  = (data)       => client.post('/api/admin/users', data)
export const updatePatientApi  = (id, data)   => client.put(`/api/admin/users/${id}`, data)
export const deletePatientApi  = (id)         => client.delete(`/api/admin/users/${id}`)
