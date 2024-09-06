import React from 'react'
import agenda1 from './imgs/agenda1.jpg'
import agenda2 from './imgs/agenda2.jpg'
import agenda3 from './imgs/agenda3.jpg'
import agenda4 from './imgs/agenda4.jpg'
import agenda5 from './imgs/agenda5.jpg'
import agenda6 from './imgs/agenda6.jpg'
import agenda7 from './imgs/agenda7.jpg'
import agenda8 from './imgs/agenda8.jpg'
import { Link } from 'react-router-dom'


const Agenda = ({ source, imgNumber, agendaName }) => {
    return (
        <Link  to='/agendas'>
        <article className='agendaContainer'>
            <img src={source} className={`imgAgenda${imgNumber}`}/>
        </article>
        </Link>
    )
}


const AgendaSection = () => {
    return (
        <section className='sectionAgenda'>
              <div className='agendaSlider'>  
                <Agenda source={agenda1} imgNumber={1} agendaName='Diseño 1'/>
                <Agenda source={agenda3} imgNumber={1} agendaName='Diseño 1'/>
                <Agenda source={agenda5} imgNumber={1} agendaName='Diseño 1'/>
                <Agenda source={agenda2} imgNumber={2} agendaName='Diseño 2'/>
                <Agenda source={agenda4} imgNumber={4} agendaName='Diseño 4'/>
                <Agenda source={agenda6} imgNumber={6} agendaName='Diseño 6'/>
                <Agenda source={agenda7} imgNumber={7} agendaName='Diseño 7'/>
            </div>
        </section>
    )
}

export default AgendaSection