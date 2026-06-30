import React, { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();
export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cwk_orders") || "[]"); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem("cwk_orders", JSON.stringify(orders)); }, [orders]);

  const placeOrder = (userId, userName, cartItems, total, shippingInfo) => {
    const order = {
      id: "ORD-" + Date.now(),
      userId,
      userName,
      items: cartItems,
      total,
      shippingInfo,
      status: "Processing",
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [order, ...prev]);
    return order;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const getUserOrders = (userId) => orders.filter(o => o.userId === userId);

  return (
    <OrderContext.Provider value={{ orders, placeOrder, updateOrderStatus, getUserOrders }}>
      {children}
    </OrderContext.Provider>
  );
};
