// client/src/context/LanguageContext.js
import { createContext, useState, useEffect } from "react";

export const LanguageContext = createContext();

export default function LanguageProvider({ children }) {
  // Lấy lang từ localStorage hoặc mặc định là ja
  const [lang, setLang] = useState(localStorage.getItem("lang") || "ja");

  // Khi đổi ngôn ngữ -> lưu vào localStorage VÀ dispatch event
  const changeLanguage = (language) => {
    setLang(language);
    localStorage.setItem("lang", language);

    // ← THÊM: Dispatch event để notify các component khác
    window.dispatchEvent(new Event("language-changed"));

    console.log("🌐 Language changed to:", language); // Debug
  };

  const value = { lang, changeLanguage };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
