import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilterModal from "../components/search/FilterModal";

import {
  mockRestaurants,
  mockDishes,
  mockRecentKeywords,
} from "../data/mockData";

import useTranslation from "../hooks/useTranslation";

import "./SearchPage.css";

const SearchPage = () => {
  const navigate = useNavigate();
  const t = useTranslation();

  const [keyword, setKeyword] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    services: [],
    cuisines: [],
    distance: "",
    priceRange: "",
    styles: [],
    minRating: 0,
  });
  const [recentKeywords, setRecentKeywords] = useState(mockRecentKeywords);
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("recentKeywords");
    if (saved) {
      setRecentKeywords(JSON.parse(saved));
    }
  }, []);

  const saveRecentKeyword = (kw) => {
    if (!kw.trim()) return;

    const updated = [kw, ...recentKeywords.filter((k) => k !== kw)].slice(
      0,
      10
    );
    setRecentKeywords(updated);
    localStorage.setItem("recentKeywords", JSON.stringify(updated));
  };

  const handleSearch = (searchKeyword = keyword) => {
    if (!searchKeyword.trim() && filters.services.length === 0) {
      setSearchResults(null);
      return;
    }

    if (searchKeyword.trim()) {
      saveRecentKeyword(searchKeyword.trim());
    }

    let filtered = mockRestaurants;

    if (searchKeyword.trim()) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          r.nameEn.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    if (filters.services.length > 0) {
      filtered = filtered.filter((r) =>
        filters.services.some((s) => r.services.includes(s))
      );
    }

    if (filters.cuisines.length > 0) {
      filtered = filtered.filter((r) => filters.cuisines.includes(r.cuisine));
    }

    if (filters.distance) {
      if (filters.distance === "< 2") {
        filtered = filtered.filter((r) => r.distance < 2);
      } else if (filters.distance === "2-6") {
        filtered = filtered.filter((r) => r.distance >= 2 && r.distance <= 6);
      } else if (filters.distance === "> 6") {
        filtered = filtered.filter((r) => r.distance > 6);
      }
    }

    if (filters.priceRange) {
      filtered = filtered.filter((r) => r.priceRange === filters.priceRange);
    }

    if (filters.styles.length > 0) {
      filtered = filtered.filter((r) =>
        filters.styles.some((s) => r.style.includes(s))
      );
    }

    if (filters.minRating > 0) {
      filtered = filtered.filter((r) => r.rating >= filters.minRating);
    }

    let filteredDishes = mockDishes;
    if (searchKeyword.trim()) {
      filteredDishes = filteredDishes.filter(
        (d) =>
          d.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          d.nameEn.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    setSearchResults({
      restaurants: filtered,
      dishes: filteredDishes.filter((d) => d.isPopular).slice(0, 4),
    });
  };

  const handleApplyFilter = (newFilters) => {
    setFilters(newFilters);
    setShowFilter(false);
    setTimeout(() => handleSearch(keyword), 100);
  };

  const handleKeywordClick = (kw) => {
    setKeyword(kw);
    handleSearch(kw);
  };

  const recommendations = mockRestaurants
    .filter((r) => r.isOpen)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const popularDishes = mockDishes.filter((d) => d.isPopular).slice(0, 4);

  return (
    <div className="search-page">
      {/* Header */}
      <div className="search-header">
        <button className="back-button" onClick={() => navigate("/home")}>
          <span>←</span>
        </button>
        <h1 className="search-title">{t("search.title")}</h1>
      </div>

      {/* Search Bar */}
      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder={t("search.search_placeholder")}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <button
          className="filter-button"
          onClick={() => setShowFilter(true)}
          title={t("search.filters_button")}
        >
          <svg className="filter-icon" width="24" height="24">
            <path
              d="M3 4.5H21V6.75L14.25 13.5V19.5L9.75 21.75V13.5L3 6.75V4.5Z"
              fill="currentColor"
              stroke="currentColor"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="search-content">
        {searchResults ? (
          <div className="search-results">
            {/* Popular Dishes */}
            {searchResults.dishes.length > 0 && (
              <div className="results-section">
                <h2 className="section-title">
                  {t("search.sections.popular_dishes")}
                </h2>
                <div className="dishes-grid">
                  {searchResults.dishes.map((dish) => (
                    <div key={dish.id} className="dish-card">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="dish-image"
                      />
                      <h3 className="dish-name">{dish.name}</h3>
                      <p className="dish-restaurant">{dish.restaurantName}</p>
                      <p className="dish-price">¥{dish.price}</p>
                      <button className="add-button">+</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Restaurants */}
            {searchResults.restaurants.length > 0 && (
              <div className="results-section">
                <h2 className="section-title">
                  {t("search.sections.open_restaurants")}
                </h2>
                <div className="restaurants-list">
                  {searchResults.restaurants.map((restaurant) => (
                    <div
                      key={restaurant.id}
                      className="restaurant-card"
                      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                    >
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="restaurant-image"
                      />
                      <div className="restaurant-info">
                        <h3 className="restaurant-name">{restaurant.name}</h3>
                        <p className="restaurant-address">
                          {restaurant.address}
                        </p>
                        <div className="restaurant-meta">
                          <span>⭐ {restaurant.rating}</span>
                          <span>{restaurant.distance} km</span>
                          <span>{restaurant.priceRange}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchResults.restaurants.length === 0 &&
              searchResults.dishes.length === 0 && (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <p className="no-results-title">
                    {t("search.sections.no_results_title")}
                  </p>
                  <p className="no-results-text">
                    {t("search.sections.no_results_text")}
                  </p>
                </div>
              )}
          </div>
        ) : (
          <>
            {/* Recent Keywords */}
            {recentKeywords.length > 0 && (
              <div className="recent-keywords-section">
                <h2 className="section-title">
                  {t("search.sections.recent_keywords")}
                </h2>
                <div className="keywords-list">
                  {recentKeywords.map((kw, i) => (
                    <button
                      key={i}
                      className="keyword-chip"
                      onClick={() => handleKeywordClick(kw)}
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Restaurants */}
            <div className="recommendations-section">
              <h2 className="section-title">
                {t("search.sections.recommended_restaurants")}
              </h2>
              <div className="restaurants-list">
                {recommendations.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="restaurant-card"
                    onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                  >
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="restaurant-image"
                    />
                    <div className="restaurant-info">
                      <h3 className="restaurant-name">{restaurant.name}</h3>
                      <p className="restaurant-address">{restaurant.address}</p>
                      <div className="restaurant-meta">
                        <span>⭐ {restaurant.rating}</span>
                        <span>{restaurant.distance} km</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Dishes */}
            <div className="popular-dishes-section">
              <h2 className="section-title">
                {t("search.sections.recommended_dishes")}
              </h2>
              <div className="dishes-scroll">
                {popularDishes.map((dish) => (
                  <div key={dish.id} className="dish-card-small">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="dish-image-small"
                    />
                    <p className="dish-name-small">{dish.name}</p>
                    <p className="dish-restaurant-small">
                      {dish.restaurantName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {showFilter && (
        <FilterModal
          filters={filters}
          onClose={() => setShowFilter(false)}
          onApply={handleApplyFilter}
          t={t}
        />
      )}
    </div>
  );
};

export default SearchPage;
