(() => {
  'use strict';
  const root = document.documentElement;
  const hero = document.querySelector('.hero-scroll');
  const stage = document.querySelector('.hero-sticky');
  const initial = document.querySelector('.hero-initial');
  const chapter = document.querySelector('#chapter-number');
  const menuButton = document.querySelector('.menu-button');
  const menu = document.querySelector('#mobile-menu');
  const orderSection = document.querySelector('#pedido');
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  let scheduled = false;
  let travel = 1;
  let orderTop = 0;
  let started = null;

  function measure() {
    travel = Math.max(1, hero.offsetHeight - stage.offsetHeight);
    orderTop = orderSection.getBoundingClientRect().top + window.scrollY;
    requestUpdate();
  }
  function update() {
    scheduled = false;
    const reduced = motionPreference.matches;
    const progress = reduced ? 0 : clamp(-hero.getBoundingClientRect().top / travel);
    const explosion = smooth(.10, .62, progress);
    const intro = 1 - smooth(.03, .21, progress);
    const detail = smooth(.25, .58, progress);
    stage.style.setProperty('--explode', explosion.toFixed(4));
    stage.style.setProperty('--intro', intro.toFixed(4));
    stage.style.setProperty('--detail', detail.toFixed(4));
    stage.style.setProperty('--hero-progress', progress.toFixed(4));
    const isStarted = progress > .2;
    if (isStarted !== started) {
      started = isStarted;
      stage.classList.toggle('is-started', isStarted);
      initial.inert = isStarted;
    }
    const number = progress < .25 ? '01' : '02';
    if (chapter.textContent !== number) chapter.textContent = number;
    root.classList.toggle('show-mobile-order', window.scrollY > 300 && window.scrollY + window.innerHeight < orderTop + 180);
  }
  function requestUpdate() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }
  function closeMenu(restoreFocus = false) {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    menu.hidden = true;
    if (restoreFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.hidden = !open;
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) closeMenu(true); });
  document.addEventListener('click', event => { if (!menu.hidden && !event.target.closest('.header')) closeMenu(); });
  window.addEventListener('scroll', requestUpdate, {passive: true});
  window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); measure(); }, {passive: true});
  window.addEventListener('load', measure, {once: true});
  window.addEventListener('waves:menu-layout', measure);
  motionPreference.addEventListener('change', measure);
  document.querySelector('#year').textContent = String(new Date().getFullYear());
  if (document.fonts) document.fonts.ready.then(measure);
  measure();
})();
