import { useNavigate } from "react-router-dom";

export default function Avatar({ user = {} }) {
  const navigate = useNavigate();

  const fullName = user.fullName || "ゲスト";
  const avatarSrc =
    user.avatarUrl ||
    user.avatar ||
    "/default-avatar.jpg";

  const handleClick = () => {
    navigate("/profile");
  };

  return (
    <div className="avatar-container" onClick={handleClick}>
      <img
        src={avatarSrc}
        alt={fullName}
        className="avatar-img"
        onError={(e) => {
          e.target.src = "/default-avatar.jpg";
        }}
      />
      <span className="avatar-name">{fullName}</span>
    </div>
  );
}
