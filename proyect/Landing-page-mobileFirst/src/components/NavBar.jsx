import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bookSvg from './assets/Book.svg';
import diamondSvg from './assets/Diamond.svg';
import homeSvg from './assets/Home.svg';
import paintBrush from './assets/PaintBrush.svg';
import Eye from './assets/Eye.svg';
import Printer from './assets/Printer.svg'

const NavBar = () => {
  const [menu, setMenu] = useState(false);

  const toggleMenu = () => {
    setMenu(!menu);
  };
  const handleLink = () => {
    setMenu(false)
  }

  return (
    <nav className='navBar'>
      <Link to='/'>
      <div className="navLogo">
        <div className='contH1Nav'>
          <h1>anicarlomagno</h1>
        </div>
        <h2>artista plástica</h2>
      </div>
      </Link>
      <div className={menu ? 'displayMenu' : ''}>
        <ul className={menu ? 'openMenu' : 'closedMenu'}>
          <Link onClick={handleLink} to="/"><li><img className='svg' src={homeSvg} alt=""/>INICIO</li></Link>
          <Link onClick={handleLink} to="/elegir"><li><img className='svg' src={paintBrush} alt=""/>OBRAS</li></Link>
          <Link onClick={handleLink} to="/agendas"><li><img className='svg' src={bookSvg} alt=""/>AGENDAS Y CUADERNOS</li></Link>
          <Link onClick={handleLink} to="/mi-libro"><li><img className='svg' src={Eye} alt=""/>LIBROS</li></Link>
          <Link onClick={handleLink} to="/laminas"><li><img className='svg' src={Printer} alt=""/>LÁMINAS</li></Link>
          <Link onClick={handleLink} to="/sobre-mi"><li><img className='svg' src={diamondSvg} alt=""/>SOBRE MI</li></Link>
        </ul>
      </div>
      <button className='btnDisplayMenu' onClick={toggleMenu}>☰</button>
    </nav>
  );
}

export default NavBar;
