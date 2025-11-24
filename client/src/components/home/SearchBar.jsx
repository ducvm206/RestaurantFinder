import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // send the value to parent component
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="料理名、キーワードで検索..."
        className="search-box"
        value={query}
        onChange={handleChange}
      />
    </div>
  );
}
