import React, { useState } from 'react'
import SocialMedia from './SocialMedia';
import { Link } from 'react-router-dom'
import bookSvg from './assets/Book.svg';
import diamondSvg from './assets/Diamond.svg';
import homeSvg from './assets/Home.svg';
import paintBrush from './assets/PaintBrush.svg';
import Eye from './assets/Eye.svg';
import Printer from './assets/Printer.svg'

const FooterNavbar = () => {
    return (
        <div className="footer-navbar">
            <SocialMedia></SocialMedia>
            <nav className='navbar'>
                <Link to="/"><li><img className='svg' src={homeSvg} alt="" />INICIO</li></Link>
                <Link to="/elegir"><li><img className='svg' src={paintBrush} alt="" />OBRAS</li></Link>
                <Link to="/agendas"><li><img className='svg' src={bookSvg} alt="" />AGENDAS Y CUADERNOS</li></Link>
                <Link to="/mi-libro"><li><img className='svg' src={Eye} alt="" />LIBROS</li></Link>
                <Link to="/laminas"><li><img className='svg' src={Printer} alt="" />LÁMINAS</li></Link>
                <Link to="/sobre-mi"><li><img className='svg' src={diamondSvg} alt="" />SOBRE MI</li></Link>
            </nav>
        </div>
    )
}

export default FooterNavbar;