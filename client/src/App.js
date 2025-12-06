// src/App.js
import "./App.css";
import Home from "./pages/Home";
import RestaurantDetail from "./pages/RestaurantDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/ProfilePage";
import Favorites from "./pages/FavoritesPage";
import SearchPage from './pages/SearchPage';
import { Routes, Route } from "react-router-dom";




function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/restaurants/:id" element={<RestaurantDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favorites" element={<Favorites  />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </div>
  );
}

export default App;
