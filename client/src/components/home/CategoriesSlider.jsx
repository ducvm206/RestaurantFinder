import { useState, useRef, useEffect } from "react";

export default function CategoriesSlider({ foodlist = [] }) {
  const wrapperRef = useRef(null);

  const ITEM_WIDTH = 140;   // chiều rộng item
  const GAP = 20;           // khoảng cách giữa item

  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  // ------------------------
  // Update số lượng item hiển thị theo kích thước màn hình
  // ------------------------
  useEffect(() => {
    const updateVisibleCount = () => {
      if (!wrapperRef.current) return;

      const wrapperWidth = wrapperRef.current.offsetWidth;
      const count = Math.floor(wrapperWidth / (ITEM_WIDTH + GAP));

      setVisibleCount(count > 0 ? count : 1); // tránh trường hợp bằng 0
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);

    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const maxIndex = Math.max(foodlist.length - visibleCount, 0);

  const next = () => setIndex((i) => Math.min(i + 1, maxIndex));
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
            transform: `translateX(-${index * (ITEM_WIDTH + GAP)}px)`,
            transition: "transform 0.3s ease",
          }}
        >
          {foodlist.map((cat) => (
            <div key={cat.id} className="cat-item" style={{ width: ITEM_WIDTH }}>
              <img src={cat.image} alt={cat.name} className="cat-img" />
              <p className="cat-name">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>

      {index < maxIndex && (
        <button className="cat-btn right" onClick={next}>
          ▶
        </button>
      )}
    </div>
  );
}
