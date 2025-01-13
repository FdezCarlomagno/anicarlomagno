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
    const agendaRef = useRef(null)
    const [pulse, setPulse] = useState(false);  // Estado para activar la animación de "pulse"

    useEffect(() => {
        const storedAgendas = JSON.parse(localStorage.getItem('agendas') || '[]');
        if (isMounted.current) {
            setAgendas(storedAgendas);
        }
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        localStorage.setItem('agendas', JSON.stringify(agendas));
        if (agendas.length > 0 && agendaRef.current) {
            agendaRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setPulse(true);  // Activamos el "pulse" cuando hay agendas
            setTimeout(() => setPulse(false), 1000);  // Desactivamos después de 500ms
        }
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
            if(agenda.username) message += `- Nombre: ${agenda.username}\n`;
            if(agenda.textDirection) message += `- Dirección de texto: ${agenda.textDirection}\n`;
            if(agenda.username) message += `- Color: ${agenda.fontColor}\n`;
            if (agenda.quote) message += `- Frase: ${agenda.quote}\n`;
            if (agenda.other) message += `- Comentarios: ${agenda.other}\n`;
            return acc + message + '\n';
        }, baseMessage);

        const whatsappURL = `https://api.whatsapp.com/send?phone=542494245966&text=${encodeURIComponent(fullMessage)}`;
        window.open(whatsappURL, '_blank');
    };

    return (
        <div className="flex-column">
            <div className="titleBg">
                <h1 className="myPaintingsTitle">Agenda personalizada</h1>
            </div>
            {renderForms()} 
            {agendas.length > 0 && (
                <div className="saved-agendas"  ref={agendaRef}>
                    <h2>Tus agendas guardadas:</h2>
                    <motion.button
                        animate={pulse ? { scale: 1.15 } : { scale: 1 }}  // Animación de "pulse"
                        transition={{ type: 'spring', stiffness: 300 }}  // Ajuste de la transición
                        whileHover={{ scale: 1.1 }}  // Levemente más grande en hover
                        className="btnAgenda encargar"
                        onClick={handleEncargue}
                      
                    >
                        Encargar
                    </motion.button>
                    <ul className="saved-agendas-container">
                        {agendas.map((agenda, index) => (
                            <SavedAgenda key={index} agenda={agenda} index={index} handleDeleteAgenda={handleDeleteAgenda} />
                        ))}
                    </ul>
                </div>
            )}
            <Toaster />
        </div>
    );
};

export default CustomAgenda;
