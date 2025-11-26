export default function CategoryGrid({ list }) {
    return (
        <div className="section">
            <h3>Danh mục</h3>
            <div className="grid">
                {list.map(cat => (
                    <div key={cat.id} className="category-item">
                        <img src={cat.icon} />
                        <span>{cat.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
