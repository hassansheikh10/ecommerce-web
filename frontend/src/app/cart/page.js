"use client";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import "../cart/cart.css";

const UPLOADS_URL = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL;

export default function CartPage() {
  const router = useRouter();
  const { cartItems, removeFromCart } = useCart();

  // Total price calculation
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.Product?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h1 className="cart-title">🛒 Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="empty-msg">Your cart is empty.</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.guestId ?? item.id}>
                  <td data-label="Image">
                    <img
                      src={
                        item.Product?.images?.length
                          ? `${UPLOADS_URL}/${item.Product.images[0]}`
                          : "/no-image.jpg"
                      }
                      alt={item.Product?.name}
                    />
                  </td>
                  <td data-label="Product">{item.Product?.name}</td>
                  <td data-label="Price">Rs. {item.Product?.price}</td>
                  <td data-label="Quantity">
                    <input type="number" value={item.quantity} readOnly />
                  </td>
                  <td data-label="Total">Rs. {item.Product?.price * item.quantity}</td>
                  <td data-label="Remove">
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.guestId ?? item.id)}
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

          <div className="cart-footer">
            <h2>Total: Rs. {totalPrice}</h2>
            <button
              className="checkout-btn"
              onClick={() => router.push("/checkout")}
            >
              Proceed to Checkout →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
