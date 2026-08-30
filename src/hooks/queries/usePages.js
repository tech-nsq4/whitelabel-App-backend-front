import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPagesApi, updatePageApi } from '../../api/pages.api'

export const PAGES_KEY = ['pages']

export function usePages() {
  return useQuery({
    queryKey: PAGES_KEY,
    queryFn: () => getPagesApi().then(r => r.data.data),
  })
}

export function useUpdatePage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updatePageApi(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PAGES_KEY }),
  })
}
