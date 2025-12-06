// client/src/pages/RestaurantDetail.jsx
import "../styles/RestaurantDetail.css";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import axios from "axios";

import RestaurantInfo from "../components/restaurant/RestaurantInfo";
import RestaurantCarousel from "../components/restaurant/RestaurantCarousel";
import MenuList from "../components/restaurant/MenuList";
import ReviewList from "../components/restaurant/ReviewList";
import RestaurantImages from "../components/restaurant/RestaurantImages";

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
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

  const isFavorite =
    restaurant && favorites.some(f => f.id === restaurant.id);

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
      {restaurant.logo && (
        <img src={restaurant.logo} alt={restaurant.name} className="restaurant-logo-full" />
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
        <MenuList menu={restaurant.menu_items || []} />
      </section>

      {/* IMAGES */}
      <section ref={imagesRef} className="restaurant-section">
        <h2 className="section-title">Images</h2>
        <RestaurantImages images={restaurant.images || []} />
      </section>

      {/* REVIEWS */}
      <section ref={reviewsRef} className="restaurant-section">
        <h2 className="section-title">Reviews</h2>
        <ReviewList reviews={restaurant.reviews || []} />
      </section>
    </div>
  );
}
