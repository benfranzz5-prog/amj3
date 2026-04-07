(async function () {
  const pageMeta = document.querySelector('meta[name="cms-page"]')
  const pageSection = pageMeta ? pageMeta.getAttribute('content') : null

  const fetches = [
    fetch('/_data/contact.json').then(r => r.ok ? r.json() : {}),
    fetch('/_data/images.json').then(r => r.ok ? r.json() : {}),
    pageSection ? fetch(`/_data/${pageSection}.json`).then(r => r.ok ? r.json() : {}) : Promise.resolve({}),
    fetch('/_data/products.json').then(r => r.ok ? r.json() : null),
    fetch('/_data/gallery.json').then(r => r.ok ? r.json() : null),
  ]

  const [contact, images, pageData, products, gallery] = await Promise.all(fetches)

  // ── Product photo grid ──
  const productGrid = document.getElementById('product-photo-grid')
  if (productGrid && Array.isArray(products)) {
    function safeAttr(s) { return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;') }
    productGrid.innerHTML = products.map(p => {
      const imgSrc = p.src.startsWith('http') ? p.src : (p.src.startsWith('/') ? p.src : '/' + p.src)
      return `
        <div class="product-photo-card" data-name="${safeAttr(p.name)}" data-desc="${safeAttr(p.description||'')}">
          <img src="${imgSrc}" alt="${safeAttr(p.name)}" loading="lazy">
          <div class="product-photo-card-name">${p.name}</div>
        </div>`
    }).join('')

    // Apply tooltips — use description from products.json first, fall back to _prodTooltips
    const tooltipData = window._prodTooltips || {}
    productGrid.querySelectorAll('.product-photo-card').forEach(card => {
      const name = card.dataset.name
      const desc = card.dataset.desc
      if (desc) {
        const tip = document.createElement('div')
        tip.className = 'product-tooltip'
        tip.innerHTML = '<strong>' + name + '</strong>' + desc
        card.appendChild(tip)
        return
      }
      // Fall back to hardcoded tooltip map (products without CMS description)
      const img = card.querySelector('img')
      if (!img) return
      const filename = img.src.split('/').pop()
        .replace(/[_-]270_200_s_c1\.(jpg|jpeg|JPG|png|PNG|webp)$/i, '')
        .replace(/_270_200_s_c1\.(jpg|jpeg|JPG|png|PNG|webp)$/i, '')
        .replace(/\.[a-z]+$/i, '')
      let info = tooltipData[filename]
      if (!info) {
        const key = Object.keys(tooltipData).find(k => img.src.includes(k))
        if (key) info = tooltipData[key]
      }
      if (!info) return
      const tip = document.createElement('div')
      tip.className = 'product-tooltip'
      tip.innerHTML = '<strong>' + info.name + '</strong>' + info.desc
      card.appendChild(tip)
    })
  }

  // ── CMS gallery (uploaded photos) ──
  const gallerySection = document.getElementById('gallery')
  const galleryGrid = document.getElementById('cms-gallery-grid')
  if (galleryGrid && Array.isArray(gallery) && gallery.length > 0) {
    gallerySection.style.display = ''
    galleryGrid.innerHTML = gallery.map(item => {
      const imgSrc = item.src.startsWith('http') ? item.src : (item.src.startsWith('/') ? item.src : '/' + item.src)
      return `<div style="border-radius:8px;overflow:hidden;aspect-ratio:4/3;background:#f0f0f0">
        <img src="${imgSrc}" alt="Gallery photo" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block">
      </div>`
    }).join('')
  }

  const data = Object.assign({}, contact, pageData)

  // data-cms="key" → textContent
  document.querySelectorAll('[data-cms]').forEach(el => {
    const key = el.getAttribute('data-cms')
    if (key in data) el.textContent = data[key]
  })

  // data-cms-html="key" → innerHTML
  document.querySelectorAll('[data-cms-html]').forEach(el => {
    const key = el.getAttribute('data-cms-html')
    if (key in data) el.innerHTML = data[key]
  })

  // data-cms-href="key" → href (tel: and mailto: only)
  document.querySelectorAll('[data-cms-href]').forEach(el => {
    const key = el.getAttribute('data-cms-href')
    const val = data[key]
    if (val && /^(tel:|mailto:)/.test(val)) el.href = val
  })

  // data-cms-bg="key" → backgroundImage (from images.json)
  document.querySelectorAll('[data-cms-bg]').forEach(el => {
    const key = el.getAttribute('data-cms-bg')
    const slot = images[key]
    if (slot && slot.src) el.style.backgroundImage = `url('/${slot.src}')`
  })

  // data-cms-src="key" → src (from images.json)
  document.querySelectorAll('[data-cms-src]').forEach(el => {
    const key = el.getAttribute('data-cms-src')
    const slot = images[key]
    if (slot && slot.src) el.src = '/' + slot.src
  })
})()
