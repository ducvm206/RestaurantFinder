import { useState, useEffect } from "react";

export default function FindLocation({ onCoords }) {
  const [address, setAddress] = useState("位置情報を取得中...");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        onCoords && onCoords({ lat, lon });

        // Reverse geocode (optional)
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
          { headers: { "User-Agent": "MyReactApp/1.0" } }
        );
        const data = await res.json();
        setAddress(data.display_name || "住所が見つかりません");
      },
      (err) => {
        setAddress("位置情報を取得できません");
        console.error(err);
      }
    );
  }, [onCoords]);

  return <span>{address}</span>;
}
