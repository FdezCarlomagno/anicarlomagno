/* eslint-disable react/prop-types -- el proyecto no usa prop-types */
import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const PUBLIC_KEY = 'e8O1W419SxmdXAcUr'; // clave pública de EmailJS (sin cambios)

const INITIAL = { nombre: '', apellido: '', email: '', mensaje: '' };

const validate = (name, value) => {
  const v = value.trim();
  switch (name) {
    case 'nombre':
    case 'apellido':
      if (!v) return 'Este campo es obligatorio.';
      if (v.length < 2) return 'Escribí al menos 2 letras.';
      return '';
    case 'email':
      if (!v) return 'Ingresá tu email para poder responderte.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Revisá el email: parece que falta algo (ej: nombre@correo.com).';
      return '';
    case 'mensaje':
      if (!v) return 'Contame en qué te puedo ayudar.';
      if (v.length < 10) return 'Sumá un poco más de detalle (mínimo 10 caracteres).';
      return '';
    default:
      return '';
  }
};

const FIELDS = Object.keys(INITIAL);

const Check = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);

const Field = ({ id, label, error, valid, children }) => (
  <div className={`ct-field${error ? ' has-error' : ''}${valid ? ' is-valid' : ''}`}>
    <label htmlFor={id}>{label}</label>
    <div className="ct-control">
      {children}
      {valid && <span className="ct-valid-icon"><Check /></span>}
    </div>
    {error && <p className="ct-error" id={`${id}-error`} role="alert">{error}</p>}
  </div>
);

const ContactForm = () => {
  const [data, setData] = useState(INITIAL);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | failed
  const headingRef = useRef(null);

  const errors = Object.fromEntries(FIELDS.map((f) => [f, validate(f, data[f])]));
  const showError = (f) => (touched[f] && errors[f]) || '';
  const isValid = (f) => touched[f] && !errors[f];

  const update = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (status === 'failed') setStatus('idle');
  };

  const blur = (e) => setTouched((prev) => ({ ...prev, [e.target.name]: true }));

  const inputProps = (name) => ({
    id: name,
    name,
    value: data[name],
    onChange: update,
    onBlur: blur,
    required: true,
    'aria-invalid': Boolean(showError(name)),
    'aria-describedby': showError(name) ? `${name}-error` : undefined,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const invalid = FIELDS.filter((f) => errors[f]);
    if (invalid.length) {
      setTouched(Object.fromEntries(FIELDS.map((f) => [f, true])));
      document.getElementById(invalid[0])?.focus();
      return;
    }

    setStatus('sending');
    const { nombre, apellido, email, mensaje } = data;
    try {
      await emailjs.send(
        'anicarlomagno-email-serv', // Service ID
        'anica-template', // Template ID
        { nombre, apellido, email, mensaje },
        PUBLIC_KEY
      );
      setStatus('sent');
      setTimeout(() => headingRef.current?.focus(), 50);
    } catch (error) {
      console.error('FAILED...', error);
      setStatus('failed'); // se conservan los datos para reintentar
    }
  };

  const reset = () => {
    setData(INITIAL);
    setTouched({});
    setStatus('idle');
  };

  if (status === 'sent') {
    return (
      <div className="ct-card ct-success">
        <span className="ct-success-icon"><Check /></span>
        <h2 className="ct-card-title" tabIndex={-1} ref={headingRef}>¡Mensaje enviado, {data.nombre.trim()}!</h2>
        <p>Gracias por escribirme. Te respondo al email que dejaste lo antes posible.</p>
        <button type="button" className="ct-btn ct-btn--ghost" onClick={reset}>Enviar otro mensaje</button>
      </div>
    );
  }

  return (
    <form className="ct-card" onSubmit={handleSubmit} noValidate aria-labelledby="ct-form-title">
      <h2 id="ct-form-title" className="ct-card-title">Escribime un mensaje</h2>
      <p className="ct-card-text">Todos los campos son obligatorios. Te respondo por email.</p>

      <div className="ct-row">
        <Field id="nombre" label="Nombre" error={showError('nombre')} valid={isValid('nombre')}>
          <input type="text" autoComplete="given-name" {...inputProps('nombre')} />
        </Field>
        <Field id="apellido" label="Apellido" error={showError('apellido')} valid={isValid('apellido')}>
          <input type="text" autoComplete="family-name" {...inputProps('apellido')} />
        </Field>
      </div>

      <Field id="email" label="Email" error={showError('email')} valid={isValid('email')}>
        <input type="email" autoComplete="email" inputMode="email" placeholder="nombre@correo.com" {...inputProps('email')} />
      </Field>

      <Field id="mensaje" label="Mensaje" error={showError('mensaje')} valid={isValid('mensaje')}>
        <textarea rows="5" placeholder="Contame qué estás buscando o qué querés consultar…" {...inputProps('mensaje')} />
      </Field>

      {status === 'failed' && (
        <p className="ct-alert" role="alert">
          No pudimos enviar tu mensaje. Revisá tu conexión y probá de nuevo, o escribime por WhatsApp.
        </p>
      )}

      <button type="submit" className="ct-btn ct-btn--primary" disabled={status === 'sending'}>
        {status === 'sending' ? 'Enviando…' : status === 'failed' ? 'Reintentar' : 'Enviar mensaje'}
      </button>
    </form>
  );
};

export default ContactForm;
