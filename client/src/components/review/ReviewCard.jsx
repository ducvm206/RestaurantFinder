// ═══════════════════════════════════════════════════════════════
// REVIEW CARD COMPONENT - WITH EDIT FUNCTIONALITY
// ═══════════════════════════════════════════════════════════════
import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { LanguageContext } from "../../context/LanguageContext";
import EditReviewModal from "./EditReviewModal";
import "./ReviewCard.css";

// Import trực tiếp các file translation
import translationsJa from "../../translations/ja.json";
import translationsEn from "../../translations/en.json";
import translationsVi from "../../translations/vi.json";

const translations = {
  ja: translationsJa,
  en: translationsEn,
  vi: translationsVi,
};

const ReviewCard = ({
  review,
  currentUserId,
  restaurantName,
  onDelete,
  onUpdate,
}) => {
  const { lang } = useContext(LanguageContext);

  // Tạo function t trực tiếp từ translations
  const t = (key) => {
    try {
      const parts = key.split(".");
      let currentLang = lang || "ja";
      let obj = translations[currentLang];

      if (!obj) {
        obj = translations.ja;
      }

      for (const part of parts) {
        if (!obj || !obj[part]) {
          console.warn(
            `Translation key not found: ${key} for language: ${currentLang}`
          );
          return key;
        }
        obj = obj[part];
      }

      return obj;
    } catch (error) {
      console.error("Translation error:", error);
      return key;
    }
  };

  console.log("🔍 ReviewCard props:", {
    reviewUserId: review.user_id,
    currentUserId: currentUserId,
    match: currentUserId === review.user_id,
  });

  const [showFullComment, setShowFullComment] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const MAX_LENGTH = 150;
  const hasImages = review.images && review.images.length > 0;

  // Check if comment should be truncated
  const shouldTruncate = review.comment && review.comment.length > MAX_LENGTH;
  const displayComment =
    showFullComment || !shouldTruncate
      ? review.comment
      : review.comment?.slice(0, MAX_LENGTH) + "...";

  // Check if current user can edit/delete
  const canModify =
    currentUserId && parseInt(review.user_id) === parseInt(currentUserId);

  // Check if review has been edited
  const isEdited =
    review.updated_at &&
    review.created_at &&
    new Date(review.updated_at).getTime() !==
      new Date(review.created_at).getTime();

  // ═══════════════════════════════════════════════════════════════
  // FORMAT DATE
  // ═══════════════════════════════════════════════════════════════
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Format theo ngôn ngữ
    if (lang === "en") {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${monthNames[month - 1]} ${day}, ${year}`;
    } else if (lang === "vi") {
      return `${day}/${month}/${year}`;
    } else {
      // Japanese (default)
      return `${year}年${month}月${day}日`;
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // HANDLE DELETE
  // ═══════════════════════════════════════════════════════════════
  const handleDelete = async () => {
    if (!window.confirm(t("reviewCard.confirmDelete"))) {
      return;
    }

    setDeleting(true);

    try {
      const userStr = localStorage.getItem("user");
      const user = JSON.parse(userStr);

      const response = await fetch(
        `http://localhost:5000/api/restaurant-reviews/${review.review_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: user.user_id }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("reviewCard.deleteFailed"));
      }

      toast.success(t("reviewCard.deleteSuccess"));

      if (onDelete) {
        onDelete(review.review_id);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(error.message || t("reviewCard.deleteFailed"));
      setDeleting(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // HANDLE EDIT SUCCESS
  // ═══════════════════════════════════════════════════════════════
  const handleEditSuccess = () => {
    setShowEditModal(false);
    if (onUpdate) {
      onUpdate();
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // GALLERY FUNCTIONS
  // ═══════════════════════════════════════════════════════════════
  const openGallery = (index) => {
    setCurrentImageIndex(index);
    setShowGallery(true);
  };

  const closeGallery = () => {
    setShowGallery(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === review.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? review.images.length - 1 : prev - 1
    );
  };

  return (
    <>
      <div className="review-card">
        {/* ═══ USER INFO & ACTIONS ═══ */}
        <div className="review-header">
          <div className="review-user">
            <div className="review-avatar">
              {review.user?.avatar ? (
                <img
                  src={`http://localhost:5000${review.user.avatar}`}
                  alt={review.user.fullName}
                />
              ) : (
                <div className="review-avatar-placeholder">
                  {review.user?.fullName?.charAt(0) || "?"}
                </div>
              )}
            </div>
            <div className="review-user-info">
              <div className="review-user-name">
                {review.user?.fullName || t("reviewCard.anonymousUser")}
              </div>
              <div className="review-rating">
                {"⭐".repeat(Math.round(review.rating))}
                <span className="rating-number">{review.rating}</span>
              </div>
            </div>
          </div>

          {/* ═══ EDIT & DELETE BUTTONS ═══ */}
          {canModify && (
            <div className="review-actions">
              <button
                className="review-edit-btn"
                onClick={() => setShowEditModal(true)}
                disabled={deleting}
              >
                {t("reviewCard.edit")}
              </button>
              <button
                className="review-delete-btn"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? t("reviewCard.deleting") : t("reviewCard.delete")}
              </button>
            </div>
          )}
        </div>

        {/* ═══ TITLE ═══ */}
        {review.title && <div className="review-title">{review.title}</div>}

        {/* ═══ COMMENT ═══ */}
        <div className="review-comment">
          {displayComment}
          {shouldTruncate && (
            <button
              className="review-expand-btn"
              onClick={() => setShowFullComment(!showFullComment)}
            >
              {showFullComment
                ? t("reviewCard.showLess")
                : t("reviewCard.showMore")}
            </button>
          )}
        </div>

        {/* ═══ TAGS ═══ */}
        {(review.service_tags?.length > 0 ||
          review.style_tags?.length > 0 ||
          review.dish_tags?.length > 0) && (
          <div className="review-tags">
            {review.service_tags?.map((tag, i) => (
              <span key={`service-${i}`} className="review-tag service">
                {tag}
              </span>
            ))}
            {review.style_tags?.map((tag, i) => (
              <span key={`style-${i}`} className="review-tag style">
                {tag}
              </span>
            ))}
            {review.dish_tags?.map((tag, i) => (
              <span key={`dish-${i}`} className="review-tag dish">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* ═══ IMAGES ═══ */}
        {hasImages && (
          <div className="review-images">
            {review.images.map((image, index) => (
              <div
                key={image.image_id}
                className="review-image-thumb"
                onClick={() => openGallery(index)}
              >
                <img
                  src={`http://localhost:5000${image.image_url}`}
                  alt={`${t("reviewCard.reviewImage")} ${index + 1}`}
                />
              </div>
            ))}
          </div>
        )}

        {/* ═══ DATE & EDITED LABEL ═══ */}
        <div className="review-footer">
          <div className="review-date">
            {formatDate(review.created_at)}
            {isEdited && (
              <span className="edited-label"> • {t("reviewCard.edited")}</span>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          EDIT MODAL
          ═══════════════════════════════════════════════════════════ */}
      {showEditModal && (
        <EditReviewModal
          review={review}
          restaurantName={restaurantName}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════
          GALLERY MODAL
          ═══════════════════════════════════════════════════════════ */}
      {showGallery && hasImages && (
        <div className="gallery-modal" onClick={closeGallery}>
          <button className="gallery-close" onClick={closeGallery}>
            ✕
          </button>

          {review.images.length > 1 && (
            <>
              <button
                className="gallery-nav gallery-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                ‹
              </button>
              <button
                className="gallery-nav gallery-next"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                ›
              </button>
            </>
          )}

          <div className="gallery-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={`http://localhost:5000${review.images[currentImageIndex].image_url}`}
              alt={`${t("reviewCard.reviewImage")} ${currentImageIndex + 1}`}
            />
            <div className="gallery-counter">
              {currentImageIndex + 1} / {review.images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewCard;
