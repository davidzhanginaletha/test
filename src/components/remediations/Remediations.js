import {useCallback, useEffect, useRef, useState} from 'react';
import {Card} from 'primereact/card';
import {Panel} from 'primereact/panel';
import {Button} from 'primereact/button';
import {ListBox} from 'primereact/listbox';
import {Toast} from "primereact/toast";
import _ from 'lodash';
import {findAllRemediations} from './RemediationTenantService';
import {AddRemediation} from './AddRemediation';
import {FileUploadSelection} from './FileUploadSelection';
import log from 'loglevel';

export const Remediations = () => {
  const [submit, setSubmit] = useState(false);
  const [remediation, setRemediation] = useState(null);
  const [remediations, setRemediations] = useState({});
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const toast = useRef(null)

  // Show toast notification acknowledgements
  const showMessage = useCallback((status, summaryHeading, messageDetails) => {
    toast.current.show({severity: status, summary: summaryHeading, detail: messageDetails, life: process.env.REACT_APP_TOAST_TIMEOUT});
  }, [])

  // Define a function to load/reload the tenants (i.e. remediation instances). Memoize it since it doesn't need
  // to be recomputed on re-render.
  const loadRemediations = useCallback(() => {
    findAllRemediations(showMessage).then(data => {
      const sorted = _.sortBy(data, o => {
        return o.label
      })
      setRemediations(sorted);
    });
  }, [showMessage]);

  // Load the list of remediations on first use and changes to the submit state.
  useEffect(() => {
    loadRemediations();
  }, [submit, loadRemediations]);

  log.debug(remediations)

  return (
      <div>
        <Toast ref={toast} />
        <AddRemediation showCreateDialog={showCreateDialog}
                        setShowCreateDialog={setShowCreateDialog}
                        submit={submit}
                        setSubmit={setSubmit}/>
        <Card>
          <h1>Scotiabank's Remediation Management</h1>
            <div className="p-grid">
              <Panel header={"Current Remediations"} className="p-col-4">
                {
                  (remediations.length)
                  ?<ListBox value={remediation} options={remediations} optionLabel="label"
                    onChange={(e) => setRemediation(e.value)} filter
                    style={{width: '100%'}} listStyle={{maxHeight: '250px'}}/>
                  :<p>No Remediations Found</p>
                }
                <Button label="Add Remediation" icon="pi pi-plus" onClick={() => setShowCreateDialog(true)} style={{marginTop: '1em'}}/>
              </Panel>
              <Panel header={"File Upload"} className="p-col-8">
                <FileUploadSelection remediation={remediation}/>
              </Panel>
            </div>
        </Card>
      </div>
  )
}
