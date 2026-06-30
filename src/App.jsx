import React, { useState, useCallback } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import CartDrawer from "./components/CartDrawer";
import Toast from "./components/Toast";

import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import { Contact, FAQ, Returns } from "./pages/StaticPages";

import "./styles/global.css";
import "./pages/StaticPages.css";

let toastId = 0;

const AppShell = () => {
  const [page, setPageRaw] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [toasts, setToasts] = useState([]);
  const { user } = useAuth();

  const setPage = useCallback((p) => {
    setPageRaw(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const showToast = useCallback((message, type = "") => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const renderPage = () => {
    switch (page) {
      case "home":
        return <Home setPage={setPage} setSelectedProduct={setSelectedProduct} setShowAuth={setShowAuth} showToast={showToast} />;
      case "tshirts":
      case "hoodies":
      case "mugs":
        return <CategoryPage category={page} setPage={setPage} setSelectedProduct={setSelectedProduct} setShowAuth={setShowAuth} showToast={showToast} />;
      case "product":
        return selectedProduct
          ? <ProductDetail product={selectedProduct} setPage={setPage} setSelectedProduct={setSelectedProduct} setShowAuth={setShowAuth} showToast={showToast} />
          : <Home setPage={setPage} setSelectedProduct={setSelectedProduct} setShowAuth={setShowAuth} showToast={showToast} />;
      case "checkout":
        return <Checkout setPage={setPage} showToast={showToast} />;
      case "orders":
        return <Orders setPage={setPage} />;
      case "wishlist":
        return <Wishlist setPage={setPage} setSelectedProduct={setSelectedProduct} setShowAuth={setShowAuth} showToast={showToast} />;
      case "profile":
        return <Profile setPage={setPage} showToast={showToast} />;
      case "admin":
        return <AdminDashboard setPage={setPage} showToast={showToast} />;
      case "contact":
        return <Contact showToast={showToast} />;
      case "faq":
        return <FAQ />;
      case "returns":
        return <Returns />;
      default:
        return <Home setPage={setPage} setSelectedProduct={setSelectedProduct} setShowAuth={setShowAuth} showToast={showToast} />;
    }
  };

  return (
    <div className="app">
      <Navbar setPage={setPage} currentPage={page} setShowAuth={setShowAuth} setShowCart={setShowCart} />
      <main>{renderPage()}</main>
      {page !== "admin" && <Footer setPage={setPage} />}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} showToast={showToast} />}
      {showCart && <CartDrawer onClose={() => setShowCart(false)} setPage={setPage} user={user} setShowAuth={setShowAuth} />}
      <Toast toasts={toasts} />
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <CartProvider>
      <OrderProvider>
        <AppShell />
      </OrderProvider>
    </CartProvider>
  </AuthProvider>
);

export default App;
