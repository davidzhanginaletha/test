import axios from 'axios';
import log from 'loglevel';
import _ from 'lodash';

/**
 * The Plan Account Number can uniquely identify a remediation instance for a client. The parent type Enrichments
 * instance contains relationships to other types: Tenant, Remediations, Beneficiaries and Dispositions. However,
 * the structure of Remediations is not suitable for the UI purposes, and a different call is used to retrieve it.
 *
 * @param planAccountNumber
 * @returns {Promise<AxiosResponse<any>[] | void>}
 */
export const findEnrichmentsByPlanAccountNumber = (planAccountNumber) => {
  let enrichments = {
    dispositions: {},
    customAccountInfo: {},
    customisations: {},
    tenant: {},
    letter: {},
    remediations: {},
  };
  // Make a request for the Letter matching the argument planAccountNumber. All other entities are related to this one.
  return axios
      .get(process.env.REACT_APP_JAVA_SERVICES_URL +
          '/api/enrichments/search/findEnrichmentByPlanAccountNumberEquals?planAccountNumber=' +
          planAccountNumber)
      .then((response) => {
        // Use the HAL links to find the OneToOne child data. The links are templates so any extra param hints must
        // be removed.
        // FIXME There is a field in the response from Spring Data REST that tells if this replacement is required.
        const tenantUrl = response.data._links.tenant.href.replace(/{.+}/g, '');
        const letterUrl = response.data._links.letter.href.replace(/{.+}/g, '');
        const dispositionsUrl = response.data._links.dispositions.href.replace(/{.+}/g, '');
        // The customAccountInfo data have a custom controller to retrieve the mapped data. It also uses the planAccountNumber
        // as the key.
        const customAccountInfoUrl = process.env.REACT_APP_JAVA_SERVICES_URL +
            '/api/customaccountinfos/search/findCustomAccountInfoByPlanAccountNumberEquals?planAccountNumber=' +
            planAccountNumber
        // The customisations have a custom controller to retrieve the mapped data. It also uses the planAccountNumber
        // as the key.
        const customisationsUrl = process.env.REACT_APP_JAVA_SERVICES_URL +
            '/api/customisations/search/listCustomisationsByPlanAccountNumberEquals?planAccountNumber=' +
            planAccountNumber
        // The remediations have a custom controller to retrieve the mapped data. It also uses the planAccountNumber
        // as the key.
        const remediationsUrl = process.env.REACT_APP_JAVA_SERVICES_URL +
            '/api/remediations/search/listRemediationsByPlanAccountNumberEquals?planAccountNumber=' +
            planAccountNumber
        _.merge(enrichments, response.data);
        // Use Promise.all to retrieve all of the nested types in the data model.
        return Promise.all([
          axios.get(tenantUrl),
          axios.get(letterUrl),
          axios.get(dispositionsUrl),
          axios.get(customAccountInfoUrl),
          axios.get(customisationsUrl),
          axios.get(remediationsUrl),
        ]);
      })
      .then((responses) => {
        // Merge results into the remediation object. Tenant and Letter are flat.
        enrichments.tenant = responses[0].data;
        enrichments.letter = responses[1].data;
        // Dispositions and beneficiaries are collections so they are _embedded.
        enrichments.dispositions = responses[2].data._embedded.dispositions;
        // CustomAccountInfo are flexfields so they use a custom controller with no support for HAL.
        enrichments.customAccountInfo = responses[3].data;
        // Customisations are flexfields so they use a custom controller with no support for HAL.
        enrichments.customisations = responses[4].data;
        // Remediations are flexfields so they use a custom controller with no support for HAL.
        enrichments.remediations = responses[5].data;
        return enrichments;
      })
      .catch((error) => {
        // FIXME Implement proper error handling
        log.error(error);
      });
}
