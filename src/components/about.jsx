function About() {
  return (
    <section id="apropos" className="section shell">
      <div className="section__head">
        <span className="section__index">01</span>
        <h2>À propos de moi</h2>
      </div>
      <div className="about">
        <p className="about__text">Bonjour, je m’appelle Maël LLADO. Je suis actuellement étudiant à l’école privée Ynov Campus Bordeaux, après avoir obtenu mon Baccalauréat Professionnel SN (Systèmes Numériques), option RISC, avec la mention Très Bien, au lycée polyvalent Jean-Monnet de Libourne.</p>
        <aside className="about__aside card">
          <h3>En bref</h3>
          <dl>
            <div><dt>Formation</dt><dd>Ynov Campus Bordeaux</dd></div>
            <div><dt>Diplôme</dt><dd>Bac Pro SN option RISC — Très Bien</dd></div>
            <div><dt>Localisation</dt><dd>Bordeaux, France</dd></div>
            <div><dt>Recherche</dt><dd>Alternance / stage en développement</dd></div>
          </dl>
        </aside>
      </div>
    </section>
  );
}

export default About;
