// Prototipos de la Fase 4b: abre y cierra el menú (diálogo a pantalla completa).
// Con #menu en la URL arranca abierto, para revisar ese estado sin tocar nada.
(() => {
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
})();
