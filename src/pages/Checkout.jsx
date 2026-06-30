import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import "./Checkout.css";

const Checkout = ({ setPage, showToast }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState({ fullName: user?.name || "", address: "", city: "", zip: "", phone: "" });
  const [payment, setPayment] = useState({ cardName: "", cardNumber: "", expiry: "", cvv: "" });
  const [placing, setPlacing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const shippingCost = cartTotal > 50 ? 0 : 4.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shippingCost + tax;

  const changeShip = (e) => setShipping({ ...shipping, [e.target.name]: e.target.value });
  const changePay = (e) => setPayment({ ...payment, [e.target.name]: e.target.value });

  const validShipping = shipping.fullName && shipping.address && shipping.city && shipping.zip && shipping.phone;
  const validPayment = payment.cardName && payment.cardNumber.length >= 12 && payment.expiry && payment.cvv.length >= 3;

  const handlePlaceOrder = () => {
    setPlacing(true);
    setTimeout(() => {
      const order = placeOrder(user.id, user.name, cartItems, total, shipping);
      setConfirmedOrder(order);
      clearCart();
      setPlacing(false);
      setStep(4);
      showToast("Order placed successfully! 🎉", "success");
    }, 1200);
  };

  if (cartItems.length === 0 && step !== 4) {
    return (
      <div className="checkout-page container">
        <div className="empty-state" style={{ paddingTop: "100px" }}>
          <div className="empty-state-icon">🛒</div>
          <h3 className="empty-state-title">Your cart is empty</h3>
          <p className="empty-state-desc">Add items to your cart before checking out.</p>
          <button className="btn btn-primary" onClick={() => setPage("home")}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      {step !== 4 && (
        <div className="checkout-steps">
          {["Shipping", "Payment", "Review"].map((s, i) => (
            <div key={s} className={`step ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`}>
              <span className="step-num">{step > i + 1 ? "✓" : i + 1}</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}

      <div className="checkout-grid">
        <div className="checkout-main">
          {step === 1 && (
            <div className="checkout-card">
              <h2>Shipping Information</h2>
              <div className="form-grid">
                <div className="form-group full"><label className="form-label">Full Name</label><input className="form-input" name="fullName" value={shipping.fullName} onChange={changeShip} placeholder="Jane Doe" /></div>
                <div className="form-group full"><label className="form-label">Address</label><input className="form-input" name="address" value={shipping.address} onChange={changeShip} placeholder="123 Dev Street" /></div>
                <div className="form-group"><label className="form-label">City</label><input className="form-input" name="city" value={shipping.city} onChange={changeShip} placeholder="San Francisco" /></div>
                <div className="form-group"><label className="form-label">ZIP Code</label><input className="form-input" name="zip" value={shipping.zip} onChange={changeShip} placeholder="94103" /></div>
                <div className="form-group full"><label className="form-label">Phone Number</label><input className="form-input" name="phone" value={shipping.phone} onChange={changeShip} placeholder="(555) 123-4567" /></div>
              </div>
              <button className="btn btn-primary btn-lg btn-full" disabled={!validShipping} onClick={() => setStep(2)}>Continue to Payment →</button>
            </div>
          )}

          {step === 2 && (
            <div className="checkout-card">
              <h2>Payment Details</h2>
              <p className="payment-note">🔒 This is a demo store — no real payment will be processed.</p>
              <div className="form-grid">
                <div className="form-group full"><label className="form-label">Name on Card</label><input className="form-input" name="cardName" value={payment.cardName} onChange={changePay} placeholder="Jane Doe" /></div>
                <div className="form-group full"><label className="form-label">Card Number</label><input className="form-input" name="cardNumber" value={payment.cardNumber} onChange={changePay} placeholder="4242 4242 4242 4242" maxLength={19} /></div>
                <div className="form-group"><label className="form-label">Expiry</label><input className="form-input" name="expiry" value={payment.expiry} onChange={changePay} placeholder="MM/YY" /></div>
                <div className="form-group"><label className="form-label">CVV</label><input className="form-input" name="cvv" value={payment.cvv} onChange={changePay} placeholder="123" maxLength={4} /></div>
              </div>
              <div className="checkout-btn-row">
                <button className="btn btn-secondary btn-lg" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary btn-lg" disabled={!validPayment} onClick={() => setStep(3)}>Review Order →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="checkout-card">
              <h2>Review Your Order</h2>
              <div className="review-section">
                <h4>Shipping To</h4>
                <p>{shipping.fullName}<br/>{shipping.address}, {shipping.city} {shipping.zip}<br/>{shipping.phone}</p>
              </div>
              <div className="review-section">
                <h4>Payment Method</h4>
                <p>Card ending in {payment.cardNumber.slice(-4)}</p>
              </div>
              <div className="review-section">
                <h4>Items ({cartItems.length})</h4>
                {cartItems.map(item => (
                  <div className="review-item-row" key={item.key}>
                    <img src={item.image} alt={item.name} />
                    <div><strong>{item.name}</strong><span>{item.size} · {item.color} · Qty {item.qty}</span></div>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="checkout-btn-row">
                <button className="btn btn-secondary btn-lg" onClick={() => setStep(2)}>← Back</button>
                <button className="btn btn-primary btn-lg" disabled={placing} onClick={handlePlaceOrder}>
                  {placing ? "Placing Order..." : `Place Order — $${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}

          {step === 4 && confirmedOrder && (
            <div className="checkout-card order-confirm">
              <div className="confirm-icon">✅</div>
              <h2>Order Confirmed!</h2>
              <p>Thank you for your order. A confirmation has been sent to your account.</p>
              <div className="confirm-id">Order ID: <strong>{confirmedOrder.id}</strong></div>
              <div className="checkout-btn-row" style={{ justifyContent: "center" }}>
                <button className="btn btn-secondary btn-lg" onClick={() => setPage("orders")}>View Orders</button>
                <button className="btn btn-primary btn-lg" onClick={() => setPage("home")}>Continue Shopping</button>
              </div>
            </div>
          )}
        </div>

        {step !== 4 && (
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            {cartItems.map(item => (
              <div className="summary-item" key={item.key}>
                <img src={item.image} alt={item.name} />
                <div><strong>{item.name}</strong><span>{item.size} · {item.color} × {item.qty}</span></div>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="summary-divider"/>
            <div className="summary-row"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</span></div>
            <div className="summary-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="summary-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
