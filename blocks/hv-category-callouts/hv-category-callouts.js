import { createOptimizedPicture } from '../../scripts/aem.js';
import { observeReveal } from '../../scripts/hv-animations.js';

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const grid = document.createElement('div');
  grid.className = 'hv-callout-cols hv-stagger';

  rows.forEach((row) => {
    const cells = [...row.children];
    const href = cells[3]?.querySelector('a')?.href || cells[3]?.textContent.trim() || '#';

    const col = document.createElement('a');
    col.className = 'hv-callout-col hv-reveal';
    col.href = href;

    const imgEl = cells[0]?.querySelector('img');
    if (imgEl) {
      const pic = createOptimizedPicture(imgEl.src, imgEl.alt || cells[2]?.textContent.trim() || '', false, [{ width: '400' }]);
      pic.className = 'hv-callout-col-img';
      col.append(pic);
    }

    const overlay = document.createElement('div');
    overlay.className = 'hv-callout-col-overlay';
    col.append(overlay);

    const body = document.createElement('div');
    body.className = 'hv-callout-col-body';

    const tag = cells[1]?.textContent.trim();
    if (tag) {
      const tagEl = document.createElement('span');
      tagEl.className = 'hv-callout-col-tag';
      tagEl.textContent = tag;
      body.append(tagEl);
    }

    const title = document.createElement('div');
    title.className = 'hv-callout-col-title';
    title.textContent = cells[2]?.textContent.trim() || '';
    body.append(title);

    const btn = document.createElement('span');
    btn.className = 'hv-callout-col-btn';
    btn.textContent = 'Shop Now →';
    body.append(btn);

    col.append(body);
    grid.append(col);
  });

  block.replaceChildren(grid);
  observeReveal(block);
}
