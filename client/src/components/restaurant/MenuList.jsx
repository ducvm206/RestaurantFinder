// client/src/components/restaurant/MenuList.jsx
import "../../styles/MenuList.css";

export default function MenuList({ menu }) {
  if (!menu || menu.length === 0) return <p>No menu available</p>;

  return (
    <div className="menu-list">
      <div className="menu-grid">
        {menu.map((item) => (
          <div key={item.item_id} className="menu-item-card">
            {/* Display dish image if available */}
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.item_name}
                className="menu-item-image"
              />
            )}
            <h4>{item.item_name}</h4>
            <p>{item.price} ¥</p>
          </div>
        ))}
      </div>
    </div>
  );
}
