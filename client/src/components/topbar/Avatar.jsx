import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Avatar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          // Your API returns { success, message, user }
          const userData = data.user || data;
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch (err) {
        console.error("Avatar fetch error:", err);
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error("Failed to parse stored user:", e);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="avatar-container" onClick={() => navigate("/profile")}>
        <div className="avatar-loading"></div>
        <span className="avatar-name">Loading...</span>
      </div>
    );
  }

  const safeUser = user || {};
  
  // Get display name from user data
  const displayName = 
    safeUser.fullName || 
    safeUser.full_name ||
    safeUser.name ||
    (safeUser.email ? safeUser.email.split("@")[0] : "") ||
    "User";

  // Get avatar URL - your API returns avatar in the user object
  const avatarPath = safeUser.avatar || safeUser.avatarUrl || "";
  
  // Convert relative path to full URL
  const getAvatarUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    if (path.startsWith("/uploads/avatars/")) {
      return `http://localhost:5000${path}`;
    }
    return path;
  };

  const avatarSrc = getAvatarUrl(avatarPath);
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="avatar-container" onClick={() => navigate("/profile")}>
      {avatarSrc ? (
        <img
          src={avatarSrc}
          alt={displayName}
          className="avatar-img"
          onError={(e) => {
            e.target.style.display = "none";
            const defaultAvatar = e.target.nextElementSibling;
            if (defaultAvatar) defaultAvatar.style.display = "flex";
          }}
        />
      ) : null}
      
      <div 
        className="avatar-default"
        style={{ display: avatarSrc ? "none" : "flex" }}
      >
        {initial}
      </div>
      
      <span className="avatar-name">{displayName}</span>
    </div>
  );
}
