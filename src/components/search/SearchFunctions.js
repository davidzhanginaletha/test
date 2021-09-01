import _ from 'lodash';
import axios from 'axios';
import log from "loglevel";

export const indexSearch = (sortKey, url, params) => {
  // Make a request for an index search.
  return axios.get(url, {params: params})
      .then((response) => {
        let results = _.sortBy(response.data, sortKey);
        return results;
      })
      .catch((error) => {
        // TODO Implement error handling
        log.error(error);
      });
}

/**
 * Use a 'finder' on the server to return a list of autocomplete results. The response is assumed to be of the
 * form:
 * {
 *   _embedded: {
 *     resultsKey: [
 *       {
 *         resultKey: ...
 *         letter: {
 *           letterRefId: ...
 *           .
 *           .
 *           .
 *         }
 *         tenant: {
 *           label: ...
 *           .
 *           .
 *           .
 *         }
 *         .
 *         .
 *         .
 *       }
 *     ]
 *   }
 * }
 * @param resultsKey  embedded object label
 * @param resultKey   key that determines search result
 * @param url         search url
 * @param params      parameters required for search including the search parameter, projection, size limit, etc.
 * @returns {Promise<any[] | void>}
 */
export const searchByParameters = (resultsKey, resultKey, url, params) => {
  // Make a call to the appropriate search function with a limit on the result size.
  return axios.get(url,
      {
        params: params,
      })
      .then((response) => {
        log.debug(response);
        // Create the output by flattening and removing unneeded data.
        let results = response.data._embedded[resultsKey].map(result => {
          // Merge the nested data to top level
          // TODO Assumption is that all search results have at most nested Enrichment and Tenant. Verify this.
          //  For now only Letter needs the Enrichment merge.
          result = _.merge(result, result.enrichment, result.tenant);
          // Create a new field from the resultKey and tenant label
          result.identifier = result[resultKey] + ' ' + result.label;
          // Extract only the fields required, which does not include object types.
          result = _.omitBy(result, _.isObject);
          return result;
        });
        results = _.sortBy(results, 'identifier');
        log.debug('results');
        log.debug(results);
        return results;
      })
      .catch((error) => {
        // TODO Implement error handling
        log.error(error);
      });
}
