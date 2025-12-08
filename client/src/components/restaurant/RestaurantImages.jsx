import { useRef } from "react";
import "../../styles/RestaurantImages.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function RestaurantImages({ images }) {
  const scrollRef = useRef(null);

  // Ensure images is always an array
  let imgs = [];
  if (Array.isArray(images)) {
    imgs = images;
  } else if (images) {
    try {
      imgs = JSON.parse(images);
    } catch (err) {
      console.error("Failed to parse images JSON:", err);
      imgs = [];
    }
  }

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  if (imgs.length === 0) return <p>No images</p>;

  return (
    <div className="image-gallery-container">
      <button className="scroll-btn left" onClick={scrollLeft} type="button">
        <FiChevronLeft />
      </button>

      <div className="image-gallery" ref={scrollRef}>
        {imgs.map((img, idx) => (
          <div className="image-wrapper" key={idx}>
            <img src={img} alt={`Restaurant-image-${idx}`} />
          </div>
        ))}
      </div>

      <button className="scroll-btn right" onClick={scrollRight} type="button">
        <FiChevronRight />
      </button>
    </div>
  );
}
