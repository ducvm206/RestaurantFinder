import { createContext, useState, useEffect } from "react";

export const LanguageContext = createContext();

export default function LanguageProvider({ children }) {
  // Lấy lang từ localStorage hoặc mặc định là en
  const [lang, setLang] = useState(localStorage.getItem("lang") || "ja");

  // Khi đổi ngôn ngữ -> lưu vào localStorage
  const changeLanguage = (language) => {
    setLang(language);
    localStorage.setItem("lang", language);
  };

  const value = { lang, changeLanguage };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
