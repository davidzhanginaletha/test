import {useContext, useEffect, useState} from 'react';
import {Panel} from "primereact/panel";
import {TabPanel, TabView} from "primereact/tabview";
import {RemediationContext} from "../RemediationContext";
import {FlexFieldTable} from './FlexFieldTable';
import _ from 'lodash';
import log from 'loglevel';

export const AccountDetails = () => {
  const [customAccountInfo, setCustomAccountInfo] = useState(null);
  const [dynamicTabData, setDynamicTabData] = useState(null);
  const state = useContext(RemediationContext);

  useEffect(() => {
    // Check for customisations in the state data. These are handled through special processing.
    if (!_.isNil(state.enrichments) && !_.isNil(state.enrichments.customisations)) {
      // There is a special group identifier for the custom fields to show at the top of the Account Details.
      const customAccountDetails = state.enrichments.customAccountInfo;
      log.debug(customAccountDetails)
      setCustomAccountInfo(customAccountDetails);
      // Gather the custom data into a new container for processing by the UI.
      let customisations = state.enrichments.customisations
      log.debug(customisations)
      setDynamicTabData(customisations);
    }
  }, [state]);

  return (
      <Panel header={"Account Details"}>
        <TabView>
          <TabPanel header="Account Info">
            {/* Custom fields are displayed at the top using a loop through the customAccountInfo object. */}
            {
              _.keys(!_.isNil(customAccountInfo) ? customAccountInfo : {})
                  .map(key => (
                      <div className="p-grid">
                        <div className="p-col">
                          {key}
                        </div>
                        <div className="p-col">
                          {customAccountInfo[key]}
                        </div>
                      </div>
                  ))
            }
            <div className="p-grid">
              <div className="p-col">
                Account
              </div>
              <div className="p-col">
                {!_.isNil(state.enrichments) ? state.enrichments.planAccountNumber : ''}
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col">
                Fullname
              </div>
              <div className="p-col">
                {!_.isNil(state.enrichments) ? state.enrichments.fullName : ''}
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col">
                Type
              </div>
              <div className="p-col">
                {!_.isNil(state.enrichments) ? state.enrichments.accountType : ''}
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col">
                Account Status
              </div>
              <div className="p-col">
                {!_.isNil(state.enrichments) ? state.enrichments.accountStatus : ''}
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col">
                Branch
              </div>
              <div className="p-col">
                {!_.isNil(state.enrichments) ? state.enrichments.branchCode : ''}
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col">
                CID
              </div>
              <div className="p-col">
                {!_.isNil(state.enrichments) ? state.enrichments.cid : ''}
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col">
                Preferred Language
              </div>
              <div className="p-col">
                {!_.isNil(state.enrichments) ? state.enrichments.preferredLanguage : ''}
              </div>
            </div>
          </TabPanel>
          {/*
            Flexfields contain Group entries that correspond to tabs. Each group contains the table of
            data applicable to the tab.
            FIXME This is the lazy way to show all tabs without addressing the ordering problem.
           */}
          {
            _.keys(!_.isNil(dynamicTabData) ? dynamicTabData : [])
                .map(group => (
                    <TabPanel key={group} header={group}>
                      <FlexFieldTable group={group} flexfields={dynamicTabData[group]}/>
                    </TabPanel>
                ))
          }
        </TabView>
      </Panel>
  )
}
