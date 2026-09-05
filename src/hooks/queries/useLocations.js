import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLocationsApi,
  createLocationApi,
  updateLocationApi,
  deleteLocationApi,
} from "../../api/locations.api";

export const LOCATIONS_KEY = ["locations"];

export function useLocations() {
  return useQuery({
    queryKey: LOCATIONS_KEY,
    queryFn: () => getLocationsApi().then((r) => r.data.data || []),
  });
}

export function useCreateLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => createLocationApi(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: LOCATIONS_KEY }),
  });
}

export function useUpdateLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateLocationApi(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: LOCATIONS_KEY }),
  });
}

export function useDeleteLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteLocationApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: LOCATIONS_KEY }),
  });
}
