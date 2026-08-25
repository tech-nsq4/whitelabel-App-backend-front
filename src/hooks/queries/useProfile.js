import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProfileApi, updateProfileApi } from '../../api/profile.api'

export const PROFILE_KEY = ['profile']

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: () => getProfileApi().then(r => r.data.data),
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => updateProfileApi(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PROFILE_KEY }),
  })
}
