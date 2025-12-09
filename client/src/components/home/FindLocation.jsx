import { useState, useEffect } from "react";

export default function FindLocation({ onCoords }) {
  const [address, setAddress] = useState("Đang lấy vị trí...");

  useEffect(() => {
    if (!navigator.geolocation) {
      setAddress("Trình duyệt không hỗ trợ định vị");
      return;
    }

    const watcherId = navigator.geolocation.watchPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        onCoords && onCoords({ lat, lon });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
            { headers: { "User-Agent": "MyReactApp/1.0" } }
          );
          const data = await res.json();
          setAddress(data.display_name || "Không xác định được địa chỉ");
        } catch (err) {
          console.error("Reverse geocode error:", err);
          setAddress("Không xác định được địa chỉ");
        }
      },
      (err) => {
        setAddress("Không thể lấy vị trí");
        console.error(err);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );

    return () => {
      if (watcherId) navigator.geolocation.clearWatch(watcherId);
    };
  }, [onCoords]);

  return <span>{address}</span>;
}