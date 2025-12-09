import { useNavigate } from "react-router-dom";

export default function Avatar({ user }) {
  const navigate = useNavigate();

  const safeUser = user && typeof user === "object" ? user : {};
  const displayName =
    safeUser.fullName ||
    safeUser.name ||
    safeUser.full_name ||
    (safeUser.email ? safeUser.email.split("@")[0] : "") ||
    "User";

  const avatarSrc = safeUser.avatarUrl || safeUser.avatar || "";
  const initial = displayName.trim().charAt(0).toUpperCase() || "U";

  const handleClick = () => {
    navigate("/profile");
  };

  return (
    <div className="avatar-container" onClick={handleClick}>
      {avatarSrc ? (
        <img
          src={avatarSrc}
          alt={displayName}
          className="avatar-img"
          onError={(e) => {
            e.target.src = "/default-avatar.jpg";
          }}
        />
      ) : (
        <div className="avatar-default">{initial}</div>
      )}
      <span className="avatar-name">{displayName}</span>
    </div>
  );
}
