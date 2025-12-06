import { useState, useEffect } from "react";
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
  const [userCoords, setUserCoords] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const toggleLangMenu = () => setLangOpen((prev) => !prev);
  const selectLang = (value) => {
    setLang(value);
    setLangOpen(false);
  };

// Load user from localStorage first
useEffect(() => {
  try {
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      const userData = JSON.parse(savedUser);

      // Ensure full avatar URL
      const avatarUrl =
        userData.avatarUrl ||
        (userData.avatar ? `${API_BASE_URL}${userData.avatar}` : null);

      setUser({ ...userData, avatarUrl });
    } else {
      navigate("/login");
    }
  } catch (err) {
    console.error("Error loading user:", err);
  } finally {
    setLoading(false);
  }
}, [navigate, token]);

// Fetch latest user from backend
useEffect(() => {
  if (!token) return;

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Ensure the avatar URL is full
      const avatarUrl =
        res.data.avatar ? `${API_BASE_URL}${res.data.avatar}` : "/default-avatar.png";

      const userData = {
        id: res.data.id,
        user_id: res.data.user_id || res.data.id,
        fullName: res.data.fullName,
        avatar: res.data.avatar, // keep relative path for backend
        avatarUrl,               // full URL for frontend use
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      console.error("Cannot fetch user:", err);
    }
  };

  fetchUser();
}, [token]);


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

      {/* SearchBox will navigate to search page on click */}
      <SearchBox />

      <CategoriesSlider foodlist={foodlist} />

      <RestaurantList restaurants={restaurants} userCoords={userCoords} />
    </div>
  );
}
