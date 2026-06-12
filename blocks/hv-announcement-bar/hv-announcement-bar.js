export default function decorate(block) {
  const cells = [...block.querySelector(':scope > div')?.children || []];

  const left = document.createElement('div');
  left.className = 'hv-ann-left';

  const msgEl = cells[0]?.querySelector('a') || cells[0];
  if (msgEl) left.append(msgEl.cloneNode(true));

  const right = document.createElement('div');
  right.className = 'hv-ann-right';

  const links = cells[1]?.querySelectorAll('a') || [];
  links.forEach((a, i) => {
    if (i > 0) {
      const sep = document.createElement('span');
      sep.className = 'hv-ann-sep';
      sep.setAttribute('aria-hidden', 'true');
      right.append(sep);
    }
    right.append(a.cloneNode(true));
  });

  const phone = cells[2]?.textContent.trim();
  if (phone) {
    const sep = document.createElement('span');
    sep.className = 'hv-ann-sep';
    sep.setAttribute('aria-hidden', 'true');
    const phoneEl = document.createElement('span');
    phoneEl.className = 'hv-ann-phone';
    phoneEl.textContent = phone;
    right.append(sep, phoneEl);
  }

  block.replaceChildren(left, right);
}
