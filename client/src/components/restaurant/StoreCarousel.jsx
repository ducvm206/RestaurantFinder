import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/StoreCarousel.css";

export default function StoreCarousel({ menu, storeId }) {
  const [randomDishes, setRandomDishes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!menu || menu.length === 0) return;

    // Randomize dishes
    const shuffled = [...menu].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    setRandomDishes(selected);
  }, [menu]);

  if (!randomDishes.length) return null;

  const goToStore = () => {
    navigate(`/store/${storeId}`);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-track">
        {randomDishes.map((dish) => (
          <div
            key={dish.id}
            className="carousel-item"
            onClick={goToStore}
          >
            <img src={dish.image} alt={dish.name} className="carousel-img" />
            <p className="carousel-name">{dish.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
