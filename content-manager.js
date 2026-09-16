(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const nl = (value = '') => String(value).split('\n');
  const escape = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const money = (cents) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(cents || 0) / 100);
  const setText = (selector, value, root = document) => { const node = $(selector, root); if (node && value !== undefined) node.textContent = value; };
  const setHref = (selector, value) => { const node = $(selector); if (node && value) node.href = value; };
  const lines = (value) => nl(value).map(escape).join('<br>');

  function menuCard(item) {
    return `<li class="menu-item" data-category="${escape(item.category)}" data-product-id="${escape(item.id)}"><article class="menu-card"><div class="menu-photo"><img class="menu-image" src="${escape(item.image)}" alt="${escape(item.imageAlt || item.name)}" width="1000" height="1000" loading="lazy"></div><div class="menu-card-body"><h3>${escape(item.name)}</h3><p class="menu-description">${escape(item.description)}</p><div class="menu-card-footer"><strong class="menu-price">${money(item.priceCents)}</strong></div></div></article></li>`;
  }

  function apply(content) {
    const { site, navigation, hero, ticker, menu, story, location, order, footer } = content;
    document.title = site.title;
    $('meta[name="description"]')?.setAttribute('content', site.description);
    $$('img[src$="waves-logo.png"]').forEach((image) => { image.src = site.logo; });
    setText('.header nav a[href="#burgers"]', navigation.burgers);
    setText('.header nav a[href="#waves"]', navigation.waves);
    setText('.header nav a[href="#contato"]', navigation.location);
    setText('.header-order', navigation.order);
    setText('.mobile-menu a[href="#pedido"]', navigation.order + ' ↗');

    setText('.hero-initial .eyebrow', hero.eyebrow);
    const heroTitle = $('#hero-title');
    if (heroTitle) heroTitle.innerHTML = `${escape(hero.titleLine1)}<br>${escape(hero.titleLine2)} <span>${escape(hero.titleAccent)}</span>`;
    const heroDescription = $('.hero-description'); if (heroDescription) heroDescription.innerHTML = lines(hero.description);
    setText('.hero-order', hero.button + ' ↗'); setText('.mobile-order', hero.button + ' ↗');
    setText('.exploded-heading .eyebrow', hero.detailEyebrow);
    const detailTitle = $('.exploded-heading h2'); if (detailTitle) detailTitle.innerHTML = `${lines(hero.detailTitle)} <span>${escape(hero.detailAccent)}</span>`;
    setText('.stage-caption', hero.stageCaption);
    $$('.ingredient-label').forEach((label, index) => { const span = $('span', label); if (span && hero.ingredientLabels[index]) label.lastChild.textContent = ` ${hero.ingredientLabels[index]}`; });
    const cue = $('.scroll-cue span:last-child'); if (cue) cue.innerHTML = lines(hero.scrollCue);

    const topTicker = $('.ticker:not(.ticker-waves)');
    if (topTicker && Array.isArray(ticker)) {
      const text = ticker.map((part) => `${escape(part)} <span>✳</span>`).join(' ');
      $$('.ticker-group', topTicker).forEach((group) => { group.innerHTML = text; });
    }

    setText('.menu-heading .eyebrow', menu.eyebrow); setText('#products-title', menu.title);
    const filters = $('.menu-filters');
    if (filters) filters.innerHTML = `<button class="menu-filter" type="button" data-menu-filter="all" aria-pressed="true" aria-controls="menu-viewport">TODOS</button>${menu.categories.map((category) => `<button class="menu-filter" type="button" data-menu-filter="${escape(category.id)}" aria-pressed="false" aria-controls="menu-viewport">${escape(category.label.toUpperCase())}</button>`).join('')}`;
    const track = $('.menu-track'); if (track) track.innerHTML = menu.items.map(menuCard).join('');
    setText('.menu-bottom p', menu.intro); setText('.menu-bottom .text-link', menu.linkLabel + ' ↗'); setHref('.menu-bottom .text-link', menu.link);
    const status = $('.menu-status'); if (status) status.textContent = `Todos: ${menu.items.length} itens.`;

    const mainStory = $('.story-photo-main'); if (mainStory) mainStory.src = story.mainImage;
    const smallStory = $('.story-photo-small'); if (smallStory) smallStory.src = story.smallImage;
    const caption = $('.photo-caption'); if (caption) caption.innerHTML = lines(story.caption);
    setText('.story-copy .eyebrow', story.eyebrow);
    const storyTitle = $('#waves-title'); if (storyTitle) storyTitle.innerHTML = `${lines(story.title)}<br><span>${escape(story.titleAccent)}</span>`;
    const paragraphs = $$('.story-copy > p:not(.eyebrow)'); if (paragraphs[0]) paragraphs[0].textContent = story.paragraphOne; if (paragraphs[1]) paragraphs[1].textContent = story.paragraphTwo;
    const storyLink = $('.story-copy .text-link'); if (storyLink) { storyLink.innerHTML = `${escape(story.instagramLabel)} <span aria-hidden="true">↗</span>`; storyLink.href = story.instagram; }
    const bottomTicker = $('.ticker-waves'); if (bottomTicker) { const text = Array(6).fill(`${escape(story.bottomTicker)}<i class="ticker-dot"></i>`).join(''); $$('.ticker-group', bottomTicker).forEach((group) => { group.innerHTML = text; }); }

    setText('.locations-heading .eyebrow', location.eyebrow); const locationTitle = $('#locations-title'); if (locationTitle) locationTitle.innerHTML = lines(location.title);
    setText('.location-block h3', location.addressLabel); const address = $('.location-block address'); if (address) address.innerHTML = lines(location.address);
    const locationLink = $('.location-block .location-link'); if (locationLink) { locationLink.innerHTML = `${escape(location.mapLinkLabel)} <span aria-hidden="true">↗</span><span class="sr-only"> em nova aba</span>`; locationLink.href = location.mapLink; }
    const blocks = $$('.location-block'); if (blocks[1]) setText('h3', location.hoursLabel, blocks[1]); const hours = $('.hours-list'); if (hours) hours.innerHTML = location.hours.map((entry) => `<div><dt>${escape(entry.days)}</dt><dd>${escape(entry.time)}</dd></div>`).join('');
    if (blocks[2]) { setText('h3', location.socialLabel, blocks[2]); const link = $('.location-link', blocks[2]); if (link) { link.innerHTML = `${escape(location.instagramHandle)} <span aria-hidden="true">↗</span><span class="sr-only"> no Instagram, abre em nova aba</span>`; link.href = location.instagram; } }
    const map = $('.map-frame iframe'); if (map) map.src = location.mapEmbed;

    setText('.order-section .eyebrow', order.eyebrow); const orderTitle = $('#order-title'); if (orderTitle) orderTitle.innerHTML = `${escape(order.title)}<br><span>${escape(order.titleAccent)}</span>`;
    const orderDescription = $('.order-section > p:not(.eyebrow)'); if (orderDescription) orderDescription.innerHTML = lines(order.description);
    const options = $('.order-options'); if (options) options.innerHTML = order.options.map((option) => `<a class="button button-dark" href="${escape(option.link)}" target="_blank" rel="noopener noreferrer">${escape(option.label)} <span aria-hidden="true">↗</span></a>`).join('');
    setText('.order-channel', order.channel);

    const footerLogo = $('footer .brand img'); if (footerLogo) footerLogo.src = site.logo;
    const footerColumns = $$('footer .footer-top > div'); if (footerColumns[0]) { setText('.footer-label', footer.hoursLabel, footerColumns[0]); const p = $('p:not(.footer-label)', footerColumns[0]); if (p) p.innerHTML = location.hours.map((entry) => `${escape(entry.days)} · ${escape(entry.time)}`).join('<br>'); }
    if (footerColumns[1]) { setText('.footer-label', footer.locationLabel, footerColumns[1]); const link = $('a', footerColumns[1]); if (link) { link.href = location.mapLink; link.innerHTML = `${lines(location.address)} ↗`; } }
    if (footerColumns[2]) { setText('.footer-label', footer.socialLabel, footerColumns[2]); const social = $('a', footerColumns[2]); if (social) { social.href = location.instagram; social.textContent = location.instagramHandle + ' ↗'; } }
    const bottom = $('.footer-bottom'); if (bottom) { const tags = $$(':scope > span', bottom); if (tags[1]) tags[1].textContent = footer.tagline; const credit = $('.r5-credit'); if (credit) { credit.href = footer.creditLink; credit.innerHTML = `${escape(footer.creditLabel)} <strong>${escape(footer.creditName)}</strong> ↗`; } }
    window.dispatchEvent(new Event('waves:content-updated'));
  }

  fetch('/api/site-content').then((response) => response.ok ? response.json() : Promise.reject()).then(({ content }) => apply(content)).catch(() => {});
})();
