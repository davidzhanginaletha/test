// Import React and hooks
import React, {useEffect, useState} from 'react';

// Import PrimeReact styles
import "primereact/resources/themes/bootstrap4-dark-purple/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import 'primeflex/primeflex.css';

// Support components
import log from 'loglevel';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

// Custom Components
import {PlanAccountNumberContext} from "./components/PlanAccountNumberContext";
import {RemediationContext} from "./components/RemediationContext";
import {findEnrichmentsByPlanAccountNumber} from './components/RemediationService';
import {Administration} from './components/administration/Administration';
import {Remediations} from './components/remediations/Remediations';
import {CallCentre} from './components/callcenter/CallCentre';

log.setLevel(process.env.REACT_APP_LOG_LEVEL);

function App() {
  const [planAccountNumber, updatePlanAccountNumber] = useState('');
  const [enrichments, setEnrichments] = useState(null);

  // Update the empty arrow functions to point to the useState methods. Different names to avoid confusion.
  const setPlanAccountNumber = (value) => {
    updatePlanAccountNumber(value);
  }

  useEffect(() => {
    findEnrichmentsByPlanAccountNumber(planAccountNumber).then(data => {
      log.debug('remediation service response')
      log.debug(data)
      setEnrichments(data);
    });
  }, [planAccountNumber]);

  return (
      <PlanAccountNumberContext.Provider value={{planAccountNumber, setPlanAccountNumber}}>
        <RemediationContext.Provider value={{enrichments: enrichments, setEnrichments: setEnrichments}}>
          <Router>
            <Switch>
              <Route path="/administration">
                <Administration/>
              </Route>
              <Route path="/remediations">
                <Remediations/>
              </Route>
              <Route path="/">
                <CallCentre/>
              </Route>
            </Switch>
          </Router>
        </RemediationContext.Provider>
      </PlanAccountNumberContext.Provider>
  );
}

export default App;
