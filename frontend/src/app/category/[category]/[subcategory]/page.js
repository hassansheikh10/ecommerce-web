"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "../../../../components/ProductCard";
import api from "@/utils/api";

const sizes = [39, 40, 41, 42, 43, 44, 45];
const sortOptions = [
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Best Selling", value: "best_selling" },
  { label: "Newest", value: "newest" },
];

const ProductsPage = () => {
  const params = useParams();
  const { category, subcategory } = params;

  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSize, setSelectedSize] = useState(null);
  const [sortBy, setSortBy] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!subcategory) {
          const res = await api.get(`/products/category/${category}`);
          const data = res.data;

          setSubcategories(data.subcategories || []);
          setProducts([]);
          setFilteredProducts([]);
        } else {
          const res = await api.get(
            `/products/category/${category}/${subcategory}`
          );
          const data = res.data;

          setProducts(data);
          setFilteredProducts(data);
          setSubcategories([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, subcategory]);

  useEffect(() => {
    let updated = [...products];
    if (selectedSize) {
      updated = updated.filter((p) => p.size === selectedSize);
    }
    if (sortBy) {
      if (sortBy === "price_asc") updated.sort((a, b) => a.price - b.price);
      else if (sortBy === "price_desc") updated.sort((a, b) => b.price - a.price);
      else if (sortBy === "newest")
        updated.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      else if (sortBy === "best_selling")
        updated.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    }
    setFilteredProducts(updated);
  }, [products, selectedSize, sortBy]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "30px 20px",
        fontFamily: "'Poppins', sans-serif",
        background: "#f9f9f9",
      }}
    >
      {/* Heading */}
      <h1
        style={{
          marginBottom: "30px",
          textAlign: "center",
          fontWeight: "700",
          fontSize: "2.5rem",
          color: "#3d3e3f",
        }}
      >
        {subcategory
          ? `${subcategory} in ${category} Products`
          : `${category} Subcategories`}
      </h1>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {error && (
        <p style={{ textAlign: "center", color: "red" }}>Error: {error}</p>
      )}

      {/* Show subcategories if no subcategory param */}
      {!subcategory && subcategories.length > 0 && (
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "25px",
          }}
        >
          {subcategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/category/${category}/${sub.name}`}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "20px",
                background: "#fff",
                borderRadius: "12px",
                textAlign: "center",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                color: "#3d3e3f",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "1.2rem",
                transition: "box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(0,0,0,0.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 4px 10px rgba(0,0,0,0.1)")
              }
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      {/* Show products + filters if subcategory param exists */}
      {subcategory && (
        <>
          {/* Filters */}
          <div className="filters-wrapper">
            <div className="filter-box">
              <label htmlFor="size-select">Filter by Size:</label>
              <select
                id="size-select"
                value={selectedSize || ""}
                onChange={(e) => setSelectedSize(e.target.value || null)}
              >
                <option value="">All Sizes</option>
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-box">
              <label htmlFor="sort-select">Sort By:</label>
              <select
                id="sort-select"
                value={sortBy || ""}
                onChange={(e) => setSortBy(e.target.value || null)}
              >
                <option value="">Default</option>
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div
            style={{
              flexGrow: 1,
              maxWidth: "1200px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
              gap: "25px",
            }}
            className="product-grid-wrapper"
          >
            {loading && (
              <p style={{ gridColumn: "1/-1", textAlign: "center" }}>
                Loading products...
              </p>
            )}
            {error && (
              <p
                style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  color: "red",
                }}
              >
                Error: {error}
              </p>
            )}
            {!loading && !error && filteredProducts.length === 0 && (
              <p style={{ gridColumn: "1/-1", textAlign: "center" }}>
                No products found.
              </p>
            )}

            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}

      {/* ✅ Inline responsive CSS */}
      <style jsx>{`
        .filters-wrapper {
          max-width: 1000px;
          margin: 0 auto 40px;
          display: flex;
          justify-content: flex-end;
          gap: 30px;
          flex-wrap: wrap;
          background: #fff;
          padding: 20px 30px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .filter-box {
          min-width: 220px;
          flex: 1;
        }
        .filter-box label {
          font-weight: 600;
          margin-bottom: 8px;
          display: block;
          color: #555;
        }
        .filter-box select {
          width: 100%;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1.8px solid #ddd;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.3s;
        }
        .filter-box select:focus {
          border-color: #ed9803;
        }

        /* ✅ Mobile Responsive */
        @media (max-width: 768px) {
          .filters-wrapper {
            flex-direction: column;
            align-items: stretch;
            gap: 20px;
          }
          .filter-box {
            min-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductsPage;
