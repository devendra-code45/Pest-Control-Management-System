import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

const EMPTY_AUTH = {
  isAuthenticated: false,
  role: null,
  token: null,
  user: null,
};

const normalizeRole = (role) => {
  if (!role) return null;

  return String(role)
    .replace(/^ROLE_/, "")
    .toUpperCase();
};

const readStoredAuth = () => {
  const storedAuth =
    localStorage.getItem("pcmsAuth");

  if (!storedAuth) {
    return EMPTY_AUTH;
  }

  try {
    const parsed = JSON.parse(storedAuth);

    const token =
      parsed?.token ||
      parsed?.user?.token ||
      parsed?.user?.accessToken ||
      parsed?.user?.jwtToken ||
      localStorage.getItem("token");

    const role = normalizeRole(
      parsed?.role ||
      parsed?.user?.role
    );

    if (!token) {
      localStorage.removeItem("pcmsAuth");
      localStorage.removeItem("token");
      return EMPTY_AUTH;
    }

    return {
      isAuthenticated: true,
      role,
      token,
      user: {
        ...(parsed?.user || {}),
        role,
        token,
      },
    };
  } catch {
    localStorage.removeItem("pcmsAuth");
    localStorage.removeItem("token");
    return EMPTY_AUTH;
  }
};

export function AuthProvider({ children }) {
  const [auth, setAuth] =
    useState(readStoredAuth);

  const login = (userData) => {
    const token =
      userData?.token ||
      userData?.accessToken ||
      userData?.jwtToken;

    if (!token) {
      throw new Error(
        "Login response does not contain a JWT token."
      );
    }

    const role = normalizeRole(
      userData?.role
    );

    const normalizedUser = {
      ...userData,
      role,
      token,
    };

    const authData = {
      isAuthenticated: true,
      role,
      token,
      user: normalizedUser,
    };

    setAuth(authData);

    localStorage.setItem(
      "pcmsAuth",
      JSON.stringify(authData)
    );

    /*
     * Compatibility key used by some older API code.
     */
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setAuth(EMPTY_AUTH);

    localStorage.removeItem("pcmsAuth");
    localStorage.removeItem("token");

    sessionStorage.removeItem(
      "pcmsSelectedServiceId"
    );
  };

  const contextValue = useMemo(
    () => ({
      auth,
      login,
      logout,
      isAuthenticated:
        auth.isAuthenticated,
      role: auth.role,
      token: auth.token,
      user: auth.user,
    }),
    [auth]
  );

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}