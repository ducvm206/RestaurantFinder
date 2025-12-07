import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export default function LanguageSelector() {
  const { lang, changeLanguage } = useContext(LanguageContext);

  return (
    <div style={{ position: "fixed", top: 10, right: 10 }}>
      <select
        value={lang}
        onChange={(e) => changeLanguage(e.target.value)}
        style={{
          padding: "6px 10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
      >
        <option value="en">English</option>
        <option value="vi">Tiếng Việt</option>
        <option value="ja">日本語</option>
      </select>
    </div>
  );
}
