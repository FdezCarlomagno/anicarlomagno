import React, { useEffect, useState } from 'react';
import './pagesStyles/paintings.css';
import Cuadro from '../components/Cuadro.jsx';
import paintings from '../objects/paintings.jsx';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

// Componente separado para el cuadro animado
const AnimatedCuadro = ({ painting }) => {
    const [ref, inView] = useInView({
        threshold: 0.05,
        triggerOnce: true
    });

    return (
        <motion.div
            className="cuadro"
            ref={ref}
            initial={{ scale: 0.9, rotate: -5, y: 20 }}
            animate={inView ? { scale: 1, rotate: 0, y: 0 } : {}}
            transition={{ duration: 0.7 }}
        >
            <Cuadro painting={painting} />
        </motion.div>
    );
};

const Paintings = () => {
    const [filteredPaintings, setFilteredPaintings] = useState(paintings);
    const [filter, setFilter] = useState('all');

    const handleFilter = (filterType) => {
        setFilter(filterType);
        
        switch(filterType) {
            case 'available':
                setFilteredPaintings(paintings.filter(cuadro => !cuadro.sold));
                break;
            case 'sold':
                setFilteredPaintings(paintings.filter(cuadro => cuadro.sold));
                break;
            default:
                setFilteredPaintings(paintings);
                break;
        }
    };

    // Efecto para inicializar con todas las pinturas
    useEffect(() => {
        setFilteredPaintings(paintings);
    }, []);

    return (
        <main className="paintings">
            <div className="titleBg">
                <h1 className='myPaintingsTitle'>Obras en stock</h1>
            </div>
            
            {/* Filtros */}
            <div className="filters-container">
                <button 
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => handleFilter('all')}
                >
                    Todas las obras
                </button>
                <button 
                    className={`filter-btn ${filter === 'available' ? 'active' : ''}`}
                    onClick={() => handleFilter('available')}
                >
                    Disponibles
                </button>
                <button 
                    className={`filter-btn ${filter === 'sold' ? 'active' : ''}`}
                    onClick={() => handleFilter('sold')}
                >
                    Vendidas
                </button>
            </div>

            <div className="paintingsColumn">
                {filteredPaintings.map((cuadro) => (
                    <AnimatedCuadro 
                        key={cuadro.name} 
                        painting={cuadro} 
                    />
                ))}
            </div>

            {filteredPaintings.length === 0 && (
                <div className="no-results">
                    <p>No se encontraron obras con este filtro.</p>
                </div>
            )}

            <div className='titleAndbtn'>
                <Link to='/obra-personalizada'>
                    <button className='btnAgenda' id='btnPainting'>Quiero mi obra</button>
                </Link>
            </div>
        </main>
    );
}

export default Paintings;