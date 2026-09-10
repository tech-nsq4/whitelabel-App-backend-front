import client from './client'

export const getContactMessagesApi = (params) =>
  client.get('/api/admin/contact-messages', { params })

export const getContactMessageApi = (id) =>
  client.get(`/api/admin/contact-messages/${id}`)
