import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function AdminLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin">

      {/* ── Header ────────────────────────────────── */}
      <header className="admin__header">
        <span className="admin__header-title">Panel Admin</span>
        <button className="admin__logout" onClick={handleLogout}>
          Déconnexion
        </button>
      </header>

      <div className="admin__body">

        {/* ── Sidebar ───────────────────────────────── */}
        <nav className="admin__sidebar">
          <NavLink to="/profil">Profil</NavLink>
          <NavLink to="/sections">Sections</NavLink>
          <NavLink to="/projects">Projets</NavLink>
          <NavLink to="/timeline">Timeline</NavLink>
          <NavLink to="/socials">socials</NavLink>
          <NavLink to="/skills">Compétences</NavLink>
        </nav>

        {/* ── Contenu central ───────────────────────── */}
        <main className="admin__content">
          {children}
        </main>

      </div>
    </div>
  );
}
