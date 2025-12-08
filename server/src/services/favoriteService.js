import api from "./api";

export const fetchFavorites = () => api.get("/favorites");
export const saveFavorite = (restaurantId, notes) =>
  api.post("/favorites", { restaurant_id: restaurantId, notes });
export const removeFavorite = (restaurantId) =>
  api.delete(`/favorites/${restaurantId}`);
