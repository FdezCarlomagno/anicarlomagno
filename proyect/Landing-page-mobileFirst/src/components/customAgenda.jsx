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
    const [agendas, setAgendas] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);  // State for selected image
    const isMounted = useRef(true);
    const agendaRef = useRef(null)
    const [pulse, setPulse] = useState(false);  // Estado para activar la animación de "pulse"

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
            <AgendaForm onSave={handleEncargue}></AgendaForm>
            <Toaster />
        </div>
    );
};

export default CustomAgenda;
