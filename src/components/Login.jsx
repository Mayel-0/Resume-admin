import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);


    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // alert(`Status: ${res.status} | Réponse: ${JSON.stringify(data)}`);

      if (!res.ok) {
        setError(data.error ?? "Erreur de connexion");
        return;
      }

      login(data.token);
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

        <form className="login__form" onSubmit={handleSubmit}>

          {error && <p className="login__error">{error}</p>}

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
            {loading ? "Connexion…" : "Se connecter"}
          </button>

        </form>
      </div>
    </section>
  );
}

export default Login;
