"use client";
import { useEffect, useState } from "react";
import api from "../utils/api";
import ProductCard from "./ProductCard";
// import "../styles/product.css";  
import "../styles/globals.css";  

export default function ProductGrid() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
  api.get("/products").then((res) => {
    const featured = res.data.filter(product => product.isFeatured === true);
    setProducts(featured);
  });
}, []);

  return (
    <section className="products">
      <h2 className="products-title">Featured Products</h2>

      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}