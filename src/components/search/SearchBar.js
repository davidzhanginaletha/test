import {Panel} from "primereact/panel";
import React from "react";
import {SearchBox} from './SearchBox';

export const SearchBar = () => {
  // There are four searches each uses a different URL and parameter set for searching.
  const accountProps = {
    label: 'Account Id',
    resultsKey: 'enrichments',
    resultKey: 'planAccountNumber',
    searchParamKey: 'planAccountNumberStart',
    url: process.env.REACT_APP_JAVA_SERVICES_URL + '/api/enrichments/search/findEnrichmentsByPlanAccountNumberStartsWith',
    params : {
      projection: 'planAccountNumberSearch',
      size: 20,
      sort: 'planAccountNumber',
    }
  }

  const cidProps = {
    label: 'Customer Id',
    resultsKey: 'enrichments',
    resultKey: 'cid',
    searchParamKey: 'cidStart',
    url: process.env.REACT_APP_JAVA_SERVICES_URL + '/api/enrichments/search/findEnrichmentsByCIDStartsWith',
    params : {
      projection: 'customerIdSearch',
      size: 20,
      sort: 'cid',
    }
  }

  const fullNameProps = {
    label: 'Full name',
    resultsKey: 'enrichments',
    resultKey: 'fullName',
    searchParamKey: 'fullNameStart',
    url: process.env.REACT_APP_JAVA_SERVICES_URL + '/api/enrichments/search/findEnrichmentsByFullNameStartsWithIgnoreCase',
    params : {
      projection: 'fullNameSearch',
      size: 20,
      sort: 'fullName',
    }
  }

  const letterRefIdProps = {
    label: 'Letter Ref Id',
    resultsKey: 'letters',
    resultKey: 'displayedLetterRefId',
    searchParamKey: 'displayedLetterRefIdStart',
    url: process.env.REACT_APP_JAVA_SERVICES_URL + '/api/letters/search/findLettersByDisplayedLetterRefIdStartingWithIgnoreCase',
    params : {
      projection: 'displayedLetterRefId',
      size: 20,
      sort: 'displayedLetterRefId',
    }
  }
  return (
      <Panel header={"Search"}>
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col">
            <SearchBox {...accountProps}/>
          </div>
          <div className="p-field p-col">
            <SearchBox {...letterRefIdProps}/>
          </div>
          <div className="p-field p-col">
            <SearchBox {...fullNameProps}/>
          </div>
          <div className="p-field p-col">
            <SearchBox {...cidProps}/>
          </div>
        </div>
      </Panel>
  )
}
