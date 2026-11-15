import Hero from './components/Hero.jsx'
import './LandingPage.css'
import FirstSection from './components/FirstSection.jsx'
import SecondSection from './components/SecondSection.jsx'
import AgendaSection from './components/AgendaSection.jsx'
import PaintingImgsSection from './components/paintingImgsSection.jsx'
import ObjetosTeaser from './components/ObjetosTeaser.jsx'
import { FEATURES } from './components/config/features.js'


function Home() {


  return (
    <>
      <main id="main">
        <header>
          <Hero />
        </header>
        {/* Primero las obras, después lo nuevo y los productos, al final quién es Ani */}
        <section id="contenido">
          <PaintingImgsSection />
          {FEATURES.objetos && <ObjetosTeaser />}
          <AgendaSection />
          <FirstSection />
        </section>
        <SecondSection />
      </main>
    </>
  )
}

export default Home
