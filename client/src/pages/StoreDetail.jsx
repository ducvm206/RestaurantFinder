import "../styles/StoreDetail.css";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

import StoreInfo from "../components/restaurant/StoreInfo";
import StoreCarousel from "../components/restaurant/StoreCarousel";
import MenuList from "../components/restaurant/MenuList";
import ReviewList from "../components/restaurant/ReviewList";
import StoreImages from "../components/restaurant/StoreImages";
import { stores } from "../data/HomeData";

export default function StoreDetail() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);

  // Refs to scroll to each section

  const menuRef = useRef(null);
  const reviewsRef = useRef(null);
  const imagesRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const storeData = stores.find((s) => s.id === parseInt(id));
      if (!storeData) setError("Store not found");
      else setStore(storeData);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [id]);

  const isFavorite = store && favorites.some((s) => s.id === store.id);

  const toggleFavorite = () => {
    if (!store) return;
    if (isFavorite) {
      setFavorites(favorites.filter((s) => s.id !== store.id));
    } else {
      setFavorites([...favorites, store]);
    }
  };

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!store) return <p>Store not found</p>;

  return (
    <div className="store-detail-container">

      {/* Header */}
      <div className="store-header">
        <h1>{store.name}</h1>
        <button
          onClick={toggleFavorite}
          className={`favorite-button ${isFavorite ? "red" : "gray"}`}
        >
          {isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
        </button>
      </div>

      {/* Full width logo */}
      {store.logo && (
        <img src={store.logo} alt={store.name} className="store-logo-full" />
      )}
      
      <StoreInfo store={store} />

      {/* Navigation Tabs */}
      <div className="store-tabs">
        <button onClick={() => scrollTo(menuRef)}>Menu</button>
        <button onClick={() => scrollTo(reviewsRef)}>Reviews</button>
        <button onClick={() => scrollTo(imagesRef)}>Images</button>
      </div>

      {/* MENU SECTION */}
      <section ref={menuRef} className="store-section">
        <h2 className="section-title">Menu</h2>
        <MenuList menu={store.menu} />
      </section>

      {/* IMAGES SECTION */}
      <section ref={imagesRef} className="store-section">
        <h2 className="section-title">Images</h2>
        <StoreImages images={store.images} />
      </section>

      {/* REVIEWS SECTION */}
      <section ref={reviewsRef} className="store-section">
        <h2 className="section-title">Reviews</h2>
        <ReviewList reviews={store.reviews} />
      </section>

      

    </div>
  );
}
