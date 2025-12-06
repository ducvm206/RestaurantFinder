// client/src/pages/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterModal from '../components/search/FilterModal';
import {
  mockDishes,
  mockRecentKeywords
} from '../data/mockData';
import './SearchPage.css';

const SearchPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  
  // State filters giữ giá trị mặc định (rỗng)
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
  const [restaurants, setRestaurants] = useState([]);

  // Load recent keywords
  useEffect(() => {
    const saved = localStorage.getItem('recentKeywords');
    if (saved) {
      setRecentKeywords(JSON.parse(saved));
    }
  }, []);

  // Fetch restaurants từ API
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/restaurants');
        const data = await res.json();
        setRestaurants(data);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
      }
    };
    fetchRestaurants();
  }, []);

  // Save recent keyword
  const saveRecentKeyword = (kw) => {
    if (!kw.trim()) return;
    const updated = [kw, ...recentKeywords.filter(k => k !== kw)].slice(0, 10);
    setRecentKeywords(updated);
    localStorage.setItem('recentKeywords', JSON.stringify(updated));
  };

  // --- SỬA ĐỔI CHÍNH TẠI ĐÂY ---
  // Handle search
  // Thêm tham số passedFilters (để nhận bộ lọc từ modal ngay lập tức)
  const handleSearch = (searchKeyword = keyword, passedFilters = null) => {
    
    // Ưu tiên dùng passedFilters nếu có, nếu không thì dùng state filters hiện tại
    const activeFilters = passedFilters || filters;

    // Kiểm tra xem có bất kỳ bộ lọc nào được chọn không
    const hasActiveFilters = 
      activeFilters.services.length > 0 ||
      activeFilters.cuisines.length > 0 ||
      activeFilters.distance ||
      activeFilters.priceRange ||
      activeFilters.styles.length > 0 ||
      activeFilters.minRating > 0;

    // Nếu không có từ khóa VÀ không có bộ lọc nào -> Clear kết quả
    if (!searchKeyword.trim() && !hasActiveFilters) {
      setSearchResults(null);
      return;
    }

    if (searchKeyword.trim()) {
      saveRecentKeyword(searchKeyword.trim());
    }

    let filtered = restaurants;

    // 1. Filter by keyword
    if (searchKeyword.trim()) {
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // --- DÙNG activeFilters ĐỂ LỌC ---

    // 2. Filter by services
    if (activeFilters.services.length > 0) {
      filtered = filtered.filter(r => {
        // Parse dữ liệu services của nhà hàng cho an toàn
        const servicesArray = Array.isArray(r.services) ? r.services : JSON.parse(r.services || "[]");
        // Kiểm tra xem nhà hàng có chứa service nào trong bộ lọc không
        return activeFilters.services.some(s => servicesArray.includes(s));
      });
    }

    // 3. Filter by cuisines
    if (activeFilters.cuisines.length > 0) {
      filtered = filtered.filter(r =>
        activeFilters.cuisines.includes(r.cuisine)
      );
    }

    // 4. Filter by distance
    if (activeFilters.distance) {
      if (activeFilters.distance === '< 2') {
        filtered = filtered.filter(r => r.distance < 2);
      } else if (activeFilters.distance === '2-6') {
        filtered = filtered.filter(r => r.distance >= 2 && r.distance <= 6);
      } else if (activeFilters.distance === '> 6') {
        filtered = filtered.filter(r => r.distance > 6);
      }
    }

    // 5. Filter by price range
    if (activeFilters.priceRange) {
      filtered = filtered.filter(r => r.price_range === activeFilters.priceRange);
    }

    // 6. Filter by styles
    if (activeFilters.styles.length > 0) {
      filtered = filtered.filter(r =>
        activeFilters.styles.some(s => r.style.includes(s))
      );
    }

    // 7. Filter by rating
    if (activeFilters.minRating > 0) {
      filtered = filtered.filter(r => r.average_rating >= activeFilters.minRating);
    }

    // Filter dishes by keyword (mock giữ nguyên)
    let filteredDishes = [];
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

  // --- SỬA ĐỔI CHÍNH TẠI ĐÂY ---
  // Handle filter apply
  const handleApplyFilter = (newFilters) => {
    // 1. Gọi search NGAY LẬP TỨC với bộ lọc mới
    handleSearch(keyword, newFilters);

    // 2. Reset state filters về rỗng để lần mở sau modal sẽ sạch sẽ
    setFilters({
      services: [],
      cuisines: [],
      distance: '',
      priceRange: '',
      styles: [],
      minRating: 0
    });

    // 3. Đóng modal
    setShowFilter(false);
  };


  // Handle recent keyword click
  const handleKeywordClick = (kw) => {
    setKeyword(kw);
    handleSearch(kw);
  };

  // Get recommendations (chỉ lấy nhà hàng đang mở)
  const recommendations = restaurants
    .filter(r => r.isOpen)
    .sort((a, b) => b.average_rating - a.average_rating)
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
            // Khi nhấn Enter, gọi search không tham số (dùng filters rỗng mặc định)
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button
          className="filter-button"
          onClick={() => setShowFilter(true)}
          title="絞り込み検索"
        >
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
                      key={restaurant.restaurant_id}
                      className="restaurant-card"
                      onClick={() => navigate(`/restaurant/${restaurant.restaurant_id}`)}
                    >
                      <img
                        src={restaurant.image_url}
                        alt={restaurant.name}
                        className="restaurant-image"
                        loading="lazy"
                      />
                      <div className="restaurant-info">
                        <h3 className="restaurant-name">{restaurant.name}</h3>
                        <p className="restaurant-address">{restaurant.address_ja}</p>
                        <div className="restaurant-meta">
                          <span className="rating">⭐ {restaurant.average_rating}</span>
                          <span className="price">{restaurant.price_range}</span>
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
                    key={restaurant.restaurant_id}
                    className="restaurant-card"
                    onClick={() => navigate(`/restaurant/${restaurant.restaurant_id}`)}
                  >
                    <img
                      src={restaurant.image_url}
                      alt={restaurant.name}
                      className="restaurant-image"
                      loading="lazy"
                    />
                    <div className="restaurant-info">
                      <h3 className="restaurant-name">{restaurant.name}</h3>
                      <p className="restaurant-address">{restaurant.address_ja}</p>
                      <div className="restaurant-meta">
                        <span className="rating">⭐ {restaurant.average_rating}</span>
                        <span className="price">{restaurant.price_range}</span>
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