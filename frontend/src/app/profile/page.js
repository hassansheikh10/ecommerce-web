"use client";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    if (!user) return <p className="loading">Loading profile...</p>;

    return (
        <div className="profile-container">
            <h1 className="title">My Profile</h1>
            <div className="profile-box">
                <div className="profile-item">
                    <span className="label">Name:</span>
                    <span className="value">{user.name}</span>
                </div>
                <div className="profile-item">
                    <span className="label">Email:</span>
                    <span className="value">{user.email}</span>
                </div>
                <div className="profile-item">
                    <span className="label">Phone:</span>
                    <span className="value">{user.phone}</span>
                </div>
                <div className="profile-item">
                    <span className="label" >Address:</span>
                    <span className="value" style={{ textAlign: "right" }}>{user.address}</span>
                </div>
                <div className="profile-item">
                    <span className="label">Role:</span>
                    <span className="value">{user.isAdmin ? "Admin" : "Customer"}</span>
                </div>
            </div>

            <style jsx>{`
        .profile-container {
          font-family: Arial, sans-serif;
          padding: 40px 20px;
          min-height: 100vh;
          background-color: #f9f9f9;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .title {
          font-size: 28px;
          color: #af191b;
          margin-bottom: 20px;
        }

        .profile-box {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          padding: 25px 30px;
          max-width: 500px;
          width: 100%;
          border-top: 4px solid #af191b;
        }

        .profile-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #eee;
        }

        .profile-item:last-child {
          border-bottom: none;
        }

        .label {
          font-weight: bold;
          color: #333;
        }

        .value {
          color: #555;
        }

        @media (max-width: 500px) {
          .profile-item {
            flex-direction: column;
            align-items: flex-start;
          }
          .value {
            margin-top: 4px;
          }
        }
      `}</style>
        </div>
    );
}