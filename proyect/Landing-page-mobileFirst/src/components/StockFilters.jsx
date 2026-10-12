/* eslint-disable react/prop-types -- el proyecto no usa prop-types */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    SHAPE_OPTIONS,
    SORT_OPTIONS,
    STATUS_OPTIONS,
    TECHNIQUE_OPTIONS,
} from '../pages/stockFilters.js';
import './StockFilters.css';

const Chip = ({ active, onClick, children }) => (
    <button type="button" className={`sf-chip${active ? ' is-active' : ''}`} aria-pressed={active} onClick={onClick}>
        {children}
    </button>
);

// Barra de búsqueda y filtros de /obras-en-stock. El estado vive en la página (y en la URL).
const StockFilters = ({ filters, counts, onChange, onReset, resultCount, total, hasActive }) => {
    const [open, setOpen] = useState(false);
    const extraActive =
        Number(Boolean(filters.technique)) +
        Number(Boolean(filters.shape)) +
        Number(filters.discount) +
        Number(filters.sort !== 'default');

    return (
        <section className="sf" aria-label="Buscar y filtrar obras">
            <div className="sf-top">
                <div className="sf-search">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
                    <input
                        type="search"
                        value={filters.q}
                        onChange={(e) => onChange({ q: e.target.value })}
                        placeholder="Buscar por nombre o técnica"
                        aria-label="Buscar obras por nombre o técnica"
                        autoComplete="off"
                        enterKeyHint="search"
                    />
                    {filters.q && (
                        <button type="button" className="sf-clear" aria-label="Borrar búsqueda" onClick={() => onChange({ q: '' })}>
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
                        </button>
                    )}
                </div>

                <div className="sf-status" role="group" aria-label="Disponibilidad">
                    {STATUS_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            className={`sf-seg${filters.status === value ? ' is-active' : ''}`}
                            aria-pressed={filters.status === value}
                            onClick={() => onChange({ status: value })}
                        >
                            {label}
                            <span className="sf-count">{counts[value]}</span>
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    className="sf-toggle"
                    aria-expanded={open}
                    aria-controls="sf-panel"
                    onClick={() => setOpen((v) => !v)}
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></svg>
                    Más filtros
                    {extraActive > 0 && <span className="sf-badge">{extraActive}</span>}
                </button>
            </div>

            <div id="sf-panel" className={`sf-panel${open ? ' is-open' : ''}`}>
                <div className="sf-panel-inner">
                    <fieldset className="sf-group">
                        <legend>Técnica</legend>
                        <div className="sf-chips">
                            {TECHNIQUE_OPTIONS.map((t) => (
                                <Chip key={t} active={filters.technique === t} onClick={() => onChange({ technique: filters.technique === t ? '' : t })}>{t}</Chip>
                            ))}
                        </div>
                    </fieldset>

                    <fieldset className="sf-group">
                        <legend>Forma</legend>
                        <div className="sf-chips">
                            {SHAPE_OPTIONS.map((s) => (
                                <Chip key={s} active={filters.shape === s} onClick={() => onChange({ shape: filters.shape === s ? '' : s })}>{s}</Chip>
                            ))}
                        </div>
                    </fieldset>

                    <fieldset className="sf-group">
                        <legend>Precio</legend>
                        <div className="sf-chips">
                            <Chip active={filters.discount} onClick={() => onChange({ discount: !filters.discount })}>Con descuento</Chip>
                        </div>
                    </fieldset>

                    <div className="sf-group">
                        <label htmlFor="sf-sort" className="sf-label">Ordenar por</label>
                        <select id="sf-sort" value={filters.sort} onChange={(e) => onChange({ sort: e.target.value })}>
                            {SORT_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="sf-meta">
                <p role="status" aria-live="polite">
                    {resultCount === total ? `${total} obras` : `${resultCount} de ${total} obras`}
                </p>
                <div className="sf-meta-actions">
                    {hasActive && (
                        <button type="button" className="sf-reset" onClick={onReset}>Limpiar filtros</button>
                    )}
                    <Link to="/obra-personalizada" className="sf-custom-link">Encargar a medida →</Link>
                </div>
            </div>
        </section>
    );
};

export default StockFilters;
