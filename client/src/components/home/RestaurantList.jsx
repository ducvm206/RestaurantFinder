import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDistanceFromLatLonInKm } from "../../utils/distance";
import { useLocationContext } from "../../context/LocationContext";

export default function RestaurantList({ restaurants = [] }) {
  const navigate = useNavigate();
  const { userCoords } = useLocationContext();
  const [restWithDistance, setRestWithDistance] = useState([]);

  useEffect(() => {
    console.log("Restaurants:", restaurants);
    console.log("User Coords:", userCoords);

    const updated = restaurants.map((r) => {
      let distance = null;

      if (
        userCoords &&
        r.latitude != null &&
        r.longitude != null &&
        !isNaN(r.latitude) &&
        !isNaN(r.longitude)
      ) {
        distance = getDistanceFromLatLonInKm(
          userCoords.lat,
          userCoords.lon,
          parseFloat(r.latitude),
          parseFloat(r.longitude)
        );
      }

      return { ...r, distance };
    });

    setRestWithDistance(updated);
  }, [restaurants, userCoords]);

  const handleClick = (id) => {
    if (!id) return;
    navigate(`/restaurants/${id}`);
  };

  const getRatingDisplay = (restaurant) => {
    const totalReviews = Number(restaurant.total_reviews) || 0;
    const avgRating = restaurant.average_rating;
    
    if (totalReviews === 0) return "No reviews yet";
    if (avgRating === null || avgRating === undefined) return `${totalReviews} reviews`;
    
    const rating = parseFloat(avgRating);
    if (isNaN(rating)) return `${totalReviews} reviews`;
    
    return rating.toFixed(1);
  };

  if (!restaurants || restaurants.length === 0) {
    return <p className="no-restaurants">No restaurants found.</p>;
  }

  return (
    <div className="restaurants-list">
      {restWithDistance.map((restaurant) => (
        <div
          key={restaurant.restaurant_id || restaurant.id}
          className="restaurant-card"
          onClick={() =>
            handleClick(restaurant.restaurant_id || restaurant.id)
          }
        >
          <img
            src={restaurant.image_url || "/default-restaurant.jpg"}
            alt={restaurant.name || "Restaurant"}
            className="restaurant-image"
            onError={(e) => (e.target.src = "/default-restaurant.jpg")}
          />

          <div className="restaurant-info">
            <h3 className="restaurant-name">{restaurant.name || "Unnamed Restaurant"}</h3>
            <p className="restaurant-address">
              {restaurant.address_ja || restaurant.address || restaurant.city || "Đang cập nhật"}
            </p>

            <div className="restaurant-meta">
              <span className="rating">⭐ {getRatingDisplay(restaurant)}</span>
              {restaurant.price_range && (
                <span className="price">{restaurant.price_range}</span>
              )}
              {restaurant.distance != null && (
                <span className="distance">{restaurant.distance.toFixed(2)} km</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
