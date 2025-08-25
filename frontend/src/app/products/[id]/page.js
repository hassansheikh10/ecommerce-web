"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../utils/api";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

import { v4 as uuidv4 } from "uuid";

const UPLOADS_URL = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { addToCart, fetchCart } = useCart();

  useEffect(() => {
    api.get(`/products/${params.id}`).then((res) => {
      setProduct(res.data);

      if (res.data.images && res.data.images.length > 0) {
        setSelectedImage(`${UPLOADS_URL}/${res.data.images[0]}`);
      }
    });
  }, [params.id]);

  const handleAddToCart = (product, quantity, size) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.id) {
      // Logged-in user
      api.post("/cart/add", {
        userId: user.id,
        productId: product.id,
        quantity,
        size,
      }).then(() => fetchCart());
    } else {
      // Guest user
      let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

      // Flatten in case any nested arrays exist
      guestCart = guestCart.flat(Infinity);

      const plainProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        size: product.size,
      };

      const existingItem = guestCart.find(
        (item) => item.id === product.id && item.size === size
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        guestCart.push({
          guestId: uuidv4(),
          id: product.id,
          quantity,
          size,
          Product: plainProduct,
        });
      }

      // Save back as flat array
      localStorage.setItem("guestCart", JSON.stringify(guestCart));

      // Update cart context properly by replacing the whole cart
      fetchCart(); // Or use a context method that replaces the cart entirely
    }
  };


  if (!product) return <p className="loading">Loading...</p>;

  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  return (
    <div className="detail-container">
      {/* LEFT: Image Section */}
      <div className="image-section">
        <div className="relative">
          <img src={selectedImage} alt={product.name} className="main-image" />
          {product.discount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                background: "#D62D38",
                color: "white",
                padding: "5px 10px",
                borderRadius: "5px",
                fontWeight: "bold",
              }}
            >
              {product.discount}% OFF
            </span>
          )}
        </div>

        <div className="thumbnail-row">
          {product.images &&
            product.images.map((img, i) => (
              <img
                key={i}
                src={`${UPLOADS_URL}/${img}`}
                className={`thumbnail ${selectedImage.includes(img) ? "active" : ""
                  }`}
                onClick={() =>
                  setSelectedImage(`${UPLOADS_URL}/${img}`)
                }
              />
            ))}
        </div>
      </div>

      {/* RIGHT: Info Section */}
      <div className="info-section">
        <h1>{product.name}</h1>
        <div style={{ marginBottom: "10px" }}>
          {product.discount > 0 ? (
            <>
              <span
                style={{
                  textDecoration: "line-through",
                  color: "gray",
                  marginRight: "10px",
                }}
              >
                Rs. {product.price}
              </span>
              <span style={{ fontWeight: "bold", color: "green" }}>
                Rs. {discountedPrice}
              </span>
            </>
          ) : (
            <span style={{ fontWeight: "bold" }}>Rs. {product.price}</span>
          )}
        </div>

        <p className="desc">{product.description}</p>

        {/* Sizes */}
        <div className="sizes">
          <span>Choose Size:</span>
          <div className="size-buttons">
            {product.size.split(",").map((s) => (
              <button
                key={s}
                className={`size-btn ${selectedSize === s ? "selected" : ""}`}
                onClick={() => setSelectedSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="qty-row">
          <label>Quantity:</label>
          <input
            type="number"
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        {/* Add to Cart */}
        <button className="add-btn" onClick={() => handleAddToCart(product, quantity, selectedSize)}
        >
          <FiShoppingCart size={18} style={{ marginRight: "6px" }} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
