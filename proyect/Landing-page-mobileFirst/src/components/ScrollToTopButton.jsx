import { useState, useEffect } from 'react';
import '../LandingPage.css';
import { useLocation } from 'react-router-dom';

const ScrollToTopButton = () => {
    const [showButton, setShowButton] = useState(false);

    const location = useLocation();

    useEffect(() => {
        if (!location.hash) window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al cambiar de ruta, no al ir a un #ancla
    }, [location.pathname]);

    const handleScroll = () => {
        if (window.scrollY > window.innerHeight / 2) {
            setShowButton(true);
        } else {
            setShowButton(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Hace que el scroll sea suave
        });
    };

    return (
        showButton && (
            <button type="button" onClick={scrollToTop} className="scrollToTopBtn" aria-label="Volver arriba">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 my-icon" aria-hidden="true" focusable="false">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                </svg>
            </button>
        )
    );
};

export default ScrollToTopButton;



