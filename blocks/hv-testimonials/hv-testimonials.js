import { observeReveal } from '../../scripts/hv-animations.js';

function buildStars(rating) {
  const n = Math.round(parseFloat(rating) || 5);
  return '★'.repeat(Math.min(n, 5)) + '☆'.repeat(Math.max(5 - n, 0));
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  let headerRow = null;
  let reviewRows = rows;
  if (rows[0]?.children.length === 1) {
    [headerRow] = rows;
    reviewRows = rows.slice(1);
  }

  if (headerRow) {
    const header = document.createElement('div');
    header.className = 'hv-testimonials-header';
    const h2 = document.createElement('h2');
    h2.className = 'hv-testimonials-title hv-reveal';
    h2.textContent = headerRow.children[0]?.textContent.trim() || '';
    header.append(h2);
    block.prepend(header);
  }

  const grid = document.createElement('div');
  grid.className = 'hv-testimonials-grid hv-stagger';

  reviewRows.forEach((row) => {
    const cells = [...row.children];
    const card = document.createElement('div');
    card.className = 'hv-tcard hv-reveal';

    const stars = document.createElement('div');
    stars.className = 'hv-tcard-stars';
    stars.textContent = buildStars(cells[3]?.textContent.trim() || '5');
    card.append(stars);

    const quote = document.createElement('p');
    quote.className = 'hv-tcard-quote';
    quote.textContent = cells[4]?.textContent.trim() || '';
    card.append(quote);

    const bar = document.createElement('div');
    bar.className = 'hv-tcard-bar';
    card.append(bar);

    const author = document.createElement('div');
    author.className = 'hv-tcard-author';

    const initials = cells[0]?.textContent.trim().slice(0, 2).toUpperCase() || '??';
    const avatar = document.createElement('div');
    avatar.className = 'hv-tcard-avatar';
    avatar.textContent = initials;
    author.append(avatar);

    const meta = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'hv-tcard-name';
    name.textContent = cells[1]?.textContent.trim() || '';
    const role = document.createElement('div');
    role.className = 'hv-tcard-role';
    role.textContent = cells[2]?.textContent.trim() || '';
    meta.append(name, role);
    author.append(meta);

    const verified = document.createElement('div');
    verified.className = 'hv-tcard-verified';
    verified.textContent = '✓ Verified';
    author.append(verified);

    card.append(author);
    grid.append(card);
  });

  block.append(grid);
  observeReveal(block);
}
