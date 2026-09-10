import client from './client'

export const getContactInfoApi    = ()     => client.get('/api/admin/contact-info')
export const updateContactInfoApi = (data) => client.put('/api/admin/contact-info', data)
