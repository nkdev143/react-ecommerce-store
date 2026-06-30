import React from "react";
import "./Footer.css";

const Footer = ({ setPage }) => {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">⌨️</span>
              <span>CodeWithNK Store</span>
            </div>
            <p className="footer-tagline">Merch made for developers, by developers. Wear the code.</p>
            <div className="footer-social">
              <a href="#" aria-label="YouTube">📺</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="GitHub">💻</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <button onClick={() => setPage("tshirts")}>T-Shirts</button>
            <button onClick={() => setPage("hoodies")}>Hoodies</button>
            <button onClick={() => setPage("mugs")}>Mugs</button>
          </div>

          <div className="footer-col">
            <h4>Account</h4>
            <button onClick={() => setPage("orders")}>My Orders</button>
            <button onClick={() => setPage("wishlist")}>Wishlist</button>
            <button onClick={() => setPage("profile")}>Profile</button>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <button onClick={() => setPage("contact")}>Contact Us</button>
            <button onClick={() => setPage("faq")}>FAQs</button>
            <button onClick={() => setPage("returns")}>Returns Policy</button>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 CodeWithNK Store. Built with React, fueled by coffee. ☕</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
