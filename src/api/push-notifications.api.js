import client from './client'

export const getPushNotificationsApi  = ()         => client.get('/api/admin/push-notifications')
export const sendPushNotificationApi  = (data)     => client.post('/api/admin/push-notifications', data)
export const deletePushNotificationApi = (id)      => client.delete(`/api/admin/push-notifications/${id}`)
