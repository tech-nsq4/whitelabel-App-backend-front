import client from './client'

/**
 * POST /api/admin/auth/login
 * @param {string} email
 * @param {string} password
 * @returns {Promise} 
 */
export const loginApi = (email, password) =>
  client.post('/api/admin/auth/login', { email, password })

/**
 * POST /api/admin/auth/logout
 */
export const logoutApi = () =>
  client.post('/api/admin/auth/logout')
