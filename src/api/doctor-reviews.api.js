import client from './client'

export const getDoctorReviewsApi = (params) => client.get('/api/admin/doctor-reviews', { params })
export const deleteDoctorReviewApi = (id) => client.delete(`/api/admin/doctor-reviews/${id}`)
