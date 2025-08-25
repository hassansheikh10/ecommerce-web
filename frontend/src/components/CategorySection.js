"use client";

export default function CategorySection() {
  const categories = [
    { name: "Men", img: "/men.jpg" },
    { name: "Women", img: "/women.jpg" },
    // { name: "Kids", img: "/kids.jpg" },
  ];

  return (
    <section className="categories">
      <h2>Shop by Category</h2>
      <div className="category-grid">
        {categories.map((cat) => (
          <div key={cat.name} className="category-card">
            <img src={cat.img} alt={cat.name} />
            <h3>{cat.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}