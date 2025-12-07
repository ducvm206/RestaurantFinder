import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export default function LanguageSelector() {
  const { lang, changeLanguage } = useContext(LanguageContext);

  return (
    <select value={lang} onChange={(e) => changeLanguage(e.target.value)}>
      <option value="en">English</option>
      <option value="vi">Tiếng Việt</option>
      <option value="ja">日本語</option>
    </select>
  );
}
