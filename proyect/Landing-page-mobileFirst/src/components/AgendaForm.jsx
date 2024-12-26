import React, { useState, useEffect } from 'react';
import '../pages/pagesStyles/agendas.css';
import DropDownImgs from './DropDownImgs';
import { useInView } from 'react-intersection-observer';
import AgendaPreview from './AgendaPreview';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const AgendaForm = ( { cantAgendas, onSave, agendasGuardadas }) => {
    const [agendaPrice, setAgendaPrice] = useState(0);
    const [formQuote, setFormQuote] = useState(false);
    const [name, setName] = useState('');
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
        name: name,
        checkbox: false, 
    });
    const [dropDown, setDropDown] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const toggleDropDown = () => {
        setDropDown(!dropDown);
    };

    const handleImageClick = (image, nombre) => {
        setSelectedImage(image);
        setName(nombre);
        setFormData((prevFormData) => ({
            ...prevFormData,
            bgImg: image,
            name: nombre
        }));
    };


    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData((prevFormData) => {
            // Actualizamos el estado del formulario
            const updatedFormData = { ...prevFormData, [name]: name === 'checkbox' ? checked : value };

            if (name === 'type') {
                // Actualizamos el precio según el tipo
                switch (value) {
                    case 'agenda perpetua':
                        setAgendaPrice(18900);
                        break;
                    case 'cuaderno':
                        setAgendaPrice(13900);
                        break;
                    case 'agenda':
                        setAgendaPrice(18900);
                        break;
                    case 'agenda-docente':
                        setAgendaPrice(18900);
                        break;
                    default:
                        setAgendaPrice(0);
                }
            }

            if (name === 'checkbox') {
                // Sumamos o restamos según el estado del checkbox
                setAgendaPrice((prevPrice) => checked ? prevPrice + 1000 : prevPrice - 1000);
                setFormQuote((prevValue) => checked ? true : false);
            }


            return updatedFormData;
        });
    };


    const handleFormSubmit = (e) => {
        e.preventDefault();
        try {
            onSave(formData);
            toast.success('Agenda guardada correctamente');
        } catch (e){
            console.error(e);
            toast.error('No se pudo guardar la agenda, intente nuevamente');
            
        }
        // Restablecemos el estado a los valores iniciales
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
            name: '',
            checkbox: false, 
        });
        setSelectedImage(null);
        if(formQuote){
            setAgendaPrice(1000);
        } else {
            setAgendaPrice(0);
        }
   
        setFormQuote(false);
    };

    const nameStyles = {
        color: formData.fontColor || '#000000',
        fontFamily: 'Dancing Script'
    };

    // Set up useInView for animation
    const { ref: formRef, inView: formInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const { ref: imgRef, inView: imgInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <main className='agendaCustomization'>
            <motion.div
                ref={formRef}
                initial={{ opacity: 0, x: -50 }}
                animate={formInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5 }}
            >
                <div className='myAgenda-infoAndImg-container'>
                    <div className='myAgenda-info-container'>
                        <div className='formContainer'>
                            <form onSubmit={handleFormSubmit}>
                                <div>
                                    <div className='title-agenda-customization'>
                                        <h1>Customizá tu agenda o cuaderno</h1>
                                        <p>Completá los campos de abajo para personalizarla a tu gusto.</p>
                                    </div>
                                    <label>
                                        Tipo de agenda
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccione...</option>
                                            <option value="agenda perpetua">Perpetua</option>
                                            <option value="cuaderno">Cuaderno</option>
                                            <option value="agenda">Agenda semanal 2025</option>
                                            <option value="agenda-docente">Agenda docente</option>
                                        </select>
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        Tipo de papel
                                        <select
                                            name="paper"
                                            value={formData.paper}
                                            onChange={handleChange}
                                            required
                                            aria-label="Seleccione el tipo de agenda"
                                        >
                                            <option value="">Seleccione...</option>
                                            <option value="blanco">Blanco 80 gramos</option>
                                            <option value="natural">Natural 80 gramos</option>
                                        </select>
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        Obra de fondo
                                        <div className="dropDownAgendas">
                                            <div className="dropDownArrow">
                                                <p>Seleccione</p>
                                                <button
                                                    className='dropDownAgendas-btn'
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleDropDown();
                                                    }}
                                                >
                                                    ▼
                                                </button>
                                            </div>
                                            {dropDown && <DropDownImgs onImageClick={handleImageClick} />}
                                        </div>
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        Nombre
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder='Ingrese su nombre'
                                            minLength={3}
                                            maxLength={12}
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                        />
                                    </label>
                                </div>
                                <div className='formColor'>
                                    <label>
                                        Color de texto
                                        <input
                                            type="color"
                                            name="fontColor"
                                            value={formData.fontColor}
                                            onChange={handleChange}
                                            required
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        Dirección de texto
                                        <select
                                            name="textDirection"
                                            value={formData.textDirection}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccione...</option>
                                            <option value="arriba-derecha">Arriba-Derecha</option>
                                            <option value="arriba-izquierda">Arriba-Izquierda</option>
                                            <option value="abajo-derecha">Abajo-Derecha</option>
                                            <option value="abajo-izquierda">Abajo-Izquierda</option>
                                        </select>
                                    </label>
                                </div>
                                <div>
                                    <label className='checkbox-agenda'>
                                        <div>
                                            Frase aparte
                                        </div>
                                        <div>
                                            <input type="checkbox"
                                                name="checkbox"
                                                value={formQuote}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </label>
                                    {formQuote && (
                                        <div>
                                            <label>
                                                Ingrese una frase
                                                <textarea
                                                    name="quote"
                                                    value={formData.quote}
                                                    onChange={handleChange}
                                                />
                                            </label>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label>
                                        Otros comentarios
                                        <textarea
                                            name="other"
                                            value={formData.other}
                                            onChange={handleChange}
                                        />
                                    </label>
                                </div>
                                <div className='btnSubmitContainer'>
                                    <button id='btnSubmitAgenda' type="submit">Guardar pedido</button>
                                    <div>
                                        <h3>${agendaPrice}</h3>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </motion.div>
            <AgendaPreview formData={formData} imgRef={imgRef} imgInView={imgInView} nameStyles={nameStyles} selectedImage={selectedImage}/>
        </main>
    );
};

export default AgendaForm;
