"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";

export default function AdminLogin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");       // new field
  const [address, setAddress] = useState("");   // new field
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSignUp = async () => {
    try {
      const res = await api.post("/auth/signup", {
        name,
        email,
        password,
        phone,        // send to backend
        address       // send to backend
      });
      localStorage.setItem("token", res.data.token);
      alert("✅ SignUp successful!");
      window.location.href = "/login";
    } catch (err) {
      alert("❌ Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <h1>StepLux</h1>
          <p>Sign up to shop smarter and faster.</p>
        </div>

        <div className="login-right">
          <h2>Create your account</h2>
          <p className="subtitle">Please enter your details</p>

          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
          <input
            type="email"
            placeholder="Enter Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Enter Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-field"
          />
          <textarea
            placeholder="Enter Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input-field"
            rows={4}  // height adjust karne ke liye
          ></textarea>

          <button onClick={handleSignUp} className="login-btn">
            SignUp
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