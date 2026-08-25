import client from './client'

export const getLocationsApi  = ()         => client.get('/api/admin/locations')
export const getLocationApi   = (id)       => client.get(`/api/admin/locations/${id}`)
export const createLocationApi = (data)    => client.post('/api/admin/locations', data)
export const updateLocationApi = (id, data) => client.put(`/api/admin/locations/${id}`, data)
export const deleteLocationApi = (id)      => client.delete(`/api/admin/locations/${id}`)
