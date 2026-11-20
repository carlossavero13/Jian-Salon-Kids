import { familyReviews, reviewSettings } from './reviews-data.js';
import { getWhatsAppUrl } from './whatsapp.js';

export function getApprovedReviews(reviews) {
  return reviews.filter((review) => review && review.approved === true
    && typeof review.author === 'string' && review.author.trim()
    && typeof review.text === 'string' && review.text.trim());
}

function safeUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

export function initReviews(items = familyReviews) {
  const profileUrl = safeUrl(reviewSettings.profileUrl);
  const locationUrl = safeUrl(reviewSettings.locationUrl);
  const writeUrl = safeUrl(reviewSettings.writeReviewUrl);
  document.querySelectorAll('[data-review-profile]').forEach((link) => {
    if (profileUrl || locationUrl) link.href = profileUrl || locationUrl;
  });
  document.querySelector('[data-review-profile-label]').textContent = profileUrl
    ? 'Ver ficha y opiniones' : 'Ver ubicación en Google';
  document.querySelectorAll('[data-review-write]').forEach((link) => {
    link.href = writeUrl || profileUrl || getWhatsAppUrl('¡Hola, Jian Salón Kids! Quisiera compartir mi experiencia de nuestra visita al salón.');
    link.querySelector('[data-review-write-label]').textContent = writeUrl || profileUrl
      ? 'Compartir mi opinión' : 'Contar mi experiencia';
  });
  if (profileUrl) {
    document.getElementById('reviews-introduction').textContent = 'Conoce las opiniones directamente en nuestra ficha de Google. Y si ya nos visitaron, cuéntanos cómo les fue: nos ayuda a seguir cuidando cada detalle.';
    document.getElementById('reviews-source-text').textContent = 'Las opiniones se abren en Google Maps, en una nueva pestaña.';
  }
  if (writeUrl || profileUrl) {
    document.getElementById('reviews-share-instructions').textContent = writeUrl
      ? 'Comparte tu experiencia en Google. Puede pedirte iniciar sesión para escribir una reseña.'
      : 'Abre nuestra ficha en Google, entra a Reseñas y elige Escribir una reseña. Google puede pedirte iniciar sesión.';
  }

  const approved = getApprovedReviews(items);
  const published = document.getElementById('reviews-published');
  published.hidden = approved.length === 0;
  if (!approved.length) return;
  const grid = document.getElementById('reviews-grid');
  const more = document.getElementById('reviews-more');
  let limit = 3;

  function render() {
    grid.replaceChildren();
    approved.slice(0, limit).forEach((review) => {
      const card = document.createElement('figure');
      card.className = 'family-review-card';
      if (Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5) {
        const rating = document.createElement('div');
        rating.className = 'family-review-rating';
        rating.setAttribute('role', 'img');
        rating.setAttribute('aria-label', `${review.rating} de 5 estrellas`);
        for (let i = 1; i <= 5; i++) {
          const star = document.createElement('span');
          star.textContent = i <= review.rating ? '★' : '☆';
          star.setAttribute('aria-hidden', 'true');
          rating.append(star);
        }
        card.append(rating);
      }
      const quote = document.createElement('blockquote');
      const sourceUrl = safeUrl(review.sourceUrl);
      if (sourceUrl) quote.cite = sourceUrl;
      quote.textContent = review.text;
      const caption = document.createElement('figcaption');
      const initial = document.createElement('span');
      initial.className = 'family-review-initial';
      initial.textContent = review.author.trim().slice(0, 1).toLocaleUpperCase('es');
      initial.setAttribute('aria-hidden', 'true');
      const identity = document.createElement('span');
      const author = document.createElement('strong');
      author.textContent = review.author;
      const source = document.createElement('small');
      source.textContent = review.source || 'Testimonio compartido';
      identity.append(author, source);
      caption.append(initial, identity);
      card.append(quote, caption);
      if (sourceUrl) {
        const original = document.createElement('a');
        original.className = 'family-review-original';
        original.href = sourceUrl;
        original.target = '_blank';
        original.rel = 'noopener noreferrer';
        original.textContent = 'Ver opinión original ↗';
        original.setAttribute('aria-label', `Ver opinión original de ${review.author}`);
        card.append(original);
      }
      grid.append(card);
    });
    more.hidden = limit >= approved.length;
  }
  more.addEventListener('click', () => {
    limit += 3;
    render();
    if (more.hidden) grid.lastElementChild?.querySelector('a')?.focus({ preventScroll: true });
  });
  render();
}
