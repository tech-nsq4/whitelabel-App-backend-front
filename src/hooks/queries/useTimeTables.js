import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getTimeTablesApi,
  getTimeTableApi,
  createTimeTableApi,
  updateTimeTableApi,
  deleteTimeTableApi,
} from '../../api/time-tables.api'

export const TIME_TABLES_KEY = ['time-tables']

export function useTimeTables(params) {
  return useQuery({
    queryKey: [...TIME_TABLES_KEY, params],
    queryFn: () => getTimeTablesApi(params).then(r => r.data.data || []),
  })
}

export function useTimeTable(id) {
  return useQuery({
    queryKey: [...TIME_TABLES_KEY, id],
    queryFn: () => getTimeTableApi(id).then(r => r.data.data),
    enabled: !!id,
  })
}

export function useCreateTimeTable() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => createTimeTableApi(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: TIME_TABLES_KEY }),
  })
}

export function useUpdateTimeTable() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateTimeTableApi(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: TIME_TABLES_KEY }),
  })
}

export function useDeleteTimeTable() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteTimeTableApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: TIME_TABLES_KEY }),
  })
}
