import { createOptimizedPicture } from '../../scripts/aem.js';
import { observeReveal } from '../../scripts/hv-animations.js';

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const grid = document.createElement('div');
  grid.className = 'hv-callouts-grid';

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const href = cells[3]?.querySelector('a')?.href || cells[3]?.textContent.trim() || '#';

    const card = document.createElement('a');
    card.className = `hv-callout-card ${i === 0 ? 'hv-reveal-left' : 'hv-reveal-right'}`;
    card.href = href;

    const imgEl = cells[0]?.querySelector('img');
    if (imgEl) {
      const pic = createOptimizedPicture(imgEl.src, imgEl.alt || cells[2]?.textContent.trim() || '', false, [{ width: '800' }]);
      pic.className = 'hv-callout-img';
      card.append(pic);
    }

    const overlay = document.createElement('div');
    overlay.className = 'hv-callout-overlay';
    card.append(overlay);

    const body = document.createElement('div');
    body.className = 'hv-callout-body';

    const tag = cells[1]?.textContent.trim();
    if (tag) {
      const tagEl = document.createElement('div');
      tagEl.className = 'hv-callout-tag';
      tagEl.textContent = tag;
      body.append(tagEl);
    }

    const title = document.createElement('div');
    title.className = 'hv-callout-title';
    title.textContent = cells[2]?.textContent.trim() || '';
    body.append(title);

    const cta = document.createElement('div');
    cta.className = 'hv-callout-cta';
    cta.textContent = 'Shop the Collection →';
    body.append(cta);

    card.append(body);
    grid.append(card);
  });

  block.replaceChildren(grid);
  observeReveal(block);
}
