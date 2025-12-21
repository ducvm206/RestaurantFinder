// client/src/components/search/FilterModal.jsx
import React, { useState, useEffect, useContext } from "react";
import { filterOptions } from "../../data/mockData";
import { LanguageContext } from "../../context/LanguageContext";
import "./FilterModal.css";

// Import trực tiếp các file translation
import translationsJa from "../../translations/ja.json";
import translationsEn from "../../translations/en.json";
import translationsVi from "../../translations/vi.json";

const translations = {
  ja: translationsJa,
  en: translationsEn,
  vi: translationsVi,
};

const FilterModal = ({ filters, onApply, onClose }) => {
  const { lang } = useContext(LanguageContext);

  // Tạo function t trực tiếp từ translations
  const t = (key, params) => {
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

      // Xử lý params nếu có (ví dụ: {stars: 4})
      if (params && typeof obj === "string") {
        let result = obj;
        Object.keys(params).forEach((paramKey) => {
          result = result.replace(`{${paramKey}}`, params[paramKey]);
        });
        return result;
      }

      return obj;
    } catch (error) {
      console.error("Translation error:", error);
      return key;
    }
  };

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
    services: Array.isArray(filters.services) ? [...filters.services] : [],
    cuisines: Array.isArray(filters.cuisines) ? [...filters.cuisines] : [],
    distance: filters.distance || "",
    priceRange: filters.priceRange || "",
    styles: Array.isArray(filters.styles) ? [...filters.styles] : [],
    minRating: filters.minRating || 0,
    district: filters.district || "",
    city: filters.city || "",
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
    onApply(localFilters); // gửi filter đã chọn ra SearchPage để lọc
    onClose(); // đóng modal
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
      district: "",
      city: "",
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
            <div className="filter-chips">
              {filterOptions.distances.map((distance) => (
                <button
                  key={distance.value}
                  className={`filter-chip ${
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
            <div className="filter-chips">
              {filterOptions.priceRanges.map((price) => (
                <button
                  key={price.value}
                  className={`filter-chip ${
                    localFilters.priceRange === price.value ? "active" : ""
                  }`}
                  onClick={() => setSingleFilter("priceRange", price.value)}
                >
                  {price.label}
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

          {/* Location filters */}
          <div className="filter-section">
            <h3 className="filter-section-title">
              {t("filterModal.location_title")}
            </h3>
            <div
              className="filter-chips"
              style={{ flexDirection: "column", gap: "8px" }}
            >
              <input
                type="text"
                className="filter-input"
                placeholder={t("filterModal.district_placeholder")}
                value={localFilters.district}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    district: e.target.value,
                  }))
                }
              />
              <input
                type="text"
                className="filter-input"
                placeholder={t("filterModal.city_placeholder")}
                value={localFilters.city}
                onChange={(e) =>
                  setLocalFilters((prev) => ({ ...prev, city: e.target.value }))
                }
              />
            </div>
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
