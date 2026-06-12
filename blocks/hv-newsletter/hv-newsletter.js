import { observeReveal } from '../../scripts/hv-animations.js';

export default function decorate(block) {
  const cells = [...block.querySelector(':scope > div')?.children || []];

  const grid = document.createElement('div');
  grid.className = 'hv-nl-grid';

  const copy = document.createElement('div');
  copy.className = 'hv-nl-copy hv-reveal-left';

  const h2 = document.createElement('h2');
  h2.className = 'hv-nl-title';
  h2.innerHTML = cells[0]?.innerHTML || '';
  copy.append(h2);

  const sub = cells[1]?.textContent.trim();
  if (sub) {
    const p = document.createElement('p');
    p.className = 'hv-nl-sub';
    p.textContent = sub;
    copy.append(p);
  }

  const formWrap = document.createElement('div');
  formWrap.className = 'hv-nl-form-wrap hv-reveal-right';

  const form = document.createElement('form');
  form.className = 'hv-nl-form';
  form.noValidate = true;

  const input = document.createElement('input');
  input.type = 'email';
  input.className = 'hv-nl-input';
  input.placeholder = cells[2]?.textContent.trim() || 'Enter your work email address…';
  input.required = true;
  input.setAttribute('aria-label', 'Email address');

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.className = 'hv-nl-submit';
  btn.textContent = cells[3]?.textContent.trim() || 'Subscribe →';

  form.append(input, btn);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!input.value || !input.validity.valid) return;
    formWrap.innerHTML = '<p class="hv-nl-thanks">Thanks! You\'re on the list.</p>';
  });

  const note = document.createElement('p');
  note.className = 'hv-nl-note';
  note.textContent = 'By subscribing you agree to our Privacy Policy. Unsubscribe any time.';

  formWrap.append(form, note);
  grid.append(copy, formWrap);
  block.replaceChildren(grid);
  observeReveal(block);
}
