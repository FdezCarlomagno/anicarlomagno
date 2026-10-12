/* eslint-disable react/prop-types -- el proyecto no usa prop-types */
import { useCallback, useEffect, useRef, useState } from 'react'
import './paintingsSlider.css'

const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

const PaintingSlider = ({ paintings, label = 'Galería de imágenes' }) => {
    const trackRef = useRef(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const total = paintings.length

    // Mantiene el índice sincronizado con el scroll nativo (swipe, flechas, teclado).
    useEffect(() => {
        const track = trackRef.current
        if (!track) return undefined
        let frame = 0
        const onScroll = () => {
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(() => {
                const i = Math.round(track.scrollLeft / track.clientWidth)
                setCurrentIndex(Math.min(Math.max(i, 0), total - 1))
            })
        }
        track.addEventListener('scroll', onScroll, { passive: true })
        return () => {
            cancelAnimationFrame(frame)
            track.removeEventListener('scroll', onScroll)
        }
    }, [total])

    const goTo = useCallback((index) => {
        const track = trackRef.current
        if (!track) return
        const target = (index + total) % total
        track.scrollTo({
            left: target * track.clientWidth,
            behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        })
    }, [total])

    const onKeyDown = (e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) }
        if (e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) }
    }

    return (
        <section className="pslider" aria-roledescription="carrusel" aria-label={label}>
            <div className="pslider-viewport">
                <ul
                    className="pslider-track"
                    ref={trackRef}
                    tabIndex={0}
                    onKeyDown={onKeyDown}
                    aria-live="polite"
                >
                    {paintings.map((painting, index) => (
                        <li
                            className="pslider-slide"
                            key={index}
                            aria-roledescription="diapositiva"
                            aria-label={`${index + 1} de ${total}`}
                        >
                            <img
                                src={painting.src}
                                alt={`Imagen ${index + 1} de ${total}`}
                                width="600"
                                height="900"
                                loading={index === 0 ? 'eager' : 'lazy'}
                                decoding="async"
                                draggable="false"
                            />
                        </li>
                    ))}
                </ul>

                {total > 1 && (
                    <>
                        <button
                            type="button"
                            className="pslider-arrow pslider-arrow--prev"
                            onClick={() => goTo(currentIndex - 1)}
                            aria-label="Imagen anterior"
                        >
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
                        </button>
                        <button
                            type="button"
                            className="pslider-arrow pslider-arrow--next"
                            onClick={() => goTo(currentIndex + 1)}
                            aria-label="Imagen siguiente"
                        >
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
                        </button>
                        <span className="pslider-counter" aria-hidden="true">
                            {currentIndex + 1} / {total}
                        </span>
                    </>
                )}
            </div>

            {total > 1 && (
                <div className="pslider-dots">
                    {paintings.map((_, index) => (
                        <button
                            type="button"
                            key={index}
                            className={`pslider-dot${currentIndex === index ? ' is-active' : ''}`}
                            onClick={() => goTo(index)}
                            aria-label={`Ir a la imagen ${index + 1}`}
                            aria-current={currentIndex === index ? 'true' : undefined}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}

export default PaintingSlider
