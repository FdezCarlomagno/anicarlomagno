import React, { useEffect } from 'react';
import './pagesStyles/legal.css';

const LegalPage = ({ content }) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = content.documentTitle;
    return () => {
      document.title = previousTitle;
    };
  }, [content.documentTitle]);

  return (
    <article className="legal-page">
      <h1 className="legal-title">{content.title}</h1>
      <p className="legal-updated">Última actualización: {content.updated}</p>
      <div className="legal-intro">{content.intro}</div>
      {content.sections.map((section) => (
        <section key={section.id} className="legal-section" aria-labelledby={`legal-${section.id}`}>
          <h2 id={`legal-${section.id}`}>{section.heading}</h2>
          {section.body}
        </section>
      ))}
    </article>
  );
};

export default LegalPage;
