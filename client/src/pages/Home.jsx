import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Home.css";

import useTranslation from "../hooks/useTranslation";
import { foodlist } from "../data/HomeData";

import SearchBox from "../components/home/SearchBox";
import CategoriesSlider from "../components/home/CategoriesSlider";
import RestaurantList from "../components/home/RestaurantList";

export default function Home() {
  const t = useTranslation();
  const navigate = useNavigate();

  // User login
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaurants
  const [restaurants, setRestaurants] = useState([]);

  // Food search
  const [searchQuery, setSearchQuery] = useState("");

  // Slider
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const itemWidth = 140;
  const wrapperRef = useRef(null);

  /* Fetch user */
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) return navigate("/login");

        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
      } catch {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [navigate]);

  /* Fetch restaurants */
  useEffect(() => {
    async function loadRestaurants() {
      try {
        const res = await axios.get("http://localhost:5000/api/restaurants");
        setRestaurants(res.data);
      } catch (err) {
        console.error("Restaurant fetch failed", err);
      }
    }
    loadRestaurants();
  }, []);

  /* Slider responsive */
  useEffect(() => {
    const resize = () => {
      if (!wrapperRef.current) return;

      const w = wrapperRef.current.offsetWidth;
      const count = Math.floor(w / (itemWidth + 20));
      setVisibleCount(count > 0 ? count : 1);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const next = () =>
    setIndex((i) => Math.min(i + 1, foodlist.length - visibleCount));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

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
      <h2 className="greeting">
        {t("home.greeting").replace("{name}", user.fullName)}
      </h2>

      <SearchBox
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        navigate={navigate}
        t={t}
      />

      <CategoriesSlider
        index={index}
        next={next}
        prev={prev}
        foodlist={foodlist}
        wrapperRef={wrapperRef}
        visibleCount={visibleCount}
        itemWidth={itemWidth}
      />

      <RestaurantList restaurants={restaurants} />
    </div>
  );
}