import { AiFillStar } from "react-icons/ai";
import { FiMapPin, FiPhone, FiClock } from "react-icons/fi";

export default function StoreInfo({ store }) {
  return (
    <div className="store-info">
      {/* Japanese name / subtitle */}
      <h2 className="store-jp">{store.jp_name}</h2>

      {/* Short intro text */}
      <p className="store-intro">
        {store.description || "A high-quality Japanese restaurant serving fresh sushi and homemade dishes."}
      </p>

      {/* Rating */}
      <p className="store-rating">
        <AiFillStar className="icon-star" />
        <span>{store.rating} / 5</span>
      </p>

      {/* Categories */}
      <p className="categories">{store.categories.join("・")}</p>

      {/* Contact info */}
      <div className="contact-info">
        <p>
          <FiMapPin className="icon" />
          <span>{store.address}</span>
        </p>
        <p>
          <FiPhone className="icon" />
          <span>{store.phone}</span>
        </p>
        <p>
          <FiClock className="icon" />
          <span>{store.open_hours}</span>
        </p>
      </div>
    </div>
  );
}
