// FILE: client/src/pages/ProfilePage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useTranslation from "../hooks/useTranslation";

const ProfilePage = () => {
  const navigate = useNavigate();
  const t = useTranslation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editData, setEditData] = useState({
    fullName: "",
    email: "",
    avatar: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // =========================================
  // Fetch profile from backend
  // =========================================
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const rawUser = localStorage.getItem("user");

      if (!rawUser) {
        navigate("/login");
        return;
      }

      let userObj = rawUser;
      while (typeof userObj === "string") {
        try {
          userObj = JSON.parse(userObj);
        } catch {
          break;
        }
      }

      setUser(userObj);
      setEditData({
        fullName: userObj.fullName,
        email: userObj.email,
        avatar: userObj.avatar || "",
      });

      const response = await fetch("http://localhost:5000/api/profile", {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      const data = await response.json();
      setUser(data.user);
      setEditData({
        fullName: data.user.fullName,
        email: data.user.email,
        avatar: data.user.avatar || "",
      });

      localStorage.setItem("user", JSON.stringify(data.user));
      setLoading(false);
    } catch (err) {
      console.error("Profile error:", err);
      setError("Failed to fetch profile");
      setLoading(false);
    }
  };

  // =========================================
  // Image select
  // =========================================
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert(t("profile.errors.invalid_image"));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(t("profile.errors.file_too_large"));
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  // =========================================
  // Cancel edit
  // =========================================
  const handleCancelEdit = () => {
    setIsEditMode(false);

    const parsedUser = typeof user === "string" ? JSON.parse(user) : user;
    setEditData({
      fullName: parsedUser.fullName,
      email: parsedUser.email,
      avatar: parsedUser.avatar || "",
    });

    setPreviewImage(null);
    setSelectedFile(null);
  };

  // =========================================
  // Save profile
  // =========================================
  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      let avatarUrl = editData.avatar;

      // Upload avatar if new file selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("avatar", selectedFile);

        const uploadResponse = await fetch(
          "http://localhost:5000/api/profile/upload-avatar",
          { method: "POST", credentials: "include", body: formData }
        );

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(
            uploadData.message || t("profile.errors.upload_failed")
          );
        }

        avatarUrl = uploadData.avatarUrl;
      }

      const response = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: editData.fullName,
          email: editData.email,
          avatar: avatarUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("profile.errors.update_failed"));
      }

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      setIsEditMode(false);
      setPreviewImage(null);
      setSelectedFile(null);

      alert(t("profile.success.updated"));
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(`${t("profile.errors.general")}: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // =========================================
  // Edit mode
  // =========================================
  const handleEditClick = () => {
    setIsEditMode(true);
    setPreviewImage(null);
    setSelectedFile(null);
  };

  // =========================================
  // Logout
  // =========================================
  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    localStorage.removeItem("user");
    alert(t("profile.success.logout"));
    navigate("/login");
  };

  // =========================================
  // Loading/Error states
  // =========================================
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #ef4444",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <p>{t("profile.loading")}</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <span
          className="material-icons-outlined"
          style={{ fontSize: "4rem", color: "#ef4444", marginBottom: "1rem" }}
        >
          error_outline
        </span>
        <h2 style={{ color: "#1f2937", marginBottom: "0.5rem" }}>
          {t("profile.errors.title")}
        </h2>
        <p style={{ color: "#6b7280", marginBottom: "2rem" }}>{error}</p>
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "0.75rem 2rem",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600",
          }}
        >
          {t("profile.buttons.back_to_login")}
        </button>
      </div>
    );
  }

  // =========================================
  // Main profile page
  // =========================================
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "1rem",
        fontFamily: "'Noto Sans JP', 'Helvetica Neue', Arial, sans-serif",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 0",
          marginBottom: "2rem",
        }}
      >
        <button
          onClick={() => navigate("/home")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = "rgba(0,0,0,0.05)")
          }
          onMouseOut={(e) => (e.currentTarget.style.background = "none")}
        >
          <span className="material-icons-outlined">arrow_back</span>
        </button>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
          {t("profile.header.title")}
        </h1>
        {!isEditMode ? (
          <button
            onClick={handleEditClick}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: "0.5rem",
              borderRadius: "0.5rem",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "rgba(0,0,0,0.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.background = "none")}
          >
            <span className="material-icons-outlined">edit</span>
          </button>
        ) : (
          <div style={{ width: "40px" }}></div>
        )}
      </div>

      {/* Profile Section */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          background: "white",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            margin: "0 auto 1rem",
            width: "100px",
            height: "100px",
            position: "relative",
          }}
        >
          {previewImage || editData.avatar ? (
            <img
              src={previewImage || editData.avatar}
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #ef4444",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.5rem",
                fontWeight: 700,
              }}
            >
              {editData.fullName?.charAt(0).toUpperCase() || "U"}
            </div>
          )}

          {isEditMode && (
            <>
              <button
                onClick={() => fileInputRef.current.click()}
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "2px solid white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                <span
                  className="material-icons-outlined"
                  style={{ fontSize: "1.2rem" }}
                >
                  camera_alt
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: "none" }}
              />
            </>
          )}
        </div>

        {!isEditMode ? (
          <>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0.5rem 0" }}>
              {user.fullName}
            </h2>
            <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
              {t("profile.greeting")}
            </p>
            <div
              style={{
                display: "inline-block",
                padding: "0.25rem 0.75rem",
                backgroundColor:
                  user.authType === "google"
                    ? "#4285F4"
                    : user.authType === "facebook"
                    ? "#1877F2"
                    : "#6B7280",
                color: "white",
                borderRadius: "1rem",
                fontSize: "0.75rem",
                marginTop: "0.5rem",
              }}
            >
              {user.authType === "google" && "🔗 Google"}
              {user.authType === "facebook" && "🔗 Facebook"}
              {user.authType === "local" && "📧 Email"}
            </div>
          </>
        ) : (
          <p style={{ color: "#6b7280", fontSize: "0.9rem", marginTop: "0.5rem" }}>
            {t("profile.edit.click_to_change")}
          </p>
        )}
      </div>

      {/* Details Card */}
      <div
        style={{
          background: "white",
          borderRadius: "1rem",
          padding: "1.5rem",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: "1.5rem",
        }}
      >
        {!isEditMode ? (
          <>
            {/* FULL NAME */}
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <span className="material-icons-outlined" style={{ fontSize: "1.5rem", color: "#ef4444" }}>person</span>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem", fontWeight: 500 }}>
                  {t("profile.fields.full_name")}
                </label>
                <p style={{ margin: 0, fontSize: "1rem", color: "#1f2937" }}>{user.fullName}</p>
              </div>
            </div>

            {/* EMAIL */}
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <span className="material-icons-outlined" style={{ fontSize: "1.5rem", color: "#ef4444" }}>email</span>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem", fontWeight: 500 }}>
                  {t("profile.fields.email")}
                </label>
                <p style={{ margin: 0, fontSize: "1rem", color: "#1f2937", wordBreak: "break-word" }}>{user.email}</p>
              </div>
            </div>

            {/* CREATED DATE */}
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <span className="material-icons-outlined" style={{ fontSize: "1.5rem", color: "#ef4444" }}>calendar_today</span>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem", fontWeight: 500 }}>
                  {t("profile.fields.created_at")}
                </label>
                <p style={{ margin: 0, fontSize: "1rem", color: "#1f2937" }}>
                  {new Date(user.createdAt).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* EDIT FULL NAME */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem", fontWeight: 500 }}>
                {t("profile.fields.full_name")}
              </label>
              <input
                type="text"
                value={editData.fullName}
                onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
                placeholder={t("profile.placeholders.full_name")}
              />
            </div>

            {/* EDIT EMAIL */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  color: "#6b7280",
                  marginBottom: "0.5rem",
                  fontWeight: 500,
                }}
              >
                {t("profile.fields.email")}
              </label>
              <input
                type="email"
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
                placeholder={t("profile.placeholders.email")}
              />
            </div>
          </>
        )}
      </div>

      {/* ACTION BUTTONS */}
      {!isEditMode ? (
        <>
          <button
            onClick={fetchUserProfile}
            style={{
              width: "100%",
              padding: "1rem",
              backgroundColor: "white",
              color: "#ef4444",
              border: "2px solid #ef4444",
              borderRadius: "0.75rem",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#fef2f2";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "white";
            }}
          >
            <span className="material-icons-outlined">refresh</span>
            {t("profile.buttons.refresh")}
          </button>

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "1rem",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "0.75rem",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#dc2626";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 4px 8px rgba(239, 68, 68, 0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#ef4444";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span className="material-icons-outlined">logout</span>
            {t("profile.buttons.logout")}
          </button>
        </>
      ) : (
        <>
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            style={{
              width: "100%",
              padding: "1rem",
              backgroundColor: isSaving ? "#9ca3af" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: "0.75rem",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: isSaving ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              if (!isSaving) e.currentTarget.style.backgroundColor = "#059669";
            }}
            onMouseOut={(e) => {
              if (!isSaving) e.currentTarget.style.backgroundColor = "#10b981";
            }}
          >
            <span className="material-icons-outlined">
              {isSaving ? "hourglass_empty" : "save"}
            </span>
            {isSaving ? t("profile.buttons.saving") : t("profile.buttons.save")}
          </button>

          <button
            onClick={handleCancelEdit}
            disabled={isSaving}
            style={{
              width: "100%",
              padding: "1rem",
              backgroundColor: "white",
              color: "#6b7280",
              border: "2px solid #e5e7eb",
              borderRadius: "0.75rem",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: isSaving ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              if (!isSaving) e.currentTarget.style.backgroundColor = "#f9fafb";
            }}
            onMouseOut={(e) => {
              if (!isSaving) e.currentTarget.style.backgroundColor = "white";
            }}
          >
            <span className="material-icons-outlined">close</span>
            {t("profile.buttons.cancel")}
          </button>
        </>
      )}
    </div>
  );
};
export default ProfilePage;

