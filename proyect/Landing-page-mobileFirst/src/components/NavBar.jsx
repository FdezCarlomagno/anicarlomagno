import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bookSvg from './assets/Book.svg';
import diamondSvg from './assets/Diamond.svg';
import homeSvg from './assets/Home.svg';
import paintBrush from './assets/PaintBrush.svg';
import Eye from './assets/Eye.svg';
import Printer from './assets/Printer.svg';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import contactSvg from './assets/contact.svg'
import { Image } from '@unpic/react'


const NavBar = () => {
  const [menu, setMenu] = useState(false);

  const toggleMenu = () => {
    setMenu(!menu);
  };

  const handleLink = () => {
    setMenu(false);
  };

  return (
    <nav className='navBar'>
      <Toaster/>
      <Link to='/'>
        <div className="navLogo">
          <div className='contH1Nav'>
            <motion.p
              className="navLogo-name"
              initial={{ scale: 0, x: -100 }}
              animate={{ scale: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >anicarlomagno</motion.p>
          </div>
          <motion.p
            className="navLogo-subtitle"
            initial={{ scale: 0, x: 100 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >artista plástica</motion.p>
        </div>
      </Link>
      <button
        type="button"
        className='btnDisplayMenu'
        onClick={toggleMenu}
        aria-label="Menú"
        aria-expanded={menu}
        aria-controls="menu-principal"
      >☰</button>
      <motion.div
        className={menu ? 'displayMenu' : 'closedMenu'}
        initial={{ opacity: 0, height: 0 }}
        animate={menu ? { opacity: 1, height: 'auto' } : { opacity: 1, height: 20}}
        transition={{ duration: 0.5 }}
      >
        <motion.ul
          id="menu-principal"
          className={menu ? 'openMenu' : 'closedMenu'}
          initial={{ opacity: 0, height: 0 }}
          animate={menu ? { opacity: 1, height: 'auto' } : { opacity: 1, height: 20}}
          transition={{ duration: 0.5 }}
        >
          <Link onClick={handleLink} to="/"><motion.li><Image className='svg' src={homeSvg} alt=""/>Inicio</motion.li></Link>
          <Link onClick={handleLink} to="/elegir"><motion.li><Image className='svg' src={paintBrush} alt=""/>Obras</motion.li></Link>
          <Link onClick={handleLink} to="/agendas"><motion.li><Image className='svg' src={bookSvg} alt=""/>Agendas y cuadernos</motion.li></Link>
          <Link onClick={handleLink} to="/mi-libro"><motion.li><Image className='svg' src={Eye} alt=""/>Libros</motion.li></Link>
          <Link onClick={handleLink} to="/laminas"><motion.li><Image className='svg' src={Printer} alt=""/>Láminas</motion.li></Link>
          <Link onClick={handleLink} to="/sobre-mi"><motion.li><Image className='svg' src={diamondSvg} alt=""/>Sobre mí</motion.li></Link>
          <Link onClick={handleLink} to="/contacto"><motion.li><Image className='svg' src={contactSvg} alt=""/>Contacto</motion.li></Link>
        </motion.ul>
      </motion.div>
    </nav>
  );
}

export default NavBar;