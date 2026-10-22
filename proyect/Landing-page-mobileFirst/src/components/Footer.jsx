/* eslint-disable react/prop-types -- el proyecto no usa prop-types */
import { Link } from 'react-router-dom';
import { FEATURES } from './config/features.js';
import './Footer.css';

const SHOP = [
    { to: '/obras-en-stock', label: 'Obras' },
    { to: '/agendas', label: 'Agendas y cuadernos' },
    { to: '/mi-libro', label: 'Libros' },
    { to: '/laminas', label: 'Láminas', enabled: FEATURES.laminas },
].filter(({ enabled = true }) => enabled);

const EXPLORE = [
    { to: '/', label: 'Inicio' },
    { to: '/sobre-mi', label: 'Sobre mí' },
    { to: '/contacto', label: 'Contacto' },
];

const SOCIAL = [
    { href: 'https://www.instagram.com/anicarlomagno_painting/', label: 'Instagram' },
    { href: 'https://www.tiktok.com/@anicarlomagno_painting?_t=8pSFiI1eHB7&_r=1', label: 'TikTok' },
    { href: 'https://www.facebook.com/anicarlomagno', label: 'Facebook' },
];

const Arrow = ({ diagonal }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d={diagonal ? 'M7 17L17 7M8 7h9v9' : 'M5 12h14M13 6l6 6-6 6'} />
    </svg>
);

const Footer = () => (
    <footer className="ft">
        <div className="ft-inner">
            <div className="ft-cta">
                <p className="ft-cta-eyebrow">¿Tenés una idea en mente?</p>
                <Link to="/contacto" className="ft-cta-link">
                    Escribime
                    <Arrow />
                </Link>
            </div>

            <div className="ft-grid">
                <div className="ft-brand">
                    <p className="ft-wordmark">anicarlomagno</p>
                    <p className="ft-tagline">
                        Pintura, agendas y láminas hechas a mano en Tandil, Buenos Aires.
                    </p>
                </div>

                <nav className="ft-col" aria-label="Tienda">
                    <h2 className="ft-col-title">Tienda</h2>
                    <ul>
                        {SHOP.map(({ to, label }) => (
                            <li key={to}><Link to={to}>{label}</Link></li>
                        ))}
                    </ul>
                </nav>

                <nav className="ft-col" aria-label="Explorar">
                    <h2 className="ft-col-title">Explorar</h2>
                    <ul>
                        {EXPLORE.map(({ to, label }) => (
                            <li key={to}><Link to={to}>{label}</Link></li>
                        ))}
                    </ul>
                </nav>

                <div className="ft-col">
                    <h2 className="ft-col-title">Seguime</h2>
                    <ul>
                        {SOCIAL.map(({ href, label }) => (
                            <li key={label}>
                                <a href={href} target="_blank" rel="noopener noreferrer">
                                    {label}
                                    <Arrow diagonal />
                                    <span className="ft-sr"> (se abre en una pestaña nueva)</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="ft-bottom">
                <p>© {new Date().getFullYear()} Analía Carlomagno</p>
                <p>Tandil, Argentina</p>
            </div>
        </div>
    </footer>
);

export default Footer;
