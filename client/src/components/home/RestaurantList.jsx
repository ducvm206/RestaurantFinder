import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaMapMarkerAlt, FaMoneyBillWave, FaStore } from "react-icons/fa";
import { getDistanceFromLatLonInKm } from "../../utils/distance";
import { useLocationContext } from "../../context/LocationContext";

/* ===== Helpers ===== */
const shortText = (text, max = 100) => {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "..." : text;
};

const priceLabel = (price) => {
  switch (price) {
    case "cheap":
      return "$";
    case "moderate":
      return "$$";
    case "expensive":
      return "$$$";
    default:
      return "";
  }
};

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
    <div className="rest-list">
      {restWithDistance.map((restaurant) => (
        <div
          key={restaurant.restaurant_id || restaurant.id}
          className="rest-item"
          onClick={() =>
            handleClick(restaurant.restaurant_id || restaurant.id)
          }
        >
          {/* Image */}
          {restaurant.image_url ? (
            <img
              src={restaurant.image_url}
              alt={restaurant.name || "Restaurant"}
              className="rest-img"
              onError={(e) => (e.target.src = "/default-restaurant.jpg")}
            />
          ) : (
            <div className="rest-img placeholder" />
          )}

          {/* Info */}
          <div className="rest-info">
            {/* Name + Open */}
            <div className="rest-header">
              <h4 className="rest-name">{restaurant.name || "Unnamed Restaurant"}</h4>
              {restaurant.isOpen != null && (
                <span
                  className={`rest-status ${restaurant.isOpen ? "open" : "closed"}`}
                >
                  <FaStore /> {restaurant.isOpen ? "Open" : "Closed"}
                </span>
              )}
            </div>

            {/* Description */}
            {restaurant.description && (
              <p className="rest-desc">{shortText(restaurant.description, 80)}</p>
            )}

            {/* Address */}
            <p className="rest-address">
              <FaMapMarkerAlt />
              <span>{restaurant.address_ja || restaurant.address || restaurant.city}</span>
            </p>



            {/* Meta */}
            <div className="rest-meta">
              {restaurant.average_rating != null && (
                <span className="meta-item">
                  <FaStar /> {restaurant.average_rating}
                </span>
              )}

              {restaurant.price_range && (
                <span className="meta-item">
                  <FaMoneyBillWave /> {priceLabel(restaurant.price_range)}
                </span>
              )}

              {restaurant.distance != null && (
                <span className="meta-item">
                  <FaMapMarkerAlt /> {restaurant.distance.toFixed(2)} km
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}