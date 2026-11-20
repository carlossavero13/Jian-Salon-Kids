import { lookClips } from './gallery-data.js';

export function initClips() {
  const grid = document.getElementById('clips-grid');
  const globalControl = document.getElementById('clips-global-control');
  const hint = document.querySelector('#clips-hint span');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection?.saveData);
  let allPaused = reducedMotion.matches || saveData;
  const records = [];

  function canPlay(record) {
    const mainVideoPlaying = [...document.querySelectorAll('video')]
      .some((video) => !grid.contains(video) && !video.paused && !video.ended);
    return record.visible && !allPaused && !record.userPaused
      && document.visibilityState === 'visible' && !mainVideoPlaying
      && !document.querySelector('dialog[open]');
  }

  function updateControls(record) {
    const playing = !record.video.paused;
    record.card.dataset.state = playing ? 'playing' : 'paused';
    record.button.dataset.state = playing ? 'playing' : 'paused';
    record.button.setAttribute('aria-label', `${playing ? 'Pausar' : 'Reproducir'} vista previa: ${record.item.title}`);
  }

  function syncRecord(record) {
    if (!canPlay(record)) {
      record.video.pause();
      return;
    }
    if (!record.video.paused || record.pending) return;
    // Attach the source only once the card is actually visible.
    if (!record.video.hasAttribute('src') || record.video.error) {
      record.video.src = record.item.src;
      record.video.load();
    }
    record.pending = true;
    record.video.play().then(() => {
      record.pending = false;
      if (!canPlay(record)) record.video.pause();
    }).catch((error) => {
      record.pending = false;
      // An interrupted request is normal when scrolling quickly or opening a menu.
      if (error.name === 'AbortError') {
        if (canPlay(record)) syncRecord(record);
        return;
      }
      record.userPaused = true;
      updateControls(record);
      hint.textContent = 'Si tu navegador limita la reproducción automática, toca el botón de cada vista previa. También puedes ver el video completo.';
    });
  }

  function syncAll() {
    globalControl.dataset.state = allPaused ? 'paused' : 'playing';
    globalControl.querySelector('span:last-child').textContent = allPaused ? 'Reproducir videos' : 'Pausar videos';
    records.forEach(syncRecord);
  }

  lookClips.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'clip-card';
    card.dataset.state = 'paused';
    const screen = document.createElement('div');
    screen.className = 'clip-screen';
    const video = document.createElement('video');
    video.className = 'look-clip-video';
    video.poster = item.poster;
    video.preload = 'none';
    video.muted = video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('aria-label', `Vista previa sin sonido: ${item.title}`);

    const badge = document.createElement('span');
    badge.className = 'clip-badge';
    badge.textContent = 'VISTA PREVIA';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'clip-toggle';
    button.dataset.state = 'paused';
    const symbol = document.createElement('span');
    symbol.className = 'clip-control-symbol';
    symbol.setAttribute('aria-hidden', 'true');
    button.append(symbol);
    screen.append(video, badge, button);

    const caption = document.createElement('div');
    caption.className = 'clip-caption';
    const title = document.createElement('h4');
    title.textContent = item.title;
    const full = document.createElement('a');
    full.href = item.fullSrc;
    full.target = '_blank';
    full.rel = 'noopener noreferrer';
    full.textContent = 'Ver completo ↗';
    full.setAttribute('aria-label', `Ver video completo: ${item.title} (abre una nueva pestaña)`);
    caption.append(title, full);
    card.append(screen, caption);
    grid.append(card);

    const record = { card, video, button, item, visible: false, userPaused: false, pending: false };
    records.push(record);
    updateControls(record);
    video.addEventListener('play', () => updateControls(record));
    video.addEventListener('pause', () => updateControls(record));
    button.addEventListener('click', () => {
      if (!video.paused) {
        record.userPaused = true;
        video.pause();
      } else {
        record.userPaused = false;
        allPaused = false;
        syncAll();
      }
    });
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const record = records.find((item) => item.video === entry.target);
        record.visible = entry.isIntersecting && entry.intersectionRatio >= .35;
        syncRecord(record);
      });
    }, { threshold: [0, .35] });
    records.forEach((record) => observer.observe(record.video));
  } else {
    const updateVisible = () => {
      records.forEach((record) => {
        const rect = record.video.getBoundingClientRect();
        record.visible = rect.bottom > 0 && rect.top < window.innerHeight;
      });
      syncAll();
    };
    window.addEventListener('scroll', updateVisible, { passive: true });
    window.addEventListener('resize', updateVisible);
    updateVisible();
  }

  globalControl.addEventListener('click', () => {
    allPaused = !allPaused;
    if (!allPaused) records.forEach((record) => { record.userPaused = false; });
    syncAll();
  });
  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) { allPaused = true; syncAll(); }
  });
  document.addEventListener('visibilitychange', syncAll);
  // Pause previews while the main tour is playing or a modal menu/gallery is open.
  ['play', 'pause', 'ended'].forEach((name) => document.addEventListener(name, (event) => {
    if (event.target instanceof HTMLVideoElement && !grid.contains(event.target)) syncAll();
  }, true));
  new MutationObserver(syncAll).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
  if (allPaused) hint.textContent = 'Reproducción automática desactivada por tus preferencias de movimiento o ahorro de datos. Puedes activarla con “Reproducir videos”.';
  syncAll();
}
