import { products } from './products-data.js';
import { getWhatsAppUrl } from './whatsapp.js';

const PAGE_SIZE = 8;
const categories = { cuidado: 'Cuidado del cabello', juguetes: 'Juguetes' };
const currency = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });

export function getProductMessage(product) {
  return product.available === false
    ? `¡Hola, Jian Salón Kids! Me interesa “${product.name}”. ¿Volverá a estar disponible?`
    : `¡Hola, Jian Salón Kids! Quisiera consultar por “${product.name}”. ¿Me confirman el precio y la disponibilidad?`;
}

export function formatProductPrice(price) {
  return typeof price === 'number' && Number.isFinite(price) && price >= 0
    ? currency.format(price)
    : 'Consultar precio';
}

export function initShop(items = products) {
  const catalog = document.getElementById('shop-catalog');
  const grid = document.getElementById('shop-grid');
  const more = document.getElementById('shop-more');
  // Category cards remain useful even before the real inventory is supplied.
  catalog.hidden = items.length === 0;
  if (!items.length) return;

  let selected = 'todos';
  let limit = PAGE_SIZE;

  function render() {
    const filtered = items.filter((product) => selected === 'todos' || product.category === selected);
    grid.replaceChildren();
    filtered.slice(0, limit).forEach((product) => {
      const card = document.createElement('article');
      card.className = 'product-card';
      const visual = document.createElement('div');
      visual.className = 'product-visual';
      if (product.image) {
        const image = document.createElement('img');
        image.src = product.image;
        image.alt = product.alt || product.name;
        image.loading = 'lazy';
        image.decoding = 'async';
        visual.append(image);
      } else {
        const missingPhoto = document.createElement('span');
        missingPhoto.className = 'product-photo-pending';
        missingPhoto.textContent = 'Fotografía próximamente';
        visual.append(missingPhoto);
      }
      const tag = document.createElement('span');
      tag.className = 'product-category';
      tag.textContent = categories[product.category];
      visual.append(tag);
      const content = document.createElement('div');
      content.className = 'product-content';
      const title = document.createElement('h3');
      title.textContent = product.name;
      content.append(title);
      [
        product.description,
        product.presentation,
        product.category === 'juguetes' && product.recommendedAge
          ? `Edad recomendada: ${product.recommendedAge}` : '',
      ].filter(Boolean).forEach((text) => {
        const detail = document.createElement('p');
        detail.textContent = text;
        content.append(detail);
      });
      const price = document.createElement('strong');
      price.className = 'product-price';
      price.textContent = formatProductPrice(product.price);
      content.append(price);
      if (product.available === false) {
        const stock = document.createElement('span');
        stock.className = 'product-stock';
        stock.textContent = 'Agotado · Consulta por reposición';
        content.append(stock);
      }
      const contact = document.createElement('a');
      contact.className = 'product-contact';
      contact.textContent = product.available === false ? 'Consultar reposición ↗' : 'Consultar por WhatsApp ↗';
      contact.href = getWhatsAppUrl(getProductMessage(product));
      contact.target = '_blank';
      contact.rel = 'noopener noreferrer';
      contact.setAttribute('aria-label', `Consultar por WhatsApp: ${product.name}`);
      card.append(visual, content, contact);
      grid.append(card);
    });
    more.hidden = filtered.length <= limit;
    document.getElementById('shop-empty').hidden = filtered.length > 0;
    document.getElementById('shop-count').textContent = `${Math.min(limit, filtered.length)} de ${filtered.length} ${filtered.length === 1 ? 'artículo' : 'artículos'}`;
  }

  document.querySelectorAll('[data-shop-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      selected = button.dataset.shopFilter;
      limit = PAGE_SIZE;
      document.querySelectorAll('[data-shop-filter]').forEach((filter) => {
        const active = filter === button;
        filter.classList.toggle('is-active', active);
        filter.setAttribute('aria-pressed', String(active));
      });
      render();
    });
  });
  more.addEventListener('click', () => {
    const firstNewIndex = grid.children.length;
    limit += PAGE_SIZE;
    render();
    grid.children[firstNewIndex]?.querySelector('a')?.focus({ preventScroll: true });
  });
  render();
}
