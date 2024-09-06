import React, { useState, useEffect } from 'react';
import '../LandingPage.css';
import { useLocation } from 'react-router-dom';

const ScrollToTopButton = () => {
    const [showButton, setShowButton] = useState(false);

    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

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
            <button onClick={scrollToTop} className="scrollToTopBtn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 my-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                </svg>
            </button>
        )
    );
};

export default ScrollToTopButton;



