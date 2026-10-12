import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import bookSvg from './assets/Book.svg';
import diamondSvg from './assets/Diamond.svg';
import homeSvg from './assets/Home.svg';
import paintBrush from './assets/PaintBrush.svg';
import Eye from './assets/Eye.svg';
import Printer from './assets/Printer.svg';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import contactSvg from './assets/contact.svg'
import { Image } from '@unpic/react'
import './NavBar.css';

const LINKS = [
  { to: '/', label: 'Inicio', icon: homeSvg },
  { to: '/elegir', label: 'Obras', icon: paintBrush },
  { to: '/agendas', label: 'Agendas y cuadernos', icon: bookSvg },
  { to: '/mi-libro', label: 'Libros', icon: Eye },
  { to: '/laminas', label: 'Láminas', icon: Printer },
  { to: '/sobre-mi', label: 'Sobre mí', icon: diamondSvg },
  { to: '/contacto', label: 'Contacto', icon: contactSvg, cta: true },
];

const NavBar = () => {
  const [menu, setMenu] = useState(false);
  const toggleRef = useRef(null);
  const firstLinkRef = useRef(null);

  const [scrolled, setScrolled] = useState(false);

  const closeMenu = () => setMenu(false);

  // La barra se compacta y gana sombra al bajar.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mientras el menú está abierto: bloquea el scroll, cierra con Escape
  // y devuelve el foco al botón al cerrar.
  useEffect(() => {
    if (!menu) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstLinkRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenu(false);
        toggleRef.current?.focus();
      }
    };
    // Si se agranda la ventana hasta desktop, el overlay deja de existir.
    const mq = window.matchMedia('(min-width: 768px)');
    const onMq = (e) => { if (e.matches) setMenu(false); };

    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [menu]);

  return (
    <nav className={`navBar${scrolled ? ' is-scrolled' : ''}`} aria-label='Principal'>
      <Toaster/>
      <Link to='/' className='navLogoLink' onClick={closeMenu} aria-label='anicarlomagno, artista plástica — Inicio'>
        <div className="navLogo">
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >anicarlomagno</motion.h1>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >artista plástica</motion.h2>
        </div>
      </Link>

      <button
        ref={toggleRef}
        type='button'
        className={`btnDisplayMenu${menu ? ' isOpen' : ''}`}
        onClick={() => setMenu((m) => !m)}
        aria-expanded={menu}
        aria-controls='nav-menu'
        aria-label={menu ? 'Cerrar menú' : 'Abrir menú'}
      >
        <span className='burger' aria-hidden='true'>
          <span /><span />
        </span>
      </button>

      <div id='nav-menu' className={`navMenu${menu ? ' isOpen' : ''}`}>
        <ul className='navMenuList'>
          {LINKS.map(({ to, label, icon, cta }, i) => (
            <li key={to} style={{ '--i': i }}>
              <NavLink
                to={to}
                end={to === '/'}
                className={cta ? 'navCta' : undefined}
                onClick={closeMenu}
                ref={i === 0 ? firstLinkRef : undefined}
              >
                <span className='navMenuNum' aria-hidden='true'>{String(i + 1).padStart(2, '0')}</span>
                <span className='navMenuLabel'>{label}</span>
                <Image className='svg navMenuIcon' src={icon} alt='' width={24} height={24} />
              </NavLink>
            </li>
          ))}
        </ul>
        <p className='navMenuFoot'>anicarlomagno · artista plástica</p>
      </div>
    </nav>
  );
}

export default NavBar;
