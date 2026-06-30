import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./AuthModal.css";

const AuthModal = ({ onClose, showToast }) => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login"); // login | signup
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
      setLoading(true);
      setTimeout(() => {
        const res = login(form.email, form.password);
        setLoading(false);
        if (res.success) {
          showToast(form.email === "admin" ? "Welcome back, Admin! ⚙️" : "Welcome back! 👋", "success");
          onClose();
        } else {
          setError(res.error);
        }
      }, 500);
    } else {
      if (!form.name || !form.email || !form.password || !form.confirm) { setError("Please fill in all fields."); return; }
      if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
      if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
      setLoading(true);
      setTimeout(() => {
        const res = signup(form.name, form.email, form.password);
        setLoading(false);
        if (res.success) {
          showToast("Account created! Welcome to CodeWithNK 🎉", "success");
          onClose();
        } else {
          setError(res.error);
        }
      }, 500);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{mode === "login" ? "Welcome Back" : "Create Account"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <p className="auth-subtitle">
            {mode === "login" ? "Sign in to continue shopping" : "Join the CodeWithNK community"}
          </p>

          <form onSubmit={submit} className="auth-form">
            {mode === "signup" && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" name="name" placeholder="Jane Doe" value={form.name} onChange={change} />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email {mode === "login" && <span className="hint-text">(or admin username)</span>}</label>
              <input className="form-input" name="email" placeholder="you@example.com" value={form.email} onChange={change} autoComplete="username" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" name="password" placeholder="••••••••" value={form.password} onChange={change} autoComplete="current-password" />
            </div>
            {mode === "signup" && (
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input className="form-input" type="password" name="confirm" placeholder="••••••••" value={form.confirm} onChange={change} />
              </div>
            )}

            {error && <p className="form-error auth-error">⚠️ {error}</p>}

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="auth-switch">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} className="auth-switch-btn">
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>

          {mode === "login" && (
            <div className="admin-hint">
              💡 Demo admin login: <code>admin</code> / <code>Password@99965</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
