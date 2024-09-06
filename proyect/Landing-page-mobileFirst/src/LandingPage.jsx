// LandingPage.jsx
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './Home.jsx';
import NavBar from './components/NavBar.jsx';
import Paintings from './pages/Paintings.jsx';
import AboutMe from './pages/AboutMe.jsx';
import Agendas from './pages/Agendas.jsx';
import WhatsappIcon from './components/WhatsappIcon.jsx'
import SocialMedia from './components/SocialMedia.jsx';
import PaintingInfo from './components/PaintingInfo.jsx';
import AgendaForm from './components/AgendaForm.jsx'
import ChooseForm  from './components/Choose.jsx';
import customPainting from './components/customPainting.jsx'
import personalBook from './pages/personalBook.jsx'
import ScrollToTopButton from './components/ScrollToTopButton.jsx';
import Laminas from './pages/Laminas.jsx'
import FooterNavbar from './components/FooterNavbar.jsx';
import Envio from './components/Envio.jsx'
import './LandingPage.css';

const LandingPage = () => {

    return (
        <BrowserRouter>
            <div className="LandingPage">
                <NavBar />
                <WhatsappIcon />
                <ScrollToTopButton />
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/obras-en-stock" component={Paintings} />
                    <Route path="/obra-personalizada" component={customPainting} />
                    <Route path="/elegir" component={ChooseForm} />
                    <Route path="/agendas" component={Agendas} />
                    <Route path="/sobre-mi"  component={AboutMe} />
                    <Route path="/agenda-personalizada" component={AgendaForm} />
                    <Route path="/mi-libro" component={personalBook} />
                    <Route path="/laminas" component={Laminas} />
                    <Route component={Home} />
                </Switch>
                <Envio></Envio>
                <FooterNavbar />
                <footer>
                    <p>Copyright © 2024 Analia Carlomagno</p>
                </footer>
            </div>
        </BrowserRouter>
    );
}

export default LandingPage;
