import { useQuery } from '@tanstack/react-query'
import { getFinanceApi } from '../../api/finance.api'

export const FINANCE_KEY = ['finance']

export function useFinance(params) {
  return useQuery({
    queryKey: [...FINANCE_KEY, params],
    queryFn: () => getFinanceApi(params).then((r) => r.data.data),
  })
}
