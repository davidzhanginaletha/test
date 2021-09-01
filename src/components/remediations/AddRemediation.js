import {useState, useCallback, useRef} from 'react';
import {InputText} from 'primereact/inputtext';
import {InputTextarea} from 'primereact/inputtextarea';
import {Toast} from "primereact/toast";
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import axios from 'axios';
import log from 'loglevel';

// Field labels
const FIELDS = {
  LABEL: 'label',
  SHORTCODE: 'shortCode',
  DESCRIPTION: 'description',
}

export const AddRemediation = (props) => {
  // Deconstruct props to be used as dependencies in lifecycle functions
  const propSetSubmit = props.setSubmit
  const propSubmit = props.submit
  const propSetShowCreateDialog = props.setShowCreateDialog
  const propShowCreateDialog = props.showCreateDialog

  const [formValues, changeFormValues] = useState({
    [FIELDS.LABEL]: '',
    [FIELDS.SHORTCODE]: '',
    [FIELDS.DESCRIPTION]: '',
  });
  const toast = useRef(null)

  // Method to capture field changes and merge into formValues.
  const handleInputChange = useCallback(fieldName => e => {
    const fieldValue = e.target.value;

    changeFormValues(prevState => ({
      ...prevState,
      [fieldName]: fieldValue
    }));
  }, []);

  // Show toast notification acknowledgements
  const showMessage = useCallback((status, summaryHeading, messageDetails) => {
    toast.current.show({severity: status, summary: summaryHeading, detail: messageDetails, life: process.env.REACT_APP_TOAST_TIMEOUT});
  }, [])

  // Clear state function. Memoize to save on resources.
  const clearState = useCallback(() => {
    changeFormValues({
      [FIELDS.LABEL]: '',
      [FIELDS.SHORTCODE]: '',
      [FIELDS.DESCRIPTION]: '',
    });
  }, []);
  // Dismiss should clear and change display state. Memoize to save on resources.
  const dismiss = useCallback(() => {
    // clearState();
    // props.setShowCreateDialog(false);
    propSetShowCreateDialog(false);
  }, [propSetShowCreateDialog]);

  // Submit will post the formvalues to the backend
  const submit = useCallback(() => {
    log.debug(formValues);
    axios.post(process.env.REACT_APP_JAVA_SERVICES_URL + '/api/tenants', formValues)
        .then((response) => {
          log.debug(response);
          propSetSubmit(!propSubmit)
          dismiss();
        })
        .then(() => {
          clearState();
        })
        .then(() => {
          showMessage('success', 'Success', "Remediation added successfully")
        })
        .catch((error) => {
          // FIXME handle error
          // log.error(error);
          showMessage('error', 'Error', "Error adding remediation, " + error)
        });
  }, [propSetSubmit, propSubmit, formValues, clearState, dismiss, showMessage]);

  // Footer contains logic to save and clear out state. Memoize because it is the same for each rendering.
  const renderFooter = useCallback(() => {
    return (
        <div>
          <Button label="Submit" icon="pi pi-check" onClick={() => submit()}/>
          <Button label="Cancel" icon="pi pi-times" onClick={() => dismiss()}/>
        </div>
    );
  }, [submit, dismiss]);

  return (
    <div>
      <Toast ref={toast} />
      <Dialog header="Add Remediation"
              visible={propShowCreateDialog}
              style={{width: '50vw'}}
              footer={renderFooter()}
              onHide={() => dismiss()}>
        <div className="p-fluid">
          <div className="p-field p-grid">
            <label htmlFor={FIELDS.LABEL} className="p-col-12 p-md-2">Remediation Label</label>
            <div className="p-col-12 p-md-10">
              <InputText id={FIELDS.LABEL} type="text" value={formValues[FIELDS.LABEL]}
                         onChange={handleInputChange(FIELDS.LABEL)}/>
            </div>
          </div>
          <div className="p-field p-grid">
            <label htmlFor={FIELDS.SHORTCODE} className="p-col-12 p-md-2">Remediation Short Code</label>
            <div className="p-col-12 p-md-10">
              <InputText id={FIELDS.SHORTCODE} type="text" value={formValues[FIELDS.SHORTCODE]}
                         onChange={handleInputChange(FIELDS.SHORTCODE)}/>
            </div>
          </div>
          <div className="p-field p-grid">
            <label htmlFor={FIELDS.DESCRIPTION} className="p-col-12 p-md-2">Remediation Description</label>
            <div className="p-col-12 p-md-10">
              <InputTextarea id={FIELDS.DESCRIPTION} rows={3} value={formValues[FIELDS.DESCRIPTION]}
                             onChange={handleInputChange(FIELDS.DESCRIPTION)}/>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
