import { useState, useRef, useEffect } from "react";
import { foodlist, stores } from "../data/HomeData";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import useTranslation from "../hooks/useTranslation";

export default function Home() {
  const t = useTranslation(); // <-- MULTI LANGUAGE HOOK
  const navigate = useNavigate();

  // LOCATION USING TRANSLATION
  const locationText = t("home.location");

  const [searchQuery, setSearchQuery] = useState("");
  const [index, setIndex] = useState(0);
  const wrapperRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const itemWidth = 140;

  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef(null);

  // REAL USER
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("user", JSON.stringify(data));
          setUser(data);
        } else {
          navigate("/login");
        }
      } catch {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // Close dropdown
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

  // Filtering
  const filteredDishes = foodlist.filter((dish) =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories =
    filteredDishes.length > 0
      ? Array.from(new Set(filteredDishes.map((d) => d.name)))
      : foodlist;

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Slider navigation
  const next = () =>
    setIndex((i) => Math.min(i + 1, filteredCategories.length - visibleCount));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  // Find restaurant serving dish
  const goToDishRestaurant = (dishName) => {
    const restaurant = stores.find((store) =>
      store.menu.some((item) => item.name === dishName)
    );
    if (restaurant) navigate(`/store/${restaurant.id}`);
    else alert(t("home.dish_not_found"));
  };

  // Loading UI
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t("home.loading")}</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="home-container">
      {/* TOP BAR */}
      <div className="top-bar">
        {/* LANGUAGE DROPDOWN */}
        <div className="lang-dropdown" ref={dropdownRef}>
          <button className="lang-btn" onClick={() => setLangOpen(!langOpen)}>
            🌐 ▾
          </button>

          {langOpen && (
            <div className="lang-menu">
              <div
                className="lang-item"
                onClick={() => localStorage.setItem("lang", "ja")}
              >
                日本語
              </div>
              <div
                className="lang-item"
                onClick={() => localStorage.setItem("lang", "vi")}
              >
                Tiếng Việt
              </div>
              <div
                className="lang-item"
                onClick={() => localStorage.setItem("lang", "en")}
              >
                English
              </div>
            </div>
          )}
        </div>

        {/* FAVORITES BUTTON */}
        <button
          className="favorites-btn"
          onClick={() => navigate("/favorites")}
        >
          {t("home.favorites")}
        </button>

        {/* AVATAR */}
        <div className="avatar-container" onClick={() => navigate("/profile")}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.fullName} className="avatar-img" />
          ) : (
            <div className="avatar-default">
              {user.fullName?.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="avatar-name">{user.fullName}</span>
        </div>
      </div>

      {/* LOCATION */}
      <p className="location">📍 {locationText}</p>

      {/* GREETING */}
      <h2 className="greeting">
        {t("home.greeting").replace("{name}", user.fullName)}
      </h2>

      {/* SEARCH */}
      <div className="search-container">
        <input
          type="text"
          placeholder={t("home.search_placeholder")}
          onClick={() => navigate("/search")}
          readOnly
          className="search-box"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* SEARCH RESULTS */}
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

      {/* CATEGORY SLIDER */}
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

      {/* RESTAURANTS LIST */}
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
