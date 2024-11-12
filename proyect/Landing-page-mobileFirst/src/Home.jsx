import Slider from './components/Slider.jsx'
import './LandingPage.css'
import FirstSection from './components/FirstSection.jsx'
import SecondSection from './components/SecondSection.jsx'
import AgendaSection from './components/AgendaSection.jsx'
import igSvg from './components/assets/blackInstagram.svg'
import PaintingImgsSection from './components/paintingImgsSection.jsx'

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
            <button className='btnViewOnInstagram'><a href="https://www.instagram.com/stories/highlights/17931595102459109/" target='blank'><img src={igSvg} />Ver en instagram</a></button>
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
