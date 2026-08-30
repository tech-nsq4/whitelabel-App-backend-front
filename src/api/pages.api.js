import client from './client'

export const getPagesApi  = ()           => client.get('/api/admin/pages')
export const updatePageApi = (id, data)  => client.put(`/api/admin/pages/${id}`, data)
