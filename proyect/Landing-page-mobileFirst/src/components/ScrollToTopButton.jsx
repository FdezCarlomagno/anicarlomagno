import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ScrollToTopButton.css';

const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false);
    const location = useLocation();

    // Al cambiar de ruta (no de #ancla) arrancamos arriba.
    useEffect(() => {
        if (!location.hash) window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al cambiar de ruta, no al ir a un #ancla
    }, [location.pathname]);

    // Scroll pasivo y agrupado por frame; solo actualiza el estado si cambia.
    useEffect(() => {
        let frame = 0;
        const update = () => {
            frame = 0;
            setVisible(window.scrollY > window.innerHeight / 2);
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [location.pathname]);

    const scrollToTop = () => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    };

    return (
        <button
            type="button"
            onClick={scrollToTop}
            className={`scroll-top${visible ? ' is-visible' : ''}`}
            aria-label="Volver arriba"
            tabIndex={visible ? 0 : -1}
            aria-hidden={visible ? undefined : true}
        >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="m5 15 7-7 7 7" />
            </svg>
        </button>
    );
};

export default ScrollToTopButton;
