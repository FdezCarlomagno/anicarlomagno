import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home.jsx';
import NavBar from './components/NavBar.jsx';
import WhatsappIcon from './components/WhatsappIcon.jsx';
import ScrollToTopButton from './components/ScrollToTopButton.jsx';
import Footer from './components/Footer.jsx';
import Envio from './components/Envio.jsx';
import RouteMeta from './seo/RouteMeta.jsx';
import './LandingPage.css';

// Cada ruta (salvo la home) se descarga recién cuando se visita: menos JavaScript al cargar.
const Paintings = lazy(() => import('./pages/Paintings.jsx'));
const AboutMe = lazy(() => import('./pages/AboutMe.jsx'));
const Agendas = lazy(() => import('./pages/Agendas.jsx'));
const CustomAgenda = lazy(() => import('./components/customAgenda.jsx'));
const ChooseForm = lazy(() => import('./components/Choose.jsx'));
const CustomPainting = lazy(() => import('./components/customPainting.jsx'));
const PersonalBook = lazy(() => import('./pages/personalBook.jsx'));
const Laminas = lazy(() => import('./pages/Laminas.jsx'));
const Contact = lazy(() => import('./components/contact/ContactSection.jsx'));

// Salto al contenido: el <main> de cada página recibe el foco.
const skipToContent = (e) => {
  const main = document.querySelector('main');
  if (!main) return;
  e.preventDefault();
  main.setAttribute('tabindex', '-1');
  main.focus();
  main.scrollIntoView();
};

const LandingPage = () => {
  return (
    <BrowserRouter>
      <div className="LandingPage">
        <a className="skip-link" href="#main" onClick={skipToContent}>Saltar al contenido</a>
        <RouteMeta />
        <NavBar />
        <WhatsappIcon />
        <ScrollToTopButton />
        {/* Envio y Footer van dentro del Suspense: así no "saltan" mientras se descarga la página (CLS). */}
        <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-busy="true" />}>
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
            <Route path="*" element={<Home />} /> {/* Ruta por defecto */}
          </Routes>
          <Envio />
          <Footer />
        </Suspense>
      </div>
    </BrowserRouter>
  );
};

export default LandingPage;
