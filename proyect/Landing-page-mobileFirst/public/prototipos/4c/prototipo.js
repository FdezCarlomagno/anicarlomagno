// Fase 4c: lo mínimo para el menú abierto, la entrada de las obras y el botón flotante.
// Sin este archivo la página se ve y se usa igual: todo visible y el botón de WhatsApp siempre a mano.
(() => {
  // Menú: diálogo a pantalla completa. Con #menu en la URL arranca abierto, para revisar ese estado.
  const button = document.querySelector('[data-menu-button]');
  const panel = document.getElementById(button.getAttribute('aria-controls'));
  const behind = document.querySelectorAll('[data-inert-con-menu]');
  const setOpen = (open, moveFocus = true) => {
    button.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    document.documentElement.classList.toggle('menu-abierto', open);
    behind.forEach((el) => { el.inert = open; });
    if (moveFocus) (open ? panel.querySelector('[data-menu-close]') : button).focus();
  };
  button.addEventListener('click', () => setOpen(true));
  panel.querySelector('[data-menu-close]').addEventListener('click', () => setOpen(false));
  panel.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false, false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) setOpen(false); });
  if (location.hash === '#menu') setOpen(true, false);

  if (!('IntersectionObserver' in window)) return;

  // Entrada de las obras: solo las que todavía no se ven, para que nada parpadee al cargar.
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const reveal = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.remove('revela-espera');
        reveal.unobserve(e.target);
      }
    }, { rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('[data-revela]').forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight) return;
      el.classList.add('revela-espera');
      reveal.observe(el);
    });
  }

  // Botón flotante: oculto mientras se ve el hero (taparía la obra) o un pedido por WhatsApp ya visible.
  const wsp = document.querySelector('.wsp');
  const visibles = new Set();
  const zones = new IntersectionObserver((entries) => {
    for (const e of entries) (e.isIntersecting ? visibles.add(e.target) : visibles.delete(e.target));
    wsp.classList.toggle('wsp-oculto', visibles.size > 0);
  });
  document.querySelectorAll('[data-sin-flotante]').forEach((el) => zones.observe(el));
})();
