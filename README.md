# Jian Salon Kids

Landing page responsive para una peluquería infantil, creada con HTML, CSS y JavaScript sobre Vite.

## Orden de la landing

1. Portada con la propuesta del salón y reserva por WhatsApp.
2. Franja verde y experiencia infantil.
3. Galería de fotos y vistas previas de cortes en video.
4. Presentación del peluquero.
5. Recorrido por el salón.
6. Opiniones de familias y cómo compartir una experiencia.
7. Productos y juguetes (categorías preparadas, sin artículos ficticios).
8. Preguntas frecuentes.
9. Dirección, horario y reserva.

Se retiró el bloque «Tan únicos como ellos» con sus tres tarjetas de servicios. El menú y el enlace «Conoce más» ya no apuntan a esa sección. Las preguntas frecuentes van justo antes del contacto, y se redujo el espacio duplicado entre galería y perfil.

## Animaciones al desplazarse

Textos, fotos y tarjetas aparecen suavemente cuando entran en pantalla. Las tarjetas tienen una breve secuencia por columna. En móvil el movimiento es más corto y dura 500 ms; en escritorio, 620 ms. La primera entrada espera a que termine la bienvenida de 1,8 segundos.

- Código: `src/scroll-animations.js`; estilos: `src/scroll-animations.css`.
- Usa un solo `IntersectionObserver`, sin librerías adicionales ni eventos continuos de scroll. No modifica el desplazamiento nativo del teléfono ni el tamaño del contenido.
- Cada elemento se anima una vez. Las fotos añadidas con «Ver más» y al cambiar de filtro también se registran.
- No modifica los giros decorativos, el zoom solicitado de la portada ni los controles de video.
- Con movimiento reducido, sin soporte del navegador o al imprimir, el contenido se mantiene visible. Al enfocar un control con teclado se muestra inmediatamente.

## Mensaje del botón de WhatsApp

El botón flotante muestra «¡Hola! 👋 ¿Agendamos el próximo look de tu peque?» un segundo después de terminar la bienvenida, con una entrada suave y dos pulsos breves. Funciona también en móvil, respeta el área segura del dispositivo y no abre WhatsApp automáticamente.

El mensaje y el botón abren el mismo número de reservas. La cruz permite cerrar solo el mensaje, conservando el botón. El cierre se recuerda durante la sesión de esa pestaña con `sessionStorage` (sin datos personales). El mensaje se oculta mientras haya un modal abierto y no tiene animación con movimiento reducido.

Texto: `index.html`; comportamiento: `src/whatsapp-widget.js`; diseño: `src/whatsapp-widget.css`.

## Desarrollo

```sh
npm install
npm run dev
```

## Publicación

```sh
npm run build
```

Publica la carpeta `dist/` en cualquier hosting estático (por ejemplo, Netlify, Vercel o GitHub Pages, configurando la base de Vite si corresponde).

## Imágenes WebP

Las 21 imágenes se convirtieron a **`.webp`**, incluidas las fotos, el logo y las portadas de videos. Su peso conjunto pasó de **5.831.491 a 2.118.744 bytes**, aproximadamente **64 % menos**. Las fotos conservan su proporción y tienen hasta 1600 px por lado; el logo conserva la transparencia y usa compresión sin pérdida a 720 px de ancho.

Los JPG/PNG originales están respaldados en `originales/imagenes/`, manteniendo su estructura de carpetas. Cada respaldo se verificó por SHA-256. Esa carpeta queda fuera de `public`, de la compilación y de Git, para no subir copias pesadas. El `logo.png` que estaba en la raíz también se conserva sin modificar.

Solo se mantiene un **favicon PNG de 64 × 64 px** por compatibilidad. Los videos siguen en MP4; sus imágenes de portada ahora son WebP.

Para convertir nuevas imágenes JPG/PNG colocadas en `public`, con FFmpeg instalado:

```sh
npm run optimize:images -- --ffmpeg "C:\ruta\a\ffmpeg.exe"
```

El script genera WebP, comprueba que se puedan decodificar y después mueve los originales a `originales/imagenes/`. Guarda un informe de tamaños y respaldos. No sobrescribe archivos WebP existentes: usa un nombre nuevo para una foto nueva. Actualiza después las rutas de las imágenes en `index.html` o los archivos de datos y ejecuta `npm run build`. Para publicar, sube solo `dist/`, no la carpeta de originales.

## Personalización

- Contenido y enlace a Google Maps: `index.html`.
- Colores, diseño y versión móvil: `src/style.css`.
- Franja verde de mensajes: `src/joy-strip.css`. Los tres mensajes se acomodan en columnas y el texto se ajusta sin recortarse en celulares.
- Cabecera y menú móvil: `src/header.css` y `src/header.js`. El menú se abre como panel modal con cierre por botón, Escape o fondo, y enlaces a las secciones.
- Bienvenida inicial: `src/loader.css` y el bloque inicial de `index.html`. Dura 1800 ms (incluye una salida de 300 ms), utiliza el logo real y respeta movimiento reducido. No depende del tiempo de carga de fotos o videos; sin JavaScript no bloquea el contenido.
- Número de WhatsApp: `src/whatsapp.js`. Mensajes de reservas: `src/main.js`; mensajes de consulta de productos: `src/shop.js` e `index.html`.
- Logo de la cabecera y pie de página: `public/logo.webp`. Icono de la pestaña: `public/favicon.png`.
- Foto principal del salón: `public/galeria/jian_salon.webp`.
- Fotos reales de cortes, familias y local: `public/galeria/`, registradas en `src/gallery-data.js`.

Colores principales: `#79c624` y `#bbb4ac`.

## Conoce al peluquero

El perfil `#peluquero` aparece después de «La experiencia» y antes del recorrido en video. Utiliza la foto proporcionada, optimizada como `public/galeria/maestro.webp`, tiene acceso al video y un mensaje específico de WhatsApp para conversar sobre la visita.

Contenido: `index.html`; diseño responsive: `src/stylist.css`. La biografía presenta a Edgar Alata, con experiencia laboral en Safari Kids y más de 15 años realizando cortes, según la información proporcionada por el negocio. Incluye mensajes de atención cercana y paciente.

## Opiniones de familias

La sección `#opiniones` está entre el recorrido del salón y las preguntas frecuentes. Invita a compartir una experiencia por WhatsApp y enlaza a la ubicación de Google Maps. No muestra una nota media, número de reseñas, estrellas, autores ni comentarios inventados. La fotografía es del salón y no se presenta como el autor de un testimonio.

- Datos y enlaces: `src/reviews-data.js`.
- Tarjetas: `src/reviews.js`; diseño: `src/reviews.css`.
- Para mostrar testimonios dentro de la landing, añade reseñas reales a `familyReviews`, con autor autorizado, texto original y fuente. Solo se publican entradas con `approved: true`.
- `rating` es opcional: si no consta en el original, déjalo en `null`. No se calcula ni se simula una valoración de Google.
- El enlace proporcionado se verificó y abre **Av. Los Quechuas 1338**, no una ficha comercial con reseñas. Se conserva en `locationUrl`. `profileUrl` y `writeReviewUrl` quedan en `null` hasta recibir los enlaces reales del negocio.
- Al añadir `profileUrl`, el botón cambia a «Ver ficha y opiniones» y el texto explica cómo opinar en Google. Con `writeReviewUrl`, el segundo botón puede abrir el formulario verificado. Sin esos enlaces, el botón invita a compartir la experiencia por WhatsApp, sin publicarla automáticamente.
- No se sincroniza automáticamente con Google ni se reciben opiniones mediante un formulario local. No hay compras, incentivos ni selección basada en si la experiencia fue positiva.

## Productos y juguetes

La sección **«Un poquito de Jian para llevar»** aparece antes de «Visítanos» y tiene dos categorías con consultas de WhatsApp: **Cuidado del cabello** y **Juguetes**. No incluye carrito, pagos en línea ni promesas de delivery o recojo sin confirmar.

Por ahora no se publican artículos individuales: faltan fotos, nombres, presentaciones, precios y edades recomendadas reales. Las ilustraciones de las categorías son decorativas y no representan inventario específico.

Para completar el catálogo:

1. Coloca las fotos en `public/productos/`.
2. Registra los artículos en `src/products-data.js`, siguiendo la estructura comentada.
3. Usa `category: 'cuidado'` o `category: 'juguetes'`. Los precios numéricos se muestran en soles; `price: null` muestra «Consultar precio».
4. Solo indica una edad recomendada si figura en el fabricante. `available: null` no afirma disponibilidad; `false` muestra «Agotado» y permite consultar por reposición.
5. Compila y vuelve a publicar la web.

Al registrar el primer artículo, aparecen automáticamente las tarjetas y los filtros del catálogo. Se muestran ocho artículos al inicio y un botón para ver más. Cada producto abre WhatsApp con su nombre en el mensaje, sin enviar nada automáticamente. Diseño: `src/shop.css`; lógica: `src/shop.js`.

Las fotografías de stock anteriores se conservan como archivos, pero ya no se muestran en la web. Fuentes originales: [corte](https://www.pexels.com/photo/a-barber-holding-a-hair-clipper-trimming-a-boy-s-hair-7697401/), [experiencia](https://www.pexels.com/photo/boy-at-the-barbershop-7697359/) y [trenzas](https://www.pexels.com/photo/girls-with-braided-hair-19202072/).

Dirección proporcionada: **Av. Los Quechuas 1338**, visible en contacto, tarjeta de ubicación y preguntas frecuentes. Los enlaces conservan la ubicación de Google Maps proporcionada. No se han añadido distrito, ciudad, precios, reseñas ni días de atención sin confirmar.

## Añadir fotos a la Galería de Looks

1. Coloca tus imágenes WebP en `public/galeria/`. Usa nombres sin espacios ni tildes, como `corte-infantil.webp`.
2. Abre `src/gallery-data.js` y añade una entrada al arreglo `looks` por cada foto:

```js
{
  src: '/galeria/corte-infantil.webp',
  title: 'Un look con mucha onda',
  alt: 'Descripción del corte que aparece en la fotografía',
  category: 'cortes', // 'cortes', 'momentos' o 'salon'
  position: 'center', // Opcional: ajusta el encuadre de la miniatura.
  illustrative: false,
},
```

La galería permite filtrar, ampliar y recorrer las imágenes con botones o las flechas del teclado. Se muestran seis fotos inicialmente y aparece **Ver más fotos** cuando hay más. Escape cierra la foto ampliada.

La galería contiene 11 fotos reales proporcionadas para el proyecto: cuatro cortes, tres momentos felices y cuatro vistas del salón. La foto `jian_salon.webp` se mantiene en la portada con el zoom solicitado. La sección de experiencia usa `corte4.webp`.

## Añadir videos

El video principal `public/videos/video_principal.mp4` se muestra en **«Conócenos antes de tu primera visita»**, después de la sección de experiencia. Mantiene su formato vertical 9:16, con portada `local1.webp`, controles y sin reproducción automática.

### Looks en movimiento

Los videos `video1.mp4` a `video3.mp4` se presentan bajo la galería como vistas previas automáticas, sin audio y en bucle. Se utilizan versiones derivadas de **10 segundos a 360 px**, en `public/videos/previews/`, para no descargar los originales de gran tamaño. Los originales se conservan y cada tarjeta incluye **Ver completo** (abre el archivo original en otra pestaña).

`video4.mp4` (66 MB) se retiró del proyecto y del repositorio por su peso. El archivo permanece respaldado en `originales/videos/video4.mp4`, fuera de `public/` y de Git. Para volver a publicarlo, recomprímelo a un tamaño razonable antes de subirlo.

- Configuración: arreglo `lookClips` en `src/gallery-data.js`.
- Comportamiento: `src/clips.js`; diseño: `src/clips.css`.
- Solo se cargan y reproducen al entrar en pantalla. Se pausan al salir, al ocultar la pestaña, al abrir un modal o al reproducir el recorrido principal.
- Hay controles para pausar cada video o todos. Las preferencias de movimiento reducido y ahorro de datos desactivan el inicio automático hasta que el visitante lo solicite.
- Si el navegador bloquea la reproducción automática, queda disponible el botón de reproducción.

Para regenerar las vistas previas y las portadas, con FFmpeg instalado:

```powershell
.\scripts\prepare-clips.ps1 -Ffmpeg 'C:\ruta\a\ffmpeg.exe'
```

El script sobrescribe únicamente los derivados de la carpeta `previews`, nunca los videos originales.

1. Coloca los archivos MP4 en `public/videos/` y sus portadas en `public/galeria/`.
2. Añade una entrada al arreglo `videos` en `src/gallery-data.js`:

```js
{
  src: '/videos/nuevo-look.mp4',
  poster: '/galeria/portada-nuevo-look.webp',
  title: 'Un nuevo look, paso a paso',
  description: 'Así fue este cambio de estilo en Jian.',
  captions: '/videos/nuevo-look-es.vtt', // Opcional; añade subtítulos si hay voz.
},
```

Los reproductores admiten controles nativos, pantalla completa y reproducción en celulares, sin reproducción automática. Solo se reproduce un video a la vez y se utiliza `preload="none"` para evitar descargar el video completo al abrir la landing. Para un video vertical, añade `aspectRatio: '9 / 16'`; `featured: true` destaca el video de presentación.

**Importante:** esta versión no incluye un panel de subida. El contenido se gestiona desde estas carpetas y el archivo de configuración; después hay que volver a compilar/publicar. Usa fotos WebP de hasta 1600 px y videos MP4 H.264/AAC. Para videos largos o numerosos conviene usar un servicio de video externo antes de publicarlos.

Publica imágenes y videos de menores únicamente con autorización expresa de sus padres o tutores. No incluyas nombres completos, edades u otros datos personales en títulos o nombres de archivos.
