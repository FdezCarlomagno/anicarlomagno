import React, { useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import './styles/ContactForm.css';
import toast, { Toaster } from 'react-hot-toast';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    mensaje: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // To handle form submission state

  const PUBLIC_KEY = 'e8O1W419SxmdXAcUr'; // Replace with your public key

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true); // Start the submission process

    const { nombre, apellido, email, mensaje } = formData;
    const templateParams = {
      nombre,
      apellido,
      email,
      mensaje,
    };

    try {
      const response = await emailjs.send(
        'anicarlomagno-email-serv', // Your Service ID
        'anica-template', // Your Template ID
        templateParams,
        PUBLIC_KEY // Your Public Key
      );
      console.log('SUCCESS!', response.status, response.text);
      toast.success('¡Mensaje enviado con éxito!'); // Show success toast
    } catch (error) {
      console.error('FAILED...', error);
      toast.error('Error al enviar el mensaje. Inténtalo de nuevo.'); // Show error toast
    } finally {
      setIsSubmitting(false); // End the submission process
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        mensaje: '',
      });
    }
  };

  return (
    <>

      <motion.form
        className="contact-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="form-group"
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </motion.div>
        <motion.div
          className="form-group"
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <label htmlFor="apellido">Apellido:</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
        </motion.div>
        <motion.div
          className="form-group"
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </motion.div>
        <motion.div
          className="form-group"
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <label htmlFor="mensaje">Mensaje:</label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            required
          ></textarea>
        </motion.div>
        <motion.button
          type="submit"
          disabled={isSubmitting} // Disable the button while submitting
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </motion.button>
      </motion.form>
    </>
  );
};

export default ContactForm;
