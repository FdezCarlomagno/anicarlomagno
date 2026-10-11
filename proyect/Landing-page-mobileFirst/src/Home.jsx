import Slider from './components/Slider.jsx'
import './LandingPage.css'
import FirstSection from './components/FirstSection.jsx'
import SecondSection from './components/SecondSection.jsx'
import AgendaSection from './components/AgendaSection.jsx'
import igSvg from './components/assets/blackInstagram.svg'
import PaintingImgsSection from './components/paintingImgsSection.jsx'
import { motion } from 'framer-motion';
import { Image } from '@unpic/react'


function Home() {


  return (
    <>
      <main>
        <header>
          <div className="imageSlider">
            <Slider />
          </div>
        </header>
        <section>
          <FirstSection />
          <h2 className='titleAgendas'>Agendas</h2>
          <AgendaSection />
          <div className="viewOnInstagram">
            <a className='btnViewOnInstagram' href="https://www.instagram.com/stories/highlights/17931595102459109/" target="_blank" rel="noopener noreferrer" aria-label="Ver en instagram (se abre en una pestaña nueva)"><Image src={igSvg} alt="" />Ver en instagram</a>
          </div>
          
        </section>
        <section className='father-paintingsSection'>
        <PaintingImgsSection />
        </section>
        <SecondSection />
      </main>
    </>
  )
}

export default Home
