// src/App.js - UPDATED
import "./App.css";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import RestaurantDetail from "./pages/RestaurantDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/ProfilePage";
import Favorites from "./pages/FavoritesPage";
import SearchPage from "./pages/SearchPage";

// Components
import Layout from "./components/home/Layout/Layout";
import LanguageProvider from "./context/LanguageContext";
import LanguageSelector from "./components/language/LanguageSelector";

// Contexts
import { LocationProvider } from "./context/LocationContext";
import { UserProvider } from "./context/UserContext"; // NEW

function App() {
  return (
    <LanguageProvider>
      {/* Wrap with UserProvider */}
      <UserProvider>
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
              <Route element={<Layout />}> {/* Remove user prop */}
                <Route path="/home" element={<Home />} />
                <Route path="/restaurants/:id" element={<RestaurantDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/search" element={<SearchPage />} />
              </Route>
            </Routes>
          </div>
        </LocationProvider>
      </UserProvider>
    </LanguageProvider>
  );
}

export default App;
