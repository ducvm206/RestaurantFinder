import LanguageDropdown from "./LanguageDropdown";
import Avatar from "./Avatar";
import { useNavigate } from "react-router-dom";

export default function TopBar({ user, lang, langOpen, toggleLangMenu, selectLang }) {
  const navigate = useNavigate();

  return (
    <div className="top-bar">
      <LanguageDropdown
        lang={lang}
        langOpen={langOpen}
        toggleLangMenu={toggleLangMenu}
        selectLang={selectLang}
      />
      <button className="favorites-btn" onClick={() => navigate("/favorites")}>
        お気に入り
      </button>
      <Avatar user={user} />
    </div>
  );
}
