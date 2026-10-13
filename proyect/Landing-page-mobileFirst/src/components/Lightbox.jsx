/* eslint-disable react/prop-types -- el proyecto no usa prop-types */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './Lightbox.css';

const MIN = 1;
const MAX = 4;
const STEP = 0.5;

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

// Visor de obra a pantalla completa con zoom (botones, rueda, doble clic) y arrastre.
// Usa <dialog> nativo: trae foco atrapado, Esc para cerrar y fondo inerte.
const Lightbox = ({ src, alt, title, onClose }) => {
    const dialogRef = useRef(null);
    const stageRef = useRef(null);
    const drag = useRef(null);
    const [zoom, setZoom] = useState(MIN);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        const dialog = dialogRef.current;
        dialog.showModal();
        const html = document.documentElement;
        const prevOverflow = html.style.overflow;
        html.style.overflow = 'hidden';
        return () => {
            html.style.overflow = prevOverflow;
            dialog.close();
        };
    }, []);

    // React registra onWheel como pasivo y no deja hacer preventDefault: se engancha a mano.
    // Así la rueda solo hace zoom y nunca scrollea la página de fondo.
    useEffect(() => {
        const stage = stageRef.current;
        const onWheel = (e) => {
            e.preventDefault();
            setZoom((z) => {
                const next = clamp(z + (e.deltaY < 0 ? STEP : -STEP), MIN, MAX);
                if (next === MIN) setPos({ x: 0, y: 0 });
                return next;
            });
        };
        stage.addEventListener('wheel', onWheel, { passive: false });
        return () => stage.removeEventListener('wheel', onWheel);
    }, []);

    const applyZoom = (next) => {
        const z = clamp(next, MIN, MAX);
        setZoom(z);
        if (z === MIN) setPos({ x: 0, y: 0 });
    };

    const onPointerDown = (e) => {
        if (zoom === MIN) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
        setDragging(true);
    };
    const onPointerMove = (e) => {
        if (!drag.current) return;
        setPos({ x: e.clientX - drag.current.x, y: e.clientY - drag.current.y });
    };
    const onPointerUp = () => {
        drag.current = null;
        setDragging(false);
    };

    const onDoubleClick = () => applyZoom(zoom === MIN ? 2.5 : MIN);

    return createPortal(
        <dialog
            ref={dialogRef}
            className="lb"
            aria-label={`${title}, vista ampliada`}
            onCancel={(e) => { e.preventDefault(); onClose(); }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="lb-bar">
                <p className="lb-title">{title}</p>
                <div className="lb-tools">
                    <button type="button" className="lb-btn" onClick={() => applyZoom(zoom - STEP)} disabled={zoom <= MIN} aria-label="Alejar">−</button>
                    <button type="button" className="lb-btn" onClick={() => applyZoom(zoom + STEP)} disabled={zoom >= MAX} aria-label="Acercar">+</button>
                    <button type="button" className="lb-btn" onClick={onClose} aria-label="Cerrar">×</button>
                </div>
            </div>

            <div
                ref={stageRef}
                className={`lb-stage${zoom > MIN ? ' is-zoomed' : ''}${dragging ? ' is-dragging' : ''}`}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onDoubleClick={onDoubleClick}
            >
                <img
                    className="lb-img"
                    src={src}
                    alt={alt}
                    draggable="false"
                    style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})` }}
                />
            </div>
            <p className="lb-hint">Doble clic o rueda para acercar · arrastrá para mover</p>
        </dialog>,
        document.body,
    );
};

export default Lightbox;
