"use client";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import Loader from "@/components/Loader"; 


export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/admin/dashboard";
    } catch (err) {
      alert("❌ Invalid credentials");
    }
  };

    if (loading) return <Loader text="Loading Admin Panel..." />;


  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <h1>StepLux Admin</h1>
          <p>Manage your store, orders, and products easily.</p>
        </div>

        <div className="login-right">
          <h2>Welcome Back</h2>
          <p className="subtitle">Please login to your admin account</p>

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />

          <button onClick={handleLogin} className="login-btn">
            Login
          </button>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(120deg, #af191b, #2c2c2c);
          font-family: Arial, sans-serif;
        }
        .login-box {
          display: flex;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          overflow: hidden;
          max-width: 850px;
          width: 95%;
          box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.2);
        }
        .login-left {
          flex: 1;
          background: url("/bg.jpg") center/cover;
          color: white;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .login-left h1 {
          font-size: 28px;
          margin-bottom: 10px;
        }
        .login-left p {
          font-size: 16px;
          opacity: 0.9;
        }
        .login-right {
          flex: 1;
          padding: 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .login-right h2 {
          color: #af191b;
          font-size: 24px;
          margin-bottom: 5px;
        }
        .subtitle {
          font-size: 14px;
          margin-bottom: 20px;
          color: #555;
        }
        .input-field {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
        }
        .input-field:focus {
          outline: none;
          border-color: #af191b;
        }
        .login-btn {
          background: #af191b;
          color: white;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          width:108%;
          transition: 0.3s;
        }
        .login-btn:hover {
          background: #900f10;
        }
        @media (max-width: 768px) {
          .login-box {
            flex-direction: column;
          }
          .login-left {
            height: 180px;
            text-align: center;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}