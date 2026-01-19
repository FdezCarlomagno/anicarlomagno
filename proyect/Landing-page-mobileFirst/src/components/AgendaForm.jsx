import React, { useState } from 'react';
import '../pages/pagesStyles/agendas.css';
import DropDownImgs from './DropDownImgs';
import AgendaPreview from './AgendaPreview';
import { agendaPrices } from './config/AgendaPrices';
import cuadernoA41 from '../components/imgs/cuadernoA4/cuadernoA4-1.jpeg';
import cuadernoA42 from '../components/imgs/cuadernoA4/cuadernoA4-2.jpeg';
import cuadernoA43 from '../components/imgs/cuadernoA4/cuadernoA4-3.jpeg';
import cuadernoA44 from '../components/imgs/cuadernoA4/cuadernoA4-4.jpeg';
import cuadernoA45 from '../components/imgs/cuadernoA4/cuadernoA4-5.jpeg';
import cuadernoA46 from '../components/imgs/cuadernoA4/cuadernoA4-6.jpeg';
import cuadernoA47 from '../components/imgs/cuadernoA4/cuadernoA4-7.jpeg';

const AgendaForm = () => {
    const cuadernoA4Images = [
        { src: cuadernoA41, alt: 'Cuaderno A4 - Vista 1' },
        { src: cuadernoA42, alt: 'Cuaderno A4 - Vista 2' },
        { src: cuadernoA43, alt: 'Cuaderno A4 - Vista 3' },
        { src: cuadernoA44, alt: 'Cuaderno A4 - Vista 4' },
        { src: cuadernoA45, alt: 'Cuaderno A4 - Vista 5' },
        { src: cuadernoA46, alt: 'Cuaderno A4 - Vista 6' },
        { src: cuadernoA47, alt: 'Cuaderno A4 - Vista 7' }
    ];

    const [agendaPrice, setAgendaPrice] = useState(0);
    const [formQuote, setFormQuote] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [selectedGalleryImage, setSelectedGalleryImage] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const [formData, setFormData] = useState({
        type: '',
        username: '',
        paper: '',
        fontColor: '#000000',
        textDirection: '',
        other: '',
        bgImg: '',
        quote: null,
        price: agendaPrice,
        checkbox: false,
        name: selectedImage
    });

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'username':
                if (value && (value.length < 3 || value.length > 12)) {
                    error = 'El nombre debe tener entre 3 y 12 caracteres';
                }
                break;
            case 'fontColor':
                if (formData.username && !value) {
                    error = 'Selecciona un color para el nombre';
                }
                break;
            case 'textDirection':
                if (formData.username && !value) {
                    error = 'Selecciona dónde ubicar el nombre';
                }
                break;
            case 'quote':
                if (formData.checkbox && (!value || value.trim() === '')) {
                    error = 'Ingresa la frase que deseas';
                }
                break;
            case 'bgImg':
                if (!value) {
                    error = 'Selecciona una obra para el fondo';
                }
                break;
            default:
                break;
        }

        return error;
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched({ ...touched, [name]: true });
        const error = validateField(name, value);
        setErrors({ ...errors, [name]: error });
    };

    const handleImageClick = (image, nombre) => {
        setSelectedImage(image);
        setFormData((prevFormData) => ({
            ...prevFormData,
            name: nombre,
            bgImg: image,
        }));
        setTouched({ ...touched, bgImg: true });
        const error = validateField('bgImg', image);
        setErrors({ ...errors, bgImg: error });
    };

        const calculatePrice = (type, hasQuote) => {
        let basePrice = 0;

        switch (type) {
            case 'agenda-perpetua':
                basePrice = agendaPrices.AGENDA_PERPETUA;
                break;
            case 'agenda-semanal':
                basePrice = agendaPrices.AGENDA_SEMANAL;
                break;
            case 'agenda-docente':
                basePrice = agendaPrices.AGENDA_DOCENTE;
                break;
            case 'cuaderno':
                basePrice = agendaPrices.CUADERNO;
                break;
            case 'cuaderno-a4':
                basePrice = agendaPrices.CUADERNO_A4;
                break;
            default:
                basePrice = 0;
        }

        if (hasQuote) {
            basePrice += agendaPrices.ADICION_DE_FRASE;
        }

        return basePrice;
    };


    const handleChange = (e) => {
        const { name, value, checked } = e.target;

        setFormData((prevFormData) => {
            const updated = {
                ...prevFormData,
                [name]: name === 'checkbox' ? checked : value,
            };

            const newPrice = calculatePrice(
            name === 'type' ? value : updated.type,
            name === 'checkbox' ? checked : updated.checkbox
        );

            if (name === 'checkbox') {
                setFormQuote(checked);
            }

            setAgendaPrice(newPrice);

            return updated;
        });

        // Validación inline al escribir
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors({ ...errors, [name]: error });
        }
    };

    const playSuccessSound = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    };

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3500);
    };

    const buildWhatsAppMessage = () => {
        let message = `¡Hola! Me gustaría encargar:\n\n`;
        message += `📋 *Tipo:* ${formData.type.replace('-', ' ').toUpperCase()}\n`;
        message += `📄 *Papel:* ${formData.paper.charAt(0).toUpperCase() + formData.paper.slice(1)} 80g\n`;
        message += `🎨 *Obra:* ${formData.name}\n`;

        if (formData.username) {
            message += `✏️ *Nombre:* ${formData.username}\n`;
            message += `🎨 *Color nombre:* ${formData.fontColor}\n`;
            message += `📍 *Ubicación:* ${formData.textDirection.replace('-', ' ')}\n`;
        }

        if (formData.quote) {
            message += `💭 *Frase:* ${formData.quote}\n`;
        }

        if (formData.other) {
            message += `💬 *Comentarios:* ${formData.other}\n`;
        }

        message += `\n💰 *Total: $${agendaPrice}*`;

        return encodeURIComponent(message);
    };

    const handleFormSubmit = (e) => {
  e.preventDefault();

  // 🔎 Validaciones
  const newErrors = {};
  Object.keys(formData).forEach((key) => {
    const error = validateField(key, formData[key]);
    if (error) newErrors[key] = error;
  });

  if (!formData.type || !formData.paper) {
    showToastMessage('❌ Por favor completa todos los campos obligatorios');
    return;
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    setTouched(
      Object.keys(formData).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      )
    );
    showToastMessage('❌ Por favor corrige los errores en el formulario');
    return;
  }

  // ⏳ Feedback inmediato
  setIsProcessing(true);
  showToastMessage('⏳ Preparando tu pedido...');

  // 🔑 ABRIR WHATSAPP INMEDIATAMENTE (evita popup blocked)
  const whatsappURL = `https://api.whatsapp.com/send?phone=542494245966&text=${buildWhatsAppMessage()}`;
  window.open(whatsappURL, '_blank');

  // ✅ Feedback posterior + reset
  setTimeout(() => {
    showToastMessage('✅ ¡Pedido enviado!');
    playSuccessSound();
    setIsProcessing(false);

    // 🔄 Reset form
    setFormData({
      type: '',
      username: '',
      paper: '',
      fontColor: '#000000',
      textDirection: '',
      other: '',
      bgImg: '',
      quote: null,
      price: 0,
      checkbox: false,
      name: null
    });

    setSelectedImage(null);
    setAgendaPrice(0);
    setFormQuote(false);
    setErrors({});
    setTouched({});
  }, 2000);
};


    const nameStyles = {
        color: formData.fontColor || '#000000',
        fontFamily: 'Dancing Script',
    };

    const isFormValid = () => {
        if (!formData.type || !formData.paper || !formData.bgImg) return false;
        if (formData.username && (!formData.fontColor || !formData.textDirection)) return false;
        if (formData.checkbox && !formData.quote) return false;
        return true;
    };

    return (
        <>
            {showToast && (
                <div className="toast-notification">
                    {toastMessage}
                </div>
            )}

            <main className='agendaCustomization'>
                <div className='form-section'>
                    <div className='formContainer'>
                        <form onSubmit={handleFormSubmit}>
                            <div className='title-agenda-customization'>
                                <h1>Personaliza tu agenda o cuaderno</h1>
                                <p>Completa los campos para crear tu diseño único</p>
                            </div>

                            <fieldset className='form-group'>
                                <legend>Tipo de agenda <span className='required'>*</span></legend>
                                <div className='radio-group'>
                                    <label className='radio-option'>
                                        <input
                                            type="radio"
                                            name="type"
                                            value="agenda-perpetua"
                                            checked={formData.type === 'agenda-perpetua'}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className='radio-content'>
                                            <span className='radio-label'>Perpetua</span>
                                            <span className='radio-price'>${agendaPrices.AGENDA_PERPETUA}</span>
                                        </div>
                                    </label>

                                    <label className='radio-option'>
                                        <input
                                            type="radio"
                                            name="type"
                                            value="agenda-semanal"
                                            checked={formData.type === 'agenda-semanal'}
                                            onChange={handleChange}
                                        />
                                        <div className='radio-content'>
                                            <span className='radio-label'>Semanal {new Date().getFullYear() + 1}</span>
                                            <span className='radio-price'>${agendaPrices.AGENDA_SEMANAL}</span>
                                        </div>
                                    </label>

                                    <label className='radio-option'>
                                        <input
                                            type="radio"
                                            name="type"
                                            value="agenda-docente"
                                            checked={formData.type === 'agenda-docente'}
                                            onChange={handleChange}
                                        />
                                        <div className='radio-content'>
                                            <span className='radio-label'>Agenda Docente</span>
                                            <span className='radio-price'>${agendaPrices.AGENDA_DOCENTE}</span>
                                        </div>
                                    </label>

                                    <label className='radio-option'>
                                        <input
                                            type="radio"
                                            name="type"
                                            value="cuaderno"
                                            checked={formData.type === 'cuaderno'}
                                            onChange={handleChange}
                                        />
                                        <div className='radio-content'>
                                            <span className='radio-label'>Cuaderno</span>
                                            <span className='radio-price'>${agendaPrices.CUADERNO}</span>
                                        </div>
                                    </label>

                                    <label className='radio-option radio-option-new'>
                                        <input
                                            type="radio"
                                            name="type"
                                            value="cuaderno-a4"
                                            checked={formData.type === 'cuaderno-a4'}
                                            onChange={handleChange}
                                        />
                                        <div className='radio-content'>
                                            <span className='radio-label'>
                                                Cuaderno A4
                                                <span className='badge-new'>NUEVO</span>
                                            </span>
                                            <span className='radio-price'>${agendaPrices.CUADERNO_A4}</span>
                                        </div>
                                    </label>
                                </div>
                            </fieldset>

                            <fieldset className='form-group'>
                                <legend>Tipo de papel <span className='required'>*</span></legend>
                                <div className='radio-group radio-group-compact'>
                                    <label className='radio-option radio-option-small'>
                                        <input
                                            type="radio"
                                            name="paper"
                                            value="blanco"
                                            checked={formData.paper === 'blanco'}
                                            onChange={handleChange}
                                            required
                                        />
                                        <span className='radio-label'>Blanco 80g</span>
                                    </label>

                                    <label className='radio-option radio-option-small'>
                                        <input
                                            type="radio"
                                            name="paper"
                                            value="natural"
                                            checked={formData.paper === 'natural'}
                                            onChange={handleChange}
                                        />
                                        <span className='radio-label'>Natural 80g</span>
                                    </label>
                                </div>
                            </fieldset>

                            <div className='form-group'>
                                <label className='form-label'>
                                    Obra de fondo <span className='required'>*</span>
                                </label>
                                <DropDownImgs onImageClick={handleImageClick} selectedImage={selectedImage} />
                                {touched.bgImg && errors.bgImg && (
                                    <span className='error-message'>{errors.bgImg}</span>
                                )}
                                {selectedImage && (
                                    <div className='selected-artwork'>
                                        ✓ Obra seleccionada: {formData.name}
                                    </div>
                                )}
                            </div>

                            <div className='form-group'>
                                <label className='form-label' htmlFor="username">
                                    Nombre (opcional)
                                    <span className='help-text'>Entre 3 y 12 caracteres</span>
                                </label>
                                <input
                                    id="username"
                                    className={`form-input ${touched.username && errors.username ? 'input-error' : ''} ${touched.username && !errors.username && formData.username ? 'input-success' : ''}`}
                                    type="text"
                                    name="username"
                                    placeholder='Ej: María'
                                    minLength={3}
                                    maxLength={12}
                                    value={formData.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {touched.username && errors.username && (
                                    <span className='error-message'>{errors.username}</span>
                                )}
                            </div>

                            {formData.username && (
                                <div className='conditional-fields'>
                                    <div className='form-group'>
                                        <label className='form-label' htmlFor="fontColor">
                                            Color del nombre <span className='required'>*</span>
                                        </label>
                                        <input
                                            id="fontColor"
                                            className='form-input-color'
                                            type="color"
                                            name="fontColor"
                                            value={formData.fontColor}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {touched.fontColor && errors.fontColor && (
                                            <span className='error-message'>{errors.fontColor}</span>
                                        )}
                                    </div>

                                    <fieldset className='form-group'>
                                        <legend>Ubicación del nombre <span className='required'>*</span></legend>
                                        <div className='radio-group radio-grid'>
                                            <label className='radio-option radio-option-small'>
                                                <input
                                                    type="radio"
                                                    name="textDirection"
                                                    value="arriba-izquierda"
                                                    checked={formData.textDirection === 'arriba-izquierda'}
                                                    onChange={handleChange}
                                                />
                                                <span className='radio-label'>↖ Arriba Izq.</span>
                                            </label>
                                            <label className='radio-option radio-option-small'>
                                                <input
                                                    type="radio"
                                                    name="textDirection"
                                                    value="arriba-derecha"
                                                    checked={formData.textDirection === 'arriba-derecha'}
                                                    onChange={handleChange}
                                                />
                                                <span className='radio-label'>↗ Arriba Der.</span>
                                            </label>
                                            <label className='radio-option radio-option-small'>
                                                <input
                                                    type="radio"
                                                    name="textDirection"
                                                    value="abajo-izquierda"
                                                    checked={formData.textDirection === 'abajo-izquierda'}
                                                    onChange={handleChange}
                                                />
                                                <span className='radio-label'>↙ Abajo Izq.</span>
                                            </label>
                                            <label className='radio-option radio-option-small'>
                                                <input
                                                    type="radio"
                                                    name="textDirection"
                                                    value="abajo-derecha"
                                                    checked={formData.textDirection === 'abajo-derecha'}
                                                    onChange={handleChange}
                                                />
                                                <span className='radio-label'>↘ Abajo Der.</span>
                                            </label>
                                        </div>
                                        {touched.textDirection && errors.textDirection && (
                                            <span className='error-message'>{errors.textDirection}</span>
                                        )}
                                    </fieldset>
                                </div>
                            )}

                            <div className='form-group'>
                                <label className='checkbox-label'>
                                    <input
                                        type="checkbox"
                                        name="checkbox"
                                        checked={formData.checkbox}
                                        onChange={handleChange}
                                    />
                                    <span>Agregar frase personalizada</span>
                                </label>
                            </div>

                            {formQuote && (
                                <div className='form-group'>
                                    <label className='form-label' htmlFor="quote">
                                        Tu frase <span className='required'>*</span>
                                    </label>
                                    <textarea
                                        id="quote"
                                        className={`form-textarea ${touched.quote && errors.quote ? 'input-error' : ''}`}
                                        name="quote"
                                        placeholder='Escribe una frase inspiradora...'
                                        value={formData.quote || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        rows="3"
                                    />
                                    {touched.quote && errors.quote && (
                                        <span className='error-message'>{errors.quote}</span>
                                    )}
                                </div>
                            )}

                            <div className='form-group'>
                                <label className='form-label' htmlFor="other">
                                    Comentarios adicionales
                                </label>
                                <textarea
                                    id="other"
                                    className='form-textarea'
                                    name="other"
                                    placeholder='Cualquier detalle adicional...'
                                    value={formData.other}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>

                            <div className='form-submit'>
                                <button
                                    className='btn-submit'
                                    type="submit"
                                    disabled={!isFormValid() || isProcessing}
                                >
                                    {isProcessing ? '⏳ Procesando...' : '🛒 Encargar pedido'}
                                </button>
                                <div className='price-display'>
                                    <span className='price-label'>Total:</span>
                                    <span className='price-value'>${agendaPrice}</span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <AgendaPreview
                    formData={formData}
                    nameStyles={nameStyles}
                    selectedImage={selectedImage}
                />
            </main>

            <section className='new-product-section'>
                <div className='new-product-banner'>
                    <span className='badge-new-large'>NUEVO</span>
                    <h2>Cuaderno A4</h2>
                    <p>El tamaño perfecto para todas tus ideas. Más espacio, más creatividad.</p>

                    <div className='cuaderno-gallery'>
                        <div className='gallery-main-image'>
                            <img
                                src={cuadernoA4Images[selectedGalleryImage].src || "/placeholder.svg"}
                                alt={cuadernoA4Images[selectedGalleryImage].alt}
                            />
                        </div>

                        <div className='gallery-thumbnails'>
                            {cuadernoA4Images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`gallery-thumbnail ${selectedGalleryImage === index ? 'active' : ''}`}
                                    onClick={() => setSelectedGalleryImage(index)}
                                >
                                    <img src={image.src || "/placeholder.svg"} alt={image.alt} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='new-product-features'>
                        <div className='feature'>
                            <span className='feature-icon'>📏</span>
                            <span>Tamaño A4</span>
                        </div>
                        <div className='feature'>
                            <span className='feature-icon'>🎨</span>
                            <span>Personalizable</span>
                        </div>
                        <div className='feature'>
                            <span className='feature-icon'>💼</span>
                            <span>Ideal para trabajo</span>
                        </div>
                    </div>
                    <p className='new-product-price'>Desde ${agendaPrices.CUADERNO_A4}</p>
                </div>
            </section>
        </>
    );
};

export default AgendaForm;
