import {useRef, useState, useEffect} from 'react';
import {Toast} from 'primereact/toast';
import {Tooltip} from 'primereact/tooltip';
import {FileUpload} from 'primereact/fileupload';
import _ from 'lodash';
import log from 'loglevel';

export const FileUploadSelection = (props) => {
  // TODO This was a copy/paste from PrimeReact docs. Needs cleanup to remove dead code and memoize some functions.
  const [disabled, setDisabled] = useState(true);
  const [tenant, setTenant] = useState('');
  const toast = useRef(null);

  // This component is disabled until a tenant/remediation is selected.
  useEffect(() => {
    log.debug(props.remediation);
    const state = _.isNil(props.remediation)
    // Enable/disable based on property state
    setDisabled(state);
    // Remediation label also depends on state
    setTenant(state ? '' : props.remediation.label);
  }, [props.remediation]);

  const onUploadSuccess = () => {
    showMessage('success', 'Success', 'File(s) uploaded successfully')
  }

  const onUploadFail = () => {
    showMessage('error', 'Error', 'File(s) upload failed')
  }

  const showMessage = (status, summaryHeading, messageDetails) => {
    toast.current.show({severity: status, summary: summaryHeading, detail: messageDetails, sticky: true});
  }

  return (
      <div>
        <Toast ref={toast}></Toast>

        <Tooltip target=".custom-choose-btn" content="Choose" position="bottom"/>
        <Tooltip target=".custom-upload-btn" content="Upload" position="bottom"/>
        <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom"/>

        <FileUpload disabled={disabled} name="files"
                    url={process.env.REACT_APP_JAVA_SERVICES_URL + "/api/uploadTenant?tenant=" + tenant}
                    onUpload={onUploadSuccess} onError={onUploadFail} multiple accept=".csv" maxFileSize={1000000}
                    emptyTemplate={<p className="p-m-0">Drag and drop files to here to upload.</p>}/>
      </div>
  )
}
