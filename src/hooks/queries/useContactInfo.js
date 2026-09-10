import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getContactInfoApi, updateContactInfoApi } from '../../api/contact-info.api'

export const CONTACT_INFO_KEY = ['contact-info']

export function useContactInfo() {
  return useQuery({
    queryKey: CONTACT_INFO_KEY,
    queryFn: () => getContactInfoApi().then((r) => r.data.data),
    staleTime: 0,
  })
}

export function useUpdateContactInfo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => updateContactInfoApi(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CONTACT_INFO_KEY }),
  })
}
