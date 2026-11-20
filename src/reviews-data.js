export const reviewSettings = {
  locationUrl: 'https://maps.app.goo.gl/S9sknLK7RaPZSHfx6',
  // El enlace anterior abre una dirección, no la ficha comercial con reseñas.
  profileUrl: null,
  // Añadir solo si el negocio proporciona un enlace directo verificado.
  // Mientras tanto, las familias pueden compartir su experiencia por WhatsApp.
  writeReviewUrl: null,
};

// Solo testimonios reales, verificados y autorizados para su reproducción.
// No inventar nombres, calificaciones, fechas, promedios ni cantidades.
// Estructura:
// {
//   author: 'Nombre autorizado o iniciales',
//   text: 'Texto real de la opinión, sin cambiar su sentido.',
//   rating: null, // Número entero de 1 a 5, solo si consta en el original.
//   source: 'Google', // O la fuente real de la opinión.
//   sourceUrl: 'https://enlace-verificado-al-original',
//   approved: true, // Confirmar autenticidad y autorización antes de publicar.
// }
export const familyReviews = [];
