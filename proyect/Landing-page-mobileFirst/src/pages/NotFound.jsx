import React from 'react';
import { Link } from 'react-router-dom';
import './pagesStyles/legal.css';

const NotFound = () => {
  return (
    <article className="legal-page">
      <h1 className="legal-title">No encontré esta página</h1>
      <p>Puede que el enlace esté mal escrito o que la página haya cambiado de lugar. Seguí por acá:</p>
      <ul>
        <li><Link to="/elegir">Obras</Link></li>
        <li><Link to="/agendas">Agendas y cuadernos</Link></li>
        <li><Link to="/contacto">Contacto</Link></li>
        <li><Link to="/">Inicio</Link></li>
      </ul>
    </article>
  );
};

export default NotFound;
