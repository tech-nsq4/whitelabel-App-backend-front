import client from './client'

export const getSubSpecializationsApi  = (specializationId) =>
  client.get('/api/admin/sub-specializations', specializationId ? { params: { specialization_id: specializationId } } : {})

export const createSubSpecializationApi = (data) =>
  client.post('/api/admin/sub-specializations', data)

export const updateSubSpecializationApi = (id, data) =>
  client.put(`/api/admin/sub-specializations/${id}`, data)

export const deleteSubSpecializationApi = (id) =>
  client.delete(`/api/admin/sub-specializations/${id}`)
