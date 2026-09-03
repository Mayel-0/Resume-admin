function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p>© {year} Maël LLADO — Bordeaux, France</p>
        <div className="footer__links">
          <a href="https://www.linkedin.com/in/llado-mael-54008a384/" target="_blank" rel="noopener noreferrer">Linkedin</a>
          <a href="https://github.com/Mayel-0" target="_blank" rel="noopener noreferrer">Github</a>
          <a href="mailto:llado.mael33@gmail.com" target="_blank" rel="noopener noreferrer">Gmail</a>
          <a href="/fichiers/CV_Mael_LLADO_V3.pdf" download>CV</a>
          <a href="/fichiers/PortfolioMaelLLADO.pdf" download>Portfolio</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
