import React, { useState } from 'react';
import '../pages/pagesStyles/customPainting.css';
import FooterPaintingText from './footerPaintingText';

const CustomPainting = () => {
    const [inputValue, setInputValue] = useState({
        name: '',
        surname: '',
        size1: '',
        size2: '',
        img: '',
        description: '',
        customPhoto: false
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputValue((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        const message = `Hola! Ani Soy ${inputValue.name} ${inputValue.surname}. Me gustaria encargarte una obra de estas dimensiones: ${inputValue.size1}cm X ${inputValue.size2}cm. ${inputValue.description}. ${inputValue.customPhoto ? 'Me gustaria agregar una foto' : ''}. Muchas gracias!`

        const whatsappURL = `https://api.whatsapp.com/send?phone=542494245966&text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    }

    return (
        <div>
            <div className="titleBg">
                <h1 className='myPaintingsTitle'>Obra personalizada</h1>
            </div>
            <main className='custom-paintings'>

                <div className='custom-painting-form-container'>
                    <h1>Pedí tu obra personalizada</h1>
                    <p>Encargá tu obra personalizada completando los campos de abajo.</p>
                    <div className='custom-painting-form'>
                        <form onSubmit={handleSubmit}>
                            <div className='name-surname-inputs'>
                                <label htmlFor='name'>
                                    Nombre
                                    <input
                                        type='text'
                                        name='name'
                                        id='name'
                                        placeholder='Ingrese su nombre'
                                        required
                                        value={inputValue.name}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label htmlFor='surname'>
                                    Apellido
                                    <input
                                        type='text'
                                        name='surname'
                                        id='surname'
                                        placeholder='Ingrese su apellido'
                                        required
                                        value={inputValue.surname}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </div>
                            <div className='size-description-container'>
                                <label htmlFor='size1'>
                                    Dimensiones (cm)
                                    <div className='size-input-container'>
                                        <input
                                            type='number'
                                            name='size1'
                                            id='size1'
                                            required
                                            value={inputValue.size1}
                                            onChange={handleInputChange}
                                        />
                                        <p>X</p>
                                        <input
                                            type='number'
                                            name='size2'
                                            id='size2'
                                            required
                                            value={inputValue.size2}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </label>
                                <label htmlFor='description'>
                                    <label htmlFor='customPhoto'>
                                        <div className='customPhoto-container'>
                                            <div>Descripción</div>
                                            <div>|</div>
                                            <div className='personalPhoto'>Foto Personal</div>
                                            <div>
                                                <input
                                                    type='checkbox'
                                                    name='customPhoto'
                                                    id='customPhoto'
                                                    value={inputValue.customPhoto}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </label>
                                    <textarea
                                        type='text'
                                        name='description'
                                        id='description'
                                        required
                                        value={inputValue.description}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </div>
                            <button type='submit' className='order-painting-btn'>Pedir presupuesto</button>
                        </form>
                    </div>
                </div>
                <FooterPaintingText />
            </main>
        </div>
    );
};

export default CustomPainting;
