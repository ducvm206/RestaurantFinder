// ═══════════════════════════════════════════════════════════════
// EDIT REVIEW MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════
import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { LanguageContext } from "../../context/LanguageContext";
import "./EditReviewModal.css";

// Import trực tiếp các file translation
import translationsJa from "../../translations/ja.json";
import translationsEn from "../../translations/en.json";
import translationsVi from "../../translations/vi.json";

const translations = {
  ja: translationsJa,
  en: translationsEn,
  vi: translationsVi,
};

// ═══════════════════════════════════════════════════════════════
// CONSTANTS - TAGS
// ═══════════════════════════════════════════════════════════════
const SERVICE_TAGS = {
  ja: [
    "エアコン",
    "屋外スペース",
    "屋内",
    "パーティールーム",
    "禁煙",
    "子供向け",
  ],
  en: [
    "AC",
    "Outdoor Space",
    "Indoor",
    "Party Room",
    "Non-smoking",
    "Kid-friendly",
  ],
  vi: [
    "Điều hòa",
    "Khu ngoài trời",
    "Trong nhà",
    "Phòng tiệc",
    "Không hút thuốc",
    "Thân thiện với trẻ em",
  ],
};

const STYLE_TAGS = {
  ja: [
    "美しい",
    "エキゾチック",
    "シンプル",
    "高級ダイニング",
    "和風",
    "席心地が良い",
  ],
  en: [
    "Beautiful",
    "Exotic",
    "Simple",
    "Fine Dining",
    "Japanese Style",
    "Comfortable",
  ],
  vi: [
    "Đẹp",
    "Lạ mắt",
    "Đơn giản",
    "Sang trọng",
    "Phong cách Nhật",
    "Thoải mái",
  ],
};

const DISH_TAGS = {
  ja: ["新鮮", "ヴィーガン対応", "濃厚な", "最も自然美しい", "美味しい"],
  en: ["Fresh", "Vegan-friendly", "Rich", "Natural", "Delicious"],
  vi: ["Tươi", "Thuần chay", "Đậm đà", "Tự nhiên", "Ngon"],
};

const EditReviewModal = ({ review, restaurantName, onClose, onSuccess }) => {
  const { lang } = useContext(LanguageContext);

  // Tạo function t trực tiếp từ translations
  const t = (key) => {
    const parts = key.split(".");
    let obj = translations[lang] || translations.ja;

    for (const part of parts) {
      if (!obj || !obj[part]) return key;
      obj = obj[part];
    }

    return obj;
  };

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
        images: t("editReview.errors.maxImages"),
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
          images: t("editReview.errors.invalidFormat"),
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          images: t("editReview.errors.maxSize"),
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
      newErrors.rating = t("editReview.errors.ratingRequired");
    }

    if (!comment.trim()) {
      newErrors.comment = t("editReview.errors.commentRequired");
    } else if (comment.trim().length < 10) {
      newErrors.comment = t("editReview.errors.commentMinLength");
    } else if (comment.trim().length > 500) {
      newErrors.comment = t("editReview.errors.commentMaxLength");
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
        toast.error(t("editReview.messages.loginRequired"));
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
        throw new Error(data.message || t("editReview.messages.updateFailed"));
      }

      // Success
      toast.success(t("editReview.messages.updateSuccess"));

      // Clean up
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));

      // Close modal and refresh
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error(error.message || t("editReview.messages.updateFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="edit-review-modal-overlay" onClick={onClose}>
      <div className="edit-review-modal" onClick={(e) => e.stopPropagation()}>
        {/* ═══ HEADER ═══ */}
        <div className="edit-review-modal-header">
          <button className="back-btn" onClick={onClose}>
            ←
          </button>
          <h2>{t("editReview.title")}</h2>
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
              <label className="section-label">
                {t("editReview.existingPhotos")}
              </label>
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
                      title={
                        deleteImageIds.includes(image.image_id)
                          ? t("editReview.restore")
                          : t("editReview.delete")
                      }
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
                <span className="upload-text">
                  {t("editReview.addNewPhotos")}
                </span>
              </div>
            </label>

            {/* New Image Previews */}
            {newImagePreviews.length > 0 && (
              <div className="image-previews">
                {newImagePreviews.map((preview, index) => (
                  <div key={index} className="preview-item">
                    <img
                      src={preview}
                      alt={`${t("editReview.newPhoto")} ${index + 1}`}
                    />
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
            <label className="section-label">{t("editReview.service")}</label>
            <div className="tags-container">
              {(SERVICE_TAGS[lang] || SERVICE_TAGS.ja).map((tag) => (
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
            <label className="section-label">{t("editReview.style")}</label>
            <div className="tags-container">
              {(STYLE_TAGS[lang] || STYLE_TAGS.ja).map((tag) => (
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
            <label className="section-label">{t("editReview.dish")}</label>
            <div className="tags-container">
              {(DISH_TAGS[lang] || DISH_TAGS.ja).map((tag) => (
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
            <label className="section-label">{t("editReview.rating")}</label>
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
            <label className="section-label">{t("editReview.titleOptional")}</label>
            <input
              type="text"
              className="title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("editReview.titlePlaceholder")}
              maxLength={100}
            />
          </div> 
          */}

          {/* ═══ COMMENT ═══ */}
          <div className="form-section">
            <label className="section-label">{t("editReview.comment")}</label>
            <textarea
              className="review-textarea"
              placeholder={t("editReview.commentPlaceholder")}
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
            {submitting
              ? t("editReview.updating")
              : t("editReview.saveChanges")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditReviewModal;
