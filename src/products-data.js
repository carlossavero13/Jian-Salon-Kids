import { toys } from './toys-data.js';

// Coloca las fotos reales en public/productos/ y registra los artículos aquí.
// Solo añade datos confirmados: no se muestran productos ficticios.
// Categorías: 'cuidado' y 'juguetes'. Moneda: soles peruanos.
//
// Estructura de cada artículo:
// {
//   id: 'identificador-unico',
//   name: 'Nombre real del artículo',
//   category: 'cuidado',
//   image: '/productos/foto-real.webp',
//   alt: 'Descripción de la fotografía',
//   description: 'Descripción confirmada del artículo.',
//   presentation: 'Presentación indicada en el envase', // Opcional.
//   recommendedAge: 'Edad indicada por el fabricante', // Opcional, juguetes.
//   price: null, // Número en soles; null muestra "Consultar precio".
//   available: null, // true: confirmado; false: agotado; null: consultar.
// }
export const products = [
  {
    id: 'shampoo-muss-kids-manzanilla',
    name: 'Shampoo Muss Kids · Manzanilla',
    category: 'cuidado',
    type: 'shampoo',
    image: '/productos/shampoo-muss-kids-manzanilla.webp',
    alt: 'Shampoo Muss Kids Manzanilla en botella amarilla',
    presentation: '400 mL',
    price: null,
    available: null,
  },
  {
    id: 'shampoo-muss-kids-durazno',
    name: 'Shampoo Muss Kids · Durazno',
    category: 'cuidado',
    type: 'shampoo',
    image: '/productos/shampoo-muss-kids-durazno.webp',
    alt: 'Shampoo Muss Kids Durazno en botella naranja',
    presentation: '400 mL',
    price: null,
    available: null,
  },
  {
    id: 'shampoo-muss-kids-frutos-rojos',
    name: 'Shampoo Muss Kids · Frutos rojos',
    category: 'cuidado',
    type: 'shampoo',
    image: '/productos/shampoo-muss-kids-frutos-rojos.webp',
    alt: 'Shampoo Muss Kids Frutos Rojos en botella verde',
    presentation: '400 mL',
    price: null,
    available: null,
  },
  {
    id: 'shampoo-muss-baby',
    name: 'Shampoo Muss Baby',
    category: 'cuidado',
    type: 'shampoo',
    image: '/productos/shampoo-muss-baby.webp',
    alt: 'Shampoo Muss Baby en botella roja',
    price: null,
    available: null,
  },
  {
    id: 'gel-moco-de-gorila-botella',
    name: 'Gel Moco de Gorila · Punk',
    category: 'cuidado',
    type: 'gel',
    image: '/productos/gel-moco-de-gorila-botella.webp',
    alt: 'Gel fijador Moco de Gorila Punk en botella amarilla',
    presentation: 'Botella · 340 g',
    price: null,
    available: null,
  },
  {
    id: 'gel-moco-de-gorila-tubo',
    name: 'Gel Moco de Gorila · Punk',
    category: 'cuidado',
    type: 'gel',
    image: '/productos/gel-moco-de-gorila-tubo.webp',
    alt: 'Gel fijador Moco de Gorila Punk en tubo amarillo',
    presentation: 'Tubo · 210 g',
    price: null,
    available: null,
  },
  ...toys,
];
