import axios from 'axios';
import log from 'loglevel';

export const findAllRemediations = (showMessage) => {
  // Retrieve one record to get pagination total size. Use the total size to retrieve the full list.
  return axios.get(process.env.REACT_APP_JAVA_SERVICES_URL + '/api/tenants?size=1')
      .then((response) => {
        const totalElements = response.data.page.totalElements;
        return axios.get(process.env.REACT_APP_JAVA_SERVICES_URL + '/api/tenants?size=' + totalElements);
      })
      .then((response) => {
        return response.data._embedded.tenants;
      })
      .catch((error) => {
        // TODO implement error handling
        showMessage('error', 'Error', "Error fetching remediations, " + error)
        log.error(error);
      });
}
