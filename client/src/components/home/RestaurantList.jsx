// client/src/components/restaurant/RestaurantList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDistanceFromLatLonInKm } from "../../utils/distance";

export default function RestaurantList({ restaurants = [], userCoords }) {
  const navigate = useNavigate();
  const [restWithDistance, setRestWithDistance] = useState([]);

  useEffect(() => {
    const updated = restaurants.map((r) => {
      let distance = null;
      if (userCoords && r.latitude && r.longitude) {
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
    navigate(`/restaurants/${id}`);
  };

  return (
    <div className="rest-list">
      {restWithDistance.map((restaurant) => (
        <div
          key={restaurant.restaurant_id}
          className="rest-item"
          onClick={() => handleClick(restaurant.restaurant_id)}
        >
          {restaurant.image_url && (
            <img
              src={restaurant.image_url}
              alt={restaurant.name}
              className="rest-img"
            />
          )}
          <div className="rest-info">
            <h4>{restaurant.name}</h4>
            {restaurant.address && <p>{restaurant.address}</p>}
            <p>⭐ {restaurant.average_rating}</p>
            {restaurant.distance !== null && (
              <p>📍 {restaurant.distance.toFixed(2)} km</p>
            )}
          </div>
        </div>
      ))}
      {restWithDistance.length === 0 && <p>No restaurants found.</p>}
    </div>
  );
}
