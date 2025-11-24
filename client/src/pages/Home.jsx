import { useState, useRef, useEffect } from "react";
import { foodlist, stores, user } from "../data/HomeData";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const location = "ハノイ工科大学";

  const [searchQuery, setSearchQuery] = useState("");
  const [index, setIndex] = useState(0);
  const wrapperRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const itemWidth = 140;

  const [lang, setLang] = useState("jp");
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleLangMenu = () => setLangOpen(prev => !prev);
  const selectLang = (value) => { setLang(value); setLangOpen(false); };

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Responsive slider
  useEffect(() => {
    const updateVisibleCount = () => {
      if (!wrapperRef.current) return;
      const wrapperWidth = wrapperRef.current.offsetWidth;
      const count = Math.floor(wrapperWidth / (itemWidth + 20));
      setVisibleCount(count > 0 ? count : 1);
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  // -----------------------------
  // SEARCH LOGIC
  // -----------------------------

  // Filter dishes from foodlist directly
  const filteredDishes = foodlist.filter(dish =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter categories for the slider (optional: show categories that have dishes matching search)
  const filteredCategories = filteredDishes.length > 0
    ? Array.from(new Set(filteredDishes.map(d => d.name))) // if you want just the dishes names
    : foodlist;

  // Filter stores by name (optional: direct search)
  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Slider navigation
  const next = () => setIndex(i => Math.min(i + 1, filteredCategories.length - visibleCount));
  const prev = () => setIndex(i => Math.max(i - 1, 0));

  // Navigate to restaurant that serves the dish
  const goToDishRestaurant = (dishName) => {
    const restaurant = stores.find(store =>
      store.menu.some(item => item.name === dishName)
    );
    if (restaurant) navigate(`/store/${restaurant.id}`);
    else alert("この料理を提供している店が見つかりません。");
  };

  return (
    <div className="home-container">
      {/* Top bar */}
      <div className="top-bar">
  {/* Language Dropdown */}
  <div className="lang-dropdown" ref={dropdownRef}>
    <button className="lang-btn" onClick={toggleLangMenu}>
      {lang === "jp" ? "日本語" : "Tiếng Việt"} ▾
    </button>
    {langOpen && (
      <div className="lang-menu">
        <div className="lang-item" onClick={() => selectLang("jp")}>日本語</div>
        <div className="lang-item" onClick={() => selectLang("vi")}>Tiếng Việt</div>
      </div>
    )}
  </div>

{/* Favorites Button */}
    <button
      className="favorites-btn"
      onClick={() => navigate("/favorites")}
    >
      お気に入り
    </button>


  {/* Avatar */}
  <div
      className="avatar-container"
      onClick={() => navigate("/profile")}
    >
      <img src={user.avatar} alt={user.name} className="avatar-img" />
      <span className="avatar-name">{user.name}</span>
    </div>

    
  </div>


      <p className="location">📍 {location}</p>
      <h2 className="greeting">こんにちは、{user.name}さん！午後もがんばりましょう！</h2>

      {/* Search box */}
      <div className="search-container">
        <input
          type="text"
          placeholder="料理名を入力..."
          className="search-box"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Search results: dishes */}
      {searchQuery && filteredDishes.length > 0 && (
        <div className="search-results">
          {filteredDishes.map(dish => (
            <div
              key={dish.id}
              className="dish-card"
              onClick={() => goToDishRestaurant(dish.name)}
            >
              <div className="dish-img-wrapper">
                <img src={dish.image} alt={dish.name} className="dish-img" />
              </div>
              <p className="dish-name">{dish.name}</p>
              
            </div>
          ))}
        </div>
      )}

      {/* Categories slider */}
      {foodlist.length > 0 && (
        <div className="cat-slider">
          {index > 0 && <button className="cat-btn left" onClick={prev}>◀</button>}
          <div className="cat-wrapper" ref={wrapperRef}>
            <div className="cat-list" style={{ transform: `translateX(-${index * (itemWidth + 20)}px)`, transition: "transform 0.3s ease" }}>
              {foodlist.map(cat => (
                <div key={cat.id} className="cat-item">
                  <img src={cat.image} alt={cat.name} className="cat-img" />
                  <p>{cat.name}</p>
                </div>
              ))}
            </div>
          </div>
          {index < foodlist.length - visibleCount && <button className="cat-btn right" onClick={next}>▶</button>}
        </div>
      )}

      {/* Restaurants list */}
      <div className="rest-list">
        {filteredStores.map(store => (
          <div key={store.id} className="rest-item" onClick={() => navigate(`/store/${store.id}`)}>
            <img src={store.logo} alt={store.name} className="rest-img" />
            <div className="rest-info">
              <h4>{store.name}</h4>
              <p>{store.categories.join("・")}</p>
              <p>⭐ {store.rating}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
