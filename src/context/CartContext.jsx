import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cwk_cart") || "[]"); } catch { return []; }
  });
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cwk_wishlist") || "[]"); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem("cwk_cart", JSON.stringify(cartItems)); }, [cartItems]);
  useEffect(() => { localStorage.setItem("cwk_wishlist", JSON.stringify(wishlist)); }, [wishlist]);

  const addToCart = (product, size, color, qty = 1) => {
    const key = `${product.id}-${size}-${color}`;
    setCartItems(prev => {
      const existing = prev.find(i => i.key === key);
      if (existing) return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, key, size, color, qty }];
    });
  };

  const removeFromCart = (key) => setCartItems(prev => prev.filter(i => i.key !== key));

  const updateQty = (key, qty) => {
    if (qty < 1) return removeFromCart(key);
    setCartItems(prev => prev.map(i => i.key === key ? { ...i, qty } : i));
  };

  const clearCart = () => setCartItems([]);

  const toggleWishlist = (productId) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(i => i !== productId) : [...prev, productId]);
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal, wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </CartContext.Provider>
  );
};
