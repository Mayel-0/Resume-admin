import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login, verifyOtp, step, setStep, email, setEmail } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erreur de connexion");
        return;
      }


      setStep("otp");
    } catch (err) {
      setError("Impossible de joindre le serveur");
    } finally {
      setLoading(false);
    }
  };

  // Étape 2 : Verification du code OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await verifyOtp(email, code);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Code OTP invalide");
        return;
      }

      setStep("login");
      navigate("/");
    } catch (err) {
      setError("Impossible de joindre le serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login">
      <div className="login__inner">
        <h1 className="login__title">Administration</h1>

        {error && <p className="login__error">{error}</p>}

        {step === "login" ? (
          <form className="login__form" onSubmit={handleLoginSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <button type="submit" disabled={loading}>
              {loading ? "Vérification…" : "Se connecter"}
            </button>
          </form>
        ) : (
          <form className="login__form" onSubmit={handleOtpSubmit}>
            <p className="login__info">
              Un code de vérification a été envoyé à <strong>{email}</strong>.
            </p>

            <label htmlFor="otp">Code OTP</label>
            <input
              type="text"
              id="otp"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
              required
              autoFocus
              autoComplete="one-time-code"
            />

            <button type="submit" disabled={loading}>
              {loading ? "Validation…" : "Valider le code"}
            </button>

            <button
              type="button"
              className="login__back-btn"
              onClick={() => {
                setStep("login");
                setError(null);
              }}
            >
              Retour à la connexion
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default Login;
