import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './shell.css';

const ScrollToTopButton = () => {
    const [showButton, setShowButton] = useState(false);

    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    useEffect(() => {
        const handleScroll = () => setShowButton(window.scrollY > window.innerHeight / 2);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        });
    };

    return (
        showButton && (
            <button type="button" onClick={scrollToTop} className="scrollToTopBtn" data-inert-con-menu aria-label="Volver arriba">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true" focusable="false">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                </svg>
            </button>
        )
    );
};

export default ScrollToTopButton;
