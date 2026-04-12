(async function () {

  /* ── Helpers ──────────────────────────────────────── */
  function safeHtml(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // Allowlist-based HTML sanitizer for data-cms-html fields.
  // Only permits safe formatting tags; strips scripts, event handlers, and
  // javascript: hrefs. Uses the browser's own DOM parser so no external lib needed.
  function sanitizeHtml(dirty) {
    const ALLOWED_TAGS = new Set(['B','I','EM','STRONG','U','BR','P','SPAN','UL','OL','LI','A','H1','H2','H3','H4','H5','H6'])
    const parser = new DOMParser()
    const doc = parser.parseFromString(String(dirty || ''), 'text/html')

    function cleanNode(node) {
      if (node.nodeType === Node.TEXT_NODE) return node.cloneNode()
      if (node.nodeType !== Node.ELEMENT_NODE) return null
      if (!ALLOWED_TAGS.has(node.tagName)) {
        // Unwrap: keep text content, strip the unsafe tag itself
        const frag = document.createDocumentFragment()
        node.childNodes.forEach(c => { const n = cleanNode(c); if (n) frag.appendChild(n) })
        return frag
      }
      const el = document.createElement(node.tagName.toLowerCase())
      // Only copy href on anchors, and only safe protocols
      if (node.tagName === 'A' && node.hasAttribute('href')) {
        const href = node.getAttribute('href').trim().toLowerCase()
        if (!href.startsWith('javascript:') && !href.startsWith('vbscript:') && !href.startsWith('data:')) {
          el.setAttribute('href', node.getAttribute('href'))
          el.setAttribute('rel', 'noopener noreferrer')
        }
      }
      node.childNodes.forEach(c => { const n = cleanNode(c); if (n) el.appendChild(n) })
      return el
    }

    const frag = document.createDocumentFragment()
    doc.body.childNodes.forEach(c => { const n = cleanNode(c); if (n) frag.appendChild(n) })
    const tmp = document.createElement('div')
    tmp.appendChild(frag)
    return tmp.innerHTML
  }

  function starsSvg(n) {
    const star = (filled) => `<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style="fill:${filled ? 'var(--color-primary,#9AC92C)' : '#3a3a3a'}"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`;
    return Array.from({ length: 5 }, (_, i) => star(i < n)).join('');
  }

  /* ── Fetch all data in parallel ──────────────────── */
  const SECTIONS = ['hero','nav','about','fresho','delivery','mission','environment','commitment','contact','footer','producerange'];

  const [
    hero, nav, about, fresho, delivery, mission, environment, commitment, contact, footer, producerange,
    testimonials, products, gallery, images, productcatalogue
  ] = await Promise.all([
    ...SECTIONS.map(s => fetch(`/_data/${s}.json`).then(r => r.ok ? r.json() : {}).catch(() => ({}))),
    fetch('/_data/testimonials.json').then(r => r.ok ? r.json() : []).catch(() => []),
    fetch('/_data/products.json').then(r => r.ok ? r.json() : []).catch(() => []),
    fetch('/_data/gallery.json').then(r => r.ok ? r.json() : []).catch(() => []),
    fetch('/_data/images.json').then(r => r.ok ? r.json() : {}).catch(() => ({})),
    fetch('/_data/productcatalogue.json').then(r => r.ok ? r.json() : {categories:[]}).catch(() => ({categories:[]})),
  ]);

  /* ── Build flat data map with namespaced keys ────── */
  // section keys become "sectionname_key" to avoid collisions across sections.
  // contact.json keys are also available unprefixed for backward compat.
  const data = {};

  const sectionData = { hero, nav, about, fresho, delivery, mission, environment, commitment, contact, footer, producerange };
  for (const [sec, obj] of Object.entries(sectionData)) {
    if (obj && typeof obj === 'object') {
      for (const [k, v] of Object.entries(obj)) {
        data[`${sec}_${k}`] = v;
      }
    }
  }

  // Expose contact keys without prefix too (backward compat)
  Object.assign(data, contact);

  /* ── data-cms="key" → textContent ───────────────── */
  document.querySelectorAll('[data-cms]').forEach(el => {
    const key = el.getAttribute('data-cms');
    if (key in data) el.textContent = data[key];
  });

  /* ── data-cms-html="key" → innerHTML (sanitized) ── */
  document.querySelectorAll('[data-cms-html]').forEach(el => {
    const key = el.getAttribute('data-cms-html');
    if (key in data) el.innerHTML = sanitizeHtml(data[key]);
  });

  /* ── data-cms-href="key" → href ─────────────────── */
  document.querySelectorAll('[data-cms-href]').forEach(el => {
    const key = el.getAttribute('data-cms-href');
    const val = data[key];
    if (val) el.href = val;
  });

  /* ── data-cms-bg="key" → backgroundImage ────────── */
  document.querySelectorAll('[data-cms-bg]').forEach(el => {
    const key = el.getAttribute('data-cms-bg');
    const slot = images[key];
    if (slot && slot.src) el.style.backgroundImage = `url('/${slot.src}')`;
  });

  /* ── data-cms-src="key" → src ───────────────────── */
  document.querySelectorAll('[data-cms-src]').forEach(el => {
    const key = el.getAttribute('data-cms-src');
    const slot = images[key];
    if (slot && slot.src) el.src = '/' + slot.src;
  });

  /* ── Nav labels ──────────────────────────────────── */
  // Map nav key → [ desktop selector, mobile selector ]
  const NAV_MAP = {
    wholesale:    ['#nav .nav-links li:nth-child(1) a', '#navDrawer li:nth-child(1) a'],
    aboutAmj:     ['#nav .nav-links li:nth-child(2) a', '#navDrawer li:nth-child(2) a'],
    products:     ['#nav .nav-links li:nth-child(3) a', '#navDrawer li:nth-child(3) a'],
    media:        ['#nav .nav-links li:nth-child(4) a', '#navDrawer li:nth-child(4) a'],
    environment:  ['#nav .nav-links li:nth-child(5) a', '#navDrawer li:nth-child(5) a'],
    contact:      ['#nav .nav-links li:nth-child(6) a', '#navDrawer li:nth-child(6) a'],
    marketReport: ['#nav .nav-links li:nth-child(7) a', '#navDrawer li:nth-child(7) a'],
  };
  for (const [key, selectors] of Object.entries(NAV_MAP)) {
    const label = nav[key];
    if (label) {
      selectors.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) el.textContent = label;
      });
    }
  }

  /* ── Testimonials carousel ───────────────────────── */
  const testimonialTrack = document.getElementById('testimonialTrack');
  if (testimonialTrack && Array.isArray(testimonials) && testimonials.length > 0) {
    testimonialTrack.innerHTML = testimonials.map(t => `
      <div class="testimonial-card">
        <div class="testimonial-stars" aria-label="${t.stars || 5} out of 5 stars">
          ${starsSvg(t.stars || 5)}
        </div>
        <blockquote class="testimonial-card-text">"${safeHtml(t.quote)}"</blockquote>
        <div class="testimonial-card-author">
          <strong>${safeHtml(t.author)}</strong>
        </div>
      </div>`).join('');
  }

  /* ── Product photo grid ──────────────────────────── */
  const productGrid = document.getElementById('product-photo-grid');
  if (productGrid && Array.isArray(products)) {
    productGrid.innerHTML = products.map(p => {
      const imgSrc = p.src.startsWith('http') ? p.src : (p.src.startsWith('/') ? p.src : '/' + p.src);
      return `
        <div class="product-photo-card" data-name="${safeHtml(p.name)}" data-desc="${safeHtml(p.description||'')}">
          <img src="${imgSrc}" alt="${safeHtml(p.name)}" loading="lazy">
          <div class="product-photo-card-name">${safeHtml(p.name)}</div>
        </div>`;
    }).join('');

    // Apply description tooltips
    const tooltipData = window._prodTooltips || {};
    productGrid.querySelectorAll('.product-photo-card').forEach(card => {
      const name = card.dataset.name;
      const desc = card.dataset.desc;
      if (desc) {
        const tip = document.createElement('div');
        tip.className = 'product-tooltip';
        tip.innerHTML = '<strong>' + safeHtml(name) + '</strong>' + safeHtml(desc);
        card.appendChild(tip);
        return;
      }
      const img = card.querySelector('img');
      if (!img) return;
      const filename = img.src.split('/').pop()
        .replace(/[_-]270_200_s_c1\.(jpg|jpeg|JPG|png|PNG|webp)$/i, '')
        .replace(/\.[a-z]+$/i, '');
      let info = tooltipData[filename];
      if (!info) {
        const key = Object.keys(tooltipData).find(k => img.src.includes(k));
        if (key) info = tooltipData[key];
      }
      if (!info) return;
      const tip = document.createElement('div');
      tip.className = 'product-tooltip';
      tip.innerHTML = '<strong>' + safeHtml(info.name) + '</strong>' + safeHtml(info.desc);
      card.appendChild(tip);
    });
  }

  /* ── CMS gallery ─────────────────────────────────── */
  const gallerySection = document.getElementById('gallery');
  const galleryGrid = document.getElementById('cms-gallery-grid');
  if (galleryGrid && Array.isArray(gallery) && gallery.length > 0) {
    if (gallerySection) gallerySection.style.display = '';
    galleryGrid.innerHTML = gallery.map(item => {
      const imgSrc = item.src.startsWith('http') ? item.src : (item.src.startsWith('/') ? item.src : '/' + item.src);
      return `<div style="border-radius:8px;overflow:hidden;aspect-ratio:4/3;background:#f0f0f0">
        <img src="${imgSrc}" alt="Gallery photo" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block">
      </div>`;
    }).join('');
  }

  /* ── Product Catalogue — filterable browser ─────────── */
  (function () {
    const cats       = (productcatalogue && Array.isArray(productcatalogue.categories))
                         ? productcatalogue.categories : [];
    const filtersEl  = document.getElementById('catalogueFilters');
    const resultsEl  = document.getElementById('catalogueResults');
    const searchEl   = document.getElementById('catalogueSearch');

    if (!filtersEl || !resultsEl || !searchEl || cats.length === 0) return;

    let activeCat = 'all';   // slug or 'all'
    let searchQ   = '';

    /* Build "All" pill + one pill per category */
    function buildPills() {
      const total = cats.reduce((n, c) => n + c.items.length, 0);
      const allPill = makePill('all', 'All Products', total);
      filtersEl.innerHTML = '';
      filtersEl.appendChild(allPill);
      cats.forEach(c => filtersEl.appendChild(makePill(c.slug, c.name, c.items.length)));
    }

    function makePill(slug, label, count) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cat-pill' + (slug === activeCat ? ' active' : '');
      btn.dataset.slug = slug;
      btn.setAttribute('aria-pressed', slug === activeCat ? 'true' : 'false');
      btn.innerHTML = `${safeHtml(label)} <span class="pill-count">(${count})</span>`;
      btn.addEventListener('click', () => {
        activeCat = slug;
        render();
      });
      return btn;
    }

    function render() {
      const q = searchQ.toLowerCase().trim();

      /* Update pill active states */
      filtersEl.querySelectorAll('.cat-pill').forEach(btn => {
        const active = btn.dataset.slug === activeCat;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      /* Filter categories */
      const visibleCats = cats
        .filter(c => activeCat === 'all' || c.slug === activeCat)
        .map(c => {
          if (!q) return { ...c, matchedItems: c.items, highlights: new Set() };
          const highlights = new Set();
          const matchedItems = c.items.filter(item => {
            if (item.toLowerCase().includes(q)) {
              highlights.add(item);
              return true;
            }
            return false;
          });
          return { ...c, matchedItems, highlights };
        })
        .filter(c => c.matchedItems.length > 0);

      /* Render groups */
      if (visibleCats.length === 0) {
        resultsEl.innerHTML = `<div class="catalogue-no-results">
          <strong>No products found</strong>
          Try a different search term or browse all categories.
        </div>`;
        return;
      }

      resultsEl.innerHTML = visibleCats.map(c => `
        <div class="cat-group" data-slug="${safeHtml(c.slug)}">
          <div class="cat-group-header">
            <h3>${safeHtml(c.name)}</h3>
            <span class="cat-group-count">${c.matchedItems.length}</span>
          </div>
          <ul class="cat-group-list" aria-label="${safeHtml(c.name)} items">
            ${c.matchedItems.map(item =>
              `<li class="${c.highlights && c.highlights.has(item) ? 'highlight' : ''}">${safeHtml(item)}</li>`
            ).join('')}
          </ul>
        </div>`).join('');
    }

    /* Search input handler — debounced */
    let debounceTimer;
    searchEl.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchQ = searchEl.value;
        /* When searching, reset to "all" so results cross categories */
        if (searchQ.trim()) activeCat = 'all';
        render();
      }, 180);
    });

    buildPills();
    render();
  }());

})();
