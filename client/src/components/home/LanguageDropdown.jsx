export default function LanguageDropdown({ lang, langOpen, toggleLangMenu, selectLang }) {
  return (
    <div className="lang-dropdown">
      <button className="lang-btn" onClick={toggleLangMenu}>
        {lang === "jp" ? "日本語" : "Tiếng Việt"} ▾
      </button>
      {langOpen && (
        <div className="lang-menu">
          <div className="lang-item" onClick={() => selectLang("jp")}>日本語</div>
          <div className="lang-item" onClick={() => selectLang("vi")}>Tiếng Việt</div>
        </div>
      )}
    </div>
  );
}
