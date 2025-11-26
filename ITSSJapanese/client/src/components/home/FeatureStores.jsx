import { useNavigate } from "react-router-dom";

export default function FeaturedStores({ list }) {
  const navigate = useNavigate();

  return (
    <div className="horizontal-scroll">
      {list.map(store => (
        <div
          key={store.id}
          className="store-card"
          onClick={() => navigate(`/store/${store.id}`)}
        >
          <img src={store.image} />
          <p>{store.name}</p>
        </div>
      ))}
    </div>
  );
}
