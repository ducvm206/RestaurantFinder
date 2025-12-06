// client/src/pages/Home.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Home.css";
import TopBar from "../components/home/TopBar";
import SearchBox from "../components/home/SearchBox";
import DishSearchResults from "../components/home/DishSearchResults";
import CategoriesSlider from "../components/home/CategoriesSlider";
import RestaurantList from "../components/home/RestaurantList";
import FindLocation from "../components/home/FindLocation";
import { foodlist } from "../data/HomeData";

export default function Home() {
  const [user, setUser] = useState({ id: null, fullName: "", avatar: "" });
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [lang, setLang] = useState("jp");
  const [langOpen, setLangOpen] = useState(false);
  const [userCoords, setUserCoords] = useState(null);

  const token = localStorage.getItem("token");

  // // ------------------------
  // // Fetch logged-in user (optional)
  // // ------------------------
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({
          id: res.data.id,
          fullName: res.data.fullName,
          avatar: res.data.avatar,
        });
      } catch (err) {
        console.error("Cannot fetch user:", err);
      }
    };
    fetchUser();
  }, [token]);

  // ------------------------
  // Fetch restaurants from backend
  // ------------------------
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

  const toggleLangMenu = () => setLangOpen((prev) => !prev);
  const selectLang = (value) => { setLang(value); setLangOpen(false); };

  return (
    <div className="home-container">
      <TopBar
        user={user}
        lang={lang}
        langOpen={langOpen}
        toggleLangMenu={toggleLangMenu}
        selectLang={selectLang}
      />

      <p className="location">
        📍 <FindLocation onCoords={setUserCoords} />
      </p>

      <h2 className="greeting">
        こんにちは、{user.fullName || "ゲスト"}さん！午後もがんばりましょう！
      </h2>

      <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* TODO: Add dish search functionality */}
      <DishSearchResults filteredDishes={[]} goToDishRestaurant={() => {}} />

      <CategoriesSlider foodlist={foodlist} />

      <RestaurantList restaurants={restaurants} userCoords={userCoords} />
    </div>
  );
}
