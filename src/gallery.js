import { looks, videos } from './gallery-data.js';

const PAGE_SIZE = 6;
const categories = { cortes: 'Cortes', momentos: 'Momentos felices', salon: 'Nuestro salón' };

export function initGallery() {
  const grid = document.getElementById('gallery-grid');
  const more = document.getElementById('gallery-more');
  const count = document.getElementById('gallery-count');
  const dialog = document.getElementById('look-dialog');
  const image = document.getElementById('look-image');
  const previous = document.getElementById('look-previous');
  const next = document.getElementById('look-next');
  let category = 'todos';
  let limit = PAGE_SIZE;
  let currentIndex = 0;
  let opener;
  let scrollOverflow = '';

  const filteredLooks = () => looks.filter((look) => category === 'todos' || look.category === category);

  function showPhoto(index) {
    const items = filteredLooks();
    currentIndex = (index + items.length) % items.length;
    const look = items[currentIndex];
    image.src = look.src;
    image.alt = look.alt;
    document.getElementById('look-title').textContent = look.title;
    document.getElementById('look-description').textContent = look.illustrative
      ? 'Foto ilustrativa de inspiración · No es un trabajo del salón.'
      : categories[look.category];
    document.getElementById('look-position').textContent = `${currentIndex + 1} / ${items.length}`;
    previous.hidden = next.hidden = items.length < 2;
  }

  function renderPhotos() {
    const items = filteredLooks();
    grid.replaceChildren();
    items.slice(0, limit).forEach((look, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'look-card';
      button.setAttribute('aria-label', `Ampliar foto: ${look.title}`);

      const photo = document.createElement('img');
      photo.src = look.src;
      photo.alt = look.alt;
      photo.loading = 'lazy';
      photo.decoding = 'async';
      photo.style.objectPosition = look.position || 'center';

      const tag = document.createElement('span');
      tag.className = 'look-category';
      tag.textContent = categories[look.category];

      const caption = document.createElement('span');
      caption.className = 'look-card-caption';
      const title = document.createElement('strong');
      title.textContent = look.title;
      const expand = document.createElement('span');
      expand.className = 'look-expand';
      expand.textContent = '↗';
      expand.setAttribute('aria-hidden', 'true');
      caption.append(title, expand);
      button.append(photo, tag, caption);
      button.addEventListener('click', () => {
        opener = button;
        showPhoto(index);
        scrollOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        dialog.showModal();
      });
      grid.append(button);
    });
    more.hidden = items.length <= limit;
    count.textContent = `${Math.min(limit, items.length)} de ${items.length} ${items.length === 1 ? 'foto' : 'fotos'}`;
    document.getElementById('gallery-empty').hidden = items.length > 0;
    document.getElementById('gallery-disclaimer').hidden = !items.some((look) => look.illustrative);
  }

  document.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      category = button.dataset.filter;
      limit = PAGE_SIZE;
      document.querySelectorAll('[data-filter]').forEach((filter) => {
        const active = filter === button;
        filter.classList.toggle('is-active', active);
        filter.setAttribute('aria-pressed', String(active));
      });
      renderPhotos();
    });
  });

  more.addEventListener('click', () => {
    const firstNewIndex = grid.children.length;
    limit += PAGE_SIZE;
    renderPhotos();
    grid.children[firstNewIndex]?.focus({ preventScroll: true });
  });
  document.getElementById('look-close').addEventListener('click', () => dialog.close());
  previous.addEventListener('click', () => showPhoto(currentIndex - 1));
  next.addEventListener('click', () => showPhoto(currentIndex + 1));
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(currentIndex + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = scrollOverflow;
    image.removeAttribute('src');
    opener?.focus({ preventScroll: true });
  });

  const videoGrid = document.getElementById('video-grid');
  videoGrid.classList.toggle('video-grid-single', videos.length === 1);
  videos.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'video-card';
    if (item.featured) card.classList.add('video-card-featured');
    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'none';
    video.src = item.src;
    if (item.aspectRatio) video.style.aspectRatio = item.aspectRatio;
    if (item.poster) video.poster = item.poster;
    video.setAttribute('aria-label', item.title);
    if (item.captions) {
      const track = document.createElement('track');
      Object.assign(track, { kind: 'captions', src: item.captions, srclang: 'es', label: 'Español', default: true });
      video.append(track);
    }
    video.addEventListener('play', () => {
      videoGrid.querySelectorAll('video').forEach((other) => { if (other !== video) other.pause(); });
    });
    const title = document.createElement('h4');
    title.textContent = item.title;
    const description = document.createElement('p');
    description.textContent = item.description || '';
    if (item.featured) {
      const player = document.createElement('div');
      player.className = 'tour-player';
      const label = document.createElement('span');
      label.className = 'tour-player-brand';
      label.textContent = 'JIAN · SALÓN KIDS';
      const screen = document.createElement('div');
      screen.className = 'tour-player-screen';
      const play = document.createElement('button');
      play.type = 'button';
      play.className = 'tour-play';
      play.setAttribute('aria-label', `Reproducir: ${item.title}`);
      const symbol = document.createElement('span');
      symbol.className = 'tour-play-symbol';
      symbol.textContent = '▶';
      symbol.setAttribute('aria-hidden', 'true');
      const playText = document.createElement('span');
      playText.textContent = 'Ver recorrido';
      play.append(symbol, playText);
      const status = document.createElement('p');
      status.className = 'tour-player-status';
      status.setAttribute('role', 'status');
      status.hidden = true;
      play.addEventListener('click', () => {
        status.hidden = true;
        video.play().catch(() => {
          play.hidden = true;
          status.hidden = false;
          status.textContent = 'No se pudo iniciar el video. Inténtalo con los controles del reproductor.';
        });
      });
      video.addEventListener('play', () => { play.hidden = true; status.hidden = true; });
      video.addEventListener('pause', () => {
        play.hidden = false;
        playText.textContent = video.currentTime > 0 ? 'Continuar recorrido' : 'Ver recorrido';
        play.setAttribute('aria-label', `Continuar: ${item.title}`);
      });
      video.addEventListener('ended', () => {
        play.hidden = false;
        playText.textContent = 'Volver a ver';
        play.setAttribute('aria-label', `Volver a reproducir: ${item.title}`);
      });
      screen.append(video, play);
      player.append(label, screen);
      card.append(player, title, description, status);
    } else {
      card.append(video, title, description);
    }
    videoGrid.append(card);
  });
  document.getElementById('video-empty').hidden = videos.length > 0;
  videoGrid.hidden = videos.length === 0;
  renderPhotos();
}
