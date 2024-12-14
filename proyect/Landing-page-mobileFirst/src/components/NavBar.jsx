import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bookSvg from './assets/Book.svg';
import diamondSvg from './assets/Diamond.svg';
import homeSvg from './assets/Home.svg';
import paintBrush from './assets/PaintBrush.svg';
import Eye from './assets/Eye.svg';
import Printer from './assets/Printer.svg';
import { motion } from 'framer-motion';

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
      <Link to='/'>
        <div className="navLogo">
          <div className='contH1Nav'>
            <motion.h1
              initial={{ scale: 0, x: -100 }}
              animate={{ scale: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >anicarlomagno</motion.h1>
          </div>
          <motion.h2
            initial={{ scale: 0, x: 100 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >artista plástica</motion.h2>
        </div>
      </Link>
      <button className='btnDisplayMenu' onClick={toggleMenu}>☰</button>
      <motion.div
        className={menu ? 'displayMenu' : 'closedMenu'}
        initial={{ opacity: 0, height: 0 }}
        animate={menu ? { opacity: 1, height: 'auto' } : { opacity: 1, height: 20}}
        transition={{ duration: 0.5 }}
      >
        <motion.ul
          className={menu ? 'openMenu' : 'closedMenu'}
          initial={{ opacity: 0, height: 0 }}
          animate={menu ? { opacity: 1, height: 'auto' } : { opacity: 1, height: 20}}
          transition={{ duration: 0.5 }}
        >
          <Link onClick={handleLink} to="/"><motion.li><img className='svg' src={homeSvg} alt=""/>INICIO</motion.li></Link>
          <Link onClick={handleLink} to="/elegir"><motion.li><img className='svg' src={paintBrush} alt=""/>OBRAS</motion.li></Link>
          <Link onClick={handleLink} to="/agendas"><motion.li><img className='svg' src={bookSvg} alt=""/>AGENDAS Y CUADERNOS</motion.li></Link>
          <Link onClick={handleLink} to="/mi-libro"><motion.li><img className='svg' src={Eye} alt=""/>LIBROS</motion.li></Link>
          <Link onClick={handleLink} to="/laminas"><motion.li><img className='svg' src={Printer} alt=""/>LÁMINAS</motion.li></Link>
          <Link onClick={handleLink} to="/sobre-mi"><motion.li><img className='svg' src={diamondSvg} alt=""/>SOBRE MI</motion.li></Link>
        </motion.ul>
      </motion.div>
    </nav>
  );
}

export default NavBar;