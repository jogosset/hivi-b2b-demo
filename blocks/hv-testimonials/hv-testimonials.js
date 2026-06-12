import { observeReveal } from '../../scripts/hv-animations.js';

function buildStars(ratingStr) {
  const n = Math.min(Math.round(parseFloat(ratingStr) || 5), 5);
  let html = '';
  for (let i = 0; i < n; i += 1) html += '<span class="hv-tstar hv-tstar-full">★</span>';
  for (let i = n; i < 5; i += 1) html += '<span class="hv-tstar hv-tstar-empty">☆</span>';
  return html;
}

function getInitials(name) {
  return (name || '')
    .trim()
    .split(/\s+/)
    .map((w) => w[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase() || '??';
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Header row: 1 cell = heading only; 2 cells = eyebrow + heading
  let headerCells = null;
  let reviewRows = rows;
  if ((rows[0]?.children.length || 0) <= 2) {
    headerCells = [...rows[0].children];
    reviewRows = rows.slice(1);
  }

  if (headerCells) {
    const header = document.createElement('div');
    header.className = 'hv-testimonials-header';

    // Two-cell header: [eyebrow, heading]; one-cell: [heading]
    const headingCell = headerCells.length >= 2 ? headerCells[1] : headerCells[0];
    const eyebrowCell = headerCells.length >= 2 ? headerCells[0] : null;

    if (eyebrowCell) {
      const eyebrowText = eyebrowCell.textContent.trim();
      if (eyebrowText) {
        const eyebrow = document.createElement('p');
        eyebrow.className = 'hv-testimonials-eyebrow';
        eyebrow.textContent = eyebrowText;
        header.append(eyebrow);
      }
    }

    const h2 = document.createElement('h2');
    h2.className = 'hv-testimonials-title hv-reveal';
    h2.textContent = headingCell?.textContent.trim() || '';
    header.append(h2);
    block.prepend(header);
  }

  const grid = document.createElement('div');
  grid.className = 'hv-testimonials-grid hv-stagger';

  // Column map: 0:name  1:role·company  2:rating  3:quote
  reviewRows.forEach((row) => {
    const cells = [...row.children];
    const card = document.createElement('div');
    card.className = 'hv-tcard hv-reveal';

    const starsEl = document.createElement('div');
    starsEl.className = 'hv-tcard-stars';
    starsEl.innerHTML = buildStars(cells[2]?.textContent.trim() || '5');
    card.append(starsEl);

    const quote = document.createElement('p');
    quote.className = 'hv-tcard-quote';
    quote.textContent = cells[3]?.textContent.trim() || '';
    card.append(quote);

    const bar = document.createElement('div');
    bar.className = 'hv-tcard-bar';
    card.append(bar);

    const author = document.createElement('div');
    author.className = 'hv-tcard-author';

    const nameText = cells[0]?.textContent.trim() || '';
    const avatar = document.createElement('div');
    avatar.className = 'hv-tcard-avatar';
    avatar.textContent = getInitials(nameText);
    author.append(avatar);

    const meta = document.createElement('div');
    meta.className = 'hv-tcard-meta';
    const nameEl = document.createElement('div');
    nameEl.className = 'hv-tcard-name';
    nameEl.textContent = nameText;
    const roleEl = document.createElement('div');
    roleEl.className = 'hv-tcard-role';
    roleEl.textContent = cells[1]?.textContent.trim() || '';
    meta.append(nameEl, roleEl);
    author.append(meta);

    const verified = document.createElement('div');
    verified.className = 'hv-tcard-verified';
    verified.textContent = '✓ Verified';
    author.append(verified);

    card.append(author);
    grid.append(card);
  });

  // Replace the original rows; prepend(header) already handled above
  const originalRows = block.querySelectorAll(':scope > div');
  originalRows.forEach((r) => r.remove());
  if (block.querySelector('.hv-testimonials-header')) {
    block.querySelector('.hv-testimonials-header').after(grid);
  } else {
    block.append(grid);
  }

  observeReveal(block);

  requestAnimationFrame(() => {
    block.querySelectorAll('.hv-reveal').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.height > 0 && rect.top < window.innerHeight) {
        el.classList.add('hv-visible');
      }
    });
  });
}
