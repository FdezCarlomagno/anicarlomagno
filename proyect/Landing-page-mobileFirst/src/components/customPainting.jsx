import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import '../pages/pagesStyles/customPainting.css';
import FooterPaintingText from './footerPaintingText';
import { motion } from 'framer-motion';

const CustomPainting = () => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        size1: '',
        size2: '',
        description: '',
        customPhoto: false
    });

    const [touched, setTouched] = useState({
        name: false,
        surname: false,
        size1: false,
        size2: false,
        description: false
    });

    const [errors, setErrors] = useState({
        name: '',
        surname: '',
        size1: '',
        size2: '',
        description: ''
    });

    const { ref: titleRef, inView: titleInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const { ref: formRef, inView: formInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const validateField = (name, value) => {
        switch (name) {
            case 'name':
            case 'surname':
                if (!value.trim()) {
                    return 'Este campo es obligatorio';
                }
                if (value.trim().length < 2) {
                    return 'Mínimo 2 caracteres';
                }
                return '';
            case 'size1':
            case 'size2':
                if (!value) {
                    return 'Requerido';
                }
                const numValue = parseInt(value);
                if (numValue < 10) {
                    return 'Mínimo 10cm';
                }
                if (numValue > 200) {
                    return 'Máximo 200cm';
                }
                return '';
            case 'description':
                if (!value.trim()) {
                    return 'Por favor describe tu obra';
                }
                if (value.trim().length < 10) {
                    return 'Mínimo 10 caracteres';
                }
                if (value.trim().length > 500) {
                    return 'Máximo 500 caracteres';
                }
                return '';
            default:
                return '';
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        if (type !== 'checkbox') {
            const error = validateField(name, value);
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
    };

    const isFormValid = () => {
        return (
            formData.name.trim().length >= 2 &&
            formData.surname.trim().length >= 2 &&
            formData.size1 >= 10 && formData.size1 <= 200 &&
            formData.size2 >= 10 && formData.size2 <= 200 &&
            formData.description.trim().length >= 10 &&
            formData.description.trim().length <= 500
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!isFormValid()) {
            setTouched({
                name: true,
                surname: true,
                size1: true,
                size2: true,
                description: true
            });
            return;
        }

        const message = `Hola! Ani Soy ${formData.name} ${formData.surname}. Me gustaría encargarte una obra de estas dimensiones: ${formData.size1}cm X ${formData.size2}cm. ${formData.description}. ${formData.customPhoto ? 'Me gustaría agregar una foto' : ''}. Muchas gracias!`;

        const whatsappURL = `https://api.whatsapp.com/send?phone=542494245966&text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    };

    const getFieldClass = (fieldName) => {
        if (!touched[fieldName]) return '';
        return errors[fieldName] ? 'field-error' : 'field-valid';
    };

    return (
        <div>
            <div className="titleBg">
                <motion.h1
                    ref={titleRef}
                    initial={{ opacity: 0, y: -50 }}
                    animate={titleInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className='myPaintingsTitle'
                >
                    Obra personalizada
                </motion.h1>
            </div>
            <main className='custom-paintings'>
                <motion.div 
                    animate={titleInView ? { y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className='custom-painting-form-container'>
                    <motion.h1
                        initial={{ opacity: 0, x: 50 }}
                        animate={titleInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Pedí tu obra personalizada
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={titleInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="form-subtitle"
                    >
                        Encargá tu obra personalizada completando los campos de abajo. Los campos con (*) son obligatorios.
                    </motion.p>
                    <motion.div
                        ref={formRef}
                        className='custom-painting-form'
                        initial={{ opacity: 0, y: 20 }}
                        animate={formInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <form onSubmit={handleSubmit}>
                            <div className='name-surname-inputs'>
                                <div className="form-field">
                                    <label htmlFor='name'>
                                        Nombre <span className="required">*</span>
                                    </label>
                                    <input
                                        type='text'
                                        name='name'
                                        id='name'
                                        placeholder='Ingresá tu nombre'
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        className={getFieldClass('name')}
                                    />
                                    {touched.name && errors.name && (
                                        <span className="error-message">{errors.name}</span>
                                    )}
                                </div>
                                <div className="form-field">
                                    <label htmlFor='surname'>
                                        Apellido <span className="required">*</span>
                                    </label>
                                    <input
                                        type='text'
                                        name='surname'
                                        id='surname'
                                        placeholder='Ingresá tu apellido'
                                        required
                                        value={formData.surname}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        className={getFieldClass('surname')}
                                    />
                                    {touched.surname && errors.surname && (
                                        <span className="error-message">{errors.surname}</span>
                                    )}
                                </div>
                            </div>

                            <div className='size-section'>
                                <label className="section-label">
                                    Dimensiones (cm) <span className="required">*</span>
                                </label>
                                <p className="help-text">Rango válido: 10cm - 200cm</p>
                                <div className='size-inputs-row'>
                                    <div className="form-field size-field">
                                        <label htmlFor='size1'>Ancho</label>
                                        <input
                                            type='number'
                                            name='size1'
                                            id='size1'
                                            placeholder='ej: 50'
                                            min="10"
                                            max="200"
                                            required
                                            value={formData.size1}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className={getFieldClass('size1')}
                                        />
                                        {touched.size1 && errors.size1 && (
                                            <span className="error-message">{errors.size1}</span>
                                        )}
                                    </div>
                                    <span className="size-separator">×</span>
                                    <div className="form-field size-field">
                                        <label htmlFor='size2'>Alto</label>
                                        <input
                                            type='number'
                                            name='size2'
                                            id='size2'
                                            placeholder='ej: 70'
                                            min="10"
                                            max="200"
                                            required
                                            value={formData.size2}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            className={getFieldClass('size2')}
                                        />
                                        {touched.size2 && errors.size2 && (
                                            <span className="error-message">{errors.size2}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="form-field">
                                <label htmlFor='description'>
                                    Descripción de tu obra <span className="required">*</span>
                                </label>
                                <p className="help-text">Contanos qué te gustaría que plasmemos en tu obra (10-500 caracteres)</p>
                                <textarea
                                    name='description'
                                    id='description'
                                    placeholder='Ej: Me gustaría una obra con tonos azules y verdes, estilo abstracto, con elementos de naturaleza...'
                                    required
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={getFieldClass('description')}
                                    rows="4"
                                />
                                <div className="char-counter">
                                    {formData.description.length}/500 caracteres
                                </div>
                                {touched.description && errors.description && (
                                    <span className="error-message">{errors.description}</span>
                                )}
                            </div>

                            <div className='custom-photo-option'>
                                <label htmlFor='customPhoto' className="checkbox-label">
                                    <input
                                        type='checkbox'
                                        name='customPhoto'
                                        id='customPhoto'
                                        checked={formData.customPhoto}
                                        onChange={handleInputChange}
                                        className="custom-checkbox"
                                    />
                                    <span className="checkbox-text">
                                        <strong>¿Querés agregar una foto personalizada?</strong>
                                        <span className="checkbox-subtext">Te contacto para coordinar el envío</span>
                                    </span>
                                </label>
                            </div>

                            <motion.button
                                className={`submit-btn ${!isFormValid() ? 'btn-disabled' : ''}`}
                                type="submit"
                                disabled={!isFormValid()}
                                initial={{ scale: 1 }}
                                whileHover={isFormValid() ? { scale: 1.03 } : {}}
                                whileTap={isFormValid() ? { scale: 0.98 } : {}}
                            >
                                {isFormValid() ? 'Pedir presupuesto' : 'Completá los campos requeridos'}
                            </motion.button>
                        </form>
                    </motion.div>
                </motion.div>
            </main>
            <FooterPaintingText />
        </div>
    );
};

export default CustomPainting;
