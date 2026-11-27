import { products } from './products-data.js';
import { getWhatsAppUrl } from './whatsapp.js';

const PAGE_SIZE = 8;
const categories = { cuidado: 'Cuidado del cabello', juguetes: 'Juguetes' };
const currency = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });

export function getCatalogType(product) {
  if (product.category !== 'juguetes') return product.type || product.category;
  if (/muñeca/i.test(product.name)) return 'munecas';
  if (/auto|vehículo|camion|motocicleta|truck/i.test(product.name)) return 'vehiculos';
  if (/figura|superhéroe|dinosaurio/i.test(product.name)) return 'figuras';
  return 'juegos';
}

export function getProductMessage(product) {
  const label = product.presentation ? `${product.name} (${product.presentation})` : product.name;
  return product.available === false
    ? `¡Hola, Jian Salón Kids! Me interesa “${label}”. ¿Volverá a estar disponible?`
    : `¡Hola, Jian Salón Kids! Quisiera consultar por “${label}”. ¿Me confirman el precio y la disponibilidad?`;
}

export function formatProductPrice(price) {
  return typeof price === 'number' && Number.isFinite(price) && price >= 0
    ? currency.format(price)
    : 'Consultar precio';
}

export function initShop(items = products) {
  initCatalog(items.filter((product) => product.category !== 'juguetes'), 'shop');
  initCatalog(items.filter((product) => product.category === 'juguetes'), 'toys');
}

function initCatalog(items, prefix) {
  const catalog = document.getElementById(`${prefix}-catalog`);
  const grid = document.getElementById(`${prefix}-grid`);
  const more = document.getElementById(`${prefix}-more`);
  // Keep the catalog hidden only when no real inventory has been supplied.
  catalog.hidden = items.length === 0;
  if (!items.length) return;

  let selected = 'todos';
  let limit = PAGE_SIZE;
  const sort = document.getElementById(`${prefix}-sort`);

  function render() {
    const filtered = items.filter((product) => selected === 'todos' || getCatalogType(product) === selected);
    if (sort.value !== 'default') filtered.sort((a, b) => a.name.localeCompare(b.name, 'es') * (sort.value === 'za' ? -1 : 1));
    grid.replaceChildren();
    filtered.slice(0, limit).forEach((product) => {
      const card = document.createElement('article');
      card.className = 'product-card';
      const visual = document.createElement('a');
      visual.className = 'product-visual';
      visual.href = getWhatsAppUrl(getProductMessage(product));
      visual.target = '_blank';
      visual.rel = 'noopener noreferrer';
      visual.setAttribute('aria-label', `Consultar por WhatsApp: ${product.name}`);
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
      tag.textContent = product.type === 'shampoo' ? 'Shampoo' : product.type === 'gel' ? 'Gel fijador' : categories[product.category];

      const content = document.createElement('div');
      content.className = 'product-content';
      const title = document.createElement('h3');
      title.textContent = product.name;
      content.append(tag, title);
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
      contact.textContent = product.available === false ? 'Consultar reposición' : 'Consultar por WhatsApp';
      contact.href = getWhatsAppUrl(getProductMessage(product));
      contact.target = '_blank';
      contact.rel = 'noopener noreferrer';
      contact.setAttribute('aria-label', `Consultar por WhatsApp: ${product.name}`);
      card.append(visual, content, contact);
      grid.append(card);
    });
    more.hidden = filtered.length <= limit;
    document.getElementById(`${prefix}-empty`).hidden = filtered.length > 0;
    document.getElementById(`${prefix}-count`).textContent = `${Math.min(limit, filtered.length)} de ${filtered.length} ${filtered.length === 1 ? 'artículo' : 'artículos'}`;
  }

  catalog.querySelectorAll('[data-shop-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      selected = button.dataset.shopFilter;
      limit = PAGE_SIZE;
      catalog.querySelectorAll('[data-shop-filter]').forEach((filter) => {
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
  sort.addEventListener('change', () => {
    limit = PAGE_SIZE;
    render();
  });
  render();
}
