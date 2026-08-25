import client from './client'

export const getDoctorsApi   = (params) => client.get('/api/admin/doctors', { params })
export const getDoctorApi    = (id)      => client.get(`/api/admin/doctors/${id}`)
export const createDoctorApi = (data)    => client.post('/api/admin/doctors', data)
export const updateDoctorApi = (id, data) => client.put(`/api/admin/doctors/${id}`, data)
export const deleteDoctorApi = (id)      => client.delete(`/api/admin/doctors/${id}`)
export const getDoctorTimeTablesApi = (doctorId) => client.get('/api/admin/time-tables', { params: { doctor_id: doctorId } })
