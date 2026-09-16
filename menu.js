(() => {
  'use strict';
  const section = document.querySelector('.menu-section');
  if (!section) return;
  const viewport = section.querySelector('.menu-viewport');
  const items = () => Array.from(section.querySelectorAll('.menu-item'));
  const filters = () => Array.from(section.querySelectorAll('.menu-filter'));
  const previous = section.querySelector('[data-menu-direction="previous"]');
  const next = section.querySelector('[data-menu-direction="next"]');
  const status = section.querySelector('.menu-status');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let pending = false;

  function updateArrows() {
    pending = false;
    const remaining = viewport.scrollWidth - viewport.clientWidth - viewport.scrollLeft;
    previous.disabled = viewport.scrollLeft <= 2;
    next.disabled = remaining <= 2;
  }

  function scheduleUpdate() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(updateArrows);
  }

  function move(direction) {
    const cards = items().filter(item => !item.hidden);
    if (!cards.length) return;
    const first = cards[0].getBoundingClientRect();
    const step = cards.length > 1
      ? cards[1].getBoundingClientRect().left - first.left
      : first.width;
    const page = Math.max(1, Math.floor(viewport.clientWidth / step));
    viewport.scrollBy({left: direction * step * page, behavior: reducedMotion.matches ? 'instant' : 'smooth'});
  }

  section.addEventListener('click', event => {
    const button = event.target.closest('.menu-filter');
    if (!button || !section.contains(button)) return;
    const category = button.dataset.menuFilter;
    filters().forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    items().forEach(item => { item.hidden = category !== 'all' && item.dataset.category !== category; });
    viewport.scrollTo({left: 0, behavior: 'instant'});
    const count = items().filter(item => !item.hidden).length;
    status.textContent = `${button.textContent.trim()}: ${count} ${count === 1 ? 'item' : 'itens'}.`;
    scheduleUpdate();
    window.dispatchEvent(new Event('waves:menu-layout'));
  });

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  viewport.addEventListener('scroll', scheduleUpdate, {passive: true});
  viewport.addEventListener('keydown', event => {
    if (event.target !== viewport || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      viewport.scrollTo({left: event.key === 'Home' ? 0 : viewport.scrollWidth, behavior: reducedMotion.matches ? 'instant' : 'smooth'});
    }
  });
  window.addEventListener('resize', scheduleUpdate, {passive: true});
  window.addEventListener('load', scheduleUpdate, {once: true});
  if ('ResizeObserver' in window) new ResizeObserver(scheduleUpdate).observe(viewport);
  window.addEventListener('waves:content-updated', scheduleUpdate);
  updateArrows();
})();
