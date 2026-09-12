import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDoctorReviewsApi, deleteDoctorReviewApi } from '../../api/doctor-reviews.api'

export const DOCTOR_REVIEWS_KEY = ['doctor-reviews']

export function useDoctorReviews(params) {
  return useQuery({
    queryKey: [...DOCTOR_REVIEWS_KEY, params],
    queryFn: () => getDoctorReviewsApi(params).then((r) => r.data.data || []),
  })
}

export function useDeleteDoctorReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteDoctorReviewApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: DOCTOR_REVIEWS_KEY }),
  })
}
