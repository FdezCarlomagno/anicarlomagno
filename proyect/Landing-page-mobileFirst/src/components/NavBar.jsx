import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './shell.css';

const LINKS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/elegir', label: 'Obras' },
  { to: '/agendas', label: 'Agendas y cuadernos' },
  { to: '/mi-libro', label: 'Libros' },
  { to: '/laminas', label: 'Láminas' },
  { to: '/sobre-mi', label: 'Sobre mí' },
  { to: '/contacto', label: 'Contacto' },
];

// What stays behind the open menu on mobile becomes inert: no focus, no clicks, hidden from screen readers.
const BEHIND_MENU = '[data-inert-con-menu]';

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    const behind = document.querySelectorAll(BEHIND_MENU);
    behind.forEach((el) => { el.inert = open; });
    if (!open) return undefined;
    const timer = setTimeout(() => panelRef.current?.querySelector('a')?.focus(), 50);
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      behind.forEach((el) => { el.inert = false; });
    };
  }, [open]);

  return (
    <nav className="nav" aria-label="Principal">
      <Toaster />
      <Link to="/" className="nav-logo">
        <span className="nav-logo-name">anicarlomagno</span>
        <span className="nav-logo-sub">artista plástica</span>
      </Link>
      <button
        ref={toggleRef}
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="menu-principal"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'Cerrar' : 'Menú'}
      </button>
      <div className="nav-backdrop" data-open={open} onClick={() => setOpen(false)} aria-hidden="true" />
      <ul id="menu-principal" className="nav-links" data-open={open} ref={panelRef}>
        {LINKS.map(({ to, label, end }) => (
          <li key={to}>
            <NavLink to={to} end={end}>{label}</NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
