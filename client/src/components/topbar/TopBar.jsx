import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import LanguageDropdown from "./LanguageDropdown";
import { useContext, useState } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import { useUser } from "../../context/UserContext"; // Add this

// Import translations
import en from "../../translations/en.json";
import vi from "../../translations/vi.json";
import ja from "../../translations/ja.json";

const translations = { en, vi, ja };

export default function TopBar({ user }) {
  const navigate = useNavigate();
  const { lang, changeLanguage } = useContext(LanguageContext);

  const [isLangOpen, setIsLangOpen] = useState(false);
  const toggleDropdown = () => setIsLangOpen((prev) => !prev);
  const selectLang = (l) => {
    changeLanguage(l);
    setIsLangOpen(false);
  };

  const t = (key) => key.split(".").reduce((o, k) => o?.[k], translations[lang]) || key;

  return (
    <div className="top-bar">
      <LanguageDropdown
        currentLang={lang}
        isOpen={isLangOpen}
        toggleDropdown={toggleDropdown}
        selectLang={selectLang}
      />
      <button className="favorites-btn" onClick={() => navigate("/favorites")}>
        {t("home.favorites")}
      </button>
      <Avatar user={user} />
    </div>
  );
}
