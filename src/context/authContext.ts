import { createContext, useContext } from "react";

/** Étape du formulaire de connexion : identifiants, puis code reçu par e-mail. */
export type LoginStep = "login" | "otp";

export interface AuthContextValue {
  isAuthenticated: boolean;
  /** Vrai tant qu'on ne sait pas encore si la session est valide */
  loading: boolean;
  login: (email: string, password: string) => Promise<Response>;
  verifyOtp: (email: string, code: string) => Promise<Response>;
  logout: () => Promise<void>;
  step: LoginStep;
  setStep: (step: LoginStep) => void;
  email: string;
  setEmail: (email: string) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>");
  return value;
}
