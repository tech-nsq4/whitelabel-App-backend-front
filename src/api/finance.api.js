import client from './client'

export const getFinanceApi = (params) => client.get('/api/admin/finance', { params })
