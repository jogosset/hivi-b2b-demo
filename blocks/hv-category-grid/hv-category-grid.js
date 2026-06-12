import { createOptimizedPicture } from '../../scripts/aem.js';
import { observeReveal } from '../../scripts/hv-animations.js';

export default function decorate(block) {
  const grid = document.createElement('div');
  grid.className = 'hv-cat-grid hv-stagger';

  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    const cells = [...row.children];
    const href = cells[3]?.querySelector('a')?.href || cells[3]?.textContent.trim() || '#';

    const tile = document.createElement('a');
    tile.className = 'hv-cat-tile hv-reveal';
    tile.href = href;

    const imgWrap = document.createElement('div');
    imgWrap.className = 'hv-cat-img';
    const imgEl = cells[0]?.querySelector('img');
    if (imgEl) {
      imgWrap.append(createOptimizedPicture(imgEl.src, imgEl.alt || cells[1]?.textContent.trim() || '', false, [{ width: '160' }]));
    }

    const name = document.createElement('div');
    name.className = 'hv-cat-name';
    name.textContent = cells[1]?.textContent.trim() || '';

    const count = document.createElement('div');
    count.className = 'hv-cat-count';
    count.textContent = cells[2]?.textContent.trim() || '';

    tile.append(imgWrap, name, count);
    grid.append(tile);
  });

  block.replaceChildren(grid);
  observeReveal(block);
}
