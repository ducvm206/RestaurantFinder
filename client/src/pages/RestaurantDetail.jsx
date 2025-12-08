import "../styles/RestaurantDetail.css";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import axios from "axios";

import RestaurantInfo from "../components/restaurant/RestaurantInfo";
import RestaurantCarousel from "../components/restaurant/RestaurantCarousel";
import MenuList from "../components/restaurant/MenuList";
import ReviewList from "../components/restaurant/ReviewList";
import ReviewForm from "../components/review/ReviewForm"; // ← THÊM
import { ToastContainer } from "react-toastify"; // ← THÊM
import "react-toastify/dist/ReactToastify.css"; // ← THÊM
import RestaurantImages from "../components/restaurant/RestaurantImages";

export default function RestaurantDetail() {
  const { id } = useParams(); // <-- this is the restaurant ID
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]); // separate state for reviews

  const [showReviewForm, setShowReviewForm] = useState(false); // ← THÊM
  const [refreshKey, setRefreshKey] = useState(0); // ← THÊM

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);

  // Refs for scrolling
  const menuRef = useRef(null);
  const reviewsRef = useRef(null);
  const imagesRef = useRef(null);

  // Fetch restaurant from backend API
  useEffect(() => {
    const fetchRestaurant = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/restaurants/${id}`);
        setRestaurant(res.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Restaurant not found");
        setRestaurant(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  // Fetch reviews separately
  useEffect(() => {
  if (!id) return;

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/restaurant-reviews/restaurant/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Cannot fetch reviews:", err);
    }
  };

  fetchReviews();
}, [id]); // <-- use "id" here, not restaurantId

// ═══════════════════════════════════════════════════════════════
// HANDLE REVIEW FORM SUCCESS
// ═══════════════════════════════════════════════════════════════
const handleReviewSuccess = () => {
  // Refresh reviews by re-fetching
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/restaurant-reviews/restaurant/${id}`);
      if (res.data.success) {
        setReviews(res.data.data.reviews);
      }
    } catch (err) {
      console.error("Cannot fetch reviews:", err);
    }
  };
  
  fetchReviews();
  setRefreshKey(prev => prev + 1); // Force re-render
};

  const isFavorite = restaurant && favorites.some(f => f.id === restaurant.id);

  const toggleFavorite = () => {
    if (!restaurant) return;
    if (isFavorite) {
      setFavorites(favorites.filter(f => f.id !== restaurant.id));
    } else {
      setFavorites([...favorites, restaurant]);
    }
  };

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!restaurant) return <p>Restaurant not found</p>;

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

      {/* Restaurant Info */}
      <RestaurantInfo restaurant={restaurant} />

      {/* Navigation Tabs */}
      <div className="restaurant-tabs">
        <button onClick={() => scrollTo(menuRef)}>Menu</button>
        <button onClick={() => scrollTo(reviewsRef)}>Reviews</button>
        <button onClick={() => scrollTo(imagesRef)}>Images</button>
      </div>

      {/* MENU */}
      <section ref={menuRef} className="restaurant-section">
        <h2 className="section-title">Menu</h2>
        <MenuList menu={restaurant.menuItems || []} />
      </section>

      {/* IMAGES */}
      <section ref={imagesRef} className="restaurant-section">
        <h2 className="section-title">Images</h2>
        <RestaurantImages images={restaurant.images || []} />
      </section>

      {/* REVIEWS */}
      <section ref={reviewsRef} className="restaurant-section">
  <div className="reviews-header">
    <h2 className="section-title">お客様の声</h2>
    <button 
      className="write-review-btn"
      onClick={() => setShowReviewForm(true)}
    >
      レビューを書く
    </button>
  </div>
  <ReviewList 
    reviews={reviews} 
    restaurantId={id}
    key={refreshKey}
    onReviewsChange={(newReviews) => setReviews(newReviews)}
  />
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
