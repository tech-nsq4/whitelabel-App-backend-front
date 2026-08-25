import client from './client'

export const getTimeTablesApi    = (params)     => client.get('/api/admin/time-tables', { params })
export const getTimeTableApi     = (id)         => client.get(`/api/admin/time-tables/${id}`)
export const createTimeTableApi  = (data)       => client.post('/api/admin/time-tables', data)
export const updateTimeTableApi  = (id, data)   => client.put(`/api/admin/time-tables/${id}`, data)
export const deleteTimeTableApi  = (id)         => client.delete(`/api/admin/time-tables/${id}`)
