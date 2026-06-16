import { initializers } from '@dropins/tools/initializer.js';
import { initialize, setEndpoint, getCustomerCompanyInfo } from '@dropins/storefront-company-switcher/api.js';
import { initializeDropin } from './index.js';
import { CORE_FETCH_GRAPHQL, CS_FETCH_GRAPHQL } from '../commerce.js';

const COMPANY_KEY = 'DROPIN__COMPANYSWITCHER__COMPANY__CONTEXT';

await initializeDropin(async () => {
  // Set Fetch GraphQL (Core)
  setEndpoint(CORE_FETCH_GRAPHQL);

  // Initialize company switcher
  await initializers.mountImmediately(initialize, {
    fetchGraphQlModules: [CORE_FETCH_GRAPHQL, CS_FETCH_GRAPHQL],
    groupGraphQlModules: [CS_FETCH_GRAPHQL],
  });

  // The dropin's authenticated handler only sets X-Adobe-Company for users with
  // 2+ companies (skips single-company users). That handler also runs async and
  // is not awaited by mountImmediately, so sessionStorage may not be set yet.
  // Ensure the header is set for all company users regardless.
  if (!sessionStorage.getItem(COMPANY_KEY)) {
    const companyInfo = await getCustomerCompanyInfo();
    const companyId = companyInfo?.currentCompany?.id;
    if (companyId) {
      sessionStorage.setItem(COMPANY_KEY, companyId);
      localStorage.setItem(COMPANY_KEY, companyId);
      CORE_FETCH_GRAPHQL.setFetchGraphQlHeader('X-Adobe-Company', companyId);
      CS_FETCH_GRAPHQL.setFetchGraphQlHeader('X-Adobe-Company', companyId);
    }
  }
})();
