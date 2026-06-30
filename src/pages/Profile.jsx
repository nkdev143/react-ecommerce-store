import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import "./Profile.css";

const Profile = ({ setPage, showToast }) => {
  const { user, logout } = useAuth();
  const { getUserOrders } = useOrders();
  const [name, setName] = useState(user?.name || "");

  if (!user) {
    return (
      <div className="profile-page container">
        <div className="empty-state" style={{ paddingTop: "100px" }}>
          <div className="empty-state-icon">🔐</div>
          <h3 className="empty-state-title">Sign in to view your profile</h3>
          <button className="btn btn-primary" onClick={() => setPage("home")}>Go Home</button>
        </div>
      </div>
    );
  }

  const orderCount = getUserOrders(user.id).length;

  const saveProfile = (e) => {
    e.preventDefault();
    showToast("Profile updated! (Demo only — not persisted to user record)", "success");
  };

  return (
    <div className="profile-page container">
      <h1 className="section-title">My Profile</h1>

      <div className="profile-grid">
        <div className="profile-card">
          <div className="profile-avatar-lg">{user.name?.[0]?.toUpperCase() || "U"}</div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          {user.role === "admin" && <span className="badge badge-purple">Administrator</span>}
          <div className="profile-stats">
            <div><strong>{orderCount}</strong><span>Orders</span></div>
            <div><strong>{user.role === "admin" ? "∞" : "Free"}</strong><span>Plan</span></div>
          </div>
          <button className="btn btn-secondary btn-full" onClick={() => { logout(); setPage("home"); }}>Sign Out</button>
        </div>

        <div className="profile-card">
          <h3>Edit Profile</h3>
          <form onSubmit={saveProfile} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" value={user.email} disabled />
            </div>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </form>

          <div className="quick-links">
            <button onClick={() => setPage("orders")}>📦 View Order History</button>
            <button onClick={() => setPage("wishlist")}>❤️ View Wishlist</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
