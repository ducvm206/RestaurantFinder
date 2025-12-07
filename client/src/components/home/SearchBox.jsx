// src/components/home/SearchBox.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBox({ searchQuery, setSearchQuery }) {
  const navigate = useNavigate();

  const goToSearch = () => {
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="料理名を入力..."
        className="search-box"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={goToSearch}  // <-- navigate when input is clicked/focused
      />
    </div>
  );
}
