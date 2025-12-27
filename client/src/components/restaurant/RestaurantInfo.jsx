import { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { FiMapPin, FiPhone, FiClock } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";
import { getDistanceFromLatLonInKm } from "../../utils/distance";
import { useLocationContext } from "../../context/LocationContext";
import "./RestaurantInfo.css";

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

    // Format opening hours
    if (restaurant.opening_hours) {
      if (typeof restaurant.opening_hours === "string") {
        setFormattedHours(restaurant.opening_hours);
      } else {
        const hoursObj = restaurant.opening_hours;
        const entries = Object.entries(hoursObj);
        
        if (entries.length === 0) {
          setFormattedHours("Hours not available");
        } else {
          // Handle different formats
          const formattedEntries = entries.map(([dayRange, hours]) => {
            // Clean up the day range display
            let cleanDayRange = dayRange;
            
            // Convert snake_case to proper format
            if (dayRange.includes("_")) {
              cleanDayRange = dayRange
                .split("_")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join("-");
            }
            
            // Convert lowercase to proper case
            else if (dayRange === dayRange.toLowerCase()) {
              // Check for specific patterns
              if (dayRange === "mon_sun" || dayRange === "mon-sun") {
                cleanDayRange = "Mon-Sun";
              } else if (dayRange === "mon_fri" || dayRange === "mon-fri") {
                cleanDayRange = "Mon-Fri";
              } else if (dayRange === "sat_sun" || dayRange === "sat-sun") {
                cleanDayRange = "Sat-Sun";
              } else {
                // Capitalize first letter of each word
                cleanDayRange = dayRange
                  .split(/[_-]/)
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join("-");
              }
            }
            
            // Ensure proper capitalization for standard day abbreviations
            cleanDayRange = cleanDayRange
              .replace(/\b(mon|tue|wed|thu|fri|sat|sun)\b/gi, match => 
                match.charAt(0).toUpperCase() + match.slice(1)
              );
            
            return `${cleanDayRange}: ${hours}`;
          });
          
          // Join with line breaks for cleaner display
          setFormattedHours(formattedEntries.join("\n"));
        }
      }
    }
  }, [restaurant, userCoords]);

  if (!restaurant) return <div>Loading...</div>;

  return (
    <div className="restaurant-info-wrapper">
      <div className="restaurant-info">
        {/* ADD LEFT PADDING TO THE CONTENT INSIDE */}
        <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <h2 ref={nameRef}>{restaurant.name}</h2>
          <p className="restaurant-description">
            {restaurant.description || "A high-quality Japanese restaurant."}
          </p>

          <div className="info-list">
            <div className="info-item">
              <AiFillStar className="icon" style={{ color: '#ffb400' }} />
              <span>{restaurant.average_rating || 0} / 5</span>
            </div>

            <div className="info-item">
              <FiMapPin className="icon" style={{ color: '#777' }} />
              <span>{restaurant.address_ja}</span>
            </div>

            {restaurant.phone && (
              <div className="info-item">
                <FiPhone className="icon" style={{ color: '#777' }} />
                <span>{restaurant.phone}</span>
              </div>
            )}

            {distanceKm && (
              <div className="info-item">
                <MdLocationOn className="icon" style={{ color: '#777' }} />
                <span>{distanceKm} km</span>
              </div>
            )}

            {formattedHours && (
              <div className="info-item opening-hours-item">
                <FiClock className="icon" style={{ color: '#ff5c5c' }} />
                <div className="opening-hours-text">
                  {formattedHours.split("\n").map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}