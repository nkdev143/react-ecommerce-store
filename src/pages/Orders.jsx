import React from "react";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import "./Orders.css";

const STATUS_COLORS = {
  Processing: "badge-orange",
  Shipped: "badge-purple",
  Delivered: "badge-green",
  Cancelled: "badge-red",
};

const Orders = ({ setPage }) => {
  const { user } = useAuth();
  const { getUserOrders } = useOrders();
  const orders = user ? getUserOrders(user.id) : [];

  if (!user) {
    return (
      <div className="orders-page container">
        <div className="empty-state" style={{ paddingTop: "100px" }}>
          <div className="empty-state-icon">🔐</div>
          <h3 className="empty-state-title">Sign in to view orders</h3>
          <button className="btn btn-primary" onClick={() => setPage("home")}>Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page container">
      <h1 className="section-title">My Orders</h1>
      <p className="section-desc">Track and manage your past purchases</p>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3 className="empty-state-title">No orders yet</h3>
          <p className="empty-state-desc">When you place an order, it will show up here.</p>
          <button className="btn btn-primary" onClick={() => setPage("home")}>Start Shopping</button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div className="order-card" key={order.id}>
              <div className="order-card-header">
                <div>
                  <strong>{order.id}</strong>
                  <span className="order-date">{new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                </div>
                <span className={`badge ${STATUS_COLORS[order.status] || "badge-orange"}`}>{order.status}</span>
              </div>
              <div className="order-items">
                {order.items.map(item => (
                  <div className="order-item-row" key={item.key}>
                    <img src={item.image} alt={item.name} />
                    <div><strong>{item.name}</strong><span>{item.size} · {item.color} × {item.qty}</span></div>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="order-card-footer">
                <span>Shipping to: {order.shippingInfo?.city}, {order.shippingInfo?.zip}</span>
                <strong>Total: ${order.total.toFixed(2)}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
