import React from 'react';
import { Link } from 'react-router-dom';
import { EmailLink, WhatsappLink } from './ContactLinks';
import { LEGAL_UPDATED, OWNER_NAME } from './contact';

export const terminos = {
  documentTitle: 'Términos y condiciones | Analía Carlomagno',
  title: 'Términos y condiciones',
  updated: LEGAL_UPDATED,
  intro: (
    <p>
      Estas son las reglas básicas para comprar mis obras, agendas, cuadernos, láminas y libros a través de este
      sitio.
    </p>
  ),
  sections: [
    {
      id: 'quien-vende',
      heading: 'Quién vende',
      body: (
        <>
          <p>
            Los productos de este sitio los hago y los vendo yo, <strong>{OWNER_NAME}</strong>. Podés escribirme
            por:
          </p>
          <ul>
            <li><WhatsappLink /></li>
            <li>Email: <EmailLink /></li>
          </ul>
        </>
      ),
    },
    {
      id: 'como-comprar',
      heading: 'Cómo se compra',
      body: (
        <>
          <p>El sitio no tiene carrito ni pagos online. La compra se hace por WhatsApp:</p>
          <ol>
            <li>Elegís lo que te gusta en el sitio y tocás el botón para consultar o pedir.</li>
            <li>Se abre WhatsApp con un mensaje con los detalles de lo que elegiste.</li>
            <li>Te confirmo el precio, la disponibilidad y los detalles, y ahí acordamos el pedido.</li>
          </ol>
          <p>El pedido queda confirmado cuando lo acordamos en esa conversación.</p>
        </>
      ),
    },
    {
      id: 'personalizados',
      heading: 'Productos personalizados',
      body: (
        <p>
          Las agendas, los cuadernos y las obras por encargo se hacen a pedido con las opciones que elegís
          (diseño de tapa, nombre, frase, medidas, etc.). Revisá bien esos datos antes de confirmar, porque el
          producto se hace tal como lo acordamos.
        </p>
      ),
    },
    {
      id: 'envios',
      heading: 'Envíos',
      body: (
        <p>
          Hago envíos a todo el país. La forma de envío, su costo y los tiempos los acordamos por WhatsApp
          cuando hacés el pedido.
        </p>
      ),
    },
    {
      id: 'propiedad-intelectual',
      heading: 'Propiedad intelectual',
      body: (
        <p>
          Las obras, los diseños y las imágenes de este sitio son de {OWNER_NAME}. No se pueden copiar,
          reproducir ni usar sin mi autorización. Comprar una obra, una lámina o un producto no da derecho a
          reproducir la imagen.
        </p>
      ),
    },
    {
      id: 'datos-personales',
      heading: 'Tus datos',
      body: (
        <p>
          Cómo uso los datos que me mandás está explicado en la{' '}
          <Link to="/privacidad">Política de privacidad</Link>.
        </p>
      ),
    },
    {
      id: 'cambios',
      heading: 'Cambios en estos términos',
      body: (
        <p>
          Si cambio algo, lo publico en esta misma página con la fecha de actualización. Para cada pedido valen
          los términos publicados el día en que lo acordamos.
        </p>
      ),
    },
  ],
};
