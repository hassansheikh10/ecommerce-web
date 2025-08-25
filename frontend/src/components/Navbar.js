"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaUser, FaShoppingBasket } from "react-icons/fa";
import { useCart } from "../context/CartContext";

import "../styles/Navbar.css";
import api from "@/utils/api";

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const { cartItems } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("✅ Logged out successfully!");
    window.location.href = "/";
  };


  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const res = await fetch("http://localhost:5000/api/categories/with-subcategories");
  //       const data = await res.json();
  //       if (Array.isArray(data?.data)) {
  //         setCategories(data.data);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching categories:", err);
  //     }
  //   };

  //   fetchCategories();
  // }, []);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories/with-subcategories"); 
        if (Array.isArray(res.data?.data)) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  if (!categories.length) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <a href="/" className="navbar-logo">StepLux</a>

        <ul className="navbar-menu">
          {categories.map((category) => (
            <li key={category.id} className="navbar-item">
              <Link href={`/category/${category.name}`} className="navbar-link">
                {category.name}
              </Link>
              {Array.isArray(category.SubCategories) && category.SubCategories.length > 0 && (
                <ul className="submenu">
                  {category.SubCategories.map((sub) => (
                    <li key={sub.id} className="submenu-item">
                      <Link href={`/category/${category.name}/${sub.name}`} className="submenu-link">
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div className="navbar-icons">
          {/* USER MENU WRAPPER */}
          <div className="user-menu">
            <FaUser size={24} className="navbar-icon" />
            <div className="user-dropdown">
              {!isLoggedIn ? (
                <>
                  <Link href="/login">Login</Link>
                  <Link href="/signup">Create Account</Link>
                </>
              ) : (
                <>
                  <Link href="/profile">Profile</Link>
                  <Link href="/orders">My Orders</Link>
                  <button onClick={handleLogout}>Logout</button>
                </>
              )}
            </div>
          </div>

          {/* CART ICON */}
          <Link href="/cart" className="navbar-icon cart-icon">
            <FaShoppingBasket size={24} />
            {cartItems.length > 0 && (
              <span className="cart-count">{cartItems.length}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
