(async function () {
  // Determine page-specific data file from <meta name="cms-page" content="hero">
  const pageMeta = document.querySelector('meta[name="cms-page"]')
  const pageSection = pageMeta ? pageMeta.getAttribute('content') : null

  const fetches = [
    fetch('/_data/contact.json').then(r => r.ok ? r.json() : {}),
    fetch('/_data/images.json').then(r => r.ok ? r.json() : {}),
    pageSection ? fetch(`/_data/${pageSection}.json`).then(r => r.ok ? r.json() : {}) : Promise.resolve({}),
    fetch('/_data/products.json').then(r => r.ok ? r.json() : null),
  ]

  const [contact, images, pageData, products] = await Promise.all(fetches)

  // Render product grid if container exists
  const productGrid = document.getElementById('product-photo-grid')
  if (productGrid && Array.isArray(products)) {
    productGrid.innerHTML = products.map(p => `
      <div class="product-photo-card">
        <img src="${p.src}" alt="${p.name}" loading="lazy">
        <div class="product-photo-card-name">${p.name}</div>
      </div>`).join('')

    // Apply tooltips after grid renders
    const tooltipData = window._prodTooltips || {}
    productGrid.querySelectorAll('.product-photo-card').forEach(card => {
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
  const data = Object.assign({}, contact, pageData)

  // data-cms="key" → textContent
  document.querySelectorAll('[data-cms]').forEach(el => {
    const key = el.getAttribute('data-cms')
    if (key in data) el.textContent = data[key]
  })

  // data-cms-html="key" → innerHTML (address fields only — safe subset)
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
