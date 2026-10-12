import ContactForm from './ContactForm';
import GoogleMap from './GoogleMap';
import './Contact.css';

const WHATSAPP_URL = `https://api.whatsapp.com/send?phone=542494245966&text=${encodeURIComponent('Hola Ani! Quería hacerte una consulta.')}`;
const INSTAGRAM_URL = 'https://www.instagram.com/anicarlomagno_painting/';

const ContactSection = () => {

  return (
    <main id="main" className="ct">
      <header className="ct-head">
        <p className="ct-eyebrow">Contacto</p>
        <h1 className="ct-title">Hablemos</h1>
        <p className="ct-lead">
          ¿Una consulta, una idea para una obra o simplemente ganas de saludar? Escribime por el medio que prefieras.
        </p>
      </header>

      <div className="ct-layout">
        <ContactForm />

        <aside className="ct-aside" aria-label="Otras formas de contacto">
          <h2 className="ct-aside-title">Si preferís algo más rápido</h2>
          <ul className="ct-channels">
            <li>
              <a className="ct-channel ct-channel--wsp" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <span className="ct-channel-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M4 20l1.3-4.2A8 8 0 1 1 8.4 18.8L4 20z" /></svg>
                </span>
                <span className="ct-channel-body">
                  <strong>WhatsApp</strong>
                  <span>La forma más directa de hablar conmigo.</span>
                </span>
                <span className="ct-sr"> (se abre en una pestaña nueva)</span>
              </a>
            </li>
            <li>
              <a className="ct-channel ct-channel--ig" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                <span className="ct-channel-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="5" /><circle cx="12" cy="12" r="3.6" /><circle cx="17" cy="7" r="0.6" /></svg>
                </span>
                <span className="ct-channel-body">
                  <strong>Instagram</strong>
                  <span>@anicarlomagno_painting</span>
                </span>
                <span className="ct-sr"> (se abre en una pestaña nueva)</span>
              </a>
            </li>
          </ul>

          <h2 className="ct-aside-title ct-aside-title--map">Ubicación</h2>
          <GoogleMap />
        </aside>
      </div>
    </main>
  );
};

export default ContactSection;
