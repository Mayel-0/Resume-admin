import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

/** Message d'erreur renvoyé par le back, s'il y en a un. */
async function readError(res: Response): Promise<string | null> {
  const data: unknown = await res.json().catch(() => null);
  if (typeof data === "object" && data !== null && "error" in data && typeof data.error === "string") {
    return data.error;
  }
  return null;
}

function Login() {
  const { login, verifyOtp, step, setStep, email, setEmail } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Étape 1 : Envoi direct de l'email + mot de passe
  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. On envoie l'email et le MDP pour vérification backend
      const res = await login(email, password);

      if (!res.ok) {
        // En cas d'erreur de connexion/identifiants
        setError((await readError(res)) ?? "Email ou mot de passe incorrect");
        return;
      }

      // 2. Si c'est OK, le backend a envoyé le mail OTP, on passe à l'étape "otp"
      setStep("otp");
    } catch {
      setError("Impossible de joindre le serveur");
    } finally {
      setLoading(false);
    }
  };

  // Étape 2 : Vérification du code OTP reçu par e-mail
  const handleOtpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await verifyOtp(email, code);

      if (!res.ok) {
        setError((await readError(res)) ?? "Code OTP invalide");
        return;
      }

      // Connexion validée
      setStep("login");
      navigate("/");
    } catch {
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
          /* --- Formulaire Initial : Email + MDP --- */
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
          /* --- Formulaire Secondaire : Saisie du code OTP --- */
          <form className="login__form" onSubmit={handleOtpSubmit}>
            <p className="login__info">
              Un code OTP a été envoyé à <strong>{email}</strong>.
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
              Retour
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default Login;
