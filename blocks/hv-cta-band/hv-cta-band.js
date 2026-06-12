import { observeReveal } from '../../scripts/hv-animations.js';

export default function decorate(block) {
  const cells = [...block.querySelector(':scope > div')?.children || []];

  const inner = document.createElement('div');
  inner.className = 'hv-cta-band-inner hv-reveal';

  const h2 = document.createElement('h2');
  h2.className = 'hv-cta-band-title';
  h2.innerHTML = cells[0]?.innerHTML || '';
  inner.append(h2);

  const sub = cells[1]?.textContent.trim();
  if (sub) {
    const p = document.createElement('p');
    p.className = 'hv-cta-band-sub';
    p.textContent = sub;
    inner.append(p);
  }

  const btns = document.createElement('div');
  btns.className = 'hv-cta-band-btns';
  [cells[2], cells[3]].forEach((cell, i) => {
    const a = cell?.querySelector('a');
    if (!a) return;
    a.className = i === 0 ? 'hv-cta-btn hv-cta-btn-white' : 'hv-cta-btn hv-cta-btn-dark';
    btns.append(a);
  });
  inner.append(btns);

  block.replaceChildren(inner);
  observeReveal(block);
}
