export default function decorate(block) {
  const items = [...block.querySelectorAll(':scope > div')].map((row) => {
    const cells = [...row.children];
    const item = document.createElement('div');
    item.className = 'hv-trust-item';

    const icon = document.createElement('span');
    icon.className = 'hv-trust-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = cells[0]?.textContent.trim() || '';

    const label = document.createElement('span');
    label.className = 'hv-trust-label';
    label.textContent = cells[1]?.textContent.trim() || '';

    item.append(icon, label);
    return item;
  });

  const inner = document.createElement('div');
  inner.className = 'hv-trust-inner';
  inner.append(...items);
  block.replaceChildren(inner);
}
