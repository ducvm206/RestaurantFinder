// client/src/components/search/FilterModal.jsx
import React, { useState, useEffect } from "react";
import { filterOptions } from "../../data/mockData";
import useTranslation from "../../hooks/useTranslation";
import "./FilterModal.css";

const FilterModal = ({ filters, onApply, onClose }) => {
  const t = useTranslation();

  // Debug translations khi component mount (chỉ trong development)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 FilterModal: Checking translations...");

      // Test một vài keys
      const testKeys = [
        "filterModal.title",
        "filterModal.options.services.wifi",
        "filterModal.options.cuisines.japanese",
        "filterModal.options.distances.1km",
      ];

      testKeys.forEach((key) => {
        const result = t(key);
        if (result === key) {
          console.warn(`⚠️ Missing translation: ${key}`);
        } else {
          console.log(`✅ ${key} → ${result}`);
        }
      });
    }
  }, []);

  const [localFilters, setLocalFilters] = useState({
    services: [...filters.services],
    cuisines: [...filters.cuisines],
    distance: filters.distance,
    priceRange: filters.priceRange,
    styles: [...filters.styles],
    minRating: filters.minRating,
  });

  // Toggle multi-select filter (services, cuisines, styles)
  const toggleArrayFilter = (category, value) => {
    setLocalFilters((prev) => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  // Set single-select filter (distance, priceRange)
  const setSingleFilter = (category, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [category]: prev[category] === value ? "" : value,
    }));
  };

  // Set rating filter
  const setRating = (rating) => {
    setLocalFilters((prev) => ({
      ...prev,
      minRating: prev.minRating === rating ? 0 : rating,
    }));
  };

  // Apply filters
  const handleApply = () => {
    onApply(localFilters);
  };

  // Reset all filters
  const handleReset = () => {
    const resetFilters = {
      services: [],
      cuisines: [],
      distance: "",
      priceRange: "",
      styles: [],
      minRating: 0,
    };
    setLocalFilters(resetFilters);
  };

  // Hàm lấy label đã dịch cho option
  const getTranslatedLabel = (category, value) => {
    const translationKey = `filterModal.options.${category}.${value}`;
    const translated = t(translationKey);

    // Nếu translation trả về chính key → không tìm thấy
    if (translated === translationKey) {
      // Log warning trong development
      if (process.env.NODE_ENV === "development") {
        console.warn(`⚠️ Missing translation: ${translationKey}`);
      }

      // Fallback: hiển thị value với formatting
      // Ví dụ: "wifi" → "Wifi", "kid_friendly" → "Kid Friendly"
      return value
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    return translated;
  };

  return (
    <div className="filter-modal-overlay" onClick={onClose}>
      <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="filter-modal-header">
          <h2 className="filter-modal-title">{t("filterModal.title")}</h2>
          <button className="filter-close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="filter-modal-content">
          {/* Services */}
          <div className="filter-section">
            <h3 className="filter-section-title">
              {t("filterModal.services_title")}
            </h3>
            <div className="filter-chips">
              {filterOptions.services.map((service) => (
                <button
                  key={service.value}
                  className={`filter-chip ${
                    localFilters.services.includes(service.value)
                      ? "active"
                      : ""
                  }`}
                  onClick={() => toggleArrayFilter("services", service.value)}
                >
                  {getTranslatedLabel("services", service.value)}
                </button>
              ))}
              {filterOptions.cuisines.map((cuisine) => (
                <button
                  key={cuisine.value}
                  className={`filter-chip ${
                    localFilters.cuisines.includes(cuisine.value)
                      ? "active"
                      : ""
                  }`}
                  onClick={() => toggleArrayFilter("cuisines", cuisine.value)}
                >
                  {getTranslatedLabel("cuisines", cuisine.value)}
                </button>
              ))}
            </div>
          </div>

          {/* Distance */}
          <div className="filter-section">
            <h3 className="filter-section-title">
              {t("filterModal.distance_title")}
            </h3>
            <div className="filter-buttons">
              {filterOptions.distances.map((distance) => (
                <button
                  key={distance.value}
                  className={`filter-button ${
                    localFilters.distance === distance.value ? "active" : ""
                  }`}
                  onClick={() => setSingleFilter("distance", distance.value)}
                >
                  {getTranslatedLabel("distances", distance.value)}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-section">
            <h3 className="filter-section-title">
              {t("filterModal.price_title")}
            </h3>
            <div className="filter-buttons">
              {filterOptions.priceRanges.map((price) => (
                <button
                  key={price.value}
                  className={`filter-button price-button ${
                    localFilters.priceRange === price.value ? "active" : ""
                  }`}
                  onClick={() => setSingleFilter("priceRange", price.value)}
                >
                  {getTranslatedLabel("priceRanges", price.value)}
                </button>
              ))}
            </div>
          </div>

          {/* Styles */}
          <div className="filter-section">
            <h3 className="filter-section-title">
              {t("filterModal.styles_title")}
            </h3>
            <div className="filter-chips">
              {filterOptions.styles.map((style) => (
                <button
                  key={style.value}
                  className={`filter-chip ${
                    localFilters.styles.includes(style.value) ? "active" : ""
                  }`}
                  onClick={() => toggleArrayFilter("styles", style.value)}
                >
                  {getTranslatedLabel("styles", style.value)}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="filter-section">
            <h3 className="filter-section-title">
              {t("filterModal.rating_title")}
            </h3>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`star-button ${
                    localFilters.minRating >= star ? "active" : ""
                  }`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
            {localFilters.minRating > 0 && (
              <p className="rating-text">
                {t("filterModal.rating_text", {
                  stars: localFilters.minRating,
                })}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="filter-modal-footer">
          <button className="reset-button" onClick={handleReset}>
            {t("filterModal.reset_button")}
          </button>
          <button className="apply-button" onClick={handleApply}>
            {t("filterModal.apply_button")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
