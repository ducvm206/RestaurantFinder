import { useRef } from "react";
import "../../styles/StoreImages.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function StoreImages({ images = [] }) {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  if (!images || images.length === 0) return <p>No images</p>;

  return (
    <div className="image-gallery-container">
      <button
        className="scroll-btn left"
        onClick={scrollLeft}
        aria-label="Scroll left"
        type="button"
      >
        <FiChevronLeft />
      </button>

      <div className="image-gallery" ref={scrollRef}>
        {images.map((img, idx) => (
          <div className="image-wrapper" key={idx}>
            <img src={img} alt={`store-image-${idx}`} />
          </div>
        ))}
      </div>

      <button
        className="scroll-btn right"
        onClick={scrollRight}
        aria-label="Scroll right"
        type="button"
      >
        <FiChevronRight />
      </button>
    </div>
  );
}
