"use client";
import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";
import { v4 as uuidv4 } from "uuid";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const getUserId = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user).id : null;
  };

  // Initial load
  useEffect(() => {
    fetchCart();
  }, []);

  // Fetch cart for both guest and logged-in user
  const fetchCart = async () => {
    const userId = getUserId();

    if (!userId) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      setCartItems(guestCart.flat());
      return;
    }

    try {
      const res = await api.get(`/cart/${userId}`);
      setCartItems(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  // Add item to cart
  const addToCart = async (product, quantity = 1, size) => {
    const userId = getUserId();

    if (userId) {
      // Logged-in user
      try {
        await api.post("/cart/add", { userId, productId: product.id, quantity, size });
        fetchCart();
      } catch (err) {
        console.error("Error adding to cart:", err);
      }
    } else {
      // Guest user
      let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      guestCart = guestCart.flat();

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

      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      setCartItems(guestCart);
    }
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    const userId = getUserId();

    if (userId) {
      if (confirm("Are you sure you want to remove this item?")) {
        api.delete(`/cart/remove/${id}`).then(() => fetchCart());
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      if (confirm("Are you sure you want to remove this item?")) {
        const updatedCart = guestCart.filter(
          (item) => item.guestId !== id && item.id !== id
        );
        localStorage.setItem("guestCart", JSON.stringify(updatedCart));
        setCartItems(updatedCart);
      }
    }
  };

  // Clear entire cart
  const clearCart = () => {
    const userId = getUserId();
    if (userId) {
      api.delete(`/cart/clear/${userId}`).then(() => fetchCart());
    } else {
      localStorage.removeItem("guestCart");
      setCartItems([]);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, fetchCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);