/*
  Portfolio — progressive enhancement only.
  Without this file the page is complete: every section is visible,
  links work and <details> panels open natively.

  1. Reveal sections as they scroll into view (skipped with reduced motion).
  2. Cursor-following light on cards (pointer devices only).
  3. Mark the current section in the navigation.
*/
(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasObserver = 'IntersectionObserver' in window;

  // 1. Reveal on scroll ------------------------------------------------------
  // The hidden starting state only exists under html.js, so content is never
  // hidden if this script fails or motion is reduced.
  if (hasObserver && !reduceMotion) {
    root.classList.add('js');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
  }

  // 2. Spotlight -------------------------------------------------------------
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.spotlight').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        card.style.setProperty('--my', `${event.clientY - rect.top}px`);
      });
    });
  }

  // 3. Current section in the navigation -------------------------------------
  if (hasObserver) {
    const links = new Map(
      [...document.querySelectorAll('.site-nav a[href^="#"]')]
        .map((link) => [link.getAttribute('href').slice(1), link])
    );

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.removeAttribute('aria-current'));
        const active = links.get(entry.target.id);
        if (active) active.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    // The hero has no nav link: observing it clears the marker at the top of the page.
    ['hero', ...links.keys()].forEach((id) => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }
})();
