import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext, type AuthContextValue, type LoginStep } from "./authContext";

const BASE = import.meta.env.VITE_API_URL + "/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState<LoginStep>("login");
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

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res;
  }, []);

  const verifyOtp = useCallback(async (email: string, code: string) => {
    const res = await fetch(`${BASE}/auth/verify-otp`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    if (res.ok) setIsAuthenticated(true);
    return res;
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setIsAuthenticated(false);
    setStep("login");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated, login, verifyOtp, logout, loading, step, setStep, email, setEmail }),
    [isAuthenticated, login, verifyOtp, logout, loading, step, email],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
