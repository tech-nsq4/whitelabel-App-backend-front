import { useQuery } from '@tanstack/react-query'
import { getContactMessagesApi, getContactMessageApi } from '../../api/contact-messages.api'

export const CONTACT_MESSAGES_KEY = ['contact-messages']

export function useContactMessages(params) {
  return useQuery({
    queryKey: [...CONTACT_MESSAGES_KEY, params],
    queryFn: () => getContactMessagesApi(params).then((r) => r.data),
    staleTime: 0,
  })
}

export function useContactMessage(id) {
  return useQuery({
    queryKey: [...CONTACT_MESSAGES_KEY, id],
    queryFn: () => getContactMessageApi(id).then((r) => r.data.data),
    enabled: !!id,
    staleTime: 0,
  })
}
