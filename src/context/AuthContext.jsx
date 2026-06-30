import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cwk_users") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const saved = localStorage.getItem("cwk_current_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = (email, password) => {
    // Admin check
    if (email === "admin" && password === "Password@99965") {
      const adminUser = { id: "admin", name: "Admin", email: "admin", role: "admin" };
      setUser(adminUser);
      localStorage.setItem("cwk_current_user", JSON.stringify(adminUser));
      return { success: true };
    }
    // Regular user
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      localStorage.setItem("cwk_current_user", JSON.stringify(safeUser));
      return { success: true };
    }
    return { success: false, error: "Invalid email or password." };
  };

  const signup = (name, email, password) => {
    if (users.find((u) => u.email === email)) {
      return { success: false, error: "An account with this email already exists." };
    }
    const newUser = { id: Date.now().toString(), name, email, password, role: "user", createdAt: new Date().toISOString() };
    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem("cwk_users", JSON.stringify(updated));
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem("cwk_current_user", JSON.stringify(safeUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cwk_current_user");
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, users, login, signup, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
