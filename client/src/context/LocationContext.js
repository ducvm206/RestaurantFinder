/// context/LocationContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

const LocationContext = createContext();

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    console.warn("useLocationContext must be used within LocationProvider");
    return {
      userCoords: null,
      locationError: null,
      isLoading: false,
      isUsingFallback: false,
      locationSource: null,
      accuracy: null,
      refreshLocation: () => Promise.reject("LocationProvider not available"),
    };
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [userCoords, setUserCoords] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [locationSource, setLocationSource] = useState(null);
  const [accuracy, setAccuracy] = useState(null);

  const getGeolocationError = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "位置情報の利用が拒否されました。ブラウザの設定を確認してください。";
      case error.POSITION_UNAVAILABLE:
        return "位置情報を取得できません。ネットワーク接続を確認してください。";
      case error.TIMEOUT:
        return "位置情報の取得に時間がかかりすぎました。";
      default:
        return `位置情報エラー: ${error.message || "不明なエラー"}`;
    }
  };

  const getLocationFromIP = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/", {
        headers: {
          "User-Agent": "RestaurantApp/1.0",
        },
      });
      const data = await response.json();

      if (data.latitude && data.longitude) {
        return {
          lat: data.latitude,
          lon: data.longitude,
          source: "ip",
          accuracy: 10000, // Approximate accuracy for IP location
          city: data.city,
          country: data.country_name,
        };
      }
    } catch (error) {
      console.error("IP location failed:", error);
    }

    // Default fallback (Tokyo)
    return {
      lat: 35.6762,
      lon: 139.6503,
      source: "default",
      accuracy: 50000,
      city: "Tokyo",
      country: "Japan",
    };
  };

  const initializeLocation = async () => {
    if (!navigator.geolocation) {
      console.log("Geolocation API not supported");
      const ipLocation = await getLocationFromIP();
      setUserCoords({ lat: ipLocation.lat, lon: ipLocation.lon });
      setLocationSource(ipLocation.source);
      setIsUsingFallback(true);
      setAccuracy(ipLocation.accuracy);
      setLocationError("Geolocation not supported");
      setIsLoading(false);
      return;
    }

    console.log("Requesting location permission...");

    // First try with quick timeout for better UX
    const quickLocationPromise = new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 60000, // Accept location up to 1 minute old
        }
      );
    });

    try {
      const position = await quickLocationPromise;
      const coords = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };

      console.log("Got location quickly:", coords);
      setUserCoords(coords);
      setAccuracy(position.coords.accuracy);
      setLocationSource("gps");
      setIsUsingFallback(false);
      setLocationError(null);
      setIsLoading(false);

      // Try to get more accurate location in background
      if (position.coords.accuracy > 1000) {
        setTimeout(() => {
          navigator.geolocation.getCurrentPosition(
            (accuratePos) => {
              if (accuratePos.coords.accuracy < position.coords.accuracy) {
                console.log("Got more accurate location:", accuratePos.coords.accuracy);
                setUserCoords({
                  lat: accuratePos.coords.latitude,
                  lon: accuratePos.coords.longitude,
                });
                setAccuracy(accuratePos.coords.accuracy);
              }
            },
            () => {}, // Silent fail for background improvement
            { enableHighAccuracy: true, timeout: 10000 }
          );
        }, 1000);
      }
    } catch (quickError) {
      console.log("Quick location failed, trying with longer timeout:", quickError.message);

      // Try again with longer timeout and high accuracy
      const accurateLocationPromise = new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          }
        );
      });

      try {
        const position = await accurateLocationPromise;
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };

        console.log("Got accurate location after retry:", coords);
        setUserCoords(coords);
        setAccuracy(position.coords.accuracy);
        setLocationSource("gps");
        setIsUsingFallback(false);
        setLocationError(null);
      } catch (accurateError) {
        console.log("All geolocation attempts failed, using IP fallback");

        const errorMessage = getGeolocationError(accurateError);
        const ipLocation = await getLocationFromIP();

        setUserCoords({ lat: ipLocation.lat, lon: ipLocation.lon });
        setLocationSource(ipLocation.source);
        setIsUsingFallback(true);
        setAccuracy(ipLocation.accuracy);
        setLocationError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeLocation();

    // Set up periodic location updates (every 5 minutes)
    const updateInterval = setInterval(() => {
      if (!isUsingFallback && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserCoords({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
            setAccuracy(position.coords.accuracy);
            console.log("Periodic location update");
          },
          (error) => {
            console.log("Periodic update failed:", error.message);
          },
          { enableHighAccuracy: false, maximumAge: 300000 } // 5 minutes
        );
      }
    }, 300000); // 5 minutes

    return () => {
      clearInterval(updateInterval);
    };
  }, []);

  const refreshLocation = async (useHighAccuracy = true) => {
    if (!navigator.geolocation) {
      const error = "Geolocation not supported";
      setLocationError(error);
      return Promise.reject(error);
    }

    setIsLoading(true);
    setLocationError(null);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          console.log("Manual refresh success:", coords);
          setUserCoords(coords);
          setAccuracy(position.coords.accuracy);
          setLocationSource("gps");
          setIsUsingFallback(false);
          setLocationError(null);
          setIsLoading(false);
          resolve(coords);
        },
        (error) => {
          console.error("Manual refresh failed:", error);
          const errorMessage = getGeolocationError(error);
          setLocationError(errorMessage);
          setIsLoading(false);
          reject(error);
        },
        {
          enableHighAccuracy: useHighAccuracy,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    });
  };

  return (
    <LocationContext.Provider
      value={{
        userCoords,
        locationError,
        isLoading,
        isUsingFallback,
        locationSource,
        accuracy,
        refreshLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};