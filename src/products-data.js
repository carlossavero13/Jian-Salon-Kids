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
export const products = [];
