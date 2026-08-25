import client from './client'

export const getProfileApi = () =>
  client.get('/api/admin/profile')

export const updateProfileApi = (data) =>
  client.put('/api/admin/profile', data)
