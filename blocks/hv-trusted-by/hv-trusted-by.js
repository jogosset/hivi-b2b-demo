import { observeReveal } from '../../scripts/hv-animations.js';

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Row 0 with 2 cells = header
  let headerRow = null;
  let logoRows = rows;
  if (rows[0]?.children.length >= 2) {
    [headerRow] = rows;
    logoRows = rows.slice(1);
  }

  if (headerRow) {
    const header = document.createElement('div');
    header.className = 'hv-trusted-header hv-reveal';

    const h2 = document.createElement('h2');
    h2.className = 'hv-trusted-title';
    h2.innerHTML = headerRow.children[0]?.innerHTML || '';
    header.append(h2);

    const sub = headerRow.children[1]?.textContent.trim();
    if (sub) {
      const p = document.createElement('p');
      p.className = 'hv-trusted-sub';
      p.textContent = sub;
      header.append(p);
    }

    block.prepend(header);
  }

  const logos = document.createElement('div');
  logos.className = 'hv-trusted-logos hv-stagger';

  logoRows.forEach((row) => {
    const name = row.children[0]?.textContent.trim() || '';
    const logo = document.createElement('div');
    logo.className = 'hv-trusted-logo hv-reveal';
    logo.textContent = name;
    logos.append(logo);
  });

  block.append(logos);
  observeReveal(block);
}
