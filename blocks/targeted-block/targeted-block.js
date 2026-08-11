import { TargetedBlock } from '@dropins/storefront-personalization/containers/TargetedBlock.js';
import { render } from '@dropins/storefront-personalization/render.js';
import { readBlockConfig } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function prepareIds(providedIds) {
  return providedIds.split(',').map((num) => btoa(num.trim()));
}

export default async function decorate(block) {
  const blockConfig = readBlockConfig(block);

  const {
    fragment,
    type,
    headline,
    'background-image': backgroundImage,
    'customer-segments': customerSegments,
    'customer-groups': customerGroups,
    'cart-rules': rules,
  } = blockConfig;

  const content = (fragment !== undefined)
    ? await loadFragment(fragment)
    : block.children[block.children.length - 1];

  const segments = customerSegments !== undefined ? prepareIds(customerSegments) : [];
  const groups = customerGroups !== undefined ? prepareIds(customerGroups) : [];
  const cartRules = rules !== undefined ? prepareIds(rules) : [];

  // Apply background image before render clears DOM
  if (backgroundImage) {
    block.style.backgroundImage = `url('${backgroundImage}')`;
    block.classList.add('has-background');
  }

  render.render(TargetedBlock, {
    type,
    personalizationData: {
      segments,
      groups,
      cartRules,
    },
    slots: {
      Content: (ctx) => {
        const container = document.createElement('div');
        container.className = 'targeted-block-content';

        if (headline) {
          const headlineEl = document.createElement('h2');
          headlineEl.className = 'targeted-block-headline';
          headlineEl.textContent = headline;
          container.append(headlineEl);
        }

        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'targeted-block-slot';
        contentWrapper.append(content);
        container.append(contentWrapper);

        ctx.replaceWith(container);
      },
    },
  })(block);
}
