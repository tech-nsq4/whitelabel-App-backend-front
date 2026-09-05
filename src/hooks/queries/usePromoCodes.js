import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPromoCodesApi,
  createPromoCodeApi,
  updatePromoCodeApi,
  deletePromoCodeApi,
} from "../../api/promo-codes.api";

export const PROMO_CODES_KEY = ["promo-codes"];

export function usePromoCodes(params) {
  return useQuery({
    queryKey: [...PROMO_CODES_KEY, params],
    queryFn: () => getPromoCodesApi(params).then((r) => r.data.data || []),
  });
}

export function useCreatePromoCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => createPromoCodeApi(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PROMO_CODES_KEY }),
  });
}

export function useUpdatePromoCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updatePromoCodeApi(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PROMO_CODES_KEY }),
  });
}

export function useDeletePromoCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deletePromoCodeApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PROMO_CODES_KEY }),
  });
}
