"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '../../../styles/CategoryPage.css'; // CSS alag file me banayenge
import api from '@/utils/api';

export default function CategoryPage({ params }) {
  const { category } = params;
  const [subcategories, setSubcategories] = useState([]);

  // Static image mapping (tum apni images ke path yaha rakh sakte ho)
  const imageMap = {
    Shoes: "/shoes.jpg",
    Sandals: "/sandal.jpg",
    Slippers: "/slipper.jpg",
    Flats: "/flats.jpg",
    Heels: "/heels.jpg",
  };

  useEffect(() => {
    async function fetchSubcategories() {
      try {
        const res = await api.get(`/categories/with-subcategories`);
        const result = res.data;

        if (result.success && Array.isArray(result.data)) {
          const foundCategory = result.data.find(
            (cat) => cat.name.toLowerCase() === category.toLowerCase()
          );

          if (foundCategory?.SubCategories) {
            setSubcategories(foundCategory.SubCategories);
          }
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    }

    fetchSubcategories();
  }, [category]);

  return (
    <div className="subcategory-page">
      <h1>{category} Categories</h1>
      <div className="subcategory-grid">
        {subcategories.map((sub) => (
          <Link
            key={sub.id}
            href={`/category/${category}/${sub.name}`}
            className="subcategory-card"
          >
            <div className="card-image">
              <img
                src={imageMap[sub.name] || "/images/default.jpg"}
                alt={sub.name}
              />
            </div>
            <div className="card-title">{sub.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}