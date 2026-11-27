export function initTransformations() {
  const image = document.getElementById('transformation-after-image');
  if (!image) return;
  const views = [
    { src: '/antes-despues/despues-frente.webp', alt: 'Después del corte, de frente: cabello más corto y peinado hacia un lado' },
    { src: '/antes-despues/despues-perfil.webp', alt: 'Después del corte, de perfil: orejas despejadas y raya lateral definida' },
  ];
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let index = 0;
  let timer;
  const alternate = new Image();
  alternate.src = views[1].src;
  function sync() {
    clearInterval(timer);
    if (!visible || document.hidden || preference.matches) return;
    timer = setInterval(() => {
      if (!alternate.complete || !alternate.naturalWidth) return;
      index = (index + 1) % views.length;
      image.src = views[index].src;
      image.alt = views[index].alt;
    }, 4000);
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(image);
  } else {
    visible = true;
    sync();
  }
  document.addEventListener('visibilitychange', sync);
  preference.addEventListener('change', sync);
}
