import { createOptimizedPicture } from '../../scripts/aem.js';
import { observeCounter } from '../../scripts/hv-animations.js';

function buildSlide(row, index) {
  const cells = [...row.children];
  const slide = document.createElement('div');
  slide.className = `hv-hero-slide hv-hero-slide-${index + 1}`;
  if (index === 0) slide.classList.add('hv-active');

  // Background image
  const imgEl = cells[0]?.querySelector('img');
  if (imgEl) {
    const pic = createOptimizedPicture(imgEl.src, imgEl.alt || '', index === 0, [{ width: '1440' }]);
    pic.className = 'hv-hero-bg';
    slide.append(pic);
  }

  const overlay = document.createElement('div');
  overlay.className = 'hv-hero-overlay';
  slide.append(overlay);

  const content = document.createElement('div');
  content.className = 'hv-hero-content';

  const tag = cells[1]?.textContent.trim();
  if (tag) {
    const tagEl = document.createElement('div');
    tagEl.className = 'hv-hero-tag';
    tagEl.textContent = tag;
    content.append(tagEl);
  }

  const h1 = document.createElement('h1');
  h1.className = 'hv-hero-headline';
  h1.innerHTML = cells[2]?.innerHTML || '';
  content.append(h1);

  const sub = cells[3]?.textContent.trim();
  if (sub) {
    const p = document.createElement('p');
    p.className = 'hv-hero-sub';
    p.textContent = sub;
    content.append(p);
  }

  const ctas = document.createElement('div');
  ctas.className = 'hv-hero-ctas';
  [cells[4], cells[5]].forEach((cell, i) => {
    const a = cell?.querySelector('a');
    if (!a) return;
    a.className = i === 0 ? 'hv-btn hv-btn-neon' : 'hv-btn hv-btn-outline-white';
    ctas.append(a);
  });
  content.append(ctas);

  slide.append(content);
  return slide;
}

function buildControls(count) {
  const controls = document.createElement('div');
  controls.className = 'hv-hero-controls';

  const prev = document.createElement('button');
  prev.className = 'hv-hero-arrow hv-hero-prev';
  prev.setAttribute('aria-label', 'Previous slide');
  prev.textContent = '‹';

  const dots = document.createElement('div');
  dots.className = 'hv-hero-dots';
  for (let i = 0; i < count; i += 1) {
    const dot = document.createElement('button');
    dot.className = `hv-hero-dot${i === 0 ? ' hv-active' : ''}`;
    dot.dataset.idx = i;
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dots.append(dot);
  }

  const next = document.createElement('button');
  next.className = 'hv-hero-arrow hv-hero-next';
  next.setAttribute('aria-label', 'Next slide');
  next.textContent = '›';

  controls.append(prev, dots, next);
  return controls;
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const slideRows = rows.filter((r) => r.children.length >= 4);

  const track = document.createElement('div');
  track.className = 'hv-hero-track';
  const slides = slideRows.map((row, i) => buildSlide(row, i));
  track.append(...slides);

  const progress = document.createElement('div');
  progress.className = 'hv-hero-progress';

  const controls = buildControls(slides.length);
  block.replaceChildren(track, controls, progress);

  // Slider state
  let current = 0;
  let timer;
  let paused = false;

  function goTo(idx) {
    slides[current].classList.remove('hv-active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('hv-active');
    track.style.transform = `translateX(-${current * 100}%)`;
    controls.querySelectorAll('.hv-hero-dot').forEach((d, i) => {
      d.classList.toggle('hv-active', i === current);
    });
    // restart progress bar
    progress.style.animation = 'none';
    // eslint-disable-next-line no-unused-expressions
    progress.offsetHeight;
    progress.style.animation = 'hv-progress 6s linear infinite';
  }

  function startTimer() { timer = setInterval(() => goTo(current + 1), 6000); }
  function resetTimer() { clearInterval(timer); if (!paused) startTimer(); }

  controls.querySelector('.hv-hero-next').addEventListener('click', () => { goTo(current + 1); resetTimer(); });
  controls.querySelector('.hv-hero-prev').addEventListener('click', () => { goTo(current - 1); resetTimer(); });
  controls.querySelectorAll('.hv-hero-dot').forEach((d) => {
    d.addEventListener('click', () => { goTo(+d.dataset.idx); resetTimer(); });
  });
  block.addEventListener('mouseenter', () => { paused = true; clearInterval(timer); });
  block.addEventListener('mouseleave', () => { paused = false; startTimer(); });

  // Animate first slide content
  requestAnimationFrame(() => {
    slides[0].querySelectorAll('.hv-hero-tag, .hv-hero-headline, .hv-hero-sub, .hv-hero-ctas').forEach((el, i) => {
      el.style.animationDelay = `${i * 140}ms`;
      el.classList.add('hv-anim-fade-up');
    });
  });

  // Counter animation for any stat elements
  block.querySelectorAll('[data-count-to]').forEach(observeCounter);

  startTimer();
}
