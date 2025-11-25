// client/src/components/search/FilterModal.jsx
import React, { useState } from 'react';
import { filterOptions } from '../../data/mockData';
import './FilterModal.css';

const FilterModal = ({ filters, onApply, onClose }) => {
  const [localFilters, setLocalFilters] = useState({
    services: [...filters.services],
    cuisines: [...filters.cuisines],
    distance: filters.distance,
    priceRange: filters.priceRange,
    styles: [...filters.styles],
    minRating: filters.minRating
  });

  // Toggle multi-select filter (services, cuisines, styles)
  const toggleArrayFilter = (category, value) => {
    setLocalFilters(prev => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  // Set single-select filter (distance, priceRange)
  const setSingleFilter = (category, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [category]: prev[category] === value ? '' : value
    }));
  };

  // Set rating filter
  const setRating = (rating) => {
    setLocalFilters(prev => ({
      ...prev,
      minRating: prev.minRating === rating ? 0 : rating
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
      distance: '',
      priceRange: '',
      styles: [],
      minRating: 0
    };
    setLocalFilters(resetFilters);
  };

  return (
    <div className="filter-modal-overlay" onClick={onClose}>
      <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="filter-modal-header">
          <h2 className="filter-modal-title">絞り込み検索</h2>
          <button className="filter-close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="filter-modal-content">
          {/* Services */}
          <div className="filter-section">
            <h3 className="filter-section-title">サービス内容</h3>
            <div className="filter-chips">
              {filterOptions.services.map(service => (
                <button
                  key={service.value}
                  className={`filter-chip ${
                    localFilters.services.includes(service.value) ? 'active' : ''
                  }`}
                  onClick={() => toggleArrayFilter('services', service.value)}
                >
                  {service.label}
                </button>
              ))}
              {filterOptions.cuisines.map(cuisine => (
                <button
                  key={cuisine.value}
                  className={`filter-chip ${
                    localFilters.cuisines.includes(cuisine.value) ? 'active' : ''
                  }`}
                  onClick={() => toggleArrayFilter('cuisines', cuisine.value)}
                >
                  {cuisine.label}
                </button>
              ))}
            </div>
          </div>

          {/* Distance */}
          <div className="filter-section">
            <h3 className="filter-section-title">距離</h3>
            <div className="filter-buttons">
              {filterOptions.distances.map(distance => (
                <button
                  key={distance.value}
                  className={`filter-button ${
                    localFilters.distance === distance.value ? 'active' : ''
                  }`}
                  onClick={() => setSingleFilter('distance', distance.value)}
                >
                  {distance.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-section">
            <h3 className="filter-section-title">価格帯</h3>
            <div className="filter-buttons">
              {filterOptions.priceRanges.map(price => (
                <button
                  key={price.value}
                  className={`filter-button price-button ${
                    localFilters.priceRange === price.value ? 'active' : ''
                  }`}
                  onClick={() => setSingleFilter('priceRange', price.value)}
                >
                  {price.label}
                </button>
              ))}
            </div>
          </div>

          {/* Styles */}
          <div className="filter-section">
            <h3 className="filter-section-title">スタイル</h3>
            <div className="filter-chips">
              {filterOptions.styles.map(style => (
                <button
                  key={style.value}
                  className={`filter-chip ${
                    localFilters.styles.includes(style.value) ? 'active' : ''
                  }`}
                  onClick={() => toggleArrayFilter('styles', style.value)}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="filter-section">
            <h3 className="filter-section-title">評価</h3>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  className={`star-button ${
                    localFilters.minRating >= star ? 'active' : ''
                  }`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
            {localFilters.minRating > 0 && (
              <p className="rating-text">
                {localFilters.minRating}つ星以上
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="filter-modal-footer">
          <button className="reset-button" onClick={handleReset}>
            リセット
          </button>
          <button className="apply-button" onClick={handleApply}>
            絞り込む
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;