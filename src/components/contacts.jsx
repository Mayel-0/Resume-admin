import { MoveRight } from "lucide-react";
import useSocials from "../hooks/useSocials.js";


function Contact() {
    const {socials, loading: loadingSocials }= useSocials();

    if (loadingSocials) return <p>Chargement...</p>;

  return (
    <section id="contact" className="section shell">
      <div className="contact card">
        <div className="contact__head">
          <span className="eyebrow">Contact</span>
          <h2>Discutons de votre projet</h2>
          <p className="section__lead">
            Disponible pour une alternance, un stage ou une collaboration. Le plus simple reste
            l'e-mail — je réponds rapidement.
          </p>
        </div>

        <ul className="contact__links">
          {socials.map((social) => (
            <li key={social.order}>
              <a href={social.href} target="_blank" rel="noopener noreferrer">
                  <svg
                    viewBox={social.viewBox || social.viewbox}
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d={social.path} />
                  </svg>
                <span className="contact__label">{social.label}</span>
                <span className="contact__handle">{social.handle}</span>
                <MoveRight size={24} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Contact;
