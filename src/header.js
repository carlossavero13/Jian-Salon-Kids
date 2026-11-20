export function initHeader() {
  const header = document.querySelector('.header');
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const desktop = window.matchMedia('(min-width: 1025px)');
  function resetMenuState() {
    document.documentElement.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
  }
  const close = () => {
    if (menu.open) menu.close();
    resetMenuState();
  };

  toggle.addEventListener('click', () => {
    if (menu.open) return close();
    if (desktop.matches) return;
    menu.showModal();
    document.documentElement.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
  });
  menu.querySelector('.mobile-menu-close').addEventListener('click', () => {
    close();
    toggle.focus({ preventScroll: true });
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
  menu.addEventListener('close', resetMenuState);
  menu.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
    toggle.focus({ preventScroll: true });
  });

  // Native dialog traps focus, handles Escape, and keeps the page behind it inert.
  const outsideMenu = (event) => {
    const bounds = menu.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom;
  };
  let startedOnBackdrop = false;
  menu.addEventListener('pointerdown', (event) => { startedOnBackdrop = outsideMenu(event); });
  menu.addEventListener('click', (event) => {
    if (startedOnBackdrop && outsideMenu(event)) close();
    startedOnBackdrop = false;
  });
  desktop.addEventListener('change', (event) => { if (event.matches) close(); });
  window.addEventListener('pagehide', close);

  const updateShadow = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', updateShadow, { passive: true });
  updateShadow();

  const links = [...document.querySelectorAll('.nav-link, .mobile-nav-link')];
  function markCurrent(id) {
    links.forEach((link) => {
      const current = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-current', current);
      if (current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  links.forEach((link) => link.addEventListener('click', () => markCurrent(link.hash.slice(1))));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) markCurrent(entry.target.id); });
    }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
    new Set(links.map((link) => link.hash)).forEach((hash) => {
      const section = document.querySelector(hash);
      if (section) observer.observe(section);
    });
  }
}
