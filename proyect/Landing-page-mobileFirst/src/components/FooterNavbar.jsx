import React, { useState } from 'react'
import SocialMedia from './SocialMedia';
import { Link } from 'react-router-dom'
import bookSvg from './assets/Book.svg';
import diamondSvg from './assets/Diamond.svg';
import homeSvg from './assets/Home.svg';
import paintBrush from './assets/PaintBrush.svg';
import Eye from './assets/Eye.svg';
import Printer from './assets/Printer.svg'
import { Image } from "@unpic/react";


const FooterNavbar = () => {
    return (
        <div className="footer-navbar">
            <SocialMedia></SocialMedia>
            <nav className='navbar'>
                <Link to="/"><li><Image className='svg' src={homeSvg} alt="Home svg" />INICIO</li></Link>
                <Link to="/elegir"><li><Image className='svg' src={paintBrush} alt="Paintbrush svg" />OBRAS</li></Link>
                <Link to="/agendas"><li><Image className='svg' src={bookSvg} alt="Book svg" />AGENDAS Y CUADERNOS</li></Link>
                <Link to="/mi-libro"><li><Image className='svg' src={Eye} alt="Eye svg" />LIBROS</li></Link>
                <Link to="/laminas"><li><Image className='svg' src={Printer} alt="Printer svg" />LÁMINAS</li></Link>
                <Link to="/sobre-mi"><li><Image className='svg' src={diamondSvg} alt="Diamond svg" />SOBRE MI</li></Link>
            </nav>
        </div>
    )
}

export default FooterNavbar;