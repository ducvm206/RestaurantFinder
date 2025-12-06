import { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { FiMapPin, FiPhone, FiClock } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";
import { getDistanceFromLatLonInKm } from "../../utils/distance";

export default function RestaurantInfo({ restaurant }) {
  const [userLocation, setUserLocation] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);

  useEffect(() => {
    if (!restaurant) return;

    // get current location
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        setUserLocation({ lat: latitude, lon: longitude });

        if (restaurant.latitude && restaurant.longitude) {
          const d = getDistanceFromLatLonInKm(
            latitude,
            longitude,
            restaurant.latitude,
            restaurant.longitude
          );
          setDistanceKm(d.toFixed(2));
        }
      },
      (err) => console.error("Location error:", err)
    );
  }, [restaurant]);

  if (!restaurant) return <div>Loading...</div>;

  return (
    <div className="restaurant-info">
      {/* Name */}
      <h2>{restaurant.name}</h2>
      <p>{restaurant.description || "A high-quality Japanese restaurant."}</p>

      {/* Info List */}
      <div className="info-list">
        {/* Rating */}
        <p>
          <AiFillStar className="icon" /> {restaurant.average_rating || 0} / 5
        </p>

        {/* Address */}
        <p>
          <FiMapPin className="icon" /> {restaurant.address}, {restaurant.district}, {restaurant.city}
        </p>

        {/* Distance */}
        {distanceKm && (
          <p>
            <MdLocationOn className="icon" /> {distanceKm} km
          </p>
        )}

        {/* Phone */}
        {restaurant.phone && (
          <p>
            <FiPhone className="icon" /> {restaurant.phone}
          </p>
        )}

        {/* Opening Hours */}
        {restaurant.opening_hours && (
          <div className="opening-hours">
            <FiClock className="icon" />
            {typeof restaurant.opening_hours === "string" ? (
              <span>{restaurant.opening_hours}</span>
            ) : (
              Object.entries(restaurant.opening_hours).map(([day, hours]) => (
                <div key={day} className="opening-hour-item">
                  <strong>{day}</strong>: {hours}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
