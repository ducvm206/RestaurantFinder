import { useNavigate } from "react-router-dom";

export default function Avatar({ user }) {
  const navigate = useNavigate();
  const { fullName, avatar } = user;

  return (
    <div className="avatar-container" onClick={() => navigate("/profile")}>
      <img
        src={avatar || "/default-avatar.jpg"}
        alt={fullName || "ゲスト"}
        className="avatar-img"
      />
      <span className="avatar-name">{fullName || "ゲスト"}</span>
    </div>
  );
}
