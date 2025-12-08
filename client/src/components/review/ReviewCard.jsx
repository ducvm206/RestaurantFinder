// ═══════════════════════════════════════════════════════════════
// REVIEW CARD COMPONENT - SINGLE REVIEW WITH IMAGES
// ═══════════════════════════════════════════════════════════════
import React, { useState } from "react";
import { toast } from "react-toastify";
import "./ReviewCard.css";

const ReviewCard = ({ review, currentUserId, onDelete }) => {
  const [showFullComment, setShowFullComment] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const MAX_LENGTH = 150;
  const hasImages = review.images && review.images.length > 0;

  // Check if comment should be truncated
  const shouldTruncate = review.comment && review.comment.length > MAX_LENGTH;
  const displayComment = showFullComment || !shouldTruncate
    ? review.comment
    : review.comment?.slice(0, MAX_LENGTH) + "...";

  // Check if current user can delete
  const canDelete = currentUserId && review.user_id === currentUserId;

  // ═══════════════════════════════════════════════════════════════
  // FORMAT DATE
  // ═══════════════════════════════════════════════════════════════
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  };

  // ═══════════════════════════════════════════════════════════════
  // HANDLE DELETE
  // ═══════════════════════════════════════════════════════════════
  const handleDelete = async () => {
    if (!window.confirm("このレビューを削除してもよろしいですか？")) {
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
        throw new Error(data.message || "削除に失敗しました");
      }

      toast.success("レビューが削除されました");
      
      if (onDelete) {
        onDelete(review.review_id);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(error.message || "削除に失敗しました");
      setDeleting(false);
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
        {/* ═══ USER INFO ═══ */}
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
                {review.user?.fullName || "匿名ユーザー"}
              </div>
              <div className="review-rating">
                {"⭐".repeat(Math.round(review.rating))}
                <span className="rating-number">{review.rating}</span>
              </div>
            </div>
          </div>

          {/* ═══ DELETE BUTTON ═══ */}
          {canDelete && (
            <button
              className="review-delete-btn"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "削除中..." : "削除"}
            </button>
          )}
        </div>

        {/* ═══ TITLE ═══ */}
        {review.title && (
          <div className="review-title">{review.title}</div>
        )}

        {/* ═══ COMMENT ═══ */}
        <div className="review-comment">
          {displayComment}
          {shouldTruncate && (
            <button
              className="review-expand-btn"
              onClick={() => setShowFullComment(!showFullComment)}
            >
              {showFullComment ? "少なく表示" : "さらに見る"}
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
                  alt={`Review ${index + 1}`}
                />
              </div>
            ))}
          </div>
        )}

        {/* ═══ DATE ═══ */}
        <div className="review-date">{formatDate(review.created_at)}</div>
      </div>

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
              alt={`Review ${currentImageIndex + 1}`}
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