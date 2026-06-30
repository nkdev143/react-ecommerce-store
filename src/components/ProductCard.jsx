import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./ProductCard.css";

const StarRating = ({ rating }) => {
  return (
    <span className="stars">
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
    </span>
  );
};

const ProductCard = ({ product, setPage, setSelectedProduct, setShowAuth, showToast }) => {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const { user } = useAuth();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [added, setAdded] = useState(false);

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) { setShowAuth(true); return; }
    addToCart(product, selectedSize, selectedColor);
    setAdded(true);
    showToast(`${product.name} added to cart!`, "success");
    setTimeout(() => setAdded(false), 1800);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!user) { setShowAuth(true); return; }
    toggleWishlist(product.id);
    showToast(wishlisted ? "Removed from wishlist" : "Added to wishlist ❤️", wishlisted ? "" : "success");
  };

  const handleClick = () => {
    setSelectedProduct(product);
    setPage("product");
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="product-card card" onClick={handleClick}>
      {/* Image */}
      <div className="product-img-wrap">
        <img src={product.image} alt={product.name} className="product-img" loading="lazy" />
        {product.badge && (
          <span className={`product-badge badge ${
            product.badge === "Bestseller" ? "badge-purple" :
            product.badge === "New" ? "badge-green" :
            product.badge === "Sale" ? "badge-red" : "badge-orange"
          }`}>{product.badge}</span>
        )}
        {discount && <span className="discount-tag">-{discount}%</span>}
        <button className={`wishlist-btn-card ${wishlisted ? "wishlisted" : ""}`} onClick={handleWishlist} title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}>
          {wishlisted ? "❤️" : "🤍"}
        </button>
        <div className="quick-view-overlay">
          <span>Quick View</span>
        </div>
      </div>

      {/* Info */}
      <div className="product-info">
        <div className="product-rating">
          <StarRating rating={product.rating} />
          <span className="rating-num">{product.rating}</span>
          <span className="review-count">({product.reviews})</span>
        </div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>

        {/* Options */}
        <div className="product-options" onClick={e => e.stopPropagation()}>
          {product.sizes.length > 1 && (
            <div className="option-row">
              {product.sizes.map(s => (
                <button key={s} className={`opt-chip size-chip ${selectedSize === s ? "selected" : ""}`} onClick={() => setSelectedSize(s)}>{s}</button>
              ))}
            </div>
          )}
        </div>

        <div className="product-footer">
          <div className="price-block">
            <span className="price">${product.price.toFixed(2)}</span>
            {product.originalPrice && <span className="original-price">${product.originalPrice.toFixed(2)}</span>}
          </div>
          <button className={`add-to-cart-btn btn ${added ? "added" : "btn-primary"} btn-sm`} onClick={handleAddToCart} disabled={added}>
            {added ? "✓ Added" : "+ Cart"}
          </button>
        </div>

        {product.stock < 15 && <p className="low-stock">⚡ Only {product.stock} left!</p>}
      </div>
    </div>
  );
};

export default ProductCard;
