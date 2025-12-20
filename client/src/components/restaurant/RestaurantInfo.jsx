import { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { FiMapPin, FiPhone, FiClock } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";
import { getDistanceFromLatLonInKm } from "../../utils/distance";
import "./RestaurantInfo.css";

// Helper function to capitalize first letter of each word
const capitalizeWords = (str) => {
  return str.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

// Helper function to format day names to proper 3-letter format with capitalization
const formatDayName = (dayKey) => {
  const dayMap = {
    mon: "Mon",
    tue: "Tue", 
    wed: "Wed",
    thu: "Thu",
    fri: "Fri",
    sat: "Sat",
    sun: "Sun",
    // Handle status indicators
    sta: "Today",
    status: "Today",
    today: "Today",
    now: "Now"
  };
  
  // If it's already a formatted day range like "Mon - Sun", capitalize it properly
  if (dayKey.includes(" - ")) {
    return capitalizeWords(dayKey);
  }
  
  // Handle lowercase ranges like "fri - wed" or "fri-wed"
  if (dayKey.includes(" - ") || dayKey.includes("-")) {
    const separator = dayKey.includes(" - ") ? " - " : "-";
    const days = dayKey.split(separator);
    return days.map(day => {
      const trimmedDay = day.trim().toLowerCase();
      return dayMap[trimmedDay] || 
        (trimmedDay.charAt(0).toUpperCase() + trimmedDay.slice(1, 3));
    }).join(separator);
  }
  
  // Handle ranges with underscores like "mon_sun"
  if (dayKey.includes("_")) {
    const days = dayKey.split("_");
    return days.map(day => {
      const lowerDay = day.toLowerCase();
      return dayMap[lowerDay] || 
        (lowerDay.charAt(0).toUpperCase() + lowerDay.slice(1, 3));
    }).join(" - ");
  }
  
  // Check for status indicators
  const lowerKey = dayKey.toLowerCase();
  if (dayMap[lowerKey]) {
    return dayMap[lowerKey];
  }
  
  // Capitalize single days: "fri" -> "Fri", "wed" -> "Wed"
  return dayKey.length >= 3 
    ? (dayKey.charAt(0).toUpperCase() + dayKey.slice(1, 3).toLowerCase())
    : dayKey;
};

// Helper function to parse and clean time format
const formatTime = (timeStr) => {
  if (!timeStr) return "";
  
  // Clean up time formatting: "08:00-22:00" -> "08:00 - 22:00"
  return timeStr
    .replace(/(\d{2}:\d{2})-(\d{2}:\d{2})/g, "$1 - $2")
    .replace(/(\d{1,2}(?:am|pm)?)-(\d{1,2}(?:am|pm)?)/gi, "$1 - $2")
    .trim();
};

// Helper function to parse opening hours
const formatOpeningHours = (openingHours) => {
  if (!openingHours) return "";
  
  // If it's an object with separate days
  if (typeof openingHours === "object") {
    const entries = Object.entries(openingHours);
    
    // Check if it has a status/today entry
    const statusEntry = entries.find(([key]) => 
      key.toLowerCase() === 'sta' || 
      key.toLowerCase() === 'status' || 
      key.toLowerCase() === 'today'
    );
    
    // If there's a status entry, use that
    if (statusEntry) {
      const [key, hours] = statusEntry;
      return `${formatDayName(key)}: ${formatTime(hours)}`;
    }
    
    // Otherwise use regular formatting
    if (entries.length === 1) {
      const [day, hours] = entries[0];
      return `${formatDayName(day)}: ${formatTime(hours)}`;
    }
    
    // For multiple days, show first and last
    return `${formatDayName(entries[0][0])} - ${formatDayName(entries[entries.length - 1][0])}: ${formatTime(entries[0][1])}`;
  }
  
  // If it's a string
  if (typeof openingHours === "string") {
    // Handle "fri - wed: 08:00-22:00" format
    const colonIndex = openingHours.indexOf(":");
    if (colonIndex !== -1) {
      const dayPart = openingHours.substring(0, colonIndex).trim();
      const timePart = openingHours.substring(colonIndex + 1).trim();
      
      // Format the day part (e.g., "fri - wed" -> "Fri - Wed")
      const formattedDayPart = formatDayName(dayPart);
      
      // Format the time part (e.g., "08:00-22:00" -> "08:00 - 22:00")
      const formattedTimePart = formatTime(timePart);
      
      return `${formattedDayPart}: ${formattedTimePart}`;
    }
    
    // If no colon found, try to clean up and return as is
    return formatTime(openingHours);
  }
  
  return "";
};

export default function RestaurantInfo({ restaurant }) {
  const [userLocation, setUserLocation] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [formattedHours, setFormattedHours] = useState("");

  useEffect(() => {
    if (!restaurant) return;
    
    // Format opening hours
    const hours = formatOpeningHours(restaurant.opening_hours);
    setFormattedHours(hours);

    // Get current location
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

      {/* Info List - All items in same consistent format */}
      <div className="info-list">
        {/* Rating */}
        <p className="info-item">
          <AiFillStar className="icon" /> {restaurant.average_rating || 0} / 5
        </p>

        {/* Address */}
        <p className="info-item">
          <FiMapPin className="icon" /> {restaurant.address_ja}
        </p>

        {/* Distance */}
        {distanceKm && (
          <p className="info-item">
            <MdLocationOn className="icon" /> {distanceKm} km
          </p>
        )}

        {/* Phone */}
        {restaurant.phone && (
          <p className="info-item">
            <FiPhone className="icon" /> {restaurant.phone}
          </p>
        )}

        {/* Opening Hours */}
        {formattedHours && (
          <p className="info-item">
            <FiClock className="icon clock-icon" /> {formattedHours}
          </p>
        )}
      </div>
    </div>
  );
}