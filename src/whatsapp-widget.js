const DISMISSED_KEY = 'jian-whatsapp-message-dismissed';

export function initWhatsAppWidget() {
  const widget = document.querySelector('.whatsapp-widget');
  const message = document.getElementById('whatsapp-message');
  const button = widget.querySelector('.floating-whatsapp');
  const close = widget.querySelector('.whatsapp-message-close');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let dismissed = false;
  let shown = false;
  let timer;
  try { dismissed = sessionStorage.getItem(DISMISSED_KEY) === '1'; } catch { /* Storage may be disabled. */ }

  function show() {
    timer = undefined;
    if (dismissed || shown || widget.classList.contains('is-covered') || document.visibilityState !== 'visible') return;
    shown = true;
    message.hidden = false;
    button.setAttribute('aria-describedby', 'whatsapp-message-text');
    if (!preference.matches) widget.classList.add('is-welcoming');
  }

  function update() {
    const covered = Boolean(document.querySelector('dialog[open]'));
    widget.classList.toggle('is-covered', covered);
    if (covered || document.visibilityState !== 'visible') {
      clearTimeout(timer);
      timer = undefined;
      return;
    }
    // Let the welcome screen and first content animations finish first.
    if (!shown && !dismissed && !timer) timer = setTimeout(show, 1000);
  }

  close.addEventListener('click', () => {
    const restoreFocus = message.contains(document.activeElement);
    dismissed = true;
    message.hidden = true;
    widget.classList.remove('is-welcoming');
    button.removeAttribute('aria-describedby');
    clearTimeout(timer);
    timer = undefined;
    try { sessionStorage.setItem(DISMISSED_KEY, '1'); } catch { /* Still closes without storage. */ }
    if (restoreFocus) button.focus({ preventScroll: true });
  });
  widget.addEventListener('animationend', (event) => {
    if (event.animationName === 'whatsapp-ring') widget.classList.remove('is-welcoming');
  });
  preference.addEventListener('change', () => {
    if (preference.matches) widget.classList.remove('is-welcoming');
  });
  new MutationObserver(update).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'], childList: true });
  document.addEventListener('visibilitychange', update);
  window.addEventListener('pageshow', update);
  window.addEventListener('pagehide', () => { clearTimeout(timer); timer = undefined; });
  update();
}
