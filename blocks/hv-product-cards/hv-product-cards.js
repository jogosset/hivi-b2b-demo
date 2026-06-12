import { createOptimizedPicture } from '../../scripts/aem.js';
import { observeReveal } from '../../scripts/hv-animations.js';

function buildStars(ratingStr) {
  const num = parseFloat(ratingStr) || 0;
  const full = Math.floor(num);
  const half = num - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  let html = '';
  for (let i = 0; i < full; i += 1) html += '<span class="hv-star hv-star-full">★</span>';
  if (half) html += '<span class="hv-star hv-star-half">★</span>';
  for (let i = 0; i < empty; i += 1) html += '<span class="hv-star hv-star-empty">☆</span>';
  return html;
}

function badgeClass(text) {
  const t = (text || '').toLowerCase();
  if (t === 'new') return 'hv-plabel hv-plabel--new';
  if (t.includes('pro')) return 'hv-plabel hv-plabel--pro';
  return 'hv-plabel';
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // First row with ≥ 2 cells is the section header: [eyebrow | heading | view-all-link]
  let headerCells = null;
  let productRows = rows;
  if (rows[0]?.children.length >= 2) {
    headerCells = [...rows[0].children];
    productRows = rows.slice(1);
  }

  const header = document.createElement('div');
  header.className = 'hv-products-header';

  const titleGroup = document.createElement('div');
  titleGroup.className = 'hv-products-title-group';

  const eyebrowText = headerCells?.[0]?.textContent.trim();
  if (eyebrowText) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'hv-products-eyebrow';
    eyebrow.textContent = eyebrowText;
    titleGroup.append(eyebrow);
  }

  const h2 = document.createElement('h2');
  h2.className = 'hv-products-title hv-reveal';
  h2.textContent = headerCells?.[1]?.textContent.trim() || 'Featured Products';
  titleGroup.append(h2);

  const viewAllCell = headerCells?.[2];
  const viewAllHref = viewAllCell?.querySelector('a')?.href || viewAllCell?.textContent.trim() || '/products';
  const viewAllLabel = viewAllCell?.querySelector('a')?.textContent.trim() || 'View All →';
  const viewAll = document.createElement('a');
  viewAll.className = 'hv-products-view-all';
  viewAll.href = viewAllHref;
  viewAll.textContent = viewAllLabel;

  header.append(titleGroup, viewAll);

  const grid = document.createElement('div');
  grid.className = 'hv-product-grid hv-stagger';

  // Column map: 0:img 1:brand 2:name 3:ansi 4:price 5:msrp 6:save% 7:bulk 8:badge 9:rating 10:link
  productRows.forEach((row) => {
    const cells = [...row.children];
    const href = cells[10]?.querySelector('a')?.href || cells[10]?.textContent.trim() || '#';

    const card = document.createElement('a');
    card.className = 'hv-product-card hv-reveal';
    card.href = href;

    // ── Image area ──────────────────────────────────────────────
    const imgWrap = document.createElement('div');
    imgWrap.className = 'hv-product-img-wrap';

    const badgeText = cells[8]?.textContent.trim();
    if (badgeText) {
      const pill = document.createElement('span');
      pill.className = badgeClass(badgeText);
      pill.textContent = badgeText;
      imgWrap.append(pill);
    }

    const wish = document.createElement('button');
    wish.className = 'hv-product-wish';
    wish.setAttribute('aria-label', 'Save to wishlist');
    wish.setAttribute('type', 'button');
    wish.textContent = '♡';
    wish.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const wished = wish.classList.toggle('hv-wished');
      wish.textContent = wished ? '♥' : '♡';
    });
    imgWrap.append(wish);

    const imgEl = cells[0]?.querySelector('img');
    if (imgEl) {
      imgWrap.append(
        createOptimizedPicture(
          imgEl.src,
          imgEl.alt || cells[2]?.textContent.trim() || '',
          false,
          [{ width: '300' }],
        ),
      );
    }

    const addOverlay = document.createElement('div');
    addOverlay.className = 'hv-product-add-overlay';
    addOverlay.textContent = '+ Add to Cart';
    imgWrap.append(addOverlay);

    card.append(imgWrap);

    // ── Info area ────────────────────────────────────────────────
    const info = document.createElement('div');
    info.className = 'hv-product-info';

    const brand = document.createElement('div');
    brand.className = 'hv-product-brand';
    brand.textContent = cells[1]?.textContent.trim() || '';
    info.append(brand);

    const name = document.createElement('div');
    name.className = 'hv-product-name';
    name.textContent = cells[2]?.textContent.trim() || '';
    info.append(name);

    const ansi = cells[3]?.textContent.trim();
    if (ansi) {
      const ansiEl = document.createElement('div');
      ansiEl.className = 'hv-product-ansi';
      ansiEl.textContent = `✓ ${ansi}`;
      info.append(ansiEl);
    }

    const pricing = document.createElement('div');
    pricing.className = 'hv-product-pricing';

    const price = cells[4]?.textContent.trim();
    if (price) {
      const priceEl = document.createElement('span');
      priceEl.className = 'hv-product-price';
      priceEl.textContent = price;
      pricing.append(priceEl);
    }

    const msrp = cells[5]?.textContent.trim();
    if (msrp) {
      const msrpEl = document.createElement('span');
      msrpEl.className = 'hv-product-msrp';
      msrpEl.textContent = msrp;
      pricing.append(msrpEl);
    }

    const save = cells[6]?.textContent.trim();
    if (save) {
      const saveEl = document.createElement('span');
      saveEl.className = 'hv-product-save';
      saveEl.textContent = save;
      pricing.append(saveEl);
    }

    info.append(pricing);

    const bulk = cells[7]?.textContent.trim();
    if (bulk) {
      const bulkEl = document.createElement('div');
      bulkEl.className = 'hv-product-bulk';
      bulkEl.textContent = bulk;
      info.append(bulkEl);
    }

    const ratingText = cells[9]?.textContent.trim() || '';
    const ratingMatch = ratingText.match(/^([\d.]+)\s*\(?([\d,]+)\)?/);
    if (ratingMatch) {
      const stars = document.createElement('div');
      stars.className = 'hv-product-stars';
      stars.innerHTML = `<span class="hv-stars">${buildStars(ratingMatch[1])}</span><span class="hv-reviews">(${ratingMatch[2]})</span>`;
      info.append(stars);
    }

    card.append(info);
    grid.append(card);
  });

  block.replaceChildren(header, grid);
  observeReveal(block);

  // Reveal cards already in the viewport on load
  requestAnimationFrame(() => {
    block.querySelectorAll('.hv-reveal').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.height > 0 && rect.top < window.innerHeight) {
        el.classList.add('hv-visible');
      }
    });
  });
}
