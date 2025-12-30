import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import FilterModal from "../components/search/FilterModal";
import { mockRecentKeywords } from "../data/mockData";
import useTranslation from "../hooks/useTranslation";
import { getDistanceFromLatLonInKm } from "../utils/distance";
import { useLocationContext } from "../context/LocationContext";
import "./SearchPage.css";

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const t = useTranslation();
  const { userCoords } = useLocationContext(); // ⭐ Lấy từ context
  const [keyword, setKeyword] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    services: [],
    cuisines: [],
    distance: "",
    priceRange: "",
    styles: [],
    minRating: 0,
    district: "",
    city: "",
  });

  const [recentKeywords, setRecentKeywords] = useState(mockRecentKeywords);
  const [searchResults, setSearchResults] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState("");
// add => loading
  const [loading, setLoading] = useState(false);

  // Load restaurant fallback
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/restaurants");
        const data = await res.json();
        setRestaurants(data || []);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
      }
    };
    fetchRestaurants();
  }, []);

  // Load recent keywords
  useEffect(() => {
    const saved = localStorage.getItem("recentKeywords");
    if (saved) setRecentKeywords(JSON.parse(saved));
  }, []);

// add: when click category => display list of restaurant
    useEffect(() => {
  if (location.state?.category && location.state?.fromCategory) {
    searchByDishOnly(location.state.category);
  }
}, [location.state]);



////////////////////////////////////

  const saveRecentKeyword = (kw) => {
    if (!kw.trim()) return;
    const updated = [kw, ...recentKeywords.filter((k) => k !== kw)].slice(0, 10);
    setRecentKeywords(updated);
    localStorage.setItem("recentKeywords", JSON.stringify(updated));
  };
// ⭐ Hàm thêm distance vào dữ liệu
  const appendDistance = (items) => {
    if (!userCoords) return items;

    return items.map((r) => {
      if (!r.latitude || !r.longitude) return r;
      const dist = getDistanceFromLatLonInKm(
        userCoords.lat,
        userCoords.lon,
        parseFloat(r.latitude),
        parseFloat(r.longitude)
      );
      return { ...r, distance: dist };
    });
  };
 
// search by dish in category
  const searchByDishOnly = async (dishName) => {
  setLoading(true);
  setError("");

  try {
    const res = await fetch(
      `http://localhost:5000/api/restaurants/by-dish?name=${encodeURIComponent(dishName)}`
    );

    if (!res.ok) throw new Error("Dish search failed");

    let data = await res.json();
    data = appendDistance(data);

    setSearchResults({
      restaurants: data,
      dishes: [],
    });
  } catch (err) {
    console.error(err);
    setError("Không tìm thấy nhà hàng cho món này");
  } finally {
    setLoading(false);
  }
};



  const handleSearch = async (searchKeyword = keyword, passedFilters = null) => {
    setError("");
    const activeFilters = passedFilters || filters;

    if (searchKeyword.trim()) saveRecentKeyword(searchKeyword.trim());

    try {
      const params = new URLSearchParams();

      if (searchKeyword.trim()) params.append("q", searchKeyword.trim());
      if (activeFilters.priceRange) params.append("price_range", activeFilters.priceRange);
      if (activeFilters.minRating) params.append("min_rating", activeFilters.minRating);
      if (activeFilters.city) params.append("city", activeFilters.city);
      if (activeFilters.district) params.append("district", activeFilters.district);
      if (activeFilters.services.length) params.append("services", activeFilters.services.join(","));
      if (activeFilters.cuisines.length) params.append("cuisines", activeFilters.cuisines.join(","));
      if (activeFilters.styles.length) params.append("styles", activeFilters.styles.join(","));

      const res = await fetch(
        `http://localhost:5000/api/restaurants/search/q?${params.toString()}`
      );

      if (!res.ok) throw new Error("Search failed");

      let data = await res.json();

      // ⭐ Thêm distance
      data = appendDistance(data);

      // ⭐ Lọc distance
      if (activeFilters.distance && userCoords) {
        if (activeFilters.distance === "< 2") {
          data = data.filter((r) => r.distance < 2);
        } else if (activeFilters.distance === "2-6") {
          data = data.filter((r) => r.distance >= 2 && r.distance <= 6);
        } else if (activeFilters.distance === "> 6") {
          data = data.filter((r) => r.distance > 6);
        }
      }

      setSearchResults({ restaurants: data, dishes: [] });
    } catch (err) {
  console.error(err);
  setError("Không thể tìm kiếm nhà hàng");
} finally {
  setLoading(false);
}

  };

  const handleApplyFilter = (newFilters) => {
    setFilters(newFilters);
    setShowFilter(false);
    setTimeout(() => handleSearch(keyword, newFilters), 0);
  };

  const handleKeywordClick = (kw) => {
    setKeyword(kw);
    handleSearch(kw);
  };

  // ⭐ Recommended restaurants (also add distance)
  const recommendations = appendDistance(
    restaurants
      .filter((r) => r.isOpen)
      .sort((a, b) => b.average_rating - a.average_rating)
      .slice(0, 3)
  );
  // Add loading when click category to find restaurant
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>読み込み中</p>
        </div>
      );
    }

  
  return (
    <div className="search-page">
      <div className="search-header">
        <button className="back-button" onClick={() => navigate("/home")}>
          <span>‹</span>
        </button>
        <h1 className="search-title">{t("search.title")}</h1>
      </div>

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

        <button className="filter-button" onClick={() => setShowFilter(true)}>
          <svg className="filter-icon" width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M3 4.5H21V6.75L14.25 13.5V19.5L9.75 21.75V13.5L3 6.75V4.5Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      <div className="search-content">
        {error && <p className="favorites-error">{error}</p>}

        {searchResults ? (
          <div className="search-results">
            {searchResults.restaurants.length > 0 ? (
              <div className="results-section">
                <h2 className="section-title">
                  {t("search.sections.open_restaurants")}
                </h2>

                <div className="restaurants-list">
                  {searchResults.restaurants.map((restaurant) => (
                    <div
                      key={restaurant.restaurant_id}
                      className="restaurant-card"
                      onClick={() => navigate(`/restaurants/${restaurant.restaurant_id}`)}
                    >
                      <img
                        src={restaurant.image_url}
                        alt={restaurant.name}
                        className="restaurant-image"
                      />
                      <div className="restaurant-info">
                        <h3 className="restaurant-name">{restaurant.name}</h3>
                        <p className="restaurant-address">
                          {restaurant.address_ja || restaurant.city}
                        </p>

                        <div className="restaurant-meta">
                          <span>⭐ {restaurant.average_rating}</span>
                          <span>{restaurant.price_range}</span>
                        </div>

                        {/* ⭐ Distance */}
                        {restaurant.distance != null && (
                          <p className="restaurant-distance">
                            📍 {restaurant.distance.toFixed(2)} km
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <p className="no-results-title">{t("search.sections.no_results_title")}</p>
                <p className="no-results-text">{t("search.sections.no_results_text")}</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {recentKeywords.length > 0 && (
              <div className="recent-keywords-section">
                <h2 className="section-title">
                  {t("search.sections.recent_keywords")}
                </h2>
                <div className="keywords-list">
                  {recentKeywords.map((kw, i) => (
                    <button key={i} className="keyword-chip" onClick={() => handleKeywordClick(kw)}>
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="recommendations-section">
              <h2 className="section-title">
                {t("search.sections.recommended_restaurants")}
              </h2>
              <div className="restaurants-list">
                {recommendations.map((restaurant) => (
                  <div
                    key={restaurant.restaurant_id}
                    className="restaurant-card"
                    onClick={() => navigate(`/restaurants/${restaurant.restaurant_id}`)}
                  >
                    <img
                      src={restaurant.image_url}
                      alt={restaurant.name}
                      className="restaurant-image"
                    />
                    <div className="restaurant-info">
                      <h3 className="restaurant-name">{restaurant.name}</h3>
                      <p className="restaurant-address">
                        {restaurant.address_ja || restaurant.city}
                      </p>

                      <div className="restaurant-meta">
                        <span>⭐ {restaurant.average_rating}</span>
                        <span>{restaurant.price_range}</span>
                      </div>

                      {/* ⭐ Distance */}
                      {restaurant.distance != null && (
                        <p className="restaurant-distance">
                          📍 {restaurant.distance.toFixed(2)} km
                        </p>
                      )}
                    </div>
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
