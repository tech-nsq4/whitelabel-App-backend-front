import client from './client'

export const getPackagesApi    = (params)    => client.get('/api/admin/packages', { params })
export const getPackageApi     = (id)        => client.get(`/api/admin/packages/${id}`)
export const createPackageApi  = (data)      => client.post('/api/admin/packages', data)
export const updatePackageApi  = (id, data)  => client.put(`/api/admin/packages/${id}`, data)
export const deletePackageApi  = (id)        => client.delete(`/api/admin/packages/${id}`)
