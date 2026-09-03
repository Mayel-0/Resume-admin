import { Download, Menu } from "lucide-react";

function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <a className="header__brand" href="/">
          <span>ML</span>
          <span>Maël LLADO</span>
        </a>

        <div className="header__labelAdmin">
          <span>Admin</span>
        </div>

        <nav className="header__nav" aria-label="Navigation principale">
          <a
          href="#apropos"

          >À propos</a>
          <a href="#parcours">Parcours</a>
          <a href="#competences">Compétences</a>
          <a href="#projets">Projets</a>
          <a href="#contact">Contact</a>
          <a href="#Dprojets">Détail des projets</a>
        </nav>

        <div>
          <a className="header__cv" href="/fichiers/CV_Mael_LLADO_V3.pdf" download>
            <Download size={16} aria-hidden="true" />
            Télécharger le CV
          </a>

          <button className="hide-desktop" type="button" aria-label="Ouvrir le menu">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
