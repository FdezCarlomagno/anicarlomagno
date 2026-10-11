import React from 'react';
import { CONTACT_EMAIL, CONTACT_EMAIL_IS_PENDING, WHATSAPP_DISPLAY, WHATSAPP_URL } from './contact';

export const WhatsappLink = () => (
  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
    WhatsApp {WHATSAPP_DISPLAY}
    <span className="visually-hidden"> (se abre en una pestaña nueva)</span>
  </a>
);

export const EmailLink = () =>
  CONTACT_EMAIL_IS_PENDING ? (
    <span>{CONTACT_EMAIL}</span>
  ) : (
    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
  );
