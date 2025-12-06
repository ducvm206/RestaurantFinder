export default function DishSearchResults({ filteredDishes, goToDishRestaurant }) {
  if (!filteredDishes.length) return null;

  return (
    <div className="search-results">
      {filteredDishes.map((dish) => (
        <div key={dish.id} className="dish-card" onClick={() => goToDishRestaurant(dish.name)}>
          <div className="dish-img-wrapper">
            <img src={dish.image} alt={dish.name} className="dish-img" />
          </div>
          <p className="dish-name">{dish.name}</p>
        </div>
      ))}
    </div>
  );
}
