import React, { useState } from 'react';
import '../pages/pagesStyles/agendas.css';
import DropDownImgs from './DropDownImgs';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const AgendaForm = () => {
    const [agendaPrice, setAgendaPrice] = useState('0');
    const [name, setName] = useState('');
    const [formData, setFormData] = useState({
        type: '',
        username: '',
        paper: '',
        fontColor: '#000000',
        textDirection: '',
        other: '',
        bgImg: '',
        price: agendaPrice,
        name: name
    });
    const [dropDown, setDropDown] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const toggleDropDown = () => {
        setDropDown(!dropDown);
    };

    const handleImageClick = (image, nombre) => {
        setSelectedImage(image);
        setName(nombre);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => {
            const updatedFormData = { ...prevFormData, [name]: value };
            if (name === 'type') {
                switch (value) {
                    case 'agenda perpetua':
                        setAgendaPrice('17900');
                        break;
                    case 'cuaderno':
                        setAgendaPrice('12900');
                        break;
                    case 'agenda':
                        setAgendaPrice('16900');
                        break;
                    case 'agenda-docente':
                        setAgendaPrice('17900');
                        break;
                    default:
                        setAgendaPrice('0');
                }
            }
            return updatedFormData;
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const message = `Hola!, me gustaría encargarte una ${formData.type} de papel ${formData.paper}, con un fondo de tu obra ${name} con las siguientes especificaciones: 
        Nombre: ${formData.username}, en la parte ${formData.textDirection}, de color ${formData.fontColor}. 
        Comentarios aparte: ${formData.other}`;

        const whatsappURL = `https://api.whatsapp.com/send?phone=542494245966&text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
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
        <div>
            <div className="titleBg">
                <h1 className='myPaintingsTitle'>Agenda personalizada</h1>
            </div>
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
                                        <button id='btnSubmitAgenda' type="submit">Enviar por WhatsApp</button>
                                        <div>
                                            <h3>${agendaPrice}</h3>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    ref={imgRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={imgInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                >
                    <div className='customAgenda'>
                        {formData.type && <h2>Tu {formData.type}</h2>}
                        <div className='myAgenda-img-container'>
                            {selectedImage && (
                                <img
                                    src={selectedImage}
                                    alt={formData.bgImg ? formData.bgImg : 'Seleccioná una obra con el selector del formulario'}
                                />
                            )}
                            <div className='myAgenda-name-container'>
                                {<h2 className={formData.textDirection} style={nameStyles}>{formData.username}</h2>}
                            </div>
                            {formData.type && <span>OFERTA DE LANZAMIENTO</span>}
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default AgendaForm;
