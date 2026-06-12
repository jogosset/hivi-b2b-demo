import { createOptimizedPicture } from '../../scripts/aem.js';
import { observeReveal } from '../../scripts/hv-animations.js';

export default function decorate(block) {
  const cells = [...block.querySelector(':scope > div')?.children || []];

  const imgEl = cells[0]?.querySelector('img');
  if (imgEl) {
    const pic = createOptimizedPicture(imgEl.src, imgEl.alt || '', false, [{ width: '1440' }]);
    pic.className = 'hv-promo-img';
    block.prepend(pic);
  }

  const overlay = document.createElement('div');
  overlay.className = 'hv-promo-overlay';

  const content = document.createElement('div');
  content.className = 'hv-promo-content hv-reveal-left';

  const eyebrow = cells[1]?.textContent.trim();
  if (eyebrow) {
    const eyebrowEl = document.createElement('p');
    eyebrowEl.className = 'hv-promo-eyebrow';
    eyebrowEl.textContent = eyebrow;
    content.append(eyebrowEl);
  }

  const h2 = document.createElement('h2');
  h2.className = 'hv-promo-headline';
  h2.innerHTML = cells[2]?.innerHTML || '';
  content.append(h2);

  const sub = cells[3]?.textContent.trim();
  if (sub) {
    const p = document.createElement('p');
    p.className = 'hv-promo-sub';
    p.textContent = sub;
    content.append(p);
  }

  const ctas = document.createElement('div');
  ctas.className = 'hv-promo-ctas';
  [cells[4], cells[5]].forEach((cell, i) => {
    const a = cell?.querySelector('a');
    if (!a) return;
    a.className = i === 0 ? 'hv-btn hv-btn-neon' : 'hv-btn hv-btn-outline-white';
    ctas.append(a);
  });
  content.append(ctas);

  overlay.append(content);

  // Replace authored cells with image + overlay
  block.querySelector(':scope > div')?.remove();
  block.append(overlay);
  observeReveal(block);

  requestAnimationFrame(() => {
    block.querySelectorAll('.hv-reveal-left, .hv-reveal-right, .hv-reveal').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.height > 0 && rect.top < window.innerHeight) {
        el.classList.add('hv-visible');
      }
    });
  });

  // Parallax-lite
  const scrollHandler = () => {
    const rect = block.getBoundingClientRect();
    const offset = rect.top / window.innerHeight;
    const img = block.querySelector('.hv-promo-img img');
    if (img) img.style.transform = `translateY(${offset * -30}px)`;
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });
}
