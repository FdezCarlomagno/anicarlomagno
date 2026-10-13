/* eslint-disable react/prop-types -- el proyecto no usa prop-types */
import { useState } from 'react';
import './Cuadro.css';

const LONG_TEXT = 110;

// Tarjeta de obra. Recibe una obra "enriquecida" (ver pages/stockFilters.js).
const Cuadro = ({ painting }) => {
    const [expanded, setExpanded] = useState(false);
    const isLong = (painting.description || '').length > LONG_TEXT;
    const badge = painting.sold ? 'Vendida' : painting.offer ? '40% OFF' : null;

    const handleConsultClick = (item) => {
        const message = `Hola!, estoy interesado en ${item.name}, me gustaria saber el precio de esta obra, Ani.`;
        const whatsappURL = `https://api.whatsapp.com/send?phone=542494245966&text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    };

    return (
        <article className={`pc${painting.sold ? ' is-sold' : ''}`}>
            <div className="pc-media">
                <img src={painting.src} alt={`Pintura "${painting.name}" de Ani Carlomagno`} loading="lazy" decoding="async" />
                {badge && (
                    <span className={`pc-badge${painting.sold ? ' is-sold' : ' is-offer'}`}>{badge}</span>
                )}
            </div>

            <div className="pc-body">
                <div className="pc-head">
                    <h2 className="pc-name">{painting.name}</h2>
                    {painting.sizeLabel && <span className="pc-size">{painting.sizeLabel}</span>}
                </div>

                <p className="pc-tech">
                    <span className={`pc-dot${painting.sold ? ' is-sold' : ''}`} aria-hidden="true" />
                    {painting.sold ? 'Vendida' : 'Disponible'} · {painting.technique}
                </p>

                <p className={`pc-desc${isLong && !expanded ? ' is-clamped' : ''}`}>{painting.description}</p>
                {isLong && (
                    <button
                        type="button"
                        className="pc-more"
                        aria-expanded={expanded}
                        onClick={() => setExpanded((v) => !v)}
                    >
                        {expanded ? 'Ver menos' : 'Ver más'}
                    </button>
                )}

                <button
                    type="button"
                    className="pc-cta"
                    onClick={() => handleConsultClick(painting)}
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M21 11.5a8.4 8.4 0 0 1-12.5 7.3L3 20l1.3-5A8.4 8.4 0 1 1 21 11.5z" />
                    </svg>
                    Consultar
                    <span className="pc-sr"> por {painting.name} (WhatsApp, se abre en una pestaña nueva)</span>
                </button>
            </div>
        </article>
    );
};

export default Cuadro;
