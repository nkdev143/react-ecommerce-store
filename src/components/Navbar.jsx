import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

const Navbar = ({ setPage, currentPage, setShowAuth, setShowCart }) => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "tshirts", label: "T-Shirts" },
    { id: "hoodies", label: "Hoodies" },
    { id: "mugs", label: "Mugs" },
  ];

  const go = (page) => { setPage(page); setMenuOpen(false); setDropdownOpen(false); };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-inner container">
        {/* Logo */}
        <button className="navbar-logo" onClick={() => go("home")}>
          <span className="logo-icon">⌨️</span>
          <div className="logo-text">
            <span className="logo-main">CodeWithNK</span>
            <span className="logo-sub">Store</span>
          </div>
        </button>

        {/* Desktop Nav */}
        <ul className="navbar-links">
          {navLinks.map(link => (
            <li key={link.id}>
              <button className={`nav-link ${currentPage === link.id ? "active" : ""}`} onClick={() => go(link.id)}>
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="navbar-actions">
          {user && (
            <button className="nav-action wishlist-btn" onClick={() => go("wishlist")} title="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          )}

          <button className="nav-action cart-btn" onClick={() => setShowCart(true)} title="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>}
          </button>

          {user ? (
            <div className="user-menu">
              <button className="user-avatar-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <span className="user-avatar">{user.name?.[0]?.toUpperCase() || "U"}</span>
                <span className="user-name-short">{user.name?.split(" ")[0]}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              {dropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                  <div className="dropdown-divider"/>
                  <button onClick={() => go("orders")}>📦 My Orders</button>
                  <button onClick={() => go("wishlist")}>❤️ Wishlist</button>
                  <button onClick={() => go("profile")}>👤 Profile</button>
                  {isAdmin && (
                    <>
                      <div className="dropdown-divider"/>
                      <button className="admin-link" onClick={() => go("admin")}>⚙️ Admin Dashboard</button>
                    </>
                  )}
                  <div className="dropdown-divider"/>
                  <button className="logout-btn" onClick={() => { logout(); setDropdownOpen(false); }}>🚪 Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => setShowAuth(true)}>Sign In</button>
          )}

          {/* Mobile Hamburger */}
          <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span/><span/><span/>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map(link => (
            <button key={link.id} className={`mobile-nav-link ${currentPage === link.id ? "active" : ""}`} onClick={() => go(link.id)}>
              {link.label}
            </button>
          ))}
          <div className="mobile-menu-divider"/>
          {user ? (
            <>
              <button className="mobile-nav-link" onClick={() => go("orders")}>📦 My Orders</button>
              <button className="mobile-nav-link" onClick={() => go("wishlist")}>❤️ Wishlist</button>
              <button className="mobile-nav-link" onClick={() => go("profile")}>👤 Profile</button>
              {isAdmin && <button className="mobile-nav-link admin-link" onClick={() => go("admin")}>⚙️ Admin Dashboard</button>}
              <button className="mobile-nav-link logout-btn" onClick={() => { logout(); setMenuOpen(false); }}>🚪 Sign Out</button>
            </>
          ) : (
            <button className="btn btn-primary btn-full" style={{ margin: "12px 0" }} onClick={() => { setShowAuth(true); setMenuOpen(false); }}>Sign In / Register</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
