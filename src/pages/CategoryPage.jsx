import React, { useState, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import "./CategoryPage.css";

const CATEGORY_META = {
  tshirts: { title: "T-Shirts", icon: "👕", desc: "Premium cotton tees designed for developers who code in comfort." },
  hoodies: { title: "Hoodies", icon: "🧥", desc: "Cozy, heavyweight hoodies for late-night debugging sessions." },
  mugs: { title: "Mugs", icon: "☕", desc: "Ceramic mugs to fuel your coffee-driven development." },
};

const CategoryPage = ({ category, setPage, setSelectedProduct, setShowAuth, showToast }) => {
  const meta = CATEGORY_META[category];
  const [sort, setSort] = useState("featured");
  const [priceFilter, setPriceFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = products.filter(p => p.category === category);
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (priceFilter === "under25") list = list.filter(p => p.price < 25);
    if (priceFilter === "25to50") list = list.filter(p => p.price >= 25 && p.price <= 50);
    if (priceFilter === "over50") list = list.filter(p => p.price > 50);

    if (sort === "price-low") list = [...list].sort((a,b) => a.price - b.price);
    if (sort === "price-high") list = [...list].sort((a,b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a,b) => b.rating - a.rating);

    return list;
  }, [category, sort, priceFilter, search]);

  return (
    <div className="category-page">
      <div className="cat-hero">
        <div className="container">
          <span className="cat-hero-icon">{meta.icon}</span>
          <h1>{meta.title}</h1>
          <p>{meta.desc}</p>
        </div>
      </div>

      <div className="container">
        <div className="cat-toolbar">
          <input
            className="form-input cat-search"
            placeholder={`Search ${meta.title.toLowerCase()}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="cat-filters">
            <select className="form-input form-select" value={priceFilter} onChange={e => setPriceFilter(e.target.value)}>
              <option value="all">All Prices</option>
              <option value="under25">Under $25</option>
              <option value="25to50">$25 - $50</option>
              <option value="over50">Over $50</option>
            </select>
            <select className="form-input form-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <p className="result-count">{filtered.length} product{filtered.length !== 1 ? "s" : ""} found</p>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No products found</h3>
            <p className="empty-state-desc">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} setPage={setPage} setSelectedProduct={setSelectedProduct} setShowAuth={setShowAuth} showToast={showToast} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
