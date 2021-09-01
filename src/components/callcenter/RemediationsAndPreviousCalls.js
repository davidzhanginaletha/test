import {useContext, useEffect, useState} from 'react';
import {Panel} from "primereact/panel";
import {TabPanel, TabView} from "primereact/tabview";

import {RemediationContext} from '../RemediationContext';
import {HistoricalNotesTable} from './HistoricalNotesTable';
import {FlexFieldTable} from './FlexFieldTable';

import _ from 'lodash';
import log from 'loglevel';

export const RemediationsAndPreviousCalls = () => {
  const [remediationDetails, setRemediationDetails] = useState({});
  const [dynamicTabData, setDynamicTabData] = useState({});
  const state = useContext(RemediationContext);

  // useEffect required to update the view when the remediation is found in a search.
  useEffect(() => {
    // Check for the Remediation Details in the state data. This is the first tab panel.
    const REMEDIATION_DETAILS = 'Remediation Details';
    if (!_.isNil(state.enrichments) && !_.isNil(state.enrichments.remediations)) {
      // There is a special group identifier for the custom fields to show at the top of the Account Details.
      const remediationDetails = state.enrichments.remediations[REMEDIATION_DETAILS];
      log.debug("remediationDetails");
      log.debug(remediationDetails);
      setRemediationDetails(remediationDetails);
      // Create a new container for the remaining data.
      let otherRemediationData = state.enrichments.remediations
      delete otherRemediationData[REMEDIATION_DETAILS];
      log.debug("otherRemediationData");
      log.debug(otherRemediationData);
      setDynamicTabData(otherRemediationData);
    }
  }, [state.enrichments]);

  return (
      <Panel header={"Remediation and Previous Call Details"}>
        <TabView>
          <TabPanel key={"Remediation Details"} header="Remediation Details">
            <FlexFieldTable group={"Remediation Details"} flexfields={!_.isNil(remediationDetails) ? remediationDetails : {}}/>
          </TabPanel>
          <TabPanel key={"Historical Notes"} header="Historical Notes">
            <HistoricalNotesTable dispositions={!_.isNil(state.enrichments) ? state.enrichments.dispositions : {}}/>
          </TabPanel>
          {/*
            Flexfields contain Group entries that correspond to tabs. Each group contains the table of
            data applicable to the tab.
            FIXME This is the lazy way to show all tabs without addressing the ordering problem.
           */}
          {
            _.keys(!_.isNil(state.enrichments) ? state.enrichments.remediations : [])
                .map(group => (
                    <TabPanel key={group} header={group}>
                      <FlexFieldTable group={group} flexfields={!_.isNil(dynamicTabData) ? dynamicTabData[group] : {}}/>
                    </TabPanel>
                ))
          }
        </TabView>
      </Panel>
  )
}
