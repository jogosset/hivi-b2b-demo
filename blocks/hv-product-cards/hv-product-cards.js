import { createOptimizedPicture } from '../../scripts/aem.js';
import { observeReveal } from '../../scripts/hv-animations.js';

function buildStars(rating) {
  const num = parseFloat(rating) || 0;
  const full = Math.floor(num);
  const half = num % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // First row with a single cell is treated as a section header
  let headerRow = null;
  let productRows = rows;
  if (rows[0]?.children.length === 1) {
    [headerRow] = rows;
    productRows = rows.slice(1);
  }

  const header = document.createElement('div');
  header.className = 'hv-products-header';

  if (headerRow) {
    const titleEl = document.createElement('h2');
    titleEl.className = 'hv-products-title hv-reveal';
    titleEl.textContent = headerRow.children[0]?.textContent.trim() || 'Featured Products';
    header.append(titleEl);
  }

  const viewAll = document.createElement('a');
  viewAll.className = 'hv-products-view-all';
  viewAll.href = '/products';
  viewAll.textContent = 'View All →';
  header.append(viewAll);

  const grid = document.createElement('div');
  grid.className = 'hv-product-grid hv-stagger';

  productRows.forEach((row) => {
    const cells = [...row.children];
    const href = cells[7]?.querySelector('a')?.href || cells[7]?.textContent.trim() || '#';

    const card = document.createElement('a');
    card.className = 'hv-product-card hv-reveal';
    card.href = href;

    // Image
    const imgWrap = document.createElement('div');
    imgWrap.className = 'hv-product-img-wrap';

    const badge = cells[6]?.textContent.trim();
    if (badge) {
      const labelEl = document.createElement('div');
      labelEl.className = 'hv-product-label';
      const pill = document.createElement('span');
      pill.className = 'hv-plabel';
      pill.textContent = badge;
      labelEl.append(pill);
      imgWrap.append(labelEl);
    }

    const imgEl = cells[0]?.querySelector('img');
    if (imgEl) {
      imgWrap.append(createOptimizedPicture(imgEl.src, imgEl.alt || cells[2]?.textContent.trim() || '', false, [{ width: '240' }]));
    }

    const addOverlay = document.createElement('div');
    addOverlay.className = 'hv-product-add-overlay';
    addOverlay.textContent = '+ Add to Cart';
    imgWrap.append(addOverlay);

    card.append(imgWrap);

    // Info
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

    info.append(pricing);

    // Stars — parse "4.8 (847)" format
    const ratingText = cells[8]?.textContent.trim() || '';
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
}
