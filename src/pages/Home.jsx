import React from "react";
import ProductCard from "../components/ProductCard";
import { products, categories } from "../data/products";
import "./Home.css";

const Home = ({ setPage, setSelectedProduct, setShowAuth, showToast }) => {
  const bestsellers = products.filter(p => p.badge === "Bestseller");
  const newArrivals = products.filter(p => p.badge === "New");

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="hero-eyebrow"> Grab Your Discount Today</span>
            <h1 className="hero-title">
              Wear the <span className="hero-highlight">code</span>.<br/>
              Live the <span className="hero-highlight">craft</span>.
            </h1>
            <p className="hero-desc">
              Official CodeWithNK merchandise — premium tees, cozy hoodies, and mugs built for developers who ship in style.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => setPage("tshirts")}>Shop Collection →</button>
              <button className="btn btn-secondary btn-lg" onClick={() => setPage("hoodies")}>View Hoodies</button>
            </div>
            <div className="hero-stats">
              <div><strong>10K+</strong><span>Happy Devs</span></div>
              <div><strong>4.8★</strong><span>Avg Rating</span></div>
              <div><strong>50+</strong><span>Countries</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card hero-card-1">
              <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop" alt="T-shirt" />
            </div>
            <div className="hero-card hero-card-2">
                            <img src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=600&fit=crop" alt="Mug" />

            </div>
            <div className="hero-card hero-card-3">
              <img src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=240&h=240&fit=crop" alt="Mug" />
            </div>
            <div className="hero-glow"/>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section container">
        <div className="section-header">
          <p className="section-eyebrow">// Browse by category</p>
          <h2 className="section-title">Shop the Collection</h2>
        </div>
        <div className="category-grid">
          {categories.map(cat => (
            <button key={cat.id} className="category-card" onClick={() => setPage(cat.id)}>
              <span className="cat-icon">{cat.icon}</span>
              <h3>{cat.name}</h3>
              <p>{cat.description}</p>
              <span className="cat-count">{cat.count} products →</span>
            </button>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="section container">
        <div className="section-header flex" style={{ justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <p className="section-eyebrow">// Fan favorites</p>
            <h2 className="section-title">Bestsellers</h2>
          </div>
          <button className="btn btn-ghost" onClick={() => setPage("tshirts")}>View All →</button>
        </div>
        <div className="product-grid">
          {bestsellers.map(p => (
            <ProductCard key={p.id} product={p} setPage={setPage} setSelectedProduct={setSelectedProduct} setShowAuth={setShowAuth} showToast={showToast} />
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="section container">
          <div className="section-header">
            <p className="section-eyebrow">// Fresh drops</p>
            <h2 className="section-title">New Arrivals</h2>
          </div>
          <div className="product-grid">
            {newArrivals.map(p => (
              <ProductCard key={p.id} product={p} setPage={setPage} setSelectedProduct={setSelectedProduct} setShowAuth={setShowAuth} showToast={showToast} />
            ))}
          </div>
        </section>
      )}

      {/* PERKS */}
      <section className="perks-section">
        <div className="container perks-grid">
          <div className="perk"><span>🚚</span><div><strong>Free Shipping</strong><p>On orders over $50</p></div></div>
          <div className="perk"><span>↩️</span><div><strong>Easy Returns</strong><p>30-day return window</p></div></div>
          <div className="perk"><span>🔒</span><div><strong>Secure Checkout</strong><p>100% protected payments</p></div></div>
          <div className="perk"><span>💬</span><div><strong>24/7 Support</strong><p>We're here to help</p></div></div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter-section">
        <div className="container newsletter-inner">
          <h2>Join the Dev Squad</h2>
          <p>Get notified about new drops, discount codes, and exclusive merch.</p>
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); showToast("Subscribed! Check your inbox 📬", "success"); }}>
            <input type="email" placeholder="you@example.com" required className="form-input" />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
