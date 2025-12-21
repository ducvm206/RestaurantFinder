// client/src/pages/ProfilePage.js - FINAL
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useTranslation from "../hooks/useTranslation";
import "../styles/Profile.css";

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

  // Helper function to get full avatar URL
  const getFullAvatarUrl = (avatarPath) => {
    if (!avatarPath || avatarPath.trim() === "") return null;
    
    if (avatarPath.startsWith("http")) {
      return avatarPath;
    }
    
    if (avatarPath.startsWith("/uploads/avatars/")) {
      return `http://localhost:5000${avatarPath}`;
    }
    
    if (!avatarPath.includes("/")) {
      return `http://localhost:5000/uploads/avatars/${avatarPath}`;
    }
    
    if (avatarPath.startsWith("/")) {
      return `http://localhost:5000${avatarPath}`;
    }
    
    return `http://localhost:5000/uploads/avatars/${avatarPath}`;
  };

  // =========================================
  // Fetch profile from backend
  // =========================================
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError("");
      
      const rawUser = localStorage.getItem("user");
      if (!rawUser) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/profile", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 401) {
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch profile");
      }

      if (!data.user) {
        throw new Error("No user data received from server");
      }

      // Convert avatar to full URL before storing
      const userWithFullAvatar = {
        ...data.user,
        avatar: getFullAvatarUrl(data.user.avatar) || data.user.avatar,
      };

      // Update state with fresh data
      setUser(userWithFullAvatar);
      setEditData({
        fullName: userWithFullAvatar.fullName || "",
        email: userWithFullAvatar.email || "",
        avatar: userWithFullAvatar.avatar || "",
      });

      localStorage.setItem("user", JSON.stringify(userWithFullAvatar));
      setLoading(false);
    } catch (err) {
      console.error("Profile error:", err);
      setError("Failed to fetch profile: " + err.message);
      setLoading(false);
      
      // Fallback to localStorage data
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        try {
          const userObj = JSON.parse(rawUser);
          setUser(userObj);
          setEditData({
            fullName: userObj.fullName || "",
            email: userObj.email || "",
            avatar: getFullAvatarUrl(userObj.avatar) || userObj.avatar || "",
          });
        } catch (e) {
          console.error("Failed to parse localStorage user:", e);
        }
      }
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
      avatar: getFullAvatarUrl(parsedUser.avatar) || parsedUser.avatar || "",
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
      
      // Debug logging
      console.log("Avatar upload debug:", {
        selectedFile: selectedFile,
        previewImage: previewImage,
        editDataAvatar: editData.avatar
      });
      
      // If there's a selected file, validate it first
      if (selectedFile) {
        // Validate file exists and is valid
        if (!selectedFile || !selectedFile.type || selectedFile.size === 0) {
          throw new Error(t("profile.errors.file_not_found"));
        }
        
        // Re-validate file type and size
        if (!selectedFile.type.startsWith("image/")) {
          throw new Error(t("profile.errors.invalid_image"));
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
          throw new Error(t("profile.errors.file_too_large"));
        }
        
        const formData = new FormData();
        formData.append("avatar", selectedFile);
        
        console.log("Uploading file:", selectedFile.name, selectedFile.size); // Debug log

        const uploadResponse = await fetch(
          "http://localhost:5000/api/profile/upload-avatar",
          { 
            method: "POST", 
            credentials: "include", 
            body: formData 
          }
        );

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || t("profile.errors.upload_failed"));
        }

        const uploadData = await uploadResponse.json();
        avatarUrl = uploadData.avatarUrl || uploadData.user?.avatar;
      }

      // Remove localhost prefix if present (for backend storage)
      if (avatarUrl && avatarUrl.includes("localhost:5000")) {
        avatarUrl = avatarUrl.replace("http://localhost:5000", "");
      }

      // Update profile data
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t("profile.errors.update_failed"));
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Update failed");
      }

      const userWithFullAvatar = {
        ...data.user,
        avatar: getFullAvatarUrl(data.user.avatar) || data.user.avatar,
      };

      setUser(userWithFullAvatar);
      setEditData({
        fullName: userWithFullAvatar.fullName || "",
        email: userWithFullAvatar.email || "",
        avatar: userWithFullAvatar.avatar || "",
      });

      localStorage.setItem("user", JSON.stringify(userWithFullAvatar));
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
  // Edit mode & Logout
  // =========================================
  const handleEditClick = () => {
    setIsEditMode(true);
    setPreviewImage(null);
    setSelectedFile(null);
  };

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("user");
    alert(t("profile.success.logout"));
    navigate("/login");
  };

  // Get display avatar URL
  const getDisplayAvatar = () => {
    if (previewImage) return previewImage;
    if (editData.avatar) return getFullAvatarUrl(editData.avatar);
    return null;
  };

  // =========================================
  // Loading/Error states
  // =========================================
  if (loading) {
    return (
      <div className="profile-loading-container">
        <div className="profile-loading-spinner"></div>
        <p>{t("profile.loading")}</p>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="profile-error-container">
        <span className="material-icons-outlined profile-error-icon">
          error_outline
        </span>
        <h2>{t("profile.errors.title")}</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/login")} className="profile-error-button">
          {t("profile.buttons.back_to_login")}
        </button>
      </div>
    );
  }

  const displayAvatar = getDisplayAvatar();

  // =========================================
  // Main profile page
  // =========================================
  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <button onClick={() => navigate("/home")} className="profile-back-button">
          <span className="material-icons-outlined">arrow_back</span>
        </button>
        <h1 className="profile-title">{t("profile.header.title")}</h1>
        {!isEditMode ? (
          <button onClick={handleEditClick} className="profile-edit-button">
            <span className="material-icons-outlined">edit</span>
          </button>
        ) : (
          <div className="profile-placeholder"></div>
        )}
      </div>

      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-avatar-container">
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt="Profile"
              className="profile-avatar-image"
              key={displayAvatar}
              onError={(e) => {
                if (editData.avatar && !editData.avatar.startsWith("http")) {
                  e.target.src = `http://localhost:5000${editData.avatar}`;
                } else {
                  e.target.style.display = "none";
                }
              }}
            />
          ) : (
            <div className="profile-avatar-default">
              {editData.fullName?.charAt(0).toUpperCase() || "U"}
            </div>
          )}

          {isEditMode && (
            <>
              <button onClick={() => fileInputRef.current.click()} className="profile-avatar-upload-button">
                <span className="material-icons-outlined">camera_alt</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="profile-file-input" />
            </>
          )}
        </div>

        {!isEditMode ? (
          <>
            <h2 className="profile-name">{user?.fullName || editData.fullName}</h2>
            <p className="profile-greeting">{t("profile.greeting")}</p>
          </>
        ) : (
          <p className="profile-edit-hint">{t("profile.edit.click_to_change")}</p>
        )}
      </div>

      {/* Details Card */}
      <div className="profile-details-card">
        {!isEditMode ? (
          <>
            <div className="profile-detail-item">
              <span className="material-icons-outlined profile-detail-icon">person</span>
              <div className="profile-detail-content">
                <label className="profile-detail-label">{t("profile.fields.full_name")}</label>
                <p className="profile-detail-value">{user?.fullName || editData.fullName}</p>
              </div>
            </div>
            <div className="profile-detail-item">
              <span className="material-icons-outlined profile-detail-icon">email</span>
              <div className="profile-detail-content">
                <label className="profile-detail-label">{t("profile.fields.email")}</label>
                <p className="profile-detail-value profile-email">{user?.email || editData.email}</p>
              </div>
            </div>
            <div className="profile-detail-item">
              <span className="material-icons-outlined profile-detail-icon">calendar_today</span>
              <div className="profile-detail-content">
                <label className="profile-detail-label">{t("profile.fields.created_at")}</label>
                <p className="profile-detail-value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("ja-JP", {
                    year: "numeric", month: "long", day: "numeric",
                  }) : "N/A"}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="profile-edit-field">
              <label className="profile-edit-label">{t("profile.fields.full_name")}</label>
              <input type="text" value={editData.fullName} onChange={(e) => setEditData({ ...editData, fullName: e.target.value })} className="profile-edit-input" placeholder={t("profile.placeholders.full_name")} />
            </div>
            <div className="profile-edit-field">
              <label className="profile-edit-label">{t("profile.fields.email")}</label>
              <input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="profile-edit-input" placeholder={t("profile.placeholders.email")} />
            </div>
          </>
        )}
      </div>

      {/* ACTION BUTTONS */}
      {!isEditMode ? (
        <>
          <button onClick={fetchUserProfile} className="profile-refresh-button">
            <span className="material-icons-outlined">refresh</span>{t("profile.buttons.refresh")}
          </button>
          <button onClick={handleLogout} className="profile-logout-button">
            <span className="material-icons-outlined">logout</span>{t("profile.buttons.logout")}
          </button>
        </>
      ) : (
        <>
          <button onClick={handleSaveProfile} disabled={isSaving} className={`profile-save-button ${isSaving ? 'profile-saving' : ''}`}>
            <span className="material-icons-outlined">{isSaving ? "hourglass_empty" : "save"}</span>
            {isSaving ? t("profile.buttons.saving") : t("profile.buttons.save")}
          </button>
          <button onClick={handleCancelEdit} disabled={isSaving} className={`profile-cancel-button ${isSaving ? 'profile-disabled' : ''}`}>
            <span className="material-icons-outlined">close</span>{t("profile.buttons.cancel")}
          </button>
        </>
      )}
    </div>
  );
};

export default ProfilePage;