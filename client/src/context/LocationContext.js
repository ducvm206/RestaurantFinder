// src/context/LocationContext.js
import { createContext, useContext, useEffect, useState } from "react";

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [userCoords, setUserCoords] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    // ⭐ Theo dõi vị trí liên tục
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn("Location blocked:", err);
        setError(err);
      },
      {
        enableHighAccuracy: true,   // chính xác hơn
        maximumAge: 0,              // luôn lấy vị trí mới
        timeout: 10000,
      }
    );

    // Cleanup khi component unmount
    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  return (
    <LocationContext.Provider value={{ userCoords, error }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  return useContext(LocationContext);
}
