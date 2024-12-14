import React from 'react';
import { motion, useInView } from 'framer-motion';
import agenda1 from './imgs/agenda1.jpg';
import agenda2 from './imgs/agenda2.jpg';
import agenda3 from './imgs/agenda3.jpg';
import agenda4 from './imgs/agenda4.jpg';
import agenda5 from './imgs/agenda5.jpg';
import agenda6 from './imgs/agenda6.jpg';
import agenda7 from './imgs/agenda7.jpg';
import agenda8 from './imgs/agenda8.jpg';
import { Link } from 'react-router-dom';

const Agenda = ({ source, imgNumber, agendaName, index }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true }); // Trigger animation only once

    return (
        <Link to='/agendas'>
            <motion.article 
                ref={ref}
                className='agendaContainer'
                initial={{ opacity: 0, scale: 0.8 }} // Initial state
                animate={isInView ? { opacity: 1, scale: 1 } : {}} // Animate to this state when in view
                transition={{ duration: 0.5, delay: index * 0.1 }} // Staggered delay based on index
            >
                <img src={source} className={`imgAgenda${imgNumber}`} alt={agendaName} />
            </motion.article>
        </Link>
    );
}

const AgendaSection = () => {
    const agendas = [
        { source: agenda1, imgNumber: 1, agendaName: 'Diseño 1' },
        { source: agenda3, imgNumber: 1, agendaName: 'Diseño 1' },
        { source: agenda5, imgNumber: 1, agendaName: 'Diseño 1' },
        { source: agenda2, imgNumber: 2, agendaName: 'Diseño 2' },
        { source: agenda4, imgNumber: 4, agendaName: 'Diseño 4' },
        { source: agenda6, imgNumber: 6, agendaName: 'Diseño 6' },
        { source: agenda7, imgNumber: 7, agendaName: 'Diseño 7' },
    ];

    return (
        <section className='sectionAgenda'>
            <motion.div 
                className='agendaSlider'
                initial={{ opacity: 0 }} // Initial state for the slider
                animate={{ opacity: 1 }} // Animate to this state
                transition={{ duration: 0.5 }} // Transition duration
            >
                {agendas.map((agenda, index) => (
                    <Agenda 
                        key={index} 
                        source={agenda.source} 
                        imgNumber={agenda.imgNumber} 
                        agendaName={agenda.agendaName} 
                        index={index} // Pass index to Agenda
                    />
                ))}
            </motion.div>
        </section>
    );
}

export default AgendaSection;