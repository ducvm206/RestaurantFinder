import { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { FiMapPin, FiPhone, FiClock } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";
import { getDistanceFromLatLonInKm } from "../../utils/distance";
import { useLocationContext } from "../../context/LocationContext";

export default function RestaurantInfo({ restaurant, nameRef }) {
  const { userCoords } = useLocationContext();
  const [distanceKm, setDistanceKm] = useState(null);
  const [formattedHours, setFormattedHours] = useState("");

  useEffect(() => {
    if (!restaurant || !userCoords) return;

    if (restaurant.latitude && restaurant.longitude) {
      const d = getDistanceFromLatLonInKm(
        userCoords.lat,
        userCoords.lon,
        restaurant.latitude,
        restaurant.longitude
      );
      setDistanceKm(d.toFixed(2));
    }
  }, [restaurant, userCoords]);

  if (!restaurant) return <div>Loading...</div>;

  return (
    <div className="restaurant-info">
      <h2 ref={nameRef}>{restaurant.name}</h2>
      <p>{restaurant.description || "A high-quality Japanese restaurant."}</p>

      <div className="info-list">
        <p>
          <AiFillStar className="icon" /> {restaurant.average_rating || 0} / 5
        </p>

        <p>
          <FiMapPin className="icon" /> {restaurant.address_ja}
        </p>

        {restaurant.phone && (
          <p className="info-item">
            <FiPhone className="icon" /> {restaurant.phone}
          </p>
        )}

        {distanceKm && (
          <p className="info-item">
            <MdLocationOn className="icon" /> {distanceKm} km
          </p>
        )}

        {restaurant.opening_hours && (
          <div className="opening-hours">
            <FiClock className="icon" />
            {typeof restaurant.opening_hours === "string"
              ? restaurant.opening_hours
              : Object.entries(restaurant.opening_hours).map(([day, hours]) => (
                  <div key={day}>
                    <strong>{day}</strong>: {hours}
                  </div>
                ))}
          </div>
        )}
      </div>
    </div>
  );
}
