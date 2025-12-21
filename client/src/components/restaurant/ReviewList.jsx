// ═══════════════════════════════════════════════════════════════
// REVIEW LIST COMPONENT - UPDATED WITH NEW REVIEW SYSTEM
// ═══════════════════════════════════════════════════════════════
import React, { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import ReviewCard from "../review/ReviewCard";
import "./ReviewList.css";

// Import trực tiếp các file translation
import translationsJa from "../../translations/ja.json";
import translationsEn from "../../translations/en.json";
import translationsVi from "../../translations/vi.json";

const translations = {
  ja: translationsJa,
  en: translationsEn,
  vi: translationsVi,
};

const ReviewList = ({
  reviews: initialReviews,
  restaurantId,
  restaurantName,
  onReviewsChange,
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

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get current user
  const getCurrentUserId = () => {
    try {
      const userStr = localStorage.getItem("user");

      if (!userStr) return null;
      const user = JSON.parse(userStr);

      return user.user_id;
    } catch {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  // ═══════════════════════════════════════════════════════════════
  // FETCH REVIEWS FROM API
  // ═══════════════════════════════════════════════════════════════
  const fetchReviews = async () => {
    if (!restaurantId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/restaurant-reviews/restaurant/${restaurantId}`
      );

      if (!response.ok) {
        throw new Error(t("reviewList.loadFailed"));
      }

      const data = await response.json();

      if (data.success) {
        setReviews(data.data.reviews);
        setStats(data.data.stats);

        // Notify parent component
        if (onReviewsChange) {
          onReviewsChange(data.data.reviews, data.data.stats);
        }
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // INITIAL LOAD
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (restaurantId) {
      fetchReviews();
    }
  }, [restaurantId]);

  // ═══════════════════════════════════════════════════════════════
  // USE INITIAL REVIEWS IF PROVIDED (FROM PARENT)
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (initialReviews && Array.isArray(initialReviews)) {
      setReviews(initialReviews);

      // Calculate stats
      const totalReviews = initialReviews.length;
      const avgRating =
        totalReviews > 0
          ? (
              initialReviews.reduce((sum, r) => sum + parseFloat(r.rating), 0) /
              totalReviews
            ).toFixed(2)
          : 0;

      setStats({
        totalReviews,
        averageRating: parseFloat(avgRating),
      });
    }
  }, [initialReviews]);

  // ═══════════════════════════════════════════════════════════════
  // HANDLE DELETE
  // ═══════════════════════════════════════════════════════════════
  const handleDeleteReview = (reviewId) => {
    // Remove from local state immediately for better UX
    setReviews((prev) => prev.filter((r) => r.review_id !== reviewId));

    // Refresh from API to get updated stats
    setTimeout(() => {
      fetchReviews();
    }, 500);
  };

  // ═══════════════════════════════════════════════════════════════
  // LOADING STATE
  // ═══════════════════════════════════════════════════════════════
  if (loading && reviews.length === 0) {
    return (
      <div className="review-list-loading">
        <div className="spinner"></div>
        <p>{t("reviewList.loading")}</p>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ERROR STATE
  // ═══════════════════════════════════════════════════════════════
  if (error && reviews.length === 0) {
    return (
      <div className="review-list-error">
        <p>{error}</p>
        <button onClick={fetchReviews}>{t("reviewList.retry")}</button>
      </div>
    );
  }

  return (
    <div className="review-list-section">
      {/* ═══ STATS HEADER ═══ */}
      {stats.totalReviews > 0 && (
        <div className="review-stats">
          <div className="stats-summary">
            <span className="average-rating">⭐ {stats.averageRating}</span>
            <span className="total-reviews">
              ({stats.totalReviews} {t("reviewList.reviewsCount")})
            </span>
          </div>
        </div>
      )}

      {/* ═══ REVIEWS LIST ═══ */}
      {reviews.length === 0 ? (
        <div className="no-reviews">
          <p className="no-reviews-icon">📝</p>
          <p className="no-reviews-text">{t("reviewList.noReviews")}</p>
          <p className="no-reviews-subtext">
            {t("reviewList.noReviewsSubtext")}
          </p>
        </div>
      ) : (
        <div className="reviews-container">
          {reviews.map((review) => (
            <ReviewCard
              key={review.review_id}
              review={review}
              currentUserId={currentUserId}
              restaurantName={restaurantName}
              onDelete={handleDeleteReview}
              onUpdate={fetchReviews}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
