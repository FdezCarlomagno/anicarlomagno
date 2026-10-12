import { Link, NavLink } from 'react-router-dom'
import { EmailLink, WhatsappLink } from '../content/legal/ContactLinks.jsx'
import { OWNER_NAME } from '../content/legal/contact.js'
import './shell.css'

const PAGES = [
    { to: '/', label: 'Inicio', end: true },
    { to: '/elegir', label: 'Obras' },
    { to: '/agendas', label: 'Agendas y cuadernos' },
    { to: '/mi-libro', label: 'Libros' },
    { to: '/laminas', label: 'Láminas' },
    { to: '/sobre-mi', label: 'Sobre mí' },
    { to: '/contacto', label: 'Contacto' },
]

const SOCIAL = [
    { href: 'https://www.instagram.com/anicarlomagno_painting/', label: 'Instagram' },
    { href: 'https://www.tiktok.com/@anicarlomagno_painting?_t=8pSFiI1eHB7&_r=1', label: 'TikTok' },
    { href: 'https://www.facebook.com/anicarlomagno', label: 'Facebook' },
]

const Footer = () => (
    <footer className="footer" data-inert-con-menu>
        <div className="footer-grid">
            <section className="footer-brand" aria-labelledby="footer-brand-title">
                <h2 id="footer-brand-title" className="footer-signature">anicarlomagno</h2>
                <p>Realizamos envíos a todo el país.</p>
            </section>
            <nav aria-labelledby="footer-pages-title">
                <h2 id="footer-pages-title" className="footer-title">Navegá</h2>
                <ul>
                    {PAGES.map(({ to, label, end }) => (
                        <li key={to}><NavLink to={to} end={end}>{label}</NavLink></li>
                    ))}
                </ul>
            </nav>
            <nav aria-labelledby="footer-social-title">
                <h2 id="footer-social-title" className="footer-title">Seguime</h2>
                <ul>
                    {SOCIAL.map(({ href, label }) => (
                        <li key={label}>
                            <a href={href} target="_blank" rel="noopener noreferrer">
                                {label}<span className="visually-hidden"> (se abre en una pestaña nueva)</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
        <div className="footer-bottom">
            <nav aria-label="Legales">
                <ul>
                    <li><Link to="/privacidad">Privacidad</Link></li>
                    <li><Link to="/terminos">Términos</Link></li>
                </ul>
            </nav>
            <p>{OWNER_NAME} · <WhatsappLink /> · <EmailLink /></p>
            <p>Copyright © {new Date().getFullYear()} Analía Carlomagno</p>
        </div>
    </footer>
)

export default Footer
