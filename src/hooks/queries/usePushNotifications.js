import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getPushNotificationsApi,
  sendPushNotificationApi,
  deletePushNotificationApi,
} from '../../api/push-notifications.api'

export const PUSH_NOTIF_KEY = ['push-notifications']

export function usePushNotifications() {
  const token = localStorage.getItem('token')
  return useQuery({
    queryKey: PUSH_NOTIF_KEY,
    queryFn: () => getPushNotificationsApi().then(r => r.data.data || []),
    enabled: !!token,
    refetchInterval: 30000,
  })
}

export function useSendPushNotification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => sendPushNotificationApi(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PUSH_NOTIF_KEY }),
  })
}

export function useDeletePushNotification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => deletePushNotificationApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PUSH_NOTIF_KEY }),
  })
}
