import { useState, useRef, useEffect } from "react";

export default function CategoriesSlider({ foodlist }) {
  const wrapperRef = useRef(null);
  const itemWidth = 140;

  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  // ------------------------
  // Responsive visible count
  // ------------------------
  useEffect(() => {
    const updateVisibleCount = () => {
      if (!wrapperRef.current) return;
      const wrapperWidth = wrapperRef.current.offsetWidth;
      const count = Math.floor(wrapperWidth / (itemWidth + 20));
      setVisibleCount(count > 0 ? count : 1);
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const next = () => setIndex((i) => Math.min(i + 1, foodlist.length - visibleCount));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  return (
    <div className="cat-slider">
      {index > 0 && (
        <button className="cat-btn left" onClick={prev}>
          ◀
        </button>
      )}
      <div className="cat-wrapper" ref={wrapperRef}>
        <div
          className="cat-list"
          style={{
            transform: `translateX(-${index * (itemWidth + 20)}px)`,
            transition: "transform 0.3s ease",
          }}
        >
          {foodlist.map((cat) => (
            <div key={cat.id} className="cat-item">
              <img src={cat.image} alt={cat.name} className="cat-img" />
              <p>{cat.name}</p>
            </div>
          ))}
        </div>
      </div>
      {index < foodlist.length - visibleCount && (
        <button className="cat-btn right" onClick={next}>
          ▶
        </button>
      )}
    </div>
  );
}
