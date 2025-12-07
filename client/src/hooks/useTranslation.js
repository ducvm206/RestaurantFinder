import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../context/LanguageContext";

export default function useTranslation() {
  const { lang } = useContext(LanguageContext);
  const [dictionary, setDictionary] = useState({});

  useEffect(() => {
    import(`../translations/${lang}.json`)
      .then((module) => setDictionary(module.default)) // << FIX QUAN TRỌNG
      .catch((err) => console.error("Cannot load language file", err));
  }, [lang]);

  return (key) => {
    const parts = key.split(".");
    let obj = dictionary;

    for (const part of parts) {
      if (!obj[part]) return key; // fallback show key
      obj = obj[part];
    }

    return obj;
  };
}
