import { createOptimizedPicture } from '../../scripts/aem.js';
import { observeReveal } from '../../scripts/hv-animations.js';

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const grid = document.createElement('div');
  grid.className = 'hv-vp-grid';

  // Row 0: image | badge text
  const imgCells = [...(rows[0]?.children || [])];
  const media = document.createElement('div');
  media.className = 'hv-vp-media hv-reveal-left';

  const imgEl = imgCells[0]?.querySelector('img');
  if (imgEl) {
    const frame = document.createElement('div');
    frame.className = 'hv-vp-img-frame';
    frame.append(createOptimizedPicture(imgEl.src, imgEl.alt || '', false, [{ width: '700' }]));
    media.append(frame);
  }

  const badgeText = imgCells[1]?.textContent.trim();
  if (badgeText) {
    const badge = document.createElement('div');
    badge.className = 'hv-vp-badge';
    const [num, ...rest] = badgeText.split('\n');
    badge.innerHTML = `<span class="hv-vp-badge-num">${num.trim()}</span><span class="hv-vp-badge-text">${rest.join(' ').trim()}</span>`;
    media.append(badge);
  }

  // Row 1: eyebrow | headline
  const headCells = [...(rows[1]?.children || [])];
  const content = document.createElement('div');
  content.className = 'hv-vp-content hv-reveal-right';

  const eyebrow = headCells[0]?.textContent.trim();
  if (eyebrow) {
    const eyebrowEl = document.createElement('p');
    eyebrowEl.className = 'hv-vp-eyebrow';
    eyebrowEl.textContent = eyebrow;
    content.append(eyebrowEl);
  }

  const h2 = document.createElement('h2');
  h2.className = 'hv-vp-title';
  h2.innerHTML = headCells[1]?.innerHTML || headCells[0]?.innerHTML || '';
  content.append(h2);

  // Rows 2..N-1: icon | title | desc  (until row with single cell = CTA)
  const list = document.createElement('ul');
  list.className = 'hv-vp-list';

  let ctaRow = null;
  rows.slice(2).forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1) { ctaRow = row; return; }

    const li = document.createElement('li');
    li.className = 'hv-vp-item';

    const icon = document.createElement('div');
    icon.className = 'hv-vp-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = cells[0]?.textContent.trim() || '';

    const text = document.createElement('div');
    const itemTitle = document.createElement('div');
    itemTitle.className = 'hv-vp-item-title';
    itemTitle.textContent = cells[1]?.textContent.trim() || '';

    const desc = document.createElement('div');
    desc.className = 'hv-vp-item-desc';
    desc.textContent = cells[2]?.textContent.trim() || '';

    text.append(itemTitle, desc);
    li.append(icon, text);
    list.append(li);
  });

  content.append(list);

  if (ctaRow) {
    const a = ctaRow.querySelector('a');
    if (a) {
      a.className = 'hv-vp-cta';
      content.append(a);
    }
  }

  grid.append(media, content);
  block.replaceChildren(grid);
  observeReveal(block);
}
