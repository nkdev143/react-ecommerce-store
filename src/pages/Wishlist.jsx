import React from "react";
import { useCart } from "../context/CartContext";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import "./Orders.css";

const Wishlist = ({ setPage, setSelectedProduct, setShowAuth, showToast }) => {
  const { wishlist } = useCart();
  const wishedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="orders-page container">
      <h1 className="section-title">My Wishlist</h1>
      <p className="section-desc">Items you've saved for later</p>

      {wishedProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💔</div>
          <h3 className="empty-state-title">Your wishlist is empty</h3>
          <p className="empty-state-desc">Tap the heart icon on any product to save it here.</p>
          <button className="btn btn-primary" onClick={() => setPage("home")}>Browse Products</button>
        </div>
      ) : (
        <div className="product-grid" style={{ marginTop: "28px" }}>
          {wishedProducts.map(p => (
            <ProductCard key={p.id} product={p} setPage={setPage} setSelectedProduct={setSelectedProduct} setShowAuth={setShowAuth} showToast={showToast} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
