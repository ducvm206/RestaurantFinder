import { useState, useRef, useEffect } from "react";
import { foodlist, stores } from "../data/HomeData";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Home.css";
import TopBar from "../components/home/TopBar";
import SearchBox from "../components/home/SearchBox";
import CategoriesSlider from "../components/home/CategoriesSlider";
import RestaurantList from "../components/home/RestaurantList";
import FindLocation from "../components/home/FindLocation";
import { foodlist } from "../data/HomeData";

export default function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState({ id: null, fullName: "", avatar: "" });
  const [restaurants, setRestaurants] = useState([]);
  const [lang, setLang] = useState("jp");
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef(null);

  // REAL USER STATE
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleLangMenu = () => setLangOpen((prev) => !prev);
  const selectLang = (value) => {
    setLang(value);
    setLangOpen(false);
  };

  // Load real user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();

          // ➤ Lưu user vào localStorage
          localStorage.setItem("user", JSON.stringify(data));

          // ➤ Đặt user vào state
          setUser(data);
        } else {
          // Không có cookie hoặc cookie invalid → đăng nhập lại
          navigate("/login");
        }
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

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

  const token = localStorage.getItem("token");

  // Filter dishes from foodlist directly
  const filteredDishes = foodlist.filter((dish) =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter categories for the slider
  const filteredCategories =
    filteredDishes.length > 0
      ? Array.from(new Set(filteredDishes.map((d) => d.name)))
      : foodlist;

  // Filter stores by name
  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/restaurants");
        setRestaurants(res.data || []);
      } catch (err) {
        console.error("Cannot fetch restaurants:", err);
      }
    };
    fetchRestaurants();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>読み込み中...</p>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>読み込み中...</p>
      </div>
    );
  }

  // If no user found, show nothing (will redirect in useEffect)
  if (!user) {
    return null;
  }

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
              <div className="lang-item" onClick={() => selectLang("jp")}>
                日本語
              </div>
              <div className="lang-item" onClick={() => selectLang("vi")}>
                Tiếng Việt
              </div>
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

        {/* Avatar with REAL USER DATA */}
        <div className="avatar-container" onClick={() => navigate("/profile")}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.fullName} className="avatar-img" />
          ) : (
            <div className="avatar-default">
              {user.fullName?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          <span className="avatar-name">{user.fullName}</span>
        </div>
      </div>

      <p className="location">📍 {location}</p>
      <h2 className="greeting">
        こんにちは、{user.fullName}さん！午後もがんばりましょう！
      </h2>

      {/* Search box */}
      <div className="search-container">
        <input
          type="text"
          placeholder="料理名を入力..."
          onClick={() => navigate("/search")}
          readOnly
          className="search-box"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Search results: dishes */}
      {searchQuery && filteredDishes.length > 0 && (
        <div className="search-results">
          {filteredDishes.map((dish) => (
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
          {index > 0 && (
            <button className="cat-btn left" onClick={prev}>
              ◀
            </button>
          )}
          <div className="cat-wrapper" ref={wrapperRef}>
            <div
              className="cat-list"
              style={{
                transform: `translateX(-${index * (itemWidth + 20)}px)`,
                transition: "transform 0.3s ease",
              }}
            >
              {foodlist.map((cat) => (
                <div key={cat.id} className="cat-item">
                  <img src={cat.image} alt={cat.name} className="cat-img" />
                  <p>{cat.name}</p>
                </div>
              ))}
            </div>
          </div>
          {index < foodlist.length - visibleCount && (
            <button className="cat-btn right" onClick={next}>
              ▶
            </button>
          )}
        </div>
      )}

      {/* Restaurants list */}
      <div className="rest-list">
        {filteredStores.map((store) => (
          <div
            key={store.id}
            className="rest-item"
            onClick={() => navigate(`/store/${store.id}`)}
          >
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
