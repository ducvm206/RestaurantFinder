// ═══════════════════════════════════════════════════════════════
// EDIT REVIEW MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./EditReviewModal.css";

// ═══════════════════════════════════════════════════════════════
// CONSTANTS - TAGS
// ═══════════════════════════════════════════════════════════════
const SERVICE_TAGS = [
  "エアコン",
  "屋外スペース",
  "屋内",
  "パーティールーム",
  "禁煙",
  "子供向け",
];

const STYLE_TAGS = [
  "美しい",
  "エキゾチック",
  "シンプル",
  "高級ダイニング",
  "和風",
  "席心地が良い",
];

const DISH_TAGS = [
  "新鮮",
  "ヴィーガン対応",
  "濃厚な",
  "最も自然美しい",
  "美味しい",
];

const EditReviewModal = ({ review, restaurantName, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  
  // Existing images (from server)
  const [existingImages, setExistingImages] = useState([]);
  const [deleteImageIds, setDeleteImageIds] = useState([]);
  
  // New images (to upload)
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  
  const [serviceTags, setServiceTags] = useState([]);
  const [styleTags, setStyleTags] = useState([]);
  const [dishTags, setDishTags] = useState([]);
  
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // ═══════════════════════════════════════════════════════════════
  // INITIALIZE WITH REVIEW DATA
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!review) return;

    setRating(parseFloat(review.rating) || 0);
    setComment(review.comment || "");
    setTitle(review.title || "");
    setServiceTags(review.service_tags || []);
    setStyleTags(review.style_tags || []);
    setDishTags(review.dish_tags || []);
    setExistingImages(review.images || []);
  }, [review]);

  // ═══════════════════════════════════════════════════════════════
  // HANDLE NEW IMAGE SELECTION
  // ═══════════════════════════════════════════════════════════════
  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Calculate total images (existing - deleted + new)
    const remainingExisting = existingImages.length - deleteImageIds.length;
    const totalImages = remainingExisting + newImages.length + files.length;

    if (totalImages > 3) {
      setErrors({ 
        ...errors, 
        images: "画像は合計3枚までです" 
      });
      return;
    }

    // Validate each file
    const validFiles = [];
    const validPreviews = [];

    files.forEach((file) => {
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
        setErrors({
          ...errors,
          images: "jpg, png, gif, webp のみアップロード可能です",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors({ 
          ...errors, 
          images: "ファイルサイズは5MB以下にしてください" 
        });
        return;
      }

      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    });

    setNewImages([...newImages, ...validFiles]);
    setNewImagePreviews([...newImagePreviews, ...validPreviews]);
    setErrors({ ...errors, images: null });
  };

  // ═══════════════════════════════════════════════════════════════
  // MARK EXISTING IMAGE FOR DELETION
  // ═══════════════════════════════════════════════════════════════
  const markImageForDeletion = (imageId) => {
    if (deleteImageIds.includes(imageId)) {
      // Un-mark for deletion
      setDeleteImageIds(deleteImageIds.filter((id) => id !== imageId));
    } else {
      // Mark for deletion
      setDeleteImageIds([...deleteImageIds, imageId]);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // REMOVE NEW IMAGE (before upload)
  // ═══════════════════════════════════════════════════════════════
  const removeNewImage = (index) => {
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImages(newImages.filter((_, i) => i !== index));
    setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index));
  };

  // ═══════════════════════════════════════════════════════════════
  // TOGGLE TAG
  // ═══════════════════════════════════════════════════════════════
  const toggleTag = (tag, type) => {
    if (type === "service") {
      setServiceTags(
        serviceTags.includes(tag)
          ? serviceTags.filter((t) => t !== tag)
          : [...serviceTags, tag]
      );
    } else if (type === "style") {
      setStyleTags(
        styleTags.includes(tag)
          ? styleTags.filter((t) => t !== tag)
          : [...styleTags, tag]
      );
    } else if (type === "dish") {
      setDishTags(
        dishTags.includes(tag)
          ? dishTags.filter((t) => t !== tag)
          : [...dishTags, tag]
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // VALIDATE FORM
  // ═══════════════════════════════════════════════════════════════
  const validate = () => {
    const newErrors = {};

    if (rating === 0) {
      newErrors.rating = "評価を選択してください";
    }

    if (!comment.trim()) {
      newErrors.comment = "コメントを入力してください";
    } else if (comment.trim().length < 10) {
      newErrors.comment = "コメントは10文字以上入力してください";
    } else if (comment.trim().length > 500) {
      newErrors.comment = "コメントは500文字以内にしてください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ═══════════════════════════════════════════════════════════════
  // SUBMIT UPDATE
  // ═══════════════════════════════════════════════════════════════
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      // Get user from localStorage
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        toast.error("ログインが必要です");
        return;
      }
      const user = JSON.parse(userStr);

      // Create FormData
      const formData = new FormData();
      formData.append("user_id", user.user_id);
      formData.append("rating", rating);
      formData.append("comment", comment.trim());
      formData.append("title", title.trim());
      formData.append("service_tags", JSON.stringify(serviceTags));
      formData.append("style_tags", JSON.stringify(styleTags));
      formData.append("dish_tags", JSON.stringify(dishTags));
      
      // Add image IDs to delete
      if (deleteImageIds.length > 0) {
        formData.append("deleteImageIds", JSON.stringify(deleteImageIds));
      }

      // Append new images
      newImages.forEach((image) => {
        formData.append("images", image);
      });

      // Send request
      const response = await fetch(
        `http://localhost:5000/api/restaurant-reviews/${review.review_id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "レビューの更新に失敗しました");
      }

      // Success
      toast.success("レビューが更新されました！");

      // Clean up
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));

      // Close modal and refresh
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error(error.message || "レビューの更新に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="edit-review-modal-overlay" onClick={onClose}>
      <div
        className="edit-review-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ═══ HEADER ═══ */}
        <div className="edit-review-modal-header">
          <button className="back-btn" onClick={onClose}>
            ←
          </button>
          <h2>レビューを編集</h2>
          <div className="header-spacer"></div>
        </div>

        {/* ═══ RESTAURANT NAME ═══ */}
        <div className="restaurant-name-display">
          <h3>{restaurantName}</h3>
        </div>

        <form onSubmit={handleSubmit} className="edit-review-form">
          {/* ═══ EXISTING IMAGES ═══ */}
          {existingImages.length > 0 && (
            <div className="form-section">
              <label className="section-label">既存の写真</label>
              <div className="existing-images">
                {existingImages.map((image) => (
                  <div
                    key={image.image_id}
                    className={`existing-image-item ${
                      deleteImageIds.includes(image.image_id)
                        ? "marked-delete"
                        : ""
                    }`}
                  >
                    <img
                      src={`http://localhost:5000${image.image_url}`}
                      alt="Review"
                    />
                    <button
                      type="button"
                      className="toggle-delete-btn"
                      onClick={() => markImageForDeletion(image.image_id)}
                      title={deleteImageIds.includes(image.image_id) ? "元に戻す" : "削除"}
                    >
                      {deleteImageIds.includes(image.image_id) ? "↺" : "✕"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ NEW PHOTO UPLOAD ═══ */}
          <div className="form-section">
            <label className="photo-upload-label">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleNewImageChange}
                className="photo-input"
                disabled={
                  existingImages.length -
                    deleteImageIds.length +
                    newImages.length >=
                  3
                }
              />
              <div className="photo-placeholder">
                <span className="camera-icon">📷</span>
                <span className="upload-text">新しい写真を追加</span>
              </div>
            </label>

            {/* New Image Previews */}
            {newImagePreviews.length > 0 && (
              <div className="image-previews">
                {newImagePreviews.map((preview, index) => (
                  <div key={index} className="preview-item">
                    <img src={preview} alt={`新規 ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeNewImage(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {errors.images && (
              <div className="error-message">{errors.images}</div>
            )}
          </div>

          {/* ═══ SERVICE TAGS ═══ */}
          <div className="form-section">
            <label className="section-label">サービス</label>
            <div className="tags-container">
              {SERVICE_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-btn ${
                    serviceTags.includes(tag) ? "active" : ""
                  }`}
                  onClick={() => toggleTag(tag, "service")}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* ═══ STYLE TAGS ═══ */}
          <div className="form-section">
            <label className="section-label">スタイル</label>
            <div className="tags-container">
              {STYLE_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-btn ${
                    styleTags.includes(tag) ? "active" : ""
                  }`}
                  onClick={() => toggleTag(tag, "style")}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* ═══ DISH TAGS ═══ */}
          <div className="form-section">
            <label className="section-label">料理</label>
            <div className="tags-container">
              {DISH_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-btn ${
                    dishTags.includes(tag) ? "active" : ""
                  }`}
                  onClick={() => toggleTag(tag, "dish")}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* ═══ RATING ═══ */}
          <div className="form-section">
            <label className="section-label">評価</label>
            <div className="star-rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${
                    star <= (hoverRating || rating) ? "filled" : ""
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </span>
              ))}
            </div>
            {errors.rating && (
              <div className="error-message">{errors.rating}</div>
            )}
          </div>

          {/* ═══ TITLE (OPTIONAL) ═══ 
          <div className="form-section">
            <label className="section-label">タイトル（任意）</label>
            <input
              type="text"
              className="title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例：最高の体験でした"
              maxLength={100}
            />
          </div> 
          */}

          {/* ═══ COMMENT ═══ */}
          <div className="form-section">
            <label className="section-label">コメント</label>
            <textarea
              className="review-textarea"
              placeholder="レビューを入力..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={6}
              maxLength={500}
            />
            <div className="char-count">{comment.length} / 500</div>
            {errors.comment && (
              <div className="error-message">{errors.comment}</div>
            )}
          </div>

          {/* ═══ SUBMIT BUTTON ═══ */}
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "更新中..." : "変更を保存"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditReviewModal;