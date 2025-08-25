"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import api from "../../utils/api";

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);

  // Pre-fill user details from localStorage dynamically
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        address: user.address || "",
      });
      // Calculate delivery charges immediately
      setDeliveryCharges(calculateDeliveryCharges(user.address || ""));
    }
  }, []);

  const handleChange = (e) => {
    const updatedForm = { ...form, [e.target.name]: e.target.value };
    setForm(updatedForm);

    if (e.target.name === "address") {
      setDeliveryCharges(calculateDeliveryCharges(e.target.value));
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.email || !form.address) {
      alert("Please fill all fields");
      return;
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      setLoading(true);
      await api.post("/orders/place", {
        user: form,
        products: cartItems.map((item) => ({
          id: item.id || item.guestId,
          name: item.Product?.name,
          price: item.Product?.price,
          quantity: item.quantity,
          size: item.size,
        })),
        deliveryCharges,
        gstAmount,
      });
      alert("✅ Order placed successfully!");
      window.location.href = "/";
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const calculateDeliveryCharges = (address) => {
    const addr = address.toLowerCase();

    // Approximate mapping for Karachi areas
    const zone200 = ["korangi", "gulshan-e-iqbal", "landhi", "malir"];
    const zone400 = ["clifton", "defence", "karachi cantt", "nazimabad", "gulberg"];
    const zone500 = ["north nazimabad", "bahadurabad", "pechs", "shahrah-e-faisal"]; // example zones

    if (zone200.some((zone) => addr.includes(zone))) return 200;
    if (zone400.some((zone) => addr.includes(zone))) return 400;
    return 500; // default for other areas
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.Product?.price || 0) * item.quantity,
    0
  );
  const gst = totalAmount * 0.18;
  const grandTotal = totalAmount + gst + deliveryCharges;

  // update GST state
  useEffect(() => {
    setGstAmount(gst);
  }, [totalAmount, deliveryCharges]);

  return (
    <div className="checkout-container">
      <h1 className="title">Checkout</h1>

      {/* Products Summary */}
      {cartItems.length > 0 && (
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="cart-header">
            <span className="col name">Product</span>
            <span className="col qty">Qty</span>
            <span className="col product-price">Price</span>
          </div>
          {cartItems.map((item) => (
            <div key={item.id || item.guestId} className="cart-item">
              <span className="col name">{item.Product?.name}</span>
              <span className="col qty">{item.quantity}</span>
              <span className="col product-price">
                Rs. {item.Product?.price * item.quantity}
              </span>
            </div>
          ))}
          <div className="totals-summary">
            <div>Total Product Amount: <span>Rs. {totalAmount}</span></div>
            <div>GST 18%: <span>Rs. {gst.toFixed(2)}</span></div>
            <div style={{ borderBottom: "1px solid #eee" }}>Delivery Charges: <span>Rs. {deliveryCharges}</span></div>
            <div style={{ fontWeight: "bold" }}>Grand Total: <span>Rs. {grandTotal.toFixed(2)}</span></div>
          </div>
        </div>
      )}

      {/* Checkout Form */}
      <div className="checkout-box">
        <h2 className="form-title">Delivery Details</h2>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="input-field"
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="input-field"
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="input-field"
        />
        <textarea
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="input-field textarea"
        />

        <button onClick={handleSubmit} className="checkout-btn">
          {loading ? "Placing..." : "Place Order"}
        </button>
      </div>

      <style jsx>{`
        .checkout-container {
          font-family: Arial, sans-serif;
          padding: 40px 20px;
          min-height: 100vh;
          background-color: #f9f9f9;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .form-title {
          font-size: 20px;
          color: #af191b;
          margin-bottom: 15px;
          font-weight: bold;
        }
        .title {
          font-size: 28px;
          color: #af191b;
          margin-bottom: 20px;
        }
        .cart-header,
        .cart-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
        }
        .cart-header {
          font-weight: bold;
          border-bottom: 2px solid #eee;
        }
        .totals-summary {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-top: 5px;
        }

        .totals-summary div {
        display: flex;
        justify-content: space-between;
        }

        .col.name {
          flex: 2;
          min-width: 150px;
        }
        .col.qty {
          flex: 1;
          text-align: center;
          min-width: 60px;
        }
        .col.product-price {
          flex: 1;
          text-align: right;
          min-width: 80px;
        }
        .cart-summary {
          width: 100%;
          max-width: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          padding: 20px 25px;
          margin-bottom: 25px;
          border-top: 4px solid #af191b;
        }
        .cart-summary h2 {
          margin-bottom: 15px;
          color: #af191b;
        }
        .cart-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .cart-item:last-child {
          border-bottom: none;
        }
        .total {
          text-align: right;
          margin-top: 8px;
        }
        .checkout-box {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          padding: 25px 30px;
          max-width: 500px;
          width: 100%;
          border-top: 4px solid #af191b;
          display: flex;
          flex-direction: column;
        }
        .input-field {
          padding: 12px 14px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 15px;
          transition: 0.3s;
        }
        .input-field:focus {
          outline: none;
          border-color: #af191b;
          box-shadow: 0 0 4px rgba(175, 25, 27, 0.3);
        }
        .textarea {
          min-height: 80px;
          resize: vertical;
        }
        .checkout-btn {
          padding: 12px;
          background: #af191b;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          color: white;
          cursor: pointer;
          transition: 0.3s;
        }
        .checkout-btn:hover {
          background: #900f10;
        }
      `}</style>
    </div>
  );
}