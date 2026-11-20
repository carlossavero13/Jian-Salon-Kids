// Añade las fotos a public/galeria/ y registra cada una aquí.
// Categorías disponibles: 'cortes', 'momentos' y 'salon'.
// Cambia illustrative a false SOLO cuando sea un trabajo real del salón,
// publicado con autorización de sus padres o tutores.
export const looks = [
  {
    src: '/galeria/corte2.webp',
    title: 'Un look con personalidad',
    alt: 'Un estilista de Jian perfila el cabello de un niño con capa verde',
    category: 'cortes',
    position: 'center 45%',
    illustrative: false,
  },
  {
    src: '/galeria/corte4.webp',
    title: 'Un corte sobre ruedas',
    alt: 'Un peque recibe su corte sentado en una silla infantil con forma de motocicleta',
    category: 'cortes',
    position: 'center 55%',
    illustrative: false,
  },
  {
    src: '/galeria/servicio_listo3.webp',
    title: 'Sonrisas en familia',
    alt: 'Una familia posa junto al estilista y un peque en la silla de juegos del salón',
    category: 'momentos',
    position: 'center 55%',
    illustrative: false,
  },
  {
    src: '/galeria/corte1.webp',
    title: 'Cuidando cada detalle',
    alt: 'Un estilista trabaja en el corte de un niño con capa azul frente al espejo',
    category: 'cortes',
    position: 'center 55%',
    illustrative: false,
  },
  {
    src: '/galeria/local1.webp',
    title: 'Bienvenidos a Jian',
    alt: 'Vista del interior de Jian con espejos de marcos verdes, sillones y piso infantil de colores',
    category: 'salon',
    position: 'center 55%',
    illustrative: false,
  },
  {
    src: '/galeria/servicio_listo1.webp',
    title: 'Una visita para recordar',
    alt: 'El estilista posa con una familia y su peque después de la visita a Jian',
    category: 'momentos',
    position: 'center 50%',
    illustrative: false,
  },
  {
    src: '/galeria/corte3.webp',
    title: 'A su ritmo, con cariño',
    alt: 'Un peque acompañado por una persona adulta recibe un corte en una silla infantil verde',
    category: 'cortes',
    position: 'center 55%',
    illustrative: false,
  },
  {
    src: '/galeria/servicio_listo2.webp',
    title: 'En buena compañía',
    alt: 'Una persona adulta sostiene a un peque mientras el estilista le corta el cabello',
    category: 'momentos',
    position: 'center 50%',
    illustrative: false,
  },
  {
    src: '/galeria/local2.webp',
    title: 'Un espacio lleno de color',
    alt: 'Estaciones de corte y espejos verdes junto al área de piso con números de colores',
    category: 'salon',
    position: 'center 55%',
    illustrative: false,
  },
  {
    src: '/galeria/local3.webp',
    title: 'Todo listo para su visita',
    alt: 'Sillones y estaciones de trabajo de Jian con espejos de marcos verdes',
    category: 'salon',
    position: 'center 55%',
    illustrative: false,
  },
  {
    src: '/galeria/local4.webp',
    title: 'Aquí empieza su próximo look',
    alt: 'Vista amplia del salón con sillones, espejos y decoración infantil',
    category: 'salon',
    position: 'center 55%',
    illustrative: false,
  },
];

// Añade archivos MP4 a public/videos/ y sus portadas a public/galeria/.
// No hay videos de ejemplo para no presentar contenido ficticio del salón.
// Ejemplo de una entrada:
// {
//   src: '/videos/nuevo-look.mp4',
//   poster: '/galeria/portada-nuevo-look.webp',
//   title: 'Un nuevo look, paso a paso',
//   description: 'Así fue este cambio de estilo en Jian.',
//   captions: '/videos/nuevo-look-es.vtt', // Subtítulos si hay voz.
// }
export const videos = [
  {
    src: '/videos/video_principal.mp4',
    poster: '/galeria/local1.webp',
    title: 'Un recorrido por Jian',
    description: 'Nuestro peluquero te presenta el espacio donde recibimos a los peques y sus familias.',
    featured: true,
    aspectRatio: '9 / 16',
  },
];

// Vistas previas ligeras, sin audio, de 10 segundos. Los originales se conservan.
export const lookClips = [
  {
    src: '/videos/previews/video1.mp4',
    fullSrc: '/videos/video1.mp4',
    poster: '/videos/previews/video1.webp',
    title: 'Cortes con cariño',
  },
  {
    src: '/videos/previews/video2.mp4',
    fullSrc: '/videos/video2.mp4',
    poster: '/videos/previews/video2.webp',
    title: 'Pequeños grandes estilos',
  },
  {
    src: '/videos/previews/video3.mp4',
    fullSrc: '/videos/video3.mp4',
    poster: '/videos/previews/video3.webp',
    title: 'A su ritmo',
  },
];
