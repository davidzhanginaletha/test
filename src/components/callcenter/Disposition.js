import {useCallback, useContext, useRef, useState} from "react";
import {Dropdown} from "primereact/dropdown";
import {InputTextarea} from "primereact/inputtextarea";
import {Button} from "primereact/button";
import {Panel} from "primereact/panel";
import {Toast} from "primereact/toast";
import axios from "axios";
import log from "loglevel";
import {SelectButton} from "primereact/selectbutton";
import {RemediationContext} from '../RemediationContext';

export const Disposition = () => {
  const state = useContext(RemediationContext);

  const [callReason, setCallReason] = useState('');
  const [escalationReason, setEscalationReason] = useState('');
  const [callResolution, setCallResolution] = useState('');
  const [escalationTo, setEscalationTo] = useState('');
  const [remarks, setRemarks] = useState('');
  const toast = useRef(null)

  const showMessage = useCallback((status, summaryHeading, messageDetails) => {
    toast.current.show({severity: status, summary: summaryHeading, detail: messageDetails, life: process.env.REACT_APP_TOAST_TIMEOUT});
  }, [])

  // FIXME All of these hard coded lists should come from a table in the back-end.
  const callReasons = [
    {
      label: 'General', code: 'general', items: [
        {label: 'Cheque Issue', value: 'cheque_issue'},
        {label: 'Complaint', value: 'complaint'},
        {label: 'Grant Inquiry', value: 'grant_inquiry'},
      ]
    },
    {
      label: 'How payment calculated', code: 'how_payment_calculated', items: [
        {label: 'Inquiry Fund/Switch Purchase', value: 'inquiry_fund_switch_purchase'},
        {label: 'Inquiry Payment', value: 'inquiry_payment'},
        {label: 'Inquiry Trade Confirm', value: 'inquiry_trade_confirm'},
        {label: 'Other', value: 'other'},
      ]
    },
    {
      label: 'Purpose for Remediation', code: 'purpose for remdiation', items: [
        {label: 'Tax Questions', value: 'purpose_for_remediation_tax_questions'},
        {label: 'Transfer Form Help', value: 'purpose_for_remediation_transfer_form_help'},
      ]
    },
  ];
  const escalationReasons = [
    {label: 'Administrative', value: 'administrative'},
    {label: 'Complaint', value: 'complaint'},
    {label: 'Dissatisfaction', value: 'dissatisfaction'},
    {label: 'Fund Purchase Inquiries', value: 'fund_purchase_inquiries'},
    {label: 'Media', value: 'media'},
    {label: 'Payment Inquiries', value: 'payment_inquiries'},
    {label: 'Tax', value: 'tax'},
    {label: 'Transfer Forms', value: 'transfer_forms'},

  ];
  const callResolutions = [
    {label: 'Yes', value: 'yes'},
    {label: 'No', value: 'no'},
  ];
  const escalationTos = [
    {label: 'Call Centre Management', value: 'call_centre_management'},
    {label: 'Go Ask Ops', value: 'go_ask_ops'},
  ];

  // Clear state for the disposition form
  // No dependency needs to be passed in the useCallback because the setters don't change their own state.
  const clearState = useCallback(() => {
    log.debug("ClearState called")
    setCallReason('')
    setEscalationReason('')
    setCallResolution('')
    setEscalationTo('')
    setRemarks('')
  }, [])

  const save = () => {
    const data = {
      callReason: callReason,
      escalationReason: escalationReason,
      callResolution: callResolution,
      escalationTo: escalationTo,
      remarks: remarks,
      timestamp: new Date().toISOString()
    }
    log.debug(data);
    axios.post(process.env.REACT_APP_JAVA_SERVICES_URL + '/api/dispositions', data)
        .then((response) => {
          log.debug(response);
          // Response contains reference URL to instance of disposition
          const dispositionUrl = response.data._links.self.href;
          // The state contains the letter and the dispositions link
          const enrichmentsUrl = state.enrichments._links.dispositions.href;
          // This is the Spring Data REST approach to adding an association. The PATCH adds to an existing
          // list. A PUT would replace the list.
          // See https://www.baeldung.com/spring-data-rest-relationships. If this was bi-directional,
          // a second call would be required.
          axios({
            url: enrichmentsUrl,
            data: dispositionUrl,
            method: 'PATCH',
            headers: {
              'Content-Type': 'text/uri-list',
            },
          })
          .catch((error) => {
            log.error("Error patching disposition to enrichment data, " + error)
          })
        })
        .then(() => {
          clearState()
        })
        .then(() => {
          showMessage('success', 'Success', "Disposition added successfully")
        })
        .catch((error) => {
          log.error("Error adding disposition, " + error)
        });
  }

  return (
    <div>
      <Toast ref={toast} />
      <Panel header={"Disposition"}>
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col">
            <label htmlFor="callReason">Call Reason</label>
            <Dropdown value={callReason} options={callReasons} onChange={(e) => setCallReason(e.value)}
                      optionLabel="label" optionGroupLabel="label" optionGroupChildren="items"
                      placeholder="Select a Call Reason"/>
          </div>
          <div className="p-field p-col">
            <label htmlFor="escalationReason">Escalation Reason</label>
            <Dropdown value={escalationReason} options={escalationReasons}
                      onChange={(e) => setEscalationReason(e.value)}
                      placeholder="Select an Escalation Reason"/>
          </div>
        </div>
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col pcol-4">
            <label htmlFor="callResolution">Call Resolution</label>
            <SelectButton value={callResolution} options={callResolutions} onChange={(e) => setCallResolution(e.value)}
                          placeholder="Select a Call Resolution"/>
          </div>
          <div className="p-field p-offset-2 p-col-6">
            <label htmlFor="escalationTo">Escalation To</label>
            <Dropdown value={escalationTo} options={escalationTos}
                      onChange={(e) => setEscalationTo(e.value)}
                      placeholder="Select an Escalation To"/>
          </div>
        </div>
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col-8">
            <label htmlFor="remarks">Remarks</label>
            <InputTextarea rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)}/>
          </div>
          <div className="p-field p-col-2 p-offset-1">
            <label htmlFor="save">Save Disposition</label>
            <Button label="Submit" icon="pi pi-check" onClick={save}/>
          </div>
        </div>
      </Panel>
    </div>
  )
}
