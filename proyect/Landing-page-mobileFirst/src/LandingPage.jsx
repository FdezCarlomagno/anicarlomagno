import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Home from './Home.jsx';
import NavBar from './components/NavBar.jsx';
import Paintings from './pages/Paintings.jsx';
import AboutMe from './pages/AboutMe.jsx';
import Agendas from './pages/Agendas.jsx';
import WhatsappIcon from './components/WhatsappIcon.jsx';
import SocialMedia from './components/SocialMedia.jsx';
import PaintingInfo from './components/PaintingInfo.jsx';
import CustomAgenda from './components/customAgenda.jsx';
import ChooseForm from './components/Choose.jsx';
import CustomPainting from './components/customPainting.jsx';
import PersonalBook from './pages/personalBook.jsx';
import ScrollToTopButton from './components/ScrollToTopButton.jsx';
import Laminas from './pages/Laminas.jsx';
import FooterNavbar from './components/FooterNavbar.jsx';
import Envio from './components/Envio.jsx';
import Contact from './components/contact/ContactSection.jsx'
import { EmailLink, WhatsappLink } from './content/legal/ContactLinks.jsx';
import { OWNER_NAME } from './content/legal/contact.js';
import { privacidad } from './content/legal/privacidad.jsx';
import { terminos } from './content/legal/terminos.jsx';
import LegalPage from './pages/LegalPage.jsx';
import './LandingPage.css';


// Focus moves in script so the URL keeps no #hash and the router does not see a navigation.
const skipToContent = (e) => {
  e.preventDefault();
  document.getElementById('contenido')?.focus();
};

const LandingPage = () => {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <div className="LandingPage">
          <a className="skip-link" href="#contenido" onClick={skipToContent}>Saltar al contenido</a>
          <NavBar />
          <WhatsappIcon />
          <ScrollToTopButton />
          <main id="contenido" tabIndex={-1}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/obras-en-stock" element={<Paintings />} />
              <Route path="/obra-personalizada" element={<CustomPainting />} />
              <Route path="/elegir" element={<ChooseForm />} />
              <Route path="/agendas" element={<Agendas />} />
              <Route path="/sobre-mi" element={<AboutMe />} />
              <Route path="/agenda-personalizada" element={<CustomAgenda />} />
              <Route path="/mi-libro" element={<PersonalBook />} />
              <Route path="/laminas" element={<Laminas />} />
              <Route path='/contacto' element={<Contact />}/>
              <Route path="/privacidad" element={<LegalPage content={privacidad} />} />
              <Route path="/terminos" element={<LegalPage content={terminos} />} />
              <Route path="*" element={<Home />} /> {/* Ruta por defecto */}
            </Routes>
          </main>
          <Envio />
          <FooterNavbar />
          <footer>
            <nav className="footer-legal" aria-label="Legales">
              <ul>
                <li><Link to="/privacidad">Privacidad</Link></li>
                <li><Link to="/terminos">Términos</Link></li>
              </ul>
            </nav>
            <p className="footer-contact">
              {OWNER_NAME} · <WhatsappLink /> · <EmailLink />
            </p>
            <p>Copyright © {new Date().getFullYear()} Analía Carlomagno</p>
          </footer>
        </div>
      </MotionConfig>
    </BrowserRouter>
  );
};

export default LandingPage;
