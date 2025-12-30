// src/components/home/SearchBox.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import useTranslation from "../../hooks/useTranslation";

export default function SearchBox({ searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const t = useTranslation();

  const goToSearch = () => {
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder={t("home.search_box_place_holder")}
        className="search-box"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={goToSearch} // <-- navigate when input is clicked/focused
      />
    </div>
  );
}
