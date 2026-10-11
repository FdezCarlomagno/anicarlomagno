import React from 'react';
import { EmailLink, WhatsappLink } from './ContactLinks';
import { LEGAL_UPDATED, OWNER_NAME } from './contact';

export const privacidad = {
  title: 'Política de privacidad',
  updated: LEGAL_UPDATED,
  intro: (
    <p>
      Acá te cuento qué datos tuyos recibo cuando usás este sitio, para qué los uso y qué podés hacer con ellos.
      Lo escribí lo más claro posible; si algo no se entiende, escribime.
    </p>
  ),
  sections: [
    {
      id: 'responsable',
      heading: 'Quién es responsable de tus datos',
      body: (
        <>
          <p>
            Soy <strong>{OWNER_NAME}</strong>, artista plástica, y soy la responsable de los datos que me mandás
            a través de este sitio.
          </p>
          <p>Podés escribirme por:</p>
          <ul>
            <li><WhatsappLink /></li>
            <li>Email: <EmailLink /></li>
          </ul>
        </>
      ),
    },
    {
      id: 'datos',
      heading: 'Qué datos recibo',
      body: (
        <ul>
          <li>
            <strong>Formulario de contacto:</strong> tu nombre, apellido, email y el mensaje que escribas.
          </li>
          <li>
            <strong>WhatsApp:</strong> si tocás un botón de consulta o de pedido, se abre WhatsApp con un mensaje
            armado. Ahí recibo tu número, tu nombre de perfil y todo lo que me escribas o mandes (por ejemplo,
            los datos de tu pedido o una foto de referencia).
          </li>
          <li>
            <strong>Datos técnicos:</strong> como en cualquier sitio web, los servicios que lo hacen funcionar
            ven datos técnicos de tu visita, como tu dirección IP, el tipo de navegador y la página que abriste.
            Yo no los uso para identificarte.
          </li>
        </ul>
      ),
    },
    {
      id: 'para-que',
      heading: 'Para qué los uso',
      body: (
        <>
          <ul>
            <li>Responder tus consultas.</li>
            <li>Preparar y acordar tus pedidos, incluidos los productos personalizados.</li>
            <li>Coordinar el envío de lo que compres.</li>
          </ul>
          <p>No uso tus datos para mandarte publicidad ni se los vendo a nadie.</p>
        </>
      ),
    },
    {
      id: 'terceros',
      heading: 'Con quién se comparten',
      body: (
        <>
          <p>Para que el sitio funcione uso algunos servicios de otras empresas:</p>
          <ul>
            <li>
              <strong>EmailJS</strong>: me hace llegar los mensajes del formulario de contacto. Recibe tu nombre,
              apellido, email y mensaje, solo cuando lo enviás.
            </li>
            <li>
              <strong>WhatsApp (Meta)</strong>: solo cuando tocás un botón de WhatsApp. Desde ese momento, la
              conversación también se rige por las condiciones y la política de privacidad de WhatsApp.
            </li>
            <li>
              <strong>Google Maps</strong>: solo si tocás &quot;Ver mapa&quot; en la página de contacto. Si no lo
              cargás, el sitio no se conecta con Google.
            </li>
            <li>
              <strong>Vercel</strong>: es el servicio donde está alojado el sitio. Recibe los datos técnicos de
              cada visita para poder mostrarte las páginas.
            </li>
          </ul>
          <p>
            Los enlaces a Instagram, TikTok y Facebook te llevan a esas redes solo si los tocás; a partir de ahí
            rigen sus propias políticas.
          </p>
        </>
      ),
    },
    {
      id: 'transferencia',
      heading: 'Datos fuera de la Argentina',
      body: (
        <p>
          Algunos de estos servicios guardan o procesan datos en servidores ubicados fuera de la Argentina. Al
          usarlos, tus datos pueden viajar a otros países, siempre para los fines que te conté arriba.
        </p>
      ),
    },
    {
      id: 'conservacion',
      heading: 'Cuánto tiempo los guardo',
      body: (
        <p>
          Guardo tus mensajes el tiempo necesario para responder tu consulta y, si hacés un pedido, para
          gestionarlo.
        </p>
      ),
    },
    {
      id: 'derechos',
      heading: 'Tus derechos',
      body: (
        <>
          <p>
            Podés pedirme en cualquier momento que te diga qué datos tuyos tengo, que los corrija o que los
            borre. Escribime por <WhatsappLink /> o a <EmailLink /> y te respondo dentro de los plazos que fija
            la Ley 25.326 de Protección de Datos Personales.
          </p>
          <p>
            Tenés derecho a acceder a tus datos en forma gratuita a intervalos no inferiores a seis meses, salvo
            que acredites un interés legítimo, según el artículo 14, inciso 3, de la Ley 25.326.
          </p>
          <p>
            La Agencia de Acceso a la Información Pública, en su carácter de Órgano de Control de la Ley 25.326,
            tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en
            sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.
            Más información en{' '}
            <a href="https://www.argentina.gob.ar/aaip" target="_blank" rel="noopener noreferrer">
              argentina.gob.ar/aaip
              <span className="visually-hidden"> (se abre en una pestaña nueva)</span>
            </a>
            .
          </p>
        </>
      ),
    },
    {
      id: 'cookies',
      heading: 'Cookies',
      body: (
        <>
          <p>
            Este sitio no usa cookies ni guarda información en tu navegador (tampoco usa almacenamiento local).
            No tiene herramientas de analítica ni de publicidad, y las tipografías se cargan desde el mismo
            sitio.
          </p>
          <p>
            Si en la página de contacto tocás &quot;Ver mapa&quot;, se carga Google Maps. En ese momento Google
            recibe datos técnicos de tu visita y puede usar sus propias cookies, según su política de
            privacidad. Si no cargás el mapa, eso no pasa.
          </p>
        </>
      ),
    },
    {
      id: 'cambios',
      heading: 'Cambios en esta política',
      body: (
        <p>
          Si cambio algo, lo publico en esta misma página con la fecha de actualización. La versión que vale es
          la que ves acá.
        </p>
      ),
    },
  ],
};
