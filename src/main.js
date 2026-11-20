import './style.css';
import './joy-strip.css';
import './gallery.css';
import './tour.css';
import './clips.css';
import './shop.css';
import './reviews.css';
import './stylist.css';
import './scroll-animations.css';
import './header.css';
import './whatsapp-widget.css';
import { initGallery } from './gallery.js';
import { initHeader } from './header.js';
import { initClips } from './clips.js';
import { initShop } from './shop.js';
import { initReviews } from './reviews.js';
import { initScrollAnimations } from './scroll-animations.js';
import { initWhatsAppWidget } from './whatsapp-widget.js';
import { getWhatsAppUrl } from './whatsapp.js';
import { createIcons, ArrowUpRight, ArrowDown, ArrowRight, ArrowUp, MessageCircle, Menu, X, Heart, Scissors, Sprout, Sparkles, Smile, HandHeart, WandSparkles, Clock3, Plus, Info, Clapperboard, ChevronLeft, ChevronRight, MapPin, ShoppingBag, Droplets, Blocks } from 'lucide';

const icons = { ArrowUpRight, ArrowDown, ArrowRight, ArrowUp, MessageCircle, Menu, X, Heart, Scissors, Sprout, Sparkles, Smile, HandHeart, WandSparkles, Clock3, Plus, Info, Clapperboard, ChevronLeft, ChevronRight, MapPin, ShoppingBag, Droplets, Blocks };
createIcons({ icons, attrs: { 'stroke-width': 1.7 } });
initGallery();

document.querySelectorAll('[data-whatsapp]').forEach((link) => {
  const message = link.dataset.whatsappMessage || (link.dataset.service
    ? `¡Hola, Jian Salon Kids! Quisiera información para reservar ${link.dataset.service} para mi peque. ¿Qué horarios tienen disponibles?`
    : '¡Hola, Jian Salon Kids! Me gustaría reservar una cita para mi peque. ¿Qué horarios tienen disponibles?');
  link.href = getWhatsAppUrl(message);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});

initHeader();
initClips();
initShop();
initReviews();
initScrollAnimations();
initWhatsAppWidget();

document.getElementById('year').textContent = new Date().getFullYear();

// Keep the FAQ easy to scan: only one answer is expanded at a time.
document.querySelectorAll('.faq-list details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (detail.open) document.querySelectorAll('.faq-list details').forEach((other) => { if (other !== detail) other.open = false; });
  });
});
