import client from './client'

export const getRolesApi       = ()           => client.get('/api/admin/roles')
export const getRoleApi        = (id)         => client.get(`/api/admin/roles/${id}`)
export const createRoleApi     = (data)       => client.post('/api/admin/roles', data)
export const updateRoleApi     = (id, data)   => client.put(`/api/admin/roles/${id}`, data)
export const deleteRoleApi     = (id)         => client.delete(`/api/admin/roles/${id}`)
export const getPermissionsApi = ()           => client.get('/api/admin/permissions')
