(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header = document.querySelector('[data-header]');
  if (header) {
    const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  const revealables = document.querySelectorAll('[data-reveal]');
  if (revealables.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealables.forEach((el) => el.classList.add('is-visible'));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
      );
      revealables.forEach((el) => observer.observe(el));
    }
  }

  const toc = document.querySelector('[data-toc]');
  if (toc && 'IntersectionObserver' in window) {
    const links = new Map(
      [...toc.querySelectorAll('a[href^="#"]')].map((a) => [a.getAttribute('href').slice(1), a]),
    );
    const sections = [...links.keys()].map((id) => document.getElementById(id)).filter(Boolean);

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) => a.classList.remove('is-active'));
          const active = links.get(entry.target.id);
          if (active) active.classList.add('is-active');
        });
      },
      { rootMargin: '-25% 0px -65% 0px' },
    );
    sections.forEach((section) => spy.observe(section));
  }
})();
