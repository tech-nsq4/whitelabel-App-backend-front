import client from './client'

export const getSpecializationsApi  = ()         => client.get('/api/admin/specializations')
export const getSpecializationApi   = (id)       => client.get(`/api/admin/specializations/${id}`)
export const createSpecializationApi = (data)    => client.post('/api/admin/specializations', data)
export const updateSpecializationApi = (id, data) => client.put(`/api/admin/specializations/${id}`, data)
export const deleteSpecializationApi = (id)      => client.delete(`/api/admin/specializations/${id}`)
