import { observeReveal } from '../../scripts/hv-animations.js';

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // First row with a single non-linked cell is a heading
  let heading = null;
  let chipRows = rows;
  if (rows[0]?.children.length === 1 && !rows[0].querySelector('a')) {
    heading = rows[0].children[0]?.innerHTML || '';
    chipRows = rows.slice(1);
  }

  if (heading) {
    const h2 = document.createElement('h2');
    h2.className = 'hv-brands-heading hv-reveal';
    h2.innerHTML = heading;
    block.prepend(h2);
  }

  const scroll = document.createElement('div');
  scroll.className = 'hv-brands-scroll hv-stagger';

  chipRows.forEach((row) => {
    const cells = [...row.children];
    const href = cells[1]?.querySelector('a')?.href || cells[1]?.textContent.trim();
    const name = cells[0]?.textContent.trim() || '';

    const chip = href ? document.createElement('a') : document.createElement('span');
    chip.className = 'hv-brand-chip hv-reveal';
    if (href) chip.href = href;
    chip.textContent = name;
    scroll.append(chip);
  });

  block.append(scroll);
  observeReveal(block);
}
