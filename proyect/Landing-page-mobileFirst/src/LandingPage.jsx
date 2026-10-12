import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Home from './Home.jsx';
import NavBar from './components/NavBar.jsx';
import Paintings from './pages/Paintings.jsx';
import AboutMe from './pages/AboutMe.jsx';
import Agendas from './pages/Agendas.jsx';
import WhatsappIcon from './components/WhatsappIcon.jsx';
import CustomAgenda from './components/customAgenda.jsx';
import ChooseForm from './components/Choose.jsx';
import CustomPainting from './components/customPainting.jsx';
import PersonalBook from './pages/personalBook.jsx';
import ScrollToTopButton from './components/ScrollToTopButton.jsx';
import Laminas from './pages/Laminas.jsx';
import Footer from './components/Footer.jsx';
import Contact from './components/contact/ContactSection.jsx'
import { privacidad } from './content/legal/privacidad.jsx';
import { terminos } from './content/legal/terminos.jsx';
import LegalPage from './pages/LegalPage.jsx';
import NotFound from './pages/NotFound.jsx';
import RouteMeta from './seo/RouteMeta.jsx';
import './LandingPage.css';


// Focus moves in script so the URL keeps no #hash and the router does not see a navigation.
const skipToContent = (e) => {
  e.preventDefault();
  document.getElementById('contenido')?.focus();
};

const LandingPage = () => {
  return (
    <BrowserRouter>
      <RouteMeta />
      <MotionConfig reducedMotion="user">
        <div className="LandingPage">
          <a className="skip-link" data-inert-con-menu href="#contenido" onClick={skipToContent}>Saltar al contenido</a>
          <NavBar />
          <WhatsappIcon />
          <ScrollToTopButton />
          <main id="contenido" tabIndex={-1} data-inert-con-menu>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </MotionConfig>
    </BrowserRouter>
  );
};

export default LandingPage;
