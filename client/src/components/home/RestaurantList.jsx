import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDistanceFromLatLonInKm } from "../../utils/distance";
import { useLocationContext } from "../../context/LocationContext";

export default function RestaurantList({ restaurants = [] }) {
  const navigate = useNavigate();
  const { userCoords } = useLocationContext();
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
    <div className="rest-list">
      {restWithDistance.map((restaurant) => (
        <div
          key={restaurant.restaurant_id || restaurant.id}
          className="rest-item"
          onClick={() => handleClick(restaurant.restaurant_id || restaurant.id)}
          style={{
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
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
            <h4 style={{ margin: '8px 0 4px 0', fontSize: '16px', color: '#222' }}>
              {restaurant.name || "Unnamed Restaurant"}
            </h4>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '6px' }}>
              {restaurant.address_ja || restaurant.address || restaurant.city}
            </p>

            <p style={{ color: '#e67e22', fontWeight: '600', marginBottom: '4px' }}>
              ⭐ {getRatingDisplay(restaurant)}
              <span style={{ color: '#777', fontWeight: 'normal', fontSize: '13px', marginLeft: '4px' }}>
                ({restaurant.total_reviews || 0})
              </span>
            </p>

            {/* ⭐ UPDATED: Centered distance display with 📍 icon */}
            {restaurant.distance != null && (
              <div style={{
                marginTop: '6px',
                display: 'flex',
                justifyContent: 'center',  /* Centers horizontally */
                alignItems: 'center',      /* Centers vertically */
                gap: '4px'
              }}>
                <span style={{ fontSize: '12px' }}>📍</span>
                <span style={{
                  fontSize: '13px',
                  color: '#333',
                  fontWeight: '500'
                }}>
                  {restaurant.distance.toFixed(1)} km
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}