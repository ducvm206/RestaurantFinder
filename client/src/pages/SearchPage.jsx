// client/src/pages/SearchPage.jsx (UPDATED - Funnel Icon)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterModal from '../components/search/FilterModal';
import { 
  mockRestaurants, 
  mockDishes, 
  mockRecentKeywords 
} from '../data/mockData';
import './SearchPage.css';

const SearchPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    services: [],
    cuisines: [],
    distance: '',
    priceRange: '',
    styles: [],
    minRating: 0
  });
  const [recentKeywords, setRecentKeywords] = useState(mockRecentKeywords);
  const [searchResults, setSearchResults] = useState(null);

  // Load recent keywords
  useEffect(() => {
    const saved = localStorage.getItem('recentKeywords');
    if (saved) {
      setRecentKeywords(JSON.parse(saved));
    }
  }, []);

  // Save recent keyword
  const saveRecentKeyword = (kw) => {
    if (!kw.trim()) return;
    
    const updated = [kw, ...recentKeywords.filter(k => k !== kw)].slice(0, 10);
    setRecentKeywords(updated);
    localStorage.setItem('recentKeywords', JSON.stringify(updated));
  };

  // Handle search
  const handleSearch = (searchKeyword = keyword) => {
    if (!searchKeyword.trim() && filters.services.length === 0) {
      setSearchResults(null);
      return;
    }

    if (searchKeyword.trim()) {
      saveRecentKeyword(searchKeyword.trim());
    }

    let filtered = mockRestaurants;

    // Filter by keyword
    if (searchKeyword.trim()) {
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        r.nameEn.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // Filter by services
    if (filters.services.length > 0) {
      filtered = filtered.filter(r => 
        filters.services.some(s => r.services.includes(s))
      );
    }

    // Filter by cuisines
    if (filters.cuisines.length > 0) {
      filtered = filtered.filter(r => 
        filters.cuisines.includes(r.cuisine)
      );
    }

    // Filter by distance
    if (filters.distance) {
      if (filters.distance === '< 2') {
        filtered = filtered.filter(r => r.distance < 2);
      } else if (filters.distance === '2-6') {
        filtered = filtered.filter(r => r.distance >= 2 && r.distance <= 6);
      } else if (filters.distance === '> 6') {
        filtered = filtered.filter(r => r.distance > 6);
      }
    }

    // Filter by price range
    if (filters.priceRange) {
      filtered = filtered.filter(r => r.priceRange === filters.priceRange);
    }

    // Filter by styles
    if (filters.styles.length > 0) {
      filtered = filtered.filter(r => 
        filters.styles.some(s => r.style.includes(s))
      );
    }

    // Filter by rating
    if (filters.minRating > 0) {
      filtered = filtered.filter(r => r.rating >= filters.minRating);
    }

    // Filter dishes by keyword
    let filteredDishes = mockDishes;
    if (searchKeyword.trim()) {
      filteredDishes = filteredDishes.filter(d => 
        d.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        d.nameEn.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    setSearchResults({
      restaurants: filtered,
      dishes: filteredDishes.filter(d => d.isPopular).slice(0, 4)
    });
  };

  // Handle filter apply
  const handleApplyFilter = (newFilters) => {
    setFilters(newFilters);
    setShowFilter(false);
    setTimeout(() => handleSearch(keyword), 100);
  };

  // Handle recent keyword click
  const handleKeywordClick = (kw) => {
    setKeyword(kw);
    handleSearch(kw);
  };

  // Get recommendations
  const recommendations = mockRestaurants
    .filter(r => r.isOpen)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const popularDishes = mockDishes
    .filter(d => d.isPopular)
    .slice(0, 4);

  return (
    <div className="search-page">
      {/* Header */}
      <div className="search-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          <span>←</span>
        </button>
        <h1 className="search-title">検索</h1>
      </div>

      {/* Search Bar */}
      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="ラーメン"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button 
          className="filter-button"
          onClick={() => setShowFilter(true)}
          title="絞り込み検索"
        >
          {/* Funnel/Filter SVG Icon */}
          <svg 
            className="filter-icon" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M3 4.5H21V6.75L14.25 13.5V19.5L9.75 21.75V13.5L3 6.75V4.5Z" 
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="search-content">
        {searchResults ? (
          // Search results
          <div className="search-results">
            {searchResults.dishes.length > 0 && (
              <div className="results-section">
                <h2 className="section-title">人気のラーメン</h2>
                <div className="dishes-grid">
                  {searchResults.dishes.map(dish => (
                    <div key={dish.id} className="dish-card">
                      <img 
                        src={dish.image} 
                        alt={dish.name}
                        className="dish-image"
                        loading="lazy"
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

            {searchResults.restaurants.length > 0 && (
              <div className="results-section">
                <h2 className="section-title">営業中のレストラン</h2>
                <div className="restaurants-list">
                  {searchResults.restaurants.map(restaurant => (
                    <div 
                      key={restaurant.id} 
                      className="restaurant-card"
                      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                    >
                      <img 
                        src={restaurant.image} 
                        alt={restaurant.name}
                        className="restaurant-image"
                        loading="lazy"
                      />
                      <div className="restaurant-info">
                        <h3 className="restaurant-name">{restaurant.name}</h3>
                        <p className="restaurant-address">{restaurant.address}</p>
                        <div className="restaurant-meta">
                          <span className="rating">⭐ {restaurant.rating}</span>
                          <span className="distance">{restaurant.distance} km</span>
                          <span className="price">{restaurant.priceRange}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.restaurants.length === 0 && searchResults.dishes.length === 0 && (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <p className="no-results-title">検索結果が見つかりませんでした</p>
                <p className="no-results-text">別のキーワードで検索してください</p>
              </div>
            )}
          </div>
        ) : (
          // Default view
          <>
            {recentKeywords.length > 0 && (
              <div className="recent-keywords-section">
                <h2 className="section-title">最近のキーワード</h2>
                <div className="keywords-list">
                  {recentKeywords.map((kw, index) => (
                    <button
                      key={index}
                      className="keyword-chip"
                      onClick={() => handleKeywordClick(kw)}
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="recommendations-section">
              <h2 className="section-title">おすすめのレストラン</h2>
              <div className="restaurants-list">
                {recommendations.map(restaurant => (
                  <div 
                    key={restaurant.id} 
                    className="restaurant-card"
                    onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                  >
                    <img 
                      src={restaurant.image} 
                      alt={restaurant.name}
                      className="restaurant-image"
                      loading="lazy"
                    />
                    <div className="restaurant-info">
                      <h3 className="restaurant-name">{restaurant.name}</h3>
                      <p className="restaurant-address">{restaurant.address}</p>
                      <div className="restaurant-meta">
                        <span className="rating">⭐ {restaurant.rating}</span>
                        <span className="distance">{restaurant.distance} km</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="popular-dishes-section">
              <h2 className="section-title">おすすめの料理</h2>
              <div className="dishes-scroll">
                {popularDishes.map(dish => (
                  <div key={dish.id} className="dish-card-small">
                    <img 
                      src={dish.image} 
                      alt={dish.name}
                      className="dish-image-small"
                      loading="lazy"
                    />
                    <p className="dish-name-small">{dish.name}</p>
                    <p className="dish-restaurant-small">{dish.restaurantName}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filter Modal */}
      {showFilter && (
        <FilterModal
          filters={filters}
          onApply={handleApplyFilter}
          onClose={() => setShowFilter(false)}
        />
      )}
    </div>
  );
};

export default SearchPage;