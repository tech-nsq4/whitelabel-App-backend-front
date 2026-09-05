import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCitiesApi,
  createCityApi,
  updateCityApi,
  deleteCityApi,
} from "../../api/cities.api";

export const CITIES_KEY = ["cities"];

export function useCities() {
  return useQuery({
    queryKey: CITIES_KEY,
    queryFn: () => getCitiesApi().then((r) => r.data.data || []),
  });
}

export function useCreateCity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => createCityApi(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CITIES_KEY }),
  });
}

export function useUpdateCity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateCityApi(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CITIES_KEY }),
  });
}

export function useDeleteCity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteCityApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CITIES_KEY }),
  });
}
