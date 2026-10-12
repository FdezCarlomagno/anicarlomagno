import wspIcon from './assets/wspIcon.svg'

// Mismo número y mismo mensaje que antes; ahora es un enlace real (foco, teclado, lector de pantalla).
const message = `Hola Ani, Fui redireccionado/a de tu pagina web hacia tu contacto, como estas?`;
const whatsappURL = `https://api.whatsapp.com/send?phone=542494245966&text=${encodeURIComponent(message)}`;

const WhatsappIcon = () => (
    <a
        className="whatsappIcon"
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribir a Ani por WhatsApp (se abre en una pestaña nueva)"
    >
        <img src={wspIcon} alt="" width="38" height="38" />
    </a>
);

export default WhatsappIcon;
