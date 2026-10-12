/* eslint-disable react/prop-types -- el proyecto no usa prop-types */
import { useMemo } from 'react';
import './pagesStyles/paintings.css';
import Cuadro from '../components/Cuadro.jsx';
import '../components/Cuadro.css';
import StockFilters from '../components/StockFilters.jsx';
import paintings from '../objects/paintings.jsx';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
    DEFAULT_FILTERS,
    SHAPE_OPTIONS,
    SORT_OPTIONS,
    STATUS_OPTIONS,
    TECHNIQUE_OPTIONS,
    applyFilters,
    enrich,
} from './stockFilters.js';

// Cada obra aparece con un fade-up suave al entrar en pantalla.
const AnimatedCuadro = ({ painting }) => {
    const reduceMotion = useReducedMotion();
    return (
        <motion.li
            className="pc-item"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
            <Cuadro painting={painting} />
        </motion.li>
    );
};

// Invitación a encargar una obra a medida: cierra la grilla, como una tarjeta más.

const CustomTile = () => (
    <li className="pc-item">
        <Link to="/obra-personalizada" className="pc-custom">
            <span className="pc-custom-eyebrow">A tu medida</span>
            <span className="pc-custom-title">¿Querés una obra única?</span>
            <span className="pc-custom-text">La pinto a mano a partir de tus fotos. Contame tu idea.</span>
            <span className="pc-custom-cta">
                Encargar mi obra
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
        </Link>
    </li>
);

const allPaintings = enrich(paintings);

// Los filtros viven en la URL (?q=&estado=...): se pueden compartir y sobreviven al volver atrás.
const readFilters = (params) => {
    const pick = (value, allowed, fallback) => (allowed.includes(value) ? value : fallback);
    return {
        q: params.get('q') || '',
        status: pick(params.get('estado'), STATUS_OPTIONS.map((o) => o.value), 'all'),
        technique: pick(params.get('tecnica'), TECHNIQUE_OPTIONS, ''),
        shape: pick(params.get('forma'), SHAPE_OPTIONS, ''),
        discount: params.get('descuento') === '1',
        sort: pick(params.get('orden'), SORT_OPTIONS.map((o) => o.value), 'default'),
    };
};

const writeFilters = (f) => {
    const params = new URLSearchParams();
    if (f.q) params.set('q', f.q);
    if (f.status !== 'all') params.set('estado', f.status);
    if (f.technique) params.set('tecnica', f.technique);
    if (f.shape) params.set('forma', f.shape);
    if (f.discount) params.set('descuento', '1');
    if (f.sort !== 'default') params.set('orden', f.sort);
    return params;
};

const Paintings = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const filters = readFilters(searchParams);

    const update = (patch) => setSearchParams(writeFilters({ ...filters, ...patch }), { replace: true });
    const reset = () => setSearchParams(writeFilters(DEFAULT_FILTERS), { replace: true });

    const filteredPaintings = useMemo(
        () => applyFilters(allPaintings, filters),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [searchParams],
    );

    const counts = {
        all: allPaintings.length,
        available: allPaintings.filter((p) => !p.sold).length,
        sold: allPaintings.filter((p) => p.sold).length,
    };
    const hasActive = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

    return (
        <main id="main" className="paintings">
            <div className="titleBg">
                <h1 className='myPaintingsTitle'>Obras en stock</h1>
            </div>

            <StockFilters
                filters={filters}
                counts={counts}
                onChange={update}
                onReset={reset}
                resultCount={filteredPaintings.length}
                total={allPaintings.length}
                hasActive={hasActive}
            />

            <ul className="pc-grid">
                {filteredPaintings.map((cuadro) => (
                    <AnimatedCuadro key={cuadro.name} painting={cuadro} />
                ))}
                {filteredPaintings.length > 0 && <CustomTile />}
            </ul>

            {filteredPaintings.length === 0 && (
                <div className="sf-empty">
                    <p className="sf-empty-title">No encontramos obras con esos filtros</p>
                    <p>Probá con otra búsqueda o sacá algún filtro.</p>
                    <div className="sf-empty-actions">
                        <button type="button" className="sf-empty-btn" onClick={reset}>Limpiar filtros</button>
                        <Link to="/obra-personalizada">¿Buscás algo distinto? Encargá una a tu medida →</Link>
                    </div>
                </div>
            )}

        </main>
    );
}

export default Paintings;
