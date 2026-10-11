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
                <ul className='footer-navbar-list'>
                    <li><Link to="/"><Image className='svg' src={homeSvg} alt="" />INICIO</Link></li>
                    <li><Link to="/elegir"><Image className='svg' src={paintBrush} alt="" />OBRAS</Link></li>
                    <li><Link to="/agendas"><Image className='svg' src={bookSvg} alt="" />AGENDAS Y CUADERNOS</Link></li>
                    <li><Link to="/mi-libro"><Image className='svg' src={Eye} alt="" />LIBROS</Link></li>
                    <li><Link to="/laminas"><Image className='svg' src={Printer} alt="" />LÁMINAS</Link></li>
                    <li><Link to="/sobre-mi"><Image className='svg' src={diamondSvg} alt="" />SOBRE MI</Link></li>
                </ul>
            </nav>
        </div>
    )
}

export default FooterNavbar;