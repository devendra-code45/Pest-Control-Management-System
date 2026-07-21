import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const storedAuth = localStorage.getItem("pcmsAuth");

    if (storedAuth) {
      try {
        return JSON.parse(storedAuth);
      } catch {
        localStorage.removeItem("pcmsAuth");
      }
    }

    return {
      isAuthenticated: false,
      role: null,
      user: null,
    };
  });

  const login = (userData) => {
    const authData = {
      isAuthenticated: true,
      role: userData.role,
      user: userData,
    };

    setAuth(authData);
    localStorage.setItem("pcmsAuth", JSON.stringify(authData));
  };

  const logout = () => {
    const emptyAuth = {
      isAuthenticated: false,
      role: null,
      user: null,
    };

    setAuth(emptyAuth);
    localStorage.removeItem("pcmsAuth");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}