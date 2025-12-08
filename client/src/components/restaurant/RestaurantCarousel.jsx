import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/RestaurantCarousel.css";

export default function RestaurantCarousel({ menu, restaurantId }) {
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

  const goToRestaurant = () => {
    navigate(`/restaurant/${restaurantId}`);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-track">
        {randomDishes.map((dish) => (
          <div
            key={dish.id}
            className="carousel-item"
            onClick={goToRestaurant}
          >
            {dish.image ? (
              <img src={dish.image} alt={dish.name} className="carousel-img" />
            ) : (
              <div className="carousel-img placeholder">No image</div>
            )}
            <p className="carousel-name">{dish.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
