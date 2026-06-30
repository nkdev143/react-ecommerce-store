import React, { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { products as initialProducts, categories } from "../data/products";
import "./AdminDashboard.css";

const STATUS_OPTIONS = ["Processing", "Shipped", "Delivered", "Cancelled"];

const AdminDashboard = ({ setPage, showToast }) => {
  const { user, users, isAdmin } = useAuth();
  const { orders, updateOrderStatus } = useOrders();
  const [tab, setTab] = useState("overview");
  const [productList, setProductList] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cwk_admin_products") || JSON.stringify(initialProducts)); }
    catch { return initialProducts; }
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [search, setSearch] = useState("");

  const saveProducts = (list) => {
    setProductList(list);
    localStorage.setItem("cwk_admin_products", JSON.stringify(list));
  };

  

 
  // Stats

  
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const totalCustomers = users.length;
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  const topProducts = useMemo(() => {
    const counts = {};
    orders.forEach(o => o.items.forEach(i => { counts[i.name] = (counts[i.name] || 0) + i.qty; }));
    return Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0, 5);
  }, [orders]);

   if (!isAdmin) {
    return (
      <div className="admin-page container">
        <div className="empty-state" style={{ paddingTop: "100px" }}>
          <div className="empty-state-icon">🚫</div>
          <h3 className="empty-state-title">Access Denied</h3>
          <p className="empty-state-desc">You don't have permission to view the admin dashboard.</p>
          <button className="btn btn-primary" onClick={() => setPage("home")}>Go Home</button>
        </div>
      </div>
    );
  }


  const filteredProducts = productList.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const deleteProduct = (id) => {
    if (window.confirm("Delete this product permanently?")) {
      saveProducts(productList.filter(p => p.id !== id));
      showToast("Product deleted", "success");
    }
  };

  const openNewProduct = () => {
    setEditingProduct({ id: Date.now(), name: "", category: "tshirts", price: 0, originalPrice: "", image: "", description: "", sizes: ["S","M","L"], colors: ["Black"], stock: 10, rating: 4.5, reviews: 0, badge: "" });
    setShowProductForm(true);
  };

  const openEditProduct = (p) => { setEditingProduct({ ...p }); setShowProductForm(true); };

  const saveProduct = (e) => {
    e.preventDefault();
    const exists = productList.find(p => p.id === editingProduct.id);
    let updated;
    if (exists) {
      updated = productList.map(p => p.id === editingProduct.id ? editingProduct : p);
    } else {
      updated = [...productList, editingProduct];
    }
    saveProducts(updated);
    setShowProductForm(false);
    showToast(exists ? "Product updated!" : "Product added!", "success");
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container admin-header-inner">
          <div>
            <h1>⚙️ Admin Dashboard</h1>
            <p>Welcome back, {user.name}. Manage your store from here.</p>
          </div>
          <button className="btn btn-secondary" onClick={() => setPage("home")}>← Back to Store</button>
        </div>
      </div>

      <div className="container admin-body">
        <div className="admin-tabs">
          {[
            { id: "overview", label: "📊 Overview" },
            { id: "products", label: "📦 Products" },
            { id: "orders", label: "🧾 Orders" },
            { id: "customers", label: "👥 Customers" },
          ].map(t => (
            <button key={t.id} className={tab === t.id ? "active" : ""} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="admin-section">
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon">💰</span>
                <div><strong>${totalRevenue.toFixed(2)}</strong><span>Total Revenue</span></div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">🧾</span>
                <div><strong>{totalOrders}</strong><span>Total Orders</span></div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">👥</span>
                <div><strong>{totalCustomers}</strong><span>Registered Users</span></div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📈</span>
                <div><strong>${avgOrderValue.toFixed(2)}</strong><span>Avg. Order Value</span></div>
              </div>
            </div>

            <div className="admin-two-col">
              <div className="admin-panel">
                <h3>Top Selling Products</h3>
                {topProducts.length === 0 ? <p className="muted">No sales data yet.</p> : (
                  <div className="top-products-list">
                    {topProducts.map(([name, qty], i) => (
                      <div className="top-product-row" key={name}>
                        <span className="rank">#{i + 1}</span>
                        <span className="tp-name">{name}</span>
                        <span className="tp-qty">{qty} sold</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="admin-panel">
                <h3>Inventory by Category</h3>
                <div className="category-stats">
                  {categories.map(cat => {
                    const count = productList.filter(p => p.category === cat.id).length;
                    const stock = productList.filter(p => p.category === cat.id).reduce((s,p) => s+Number(p.stock), 0);
                    return (
                      <div className="cat-stat-row" key={cat.id}>
                        <span>{cat.icon} {cat.name}</span>
                        <span>{count} products · {stock} units</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="admin-panel">
              <h3>Recent Orders</h3>
              {orders.slice(0, 5).length === 0 ? <p className="muted">No orders yet.</p> : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
                    <tbody>
                      {orders.slice(0, 5).map(o => (
                        <tr key={o.id}>
                          <td className="mono">{o.id}</td>
                          <td>{o.userName}</td>
                          <td>{o.items.length}</td>
                          <td>${o.total.toFixed(2)}</td>
                          <td><span className={`badge ${o.status === "Delivered" ? "badge-green" : o.status === "Cancelled" ? "badge-red" : "badge-orange"}`}>{o.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {tab === "products" && (
          <div className="admin-section">
            <div className="admin-toolbar">
              <input className="form-input" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: "300px" }} />
              <button className="btn btn-primary" onClick={openNewProduct}>+ Add Product</button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr></thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id}>
                      <td><img src={p.image} alt={p.name} className="admin-thumb" /></td>
                      <td>{p.name}</td>
                      <td className="capitalize">{p.category}</td>
                      <td>${Number(p.price).toFixed(2)}</td>
                      <td>
                        <span className={Number(p.stock) < 15 ? "low-stock-text" : ""}>{p.stock}</span>
                      </td>
                      <td>{p.rating} ★</td>
                      <td className="action-cell">
                        <button className="icon-btn" onClick={() => openEditProduct(p)} title="Edit">✏️</button>
                        <button className="icon-btn" onClick={() => deleteProduct(p.id)} title="Delete">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {tab === "orders" && (
          <div className="admin-section">
            <h3 className="mb-16">All Orders ({orders.length})</h3>
            {orders.length === 0 ? <p className="muted">No orders placed yet.</p> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td className="mono">{o.id}</td>
                        <td>{o.userName}</td>
                        <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td>{o.items.length}</td>
                        <td>${o.total.toFixed(2)}</td>
                        <td>
                          <select className="form-input status-select" value={o.status} onChange={e => { updateOrderStatus(o.id, e.target.value); showToast(`Order ${o.id} updated to ${e.target.value}`, "success"); }}>
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* CUSTOMERS */}
        {tab === "customers" && (
          <div className="admin-section">
            <h3 className="mb-16">Registered Customers ({users.length})</h3>
            {users.length === 0 ? <p className="muted">No customers registered yet.</p> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Joined</th><th>Orders</th></tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</td>
                        <td>{orders.filter(o => o.userId === u.id).length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="modal-overlay" onClick={() => setShowProductForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{productList.find(p => p.id === editingProduct.id) ? "Edit Product" : "Add Product"}</h2>
              <button className="modal-close" onClick={() => setShowProductForm(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={saveProduct} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input className="form-input" required value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-input form-select" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                      <option value="tshirts">T-Shirts</option>
                      <option value="hoodies">Hoodies</option>
                      <option value="mugs">Mugs</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Badge</label>
                    <select className="form-input form-select" value={editingProduct.badge || ""} onChange={e => setEditingProduct({...editingProduct, badge: e.target.value})}>
                      <option value="">None</option>
                      <option value="New">New</option>
                      <option value="Bestseller">Bestseller</option>
                      <option value="Sale">Sale</option>
                      <option value="Popular">Popular</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price ($)</label>
                    <input className="form-input" type="number" step="0.01" required value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Original Price ($)</label>
                    <input className="form-input" type="number" step="0.01" value={editingProduct.originalPrice || ""} onChange={e => setEditingProduct({...editingProduct, originalPrice: e.target.value ? parseFloat(e.target.value) : null})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock</label>
                    <input className="form-input" type="number" required value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rating</label>
                    <input className="form-input" type="number" step="0.1" min="0" max="5" value={editingProduct.rating} onChange={e => setEditingProduct({...editingProduct, rating: parseFloat(e.target.value)})} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input className="form-input" required value={editingProduct.image} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={3} required value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Sizes (comma-separated)</label>
                    <input className="form-input" value={editingProduct.sizes.join(", ")} onChange={e => setEditingProduct({...editingProduct, sizes: e.target.value.split(",").map(s=>s.trim()).filter(Boolean)})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Colors (comma-separated)</label>
                    <input className="form-input" value={editingProduct.colors.join(", ")} onChange={e => setEditingProduct({...editingProduct, colors: e.target.value.split(",").map(s=>s.trim()).filter(Boolean)})} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-full btn-lg">Save Product</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
