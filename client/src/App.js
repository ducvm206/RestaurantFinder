// src/App.js
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

// Pages
import Home from "./pages/Home";
import RestaurantDetail from "./pages/RestaurantDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/ProfilePage";
import Favorites from "./pages/FavoritesPage";
import SearchPage from "./pages/SearchPage";

// Components
import Layout from "./components/home/Layout/Layout"; // Persistent TopBar wrapper
import LanguageProvider from "./context/LanguageContext";
import LanguageSelector from "./components/language/LanguageSelector";

// Add LocationProvider import
import { LocationProvider } from "./context/LocationContext";

function App() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );

  // Sync user state when localStorage changes (logout/login) without reload
  useEffect(() => {
    const syncUser = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("storage", syncUser);
    window.addEventListener("user-updated", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("user-updated", syncUser);
    };
  }, []);

  return (
    <LanguageProvider>
      {/* Wrap everything with LocationProvider */}
      <LocationProvider>
        {/* Language selector always visible */}
        <LanguageSelector />

        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Authenticated routes with TopBar */}
            <Route element={<Layout user={user} />}>
              <Route path="/home" element={<Home />} />
              <Route path="/restaurants/:id" element={<RestaurantDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/search" element={<SearchPage />} />
            </Route>
          </Routes>
        </div>
      </LocationProvider>
    </LanguageProvider>
  );
}

export default App;
