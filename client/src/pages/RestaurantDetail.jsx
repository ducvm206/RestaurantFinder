import "../styles/RestaurantDetail.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import axios from "axios";

import RestaurantInfo from "../components/restaurant/RestaurantInfo";
import RestaurantCarousel from "../components/restaurant/RestaurantCarousel";
import MenuList from "../components/restaurant/MenuList";
import ReviewList from "../components/restaurant/ReviewList";
import ReviewForm from "../components/review/ReviewForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RestaurantImages from "../components/restaurant/RestaurantImages";
import useTranslation from "../hooks/useTranslation";
import { LanguageContext } from "../context/LanguageContext";

export default function RestaurantDetail() {
  const t = useTranslation();
  const { lang } = useContext(LanguageContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);

  // Refs for scrolling
  const menuRef = useRef(null);
  const reviewsRef = useRef(null);
  const imagesRef = useRef(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      setLoading(true);
      try {
        console.log("🌐 Fetching restaurant with lang:", lang);

        const res = await axios.get(
          `http://localhost:5000/api/restaurants/${id}?lang=${lang}`
        );

        console.log("📦 Restaurant data received:", res.data);

        setRestaurant(res.data);
        setError("");
      } catch (err) {
        console.error("❌ Error fetching restaurant:", err);
        setError(err.response?.data?.error || "Restaurant not found");
        setRestaurant(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id, lang]);

  // Fetch reviews separately
  useEffect(() => {
    if (!id) return;

    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/restaurant-reviews/restaurant/${id}`
        );
        setReviews(res.data);
      } catch (err) {
        console.error("Cannot fetch reviews:", err);
      }
    };

    fetchReviews();
  }, [id]);

  const handleReviewSuccess = () => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/restaurant-reviews/restaurant/${id}`
        );
        if (res.data.success) {
          setReviews(res.data.data.reviews);
        }
      } catch (err) {
        console.error("Cannot fetch reviews:", err);
      }
    };

    fetchReviews();
    setRefreshKey((prev) => prev + 1);
  };

  // Load favorites for current user
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/favorites", {
          method: "GET",
          credentials: "include",
        });
        if (res.status === 401) return;
        const data = await res.json();
        setFavorites(data || []);
      } catch (err) {
        console.error("Cannot load favorites:", err);
      }
    };
    loadFavorites();

    const handleUpdated = () => loadFavorites();
    window.addEventListener("favorites-updated", handleUpdated);
    return () => window.removeEventListener("favorites-updated", handleUpdated);
  }, [id]);

  const restaurantId = restaurant?.restaurant_id || parseInt(id, 10);
  const isFavorite =
    restaurantId && favorites.some((f) => f.restaurant_id === restaurantId);

  const toggleFavorite = async () => {
    if (!restaurantId) return;

    try {
      if (isFavorite) {
        const res = await fetch(
          `http://localhost:5000/api/favorites/${restaurantId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        if (res.status === 401) {
          navigate("/login");
          return;
        }
        if (!res.ok) throw new Error("Remove favorite failed");
        setFavorites((prev) =>
          prev.filter((f) => f.restaurant_id !== restaurantId)
        );
      } else {
        const res = await fetch("http://localhost:5000/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ restaurant_id: restaurantId }),
        });
        if (res.status === 401) {
          navigate("/login");
          return;
        }
        if (!res.ok) throw new Error("Add favorite failed");
        const data = await res.json();
        const favToAdd = data.favorite || {
          restaurant_id: restaurantId,
          restaurant,
        };
        setFavorites((prev) => [...prev, favToAdd]);
      }
      window.dispatchEvent(new Event("favorites-updated"));
    } catch (err) {
      console.error("Toggle favorite error:", err);
    }
  };

  const scrollTo = (ref) => {
    const TOPBAR_HEIGHT = 56;
    const TABS_HEIGHT = 56;
    const OFFSET = TOPBAR_HEIGHT + TABS_HEIGHT + 8;

    const y =
      ref.current.getBoundingClientRect().top + window.pageYOffset - OFFSET;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t("storeDetail.loading")}</p>
      </div>
    );
  }
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!restaurant) return <p>{t("storeDetail.not_found")}</p>;

  return (
    <div className="restaurant-detail-container">
      {/* Header */}
      <div className="restaurant-header">
        <h1>{restaurant.name}</h1>
        <button
          onClick={toggleFavorite}
          className={`favorite-button ${isFavorite ? "red" : "gray"}`}
        >
          {isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
        </button>
      </div>

      {/* Logo */}
      {restaurant.image_url && (
        <img
          src={restaurant.image_url}
          alt={restaurant.name}
          className="restaurant-logo-full"
        />
      )}

      {/* Restaurant Info - Wrapped in same container */}
      <div className="content-container">
        <RestaurantInfo restaurant={restaurant} />
      </div>

      {/* Navigation Tabs */}
      <div className="tabs-wrapper">
        <div className="restaurant-tabs">
          <button onClick={() => scrollTo(menuRef)}>
            {t("storeDetail.tabs.menu")}
          </button>
          <button onClick={() => scrollTo(reviewsRef)}>
            {t("storeDetail.tabs.reviews")}
          </button>
          <button onClick={() => scrollTo(imagesRef)}>
            {t("storeDetail.tabs.images")}
          </button>
        </div>
      </div>

      {/* MENU */}
      <section ref={menuRef} className="restaurant-section">
        <div className="content-container">
          <h2 className="section-title">{t("storeDetail.tabs.menu")}</h2>
          <MenuList menu={restaurant.menuItems || []} />
        </div>
      </section>

      {/* IMAGES */}
      <section ref={imagesRef} className="restaurant-section">
        <div className="content-container">
          <h2 className="section-title">{t("storeDetail.tabs.images")}</h2>
          <RestaurantImages images={restaurant.images || []} />
        </div>
      </section>

      {/* REVIEWS */}
      <section ref={reviewsRef} className="restaurant-section">
        <div className="content-container">
          <div className="reviews-header">
            <h2 className="section-title">{t("storeDetail.tabs.reviews")}</h2>
            <button
              className="write-review-btn"
              onClick={() => setShowReviewForm(true)}
            >
              {t("storeDetail.tabs.review_button")}
            </button>
          </div>
          <ReviewList
            reviews={reviews}
            restaurantId={id}
            key={refreshKey}
            onReviewsChange={(newReviews) => setReviews(newReviews)}
          />
        </div>
      </section>

      {/* ═══ REVIEW FORM MODAL ═══ */}
      {showReviewForm && (
        <ReviewForm
          restaurantId={id}
          restaurantName={restaurant.name}
          onClose={() => setShowReviewForm(false)}
          onSuccess={handleReviewSuccess}
        />
      )}

      {/* ═══ TOAST NOTIFICATIONS ═══ */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}