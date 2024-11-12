import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home.jsx';
import NavBar from './components/NavBar.jsx';
import Paintings from './pages/Paintings.jsx';
import AboutMe from './pages/AboutMe.jsx';
import Agendas from './pages/Agendas.jsx';
import WhatsappIcon from './components/WhatsappIcon.jsx';
import SocialMedia from './components/SocialMedia.jsx';
import PaintingInfo from './components/PaintingInfo.jsx';
import AgendaForm from './components/AgendaForm.jsx';
import ChooseForm from './components/Choose.jsx';
import CustomPainting from './components/customPainting.jsx';
import PersonalBook from './pages/personalBook.jsx';
import ScrollToTopButton from './components/ScrollToTopButton.jsx';
import Laminas from './pages/Laminas.jsx';
import FooterNavbar from './components/FooterNavbar.jsx';
import Envio from './components/Envio.jsx';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <BrowserRouter>
      <div className="LandingPage">
        <NavBar />
        <WhatsappIcon />
        <ScrollToTopButton />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/obras-en-stock" element={<Paintings />} />
          <Route path="/obra-personalizada" element={<CustomPainting />} />
          <Route path="/elegir" element={<ChooseForm />} />
          <Route path="/agendas" element={<Agendas />} />
          <Route path="/sobre-mi" element={<AboutMe />} />
          <Route path="/agenda-personalizada" element={<AgendaForm />} />
          <Route path="/mi-libro" element={<PersonalBook />} />
          <Route path="/laminas" element={<Laminas />} />
          <Route path="*" element={<Home />} /> {/* Ruta por defecto */}
        </Routes>
        <Envio />
        <FooterNavbar />
        <footer>
          <p>Copyright © {new Date().getFullYear()} Analia Carlomagno</p>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default LandingPage;
