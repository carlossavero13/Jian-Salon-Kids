// A single viewport observer, no scroll handlers, and no scroll interception.
const rules = [
  { selector: '.hero-copy > .eyebrow, .hero-copy > h1, .hero-copy > p, .hero-actions, .hero-note', stagger: 55, cycle: 5 },
  { selector: '.hero-visual', variant: 'photo', delay: 100 },
  { selector: '.joy-message', stagger: 65, cycle: 3 },
  { selector: '.experience-visual, .stylist-visual, .reviews-photo, .map-card', variant: 'photo' },
  { selector: '.experience-copy > .eyebrow, .experience-copy > h2, .experience-copy > p, .experience-item, .experience-copy > .text-link', stagger: 45, cycle: 3 },
  { selector: '.section-heading, .gallery-toolbar, .clips-heading-row, .shop-toolbar' },
  { selector: '.look-card, .clip-card, .product-card, .family-review-card', variant: 'photo', stagger: 65, grid: true },
  { selector: '.gallery-more-wrap, .clips-hint', variant: 'fade' },
  { selector: '.stylist-copy > .eyebrow, .stylist-copy > h2, .stylist-copy > p, .stylist-value, .stylist-actions', stagger: 45, cycle: 3 },
  { selector: '.tour .video-heading-row > div:first-child, .tour .video-heading-row > p, .tour-highlights > div, .tour-actions, .tour-photo-note', stagger: 45, cycle: 3 },
  { selector: '.tour-stage', variant: 'photo' },
  { selector: '.reviews-invitation, .reviews-share, .shop-note' },
  { selector: '.shop-category', stagger: 75, grid: true },
  { selector: '.faq > div:first-child, .visit-copy' },
  { selector: '.faq-list > details', stagger: 50, cycle: 4 },
  { selector: '.footer-main, .footer-bottom', variant: 'fade' },
];

export function initScrollAnimations() {
  const root = document.documentElement;
  if (root.dataset.scrollAnimations) return;
  if (typeof window.IntersectionObserver !== 'function') {
    root.dataset.scrollAnimations = 'unsupported';
    return;
  }

  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const known = new WeakSet();
  const active = new Set();
  let observer;
  let changes;
  let loaderObserver;
  let enabled = false;
  let started = false;

  function finish(element) {
    observer?.unobserve(element);
    element.removeEventListener('transitionend', onTransitionEnd);
    element.removeEventListener('transitioncancel', onTransitionEnd);
    element.classList.remove('scroll-reveal', 'is-revealed');
    element.style.removeProperty('--scroll-delay');
    element.dataset.scrollRevealState = 'complete';
    active.delete(element);
  }

  function onTransitionEnd(event) {
    if (event.propertyName === 'opacity' && event.target.classList.contains('is-revealed')) finish(event.target);
  }

  function reveal(element, instant = false) {
    if (!active.has(element)) return;
    observer?.unobserve(element);
    if (instant || preference.matches || document.visibilityState === 'hidden') {
      finish(element);
      return;
    }
    element.dataset.scrollRevealState = 'revealing';
    element.addEventListener('transitionend', onTransitionEnd);
    element.addEventListener('transitioncancel', onTransitionEnd);
    element.classList.add('is-revealed');
  }

  function register(element, rule, index) {
    if (!enabled || preference.matches || known.has(element) || !element.isConnected || element.closest('dialog, [hidden]') || !element.getClientRects().length) return;
    known.add(element);
    element.dataset.scrollReveal = rule.variant || 'up';
    // Never hide content the visitor has already passed, or is using by keyboard.
    if (element.getBoundingClientRect().bottom <= 0 || element.contains(document.activeElement)) {
      element.dataset.scrollRevealState = 'complete';
      return;
    }
    let position = index % (rule.cycle || 1);
    if (rule.grid) {
      const parent = element.parentElement;
      const columns = getComputedStyle(parent).gridTemplateColumns.split(/\s+/).length;
      position = [...parent.children].indexOf(element) % Math.max(1, columns);
    }
    const delay = Math.min(220, (rule.delay || 0) + position * (rule.stagger || 0));
    element.style.setProperty('--scroll-delay', `${delay}ms`);
    element.dataset.scrollRevealState = 'pending';
    element.classList.add('scroll-reveal');
    active.add(element);
    if (started) observer.observe(element);
  }

  function scan(scope) {
    rules.forEach((rule) => {
      const elements = [...scope.querySelectorAll(rule.selector)];
      if (scope instanceof Element && scope.matches(rule.selector)) elements.unshift(scope);
      elements.forEach((element, index) => register(element, rule, index));
    });
  }

  function start() {
    if (!enabled || started) return;
    started = true;
    loaderObserver?.disconnect();
    active.forEach((element) => observer.observe(element));
  }

  function disable() {
    enabled = started = false;
    observer?.disconnect();
    changes?.disconnect();
    loaderObserver?.disconnect();
    [...active].forEach(finish);
    root.dataset.scrollAnimations = 'reduced';
  }

  function enable() {
    if (enabled || preference.matches) return;
    enabled = true;
    root.dataset.scrollAnimations = 'active';
    try {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => { if (entry.isIntersecting) reveal(entry.target); });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });
      scan(document);
      changes = new MutationObserver((mutations) => {
        // Newly filtered photos, expanded cards, and approved reviews animate too.
        [...active].forEach((element) => { if (!element.isConnected) finish(element); });
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes') {
            if (!mutation.target.hidden) scan(mutation.target);
          } else {
            mutation.addedNodes.forEach((node) => { if (node instanceof Element) scan(node); });
          }
        });
      });
      changes.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
      if (root.classList.contains('is-loading')) {
        loaderObserver = new MutationObserver(() => { if (!root.classList.contains('is-loading')) start(); });
        loaderObserver.observe(root, { attributes: true, attributeFilter: ['class'] });
      } else start();
    } catch {
      // Fail open: a browser without the animation APIs must never lose content.
      disable();
      root.dataset.scrollAnimations = 'unavailable';
    }
  }

  // Keyboard users see the focused card or button immediately, without waiting.
  document.addEventListener('focusin', (event) => {
    [...active].forEach((element) => { if (element.contains(event.target)) reveal(element, true); });
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      [...active].forEach((element) => { if (element.classList.contains('is-revealed')) finish(element); });
    }
  });
  preference.addEventListener('change', () => { if (preference.matches) disable(); else enable(); });
  if (preference.matches) root.dataset.scrollAnimations = 'reduced';
  else enable();
}
