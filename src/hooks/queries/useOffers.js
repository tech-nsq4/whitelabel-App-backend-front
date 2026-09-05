import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOffersApi,
  getOfferApi,
  createOfferApi,
  updateOfferApi,
  deleteOfferApi,
} from "../../api/offers.api";

export const OFFERS_KEY = ["offers"];

export function useOffers(params) {
  return useQuery({
    queryKey: [...OFFERS_KEY, params],
    queryFn: () => getOffersApi(params).then((r) => r.data.data || []),
  });
}

export function useOffer(id) {
  return useQuery({
    queryKey: [...OFFERS_KEY, id],
    queryFn: () => getOfferApi(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useCreateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => createOfferApi(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: OFFERS_KEY }),
  });
}

export function useUpdateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateOfferApi(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: OFFERS_KEY }),
  });
}

export function useDeleteOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteOfferApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: OFFERS_KEY }),
  });
}
