export default function LanguageDropdown({
  currentLang,
  isOpen,
  toggleDropdown,
  selectLang,
}) {
  const languages = [
    { code: "ja", label: "日本語" },
    { code: "vi", label: "Tiếng Việt" },
    { code: "en", label: "English" },
  ];

  const currentLabel =
    languages.find((l) => l.code === currentLang)?.label || "Language";

  return (
    <div className="lang-dropdown">
      {/* Button */}
      <button className="lang-btn" onClick={toggleDropdown}>
        🌐 {currentLabel} ▾
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="lang-menu">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className="lang-item"
              onClick={() => selectLang(lang.code)}
            >
              {lang.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
