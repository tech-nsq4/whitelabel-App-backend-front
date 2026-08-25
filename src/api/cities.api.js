import client from "./client";

export const getCitiesApi = () => client.get("/api/admin/cities");
export const getCityApi = (id) => client.get(`/api/admin/cities/${id}`);
export const createCityApi = (data) => client.post("/api/admin/cities", data);
export const updateCityApi = (id, data) =>
  client.put(`/api/admin/cities/${id}`, data);
export const deleteCityApi = (id) => client.delete(`/api/admin/cities/${id}`);
