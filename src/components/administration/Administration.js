import {Card} from 'primereact/card';
import {Panel} from 'primereact/panel';
import {Button} from 'primereact/button';
import log from 'loglevel';

export const Administration = () => {
  return (
      <Card>
        <h1>Scotiabank's Admin Portal</h1>
        <div className="p-grid">
          <div className="p-col">
            <Panel header={"Input Files"}>
              <div className="p-grid p-fluid">
                <div className="p-p-2 p-col-12 p-mb-2 p-lg-3 p-mb-lg-0">
                  <Button label="Posted Reports" icon="pi pi-upload" onClick={() => {log.debug("Clicked posted reports")}}/>
                </div>
                <div className="p-p-2 p-col-12 p-mb-2 p-lg-3 p-mb-lg-0">
                  <Button label="Rejected Reports" icon="pi pi-upload" onClick={() => {log.debug("Clicked rejected reports")}}/>
                </div>
                <div className="p-p-2 p-col-12 p-mb-2 p-lg-3 p-mb-lg-0">
                  <Button label="Processed Manual Exceptions" icon="pi pi-upload" onClick={() => {log.debug("Clicked processed manual exceptions")}}/>
                </div>
                <div className="p-p-2 p-col-12 p-mb-2 p-lg-3 p-mb-lg-0">
                  <Button label="Processed Rejected" icon="pi pi-upload" onClick={() => {log.debug("Clicked processsed rejected")}}/>
                </div>
                <div className="p-p-2 p-col-12 p-mb-2 p-lg-3 p-mb-lg-0">
                  <Button label="Mailing Status" icon="pi pi-upload" onClick={() => {log.debug("Clicked mailing status")}}/>
                </div>
                <div className="p-p-2 p-col-12 p-mb-2 p-lg-3 p-mb-lg-0">
                  <Button label="Return Mail Status" icon="pi pi-upload" onClick={() => {log.debug("Clicked return mail status")}}/>
                </div>
                <div className="p-p-2 p-col-12 p-mb-2 p-lg-3 p-mb-lg-0">
                  <Button label="Cheque Report Status" icon="pi pi-upload" onClick={() => {log.debug("Clicked cheque report status")}}/>
                </div>
                <div className="p-p-2 p-col-12 p-mb-2 p-lg-3 p-mb-lg-0">
                  <Button label="Election Fulfilment Status" icon="pi pi-upload" onClick={() => {log.debug("Clicked election fulfilment status")}}/>
                </div>
              </div>
            </Panel>
          </div>
        </div>
        <div className="p-grid">
          <div className="p-col">
            <Panel header={"Output Files"}>
              <div className="p-grid p-fluid">
                <div className="p-p-2 p-col-12 p-mb-2 p-lg-3 p-mb-lg-0">
                  <Button label="Download Reports" icon="pi pi-download" onClick={() => {log.debug("Clicked download reports")}}/>
                </div>
              </div>
            </Panel>
          </div>
        </div>
        <div className="p-grid">
          <div className="p-col">
            <Panel header={"Utilities"}>
              <div className="p-grid p-fluid">
                <div className="p-p-2 p-col-12 p-mb-2 p-lg-3 p-mb-lg-0">
                  <Button label="Open Escalation Portal" icon="pi pi-external-link" onClick={() => {log.debug("Clicked escalation portal")}}/>
                </div>
                <div className="p-p-2 p-col-12 p-mb-2 p-lg-3 p-mb-lg-0">
                  <Button label="Administer Remediations" icon="pi pi-tags" onClick={() => {log.debug("Clicked administer remediations")}}/>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </Card>
  )
}
