import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import useTranslation from "../hooks/useTranslation";
import { useLocationContext } from "../context/LocationContext"; // ⭐ Lấy userCoords
import { getDistanceFromLatLonInKm } from "../utils/distance"; // ⭐ Tính khoảng cách
import "../styles/FavoritesPage.css";

export default function FavoritesPage() {
  const t = useTranslation();
  const navigate = useNavigate();
  const { userCoords } = useLocationContext(); // ⭐ lấy vị trí
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFavorites = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/favorites", {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (!res.ok) throw new Error("Cannot fetch favorites");

      const data = await res.json();

      let updated = data || [];

      // ⭐ Thêm khoảng cách vào từng restaurant
      if (userCoords) {
        updated = updated.map((fav) => {
          const r = fav.restaurant || {};
          if (r.latitude && r.longitude) {
            const distance = getDistanceFromLatLonInKm(
              userCoords.lat,
              userCoords.lon,
              parseFloat(r.latitude),
              parseFloat(r.longitude)
            );
            return { ...fav, distance };
          }
          return fav;
        });
      }

      setFavorites(updated);
    } catch (err) {
      console.error("Fetch favorites failed:", err);
      setError("Không thể tải danh sách yêu thích.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
    const handleUpdated = () => loadFavorites();
    window.addEventListener("favorites-updated", handleUpdated);
    return () => window.removeEventListener("favorites-updated", handleUpdated);
  }, [navigate, userCoords]); // ⭐ reload khi userCoords thay đổi

  const removeFavorite = async (restaurantId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/favorites/${restaurantId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (!res.ok) throw new Error("Remove favorite failed");

      setFavorites((prev) =>
        prev.filter((fav) => fav.restaurant_id !== restaurantId)
      );
    } catch (err) {
      console.error("Remove favorite error:", err);
      setError("Không thể xóa yêu thích.");
    }
  };

  if (loading) {
    return (
      <div className="favorites-page">
        <p>{t("home.loading")}</p>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <h2 className="favorites-title">{t("home.favorites")}</h2>

      {error && <p className="favorites-error">{error}</p>}

      {favorites.length === 0 ? (
        <p className="favorites-empty">Chưa có địa điểm yêu thích.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((fav) => {
            const restaurant = fav.restaurant || {};
            const restaurantId = restaurant.restaurant_id || fav.restaurant_id;

            return (
              <div
                key={fav.favorite_id || restaurantId}
                className="favorite-card"
                onClick={() => navigate(`/restaurants/${restaurantId}`)}
              >
                {/* Remove favorite button */}
                <button
                  className="favorite-heart"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(restaurantId);
                  }}
                  aria-label="Remove favorite"
                >
                  <AiFillHeart className="heart-icon filled" />
                  <AiOutlineHeart className="heart-icon outline" />
                </button>

                {/* Restaurant Image */}
                {restaurant.image_url ? (
                  <img
                    src={restaurant.image_url}
                    alt={restaurant.name}
                    className="favorite-img"
                  />
                ) : (
                  <div className="favorite-img placeholder" />
                )}

                {/* Info */}
                <div className="favorite-info">
                  <h3>{restaurant.name || "Nhà hàng"}</h3>

                  <p>
                    {restaurant.district || ""}
                    {restaurant.city ? ` - ${restaurant.city}` : ""}
                  </p>

                  {/* ⭐ Rating */}
                  {restaurant.average_rating && (
                    <p>⭐ {restaurant.average_rating}</p>
                  )}

                  {/* ⭐ Khoảng cách */}
                  {fav.distance != null && (
                    <p className="favorite-distance">
                      📍 {fav.distance.toFixed(2)} km
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
