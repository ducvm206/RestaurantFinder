// ═══════════════════════════════════════════════════════════════
// REVIEW FORM COMPONENT - MODAL
// ═══════════════════════════════════════════════════════════════
import React, { useState } from "react";
import { toast } from "react-toastify";
import "./ReviewForm.css";

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

const ReviewForm = ({ restaurantId, restaurantName, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [serviceTags, setServiceTags] = useState([]);
  const [styleTags, setStyleTags] = useState([]);
  const [dishTags, setDishTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // ═══════════════════════════════════════════════════════════════
  // HANDLE IMAGE SELECTION
  // ═══════════════════════════════════════════════════════════════
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file count
    if (images.length + files.length > 3) {
      setErrors({ ...errors, images: "画像は3枚までアップロード可能です" });
      return;
    }

    // Validate each file
    const validFiles = [];
    const validPreviews = [];

    files.forEach((file) => {
      // Check file type
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
        setErrors({
          ...errors,
          images: "jpg, png, gif, webp のみアップロード可能です",
        });
        return;
      }

      // Check file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, images: "ファイルサイズは5MB以下にしてください" });
        return;
      }

      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    });

    setImages([...images, ...validFiles]);
    setImagePreviews([...imagePreviews, ...validPreviews]);
    setErrors({ ...errors, images: null });
  };

  // ═══════════════════════════════════════════════════════════════
  // REMOVE IMAGE
  // ═══════════════════════════════════════════════════════════════
  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
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
  // SUBMIT REVIEW
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
      formData.append("service_tags", JSON.stringify(serviceTags));
      formData.append("style_tags", JSON.stringify(styleTags));
      formData.append("dish_tags", JSON.stringify(dishTags));

      // Append images
      images.forEach((image) => {
        formData.append("images", image);
      });

      // Send request
      const response = await fetch(
        `http://localhost:5000/api/restaurant-reviews/restaurant/${restaurantId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "レビューの投稿に失敗しました");
      }

      // Success
      toast.success("レビューが投稿されました！");

      // Clean up
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));

      // Close modal and refresh
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.message || "レビューの投稿に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-form-overlay" onClick={onClose}>
      <div className="review-form-modal" onClick={(e) => e.stopPropagation()}>
        {/* ═══ HEADER ═══ */}
        <div className="review-form-header">
          <button className="back-btn" onClick={onClose}>
            ←
          </button>
          <h2>レストランレビュー</h2>
          <div className="header-spacer"></div>
        </div>

        {/* ═══ RESTAURANT NAME ═══ */}
        <div className="restaurant-name-display">
          <h3>{restaurantName}</h3>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          {/* ═══ PHOTO UPLOAD ═══ */}
          <div className="form-section">
            <label className="photo-upload-label">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="photo-input"
                disabled={images.length >= 3}
              />
              <div className="photo-placeholder">
                <span className="camera-icon">📷</span>
                <span className="upload-text">写真を追加</span>
              </div>
            </label>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="image-previews">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="preview-item">
                    <img src={preview} alt={`プレビュー ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeImage(index)}
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
                  className={`tag-btn ${dishTags.includes(tag) ? "active" : ""}`}
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
          <button
            type="submit"
            className="submit-btn"
            disabled={submitting}
          >
            {submitting ? "投稿中..." : "レビューを投稿"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;