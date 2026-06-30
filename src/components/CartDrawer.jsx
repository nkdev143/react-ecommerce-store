import React from "react";
import { useCart } from "../context/CartContext";
import "./CartDrawer.css";

const CartDrawer = ({ onClose, setPage, user, setShowAuth }) => {
  const { cartItems, removeFromCart, updateQty, cartTotal } = useCart();

  const checkout = () => {
    if (!user) { onClose(); setShowAuth(true); return; }
    setPage("checkout");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2 className="modal-title">Your Cart {cartItems.length > 0 && `(${cartItems.length})`}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🛒</div>
              <h3 className="empty-state-title">Your cart is empty</h3>
              <p className="empty-state-desc">Add some merch to get started!</p>
              <button className="btn btn-primary" onClick={onClose}>Continue Shopping</button>
            </div>
          ) : (
            <div className="cart-items">
              {cartItems.map(item => (
                <div className="cart-item" key={item.key}>
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p className="cart-item-meta">{item.size} · {item.color}</p>
                    <div className="cart-item-bottom">
                      <div className="qty-stepper">
                        <button onClick={() => updateQty(item.key, item.qty - 1)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.key, item.qty + 1)}>+</button>
                      </div>
                      <span className="cart-item-price">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.key)} title="Remove">🗑️</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Shipping</span>
              <span className="free-ship">{cartTotal > 50 ? "FREE" : "$4.99"}</span>
            </div>
            <div className="cart-summary-row total">
              <span>Total</span>
              <span>${(cartTotal + (cartTotal > 50 ? 0 : 4.99)).toFixed(2)}</span>
            </div>
            {cartTotal < 50 && cartTotal > 0 && (
              <p className="ship-hint">Add ${(50 - cartTotal).toFixed(2)} more for free shipping! 🚚</p>
            )}
            <button className="btn btn-primary btn-full btn-lg" onClick={checkout}>
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
