import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDistanceFromLatLonInKm } from "../../utils/distance";

export default function RestaurantList({ restaurants = [], userCoords }) {
  const navigate = useNavigate();
  const [restWithDistance, setRestWithDistance] = useState([]);

  useEffect(() => {
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

  if (!restaurants || restaurants.length === 0) {
    return <p className="no-restaurants">No restaurants found.</p>;
  }

  return (
    <div className="rest-list">
      {restWithDistance.map((restaurant) => (
        <div
          key={restaurant.restaurant_id || restaurant.id}
          className="rest-item"
          onClick={() => handleClick(restaurant.restaurant_id || restaurant.id)}
        >
          {restaurant.image_url ? (
            <img
              src={restaurant.image_url}
              alt={restaurant.name || "Restaurant"}
              className="rest-img"
              onError={(e) => {
                e.target.src = "/default-restaurant.jpg";
              }}
            />
          ) : (
            <div className="rest-img placeholder" />
          )}

          <div className="rest-info">
            <h4>{restaurant.name || "Unnamed Restaurant"}</h4>
            {restaurant.address && <p>{restaurant.address}</p>}
            {restaurant.average_rating != null && <p>⭐ {restaurant.average_rating}</p>}
            {restaurant.distance != null && <p>📍 {restaurant.distance.toFixed(2)} km</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
