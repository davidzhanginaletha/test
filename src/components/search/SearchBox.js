import React, {useContext, useState} from 'react';
import {AutoComplete} from "primereact/autocomplete";
import {PlanAccountNumberContext} from "../PlanAccountNumberContext";
import {searchByParameters} from './SearchFunctions';

export const SearchBox = (props) => {
  const planAccountNumberCtxt = useContext(PlanAccountNumberContext);

  // Set up hooks
  const [selectedSearchId, setSelectedSearchId] = useState(null);
  const [filteredSearchIds, setFilteredSearchIds] = useState(null);

  // Use a Promise + setTimeout to retrieve a list of matching entries from the server.
  // TODO Check the logic on this promise + timeout arrangement. And, make the timeout value configurable.
  const findSearchIds = (event) => {
    setTimeout(() => {
      if (!event.query.trim().length) {
        // No query, no data
        setFilteredSearchIds([]);
      } else {
        // SearchParamKey must be assigned the current search text.
        let params = props.params
        params[props.searchParamKey] = event.query.trim();
        searchByParameters(props.resultsKey, props.resultKey, props.url, params)
            .then((data) => {
              setFilteredSearchIds(data);
            });
      }
    }, process.env.REACT_APP_SEARCH_TIMEOUT);
  }

  return (
      <div>
        <label htmlFor='selectedSearchId'>{props.label}</label>
        <AutoComplete id='selectedSearchId'
                      value={selectedSearchId}
                      field='identifier'
                      suggestions={filteredSearchIds}
                      completeMethod={findSearchIds}
                      onChange={(e) => setSelectedSearchId(e.value)}
                      onSelect={(e) => {
                        planAccountNumberCtxt.setPlanAccountNumber(e.value.planAccountNumber);
                        setSelectedSearchId('');
                      }}
        />
      </div>
  )
}
