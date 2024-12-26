import React, { useState, useEffect, useRef } from 'react';
import '../pages/pagesStyles/agendas.css';
import DropDownImgs from './DropDownImgs';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import AgendaForm from './AgendaForm';
import cuadros from '../objects/newPaintings.jsx';
import SavedAgenda from './SavedAgenda.jsx';
import toast, { Toaster } from 'react-hot-toast';

const CustomAgenda = () => {
    const [cantAgendas, setCantAgendas] = useState(1);
    const [agendas, setAgendas] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);  // State for selected image

    const isMounted = useRef(true);

    useEffect(() => {
        const storedAgendas = JSON.parse(localStorage.getItem('agendas') || '[]');
        if (isMounted.current) {
            setAgendas(storedAgendas);
        }
        //console.log(selectedImage);
        return () => {
            isMounted.current = false;
        };

    }, []);

    useEffect(() => {
        localStorage.setItem('agendas', JSON.stringify(agendas));
    }, [agendas]);

    const renderForms = () => {
        const forms = [];
        for (let i = 0; i < cantAgendas; i++) {
            forms.push(<AgendaForm key={i} cantAgendas={cantAgendas} onSave={handleAddAgenda} agendasGuardadas={agendas.length} />);
        }
        return forms;
    };

    const handleAddAgenda = (newAgenda) => {
        setAgendas((prevAgenda) => [...prevAgenda, newAgenda]);
    };

    const handleChange = (n) => {
        setCantAgendas((prev) => Math.max(prev + n, 1));
    };
    const toastDeleteNotification = () => {
        return toast((t) => (
            <p>
              Pedido eliminado con <strong>éxito</strong>
            </p>
          ));
    }

    const handleDeleteAgenda = (indexToDelete) => {
        toastDeleteNotification();
        setAgendas((prev) => prev.filter((_, index) => index !== indexToDelete));
    };

    const handleEncargue = () => {
        let baseMessage = `Hola Ani! quiero encargarte ${agendas.length} pedidos de agendas.\n\n`;
        let fullMessage = agendas.reduce((acc, agenda, index) => {
            let message = `Pedido ${index + 1}:\n`;
            message += `- Tipo: ${agenda.type}\n`;
            message += `- Papel: ${agenda.paper}\n`;
            message += `- Fondo: ${agenda.name}\n`;
            message += `- Nombre: ${agenda.username}\n`;
            message += `- Dirección de texto: ${agenda.textDirection}\n`;
            message += `- Color: ${agenda.fontColor}\n`;
            if (agenda.quote) message += `- Frase: ${agenda.quote}\n`;
            if (agenda.other) message += `- Comentarios: ${agenda.other}\n`;
            return acc + message + '\n';
        }, baseMessage);
    
        const whatsappURL = `https://api.whatsapp.com/send?phone=542494245966&text=${encodeURIComponent(fullMessage)}`;
        window.open(whatsappURL, '_blank');
    };
    

    return (
        <div className='flex-column'>
            <div className="titleBg">
                <h1 className='myPaintingsTitle'>Agenda personalizada</h1>
            </div>
            {/*<div className='agenda-count-container'>
                <label htmlFor="agenda-count">
                    Cantidad de agendas
                    <div className='agenda-count' name='agenda-count'>
                        <button className='btn-agenda-count' onClick={() => handleChange(1)}>+</button>
                        <button className='btn-agenda-count' onClick={() => handleChange(-1)}>-</button>

                    </div>
                    <h3>{cantAgendas}</h3>
                </label>
            </div>*/}
            {renderForms()}
            {agendas.length > 0 && (
                <div className='saved-agendas'>
                    <h2>Tus agendas guardadas:</h2>
                    <ul className='saved-agendas-container'>
                        {agendas.map((agenda, index) => (
                            <SavedAgenda agenda={agenda} index={index} handleDeleteAgenda={handleDeleteAgenda}/>
                        ))}
                    </ul>
                </div>
            )}
            {agendas.length > 0 && <button className='btnAgenda encargar' onClick={handleEncargue}>Encargar</button>}
        </div>
    );
};

export default CustomAgenda;
