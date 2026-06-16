import { render as rlRenderer } from '@dropins/storefront-requisition-list/render.js';
import RequisitionListGrid
  from '@dropins/storefront-requisition-list/containers/RequisitionListGrid.js';
import { getRequisitionLists } from '@dropins/storefront-requisition-list/api.js';

import {
  checkIsAuthenticated,
  CUSTOMER_LOGIN_PATH,
  CUSTOMER_REQUISITION_LIST_DETAILS_PATH,
  CORE_FETCH_GRAPHQL,
  rootLink,
} from '../../scripts/commerce.js';

function showError(block, message) {
  const err = document.createElement('p');
  err.style.cssText = 'color:red;padding:1rem;font-size:.875rem;';
  err.textContent = `Requisition List error: ${message}`;
  block.replaceChildren(err);
}

export default async function decorate(block) {
  if (!checkIsAuthenticated()) {
    window.location.href = rootLink(CUSTOMER_LOGIN_PATH);
    return;
  }

  // Ensure endpoint and auth headers are set before the grid fetches
  await import('../../scripts/initializers/requisition-list.js');

  // Ensure X-Adobe-Company header is present for B2B requisition list operations.
  // The company-switcher dropin skips single-company users; read the value from
  // sessionStorage (where it was persisted during company-switcher init) as a fallback.
  const COMPANY_KEY = 'DROPIN__COMPANYSWITCHER__COMPANY__CONTEXT';
  const companyId = sessionStorage.getItem(COMPANY_KEY) || localStorage.getItem(COMPANY_KEY);
  if (companyId && !CORE_FETCH_GRAPHQL.getFetchGraphQlHeader('X-Adobe-Company')) {
    CORE_FETCH_GRAPHQL.setFetchGraphQlHeader('X-Adobe-Company', companyId);
  }

  // Probe the API before rendering: this surfaces the real error message instead of
  // letting the dropin silently swallow it as an unhandled promise rejection.
  try {
    const probe = await getRequisitionLists(1, 1);
    if (probe === null) {
      showError(block, 'Unable to load requisition lists. Ensure your account has B2B company access and that requisition lists are enabled in Adobe Commerce Admin.');
      return;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[requisition-list]', err);
    showError(block, err?.message || String(err));
    return;
  }

  const renderGrid = async () => {
    const gridRenderFunction = rlRenderer.render(RequisitionListGrid, {
      routeRequisitionListDetails: (uid) => rootLink(`${CUSTOMER_REQUISITION_LIST_DETAILS_PATH}?requisitionListUid=${uid}`),
      slots: {},
    });

    return gridRenderFunction(block);
  };

  await renderGrid();
}
