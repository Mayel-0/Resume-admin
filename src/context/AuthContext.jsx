import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const BASE = import.meta.env.VITE_API_URL + "/api";

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState("login"); // "login" | "otp"
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch(`${BASE}/auth/me`, {
      credentials: "include",
    })
      .then((res) => {
        setIsAuthenticated(res.ok);
      })
      .catch(() => setIsAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res;
  };

  const verifyOtp = async (email, code) => {
    const res = await fetch(`${BASE}/auth/verify-otp`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    if (res.ok) setIsAuthenticated(true);
    return res;
  };

  const logout = async () => {
    await fetch(`${BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setIsAuthenticated(false);
    setStep("login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        verifyOtp,
        logout,
        loading,
        step,
        setStep,
        email,
        setEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
