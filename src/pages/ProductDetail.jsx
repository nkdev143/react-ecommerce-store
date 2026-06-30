import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import "./ProductDetail.css";

const ProductDetail = ({ product, setPage, setSelectedProduct, setShowAuth, showToast }) => {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const { user } = useAuth();
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");

  const wishlisted = isWishlisted(product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!user) { setShowAuth(true); return; }
    addToCart(product, size, color, qty);
    showToast(`${qty} × ${product.name} added to cart!`, "success");
  };

  const handleBuyNow = () => {
    if (!user) { setShowAuth(true); return; }
    addToCart(product, size, color, qty);
    setPage("checkout");
  };

  return (
    <div className="product-detail">
      <div className="container">
        <div className="breadcrumb">
          <button onClick={() => setPage("home")}>Home</button> /
          <button onClick={() => setPage(product.category)}>{product.category}</button> /
          <span>{product.name}</span>
        </div>

        <div className="pd-grid">
          <div className="pd-image-section">
            <div className="pd-main-img">
              <img src={product.image} alt={product.name} />
              {product.badge && <span className="badge badge-purple pd-badge">{product.badge}</span>}
            </div>
          </div>

          <div className="pd-info">
            <div className="pd-rating-row">
              <span className="stars">★★★★★</span>
              <span>{product.rating} ({product.reviews} reviews)</span>
            </div>
            <h1 className="pd-title">{product.name}</h1>
            <div className="pd-price-row">
              <span className="pd-price">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className="pd-original-price">${product.originalPrice.toFixed(2)}</span>
                  <span className="badge badge-red">Save {Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
                </>
              )}
            </div>
            <p className="pd-desc">{product.description}</p>

            <div className="pd-option-group">
              <label>Size</label>
              <div className="option-row">
                {product.sizes.map(s => (
                  <button key={s} className={`opt-chip size-chip ${size === s ? "selected" : ""}`} onClick={() => setSize(s)}>{s}</button>
                ))}
              </div>
            </div>

            <div className="pd-option-group">
              <label>Color</label>
              <div className="option-row">
                {product.colors.map(c => (
                  <button key={c} className={`opt-chip color-chip ${color === c ? "selected" : ""}`} onClick={() => setColor(c)}>{c}</button>
                ))}
              </div>
            </div>

            <div className="pd-option-group">
              <label>Quantity</label>
              <div className="qty-stepper pd-qty">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
            </div>

            <div className="pd-actions">
              <button className="btn btn-secondary btn-lg pd-wishlist" onClick={() => { if(!user){setShowAuth(true); return;} toggleWishlist(product.id); showToast(wishlisted ? "Removed from wishlist" : "Added to wishlist ❤️"); }}>
                {wishlisted ? "❤️ Wishlisted" : "🤍 Wishlist"}
              </button>
              <button className="btn btn-secondary btn-lg" onClick={handleAddToCart}>Add to Cart</button>
              <button className="btn btn-primary btn-lg" onClick={handleBuyNow}>Buy Now</button>
            </div>

            <div className="pd-meta-list">
              <div>🚚 <strong>Free shipping</strong> on orders over $50</div>
              <div>↩️ <strong>30-day</strong> hassle-free returns</div>
              <div>📦 <strong>{product.stock}</strong> in stock — ships within 24h</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="pd-tabs">
          <div className="pd-tab-headers">
            {["description", "reviews", "shipping"].map(t => (
              <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="pd-tab-body">
            {tab === "description" && (
              <p>{product.description} Made from premium materials with a focus on durability and comfort, this piece is designed for developers who want their style to be as solid as their code. Pre-shrunk fabric, reinforced stitching, and a fit that lasts wash after wash.</p>
            )}
            {tab === "reviews" && (
              <div className="reviews-list">
                <div className="review-item">
                  <div className="review-header"><strong>Alex M.</strong><span className="stars">★★★★★</span></div>
                  <p>Quality is amazing, fits perfectly. Definitely buying more!</p>
                </div>
                <div className="review-item">
                  <div className="review-header"><strong>Priya S.</strong><span className="stars">★★★★☆</span></div>
                  <p>Great print quality and the fabric feels premium. Shipping took a bit long though.</p>
                </div>
                <div className="review-item">
                  <div className="review-header"><strong>Jordan K.</strong><span className="stars">★★★★★</span></div>
                  <p>My favorite piece of dev merch so far. Super comfortable for long coding sessions.</p>
                </div>
              </div>
            )}
            {tab === "shipping" && (
              <p>Standard shipping takes 5-7 business days. Express shipping (2-3 days) available at checkout. Free standard shipping on all orders over $50. International shipping available to 50+ countries. Returns accepted within 30 days of delivery in original condition.</p>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="pd-related">
            <h2 className="section-title">You Might Also Like</h2>
            <div className="product-grid">
              {related.map(p => (
                <ProductCard key={p.id} product={p} setPage={setPage} setSelectedProduct={setSelectedProduct} setShowAuth={setShowAuth} showToast={showToast} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
