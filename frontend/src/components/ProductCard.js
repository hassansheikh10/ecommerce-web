"use client";
import Link from "next/link";
const UPLOADS_URL = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL

export default function ProductCard({ product }) {
  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  const mainImage =
    product.images && product.images.length > 0
      ? `${UPLOADS_URL}/${product.images[0]}`
      : "/placeholder.jpg"; 

  return (
    <Link href={`/products/${product.id}`} className="product-card">
      <div className="relative">
        <img src={mainImage} alt={product.name} className="main-image" />

        {product.discount > 0 && (
          <span className="discount-badge">{product.discount}% OFF</span>
        )}
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>
        <div className="price-container">
          {product.discount > 0 ? (
            <>
              <span className="old-price">Rs. {product.price}</span>
              <span className="new-price">Rs. {discountedPrice}</span>
            </>
          ) : (
            <span className="new-price">Rs. {product.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}