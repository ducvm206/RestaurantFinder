import "../../styles/MenuList.css";

export default function MenuList({ menu }) {
  if (!menu || menu.length === 0) return <p>No menu available</p>;

  return (
    <div className="menu-list">
      <div className="menu-grid">
        {menu.map((item) => (
          <div key={item.id} className="menu-item-card">
            <img src={item.image} alt={item.name} className="menu-item-image" />
            <h4>{item.name}</h4>
            <p>${item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
