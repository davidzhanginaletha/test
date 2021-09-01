import {useEffect} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';

export const HistoricalNotesTable = (props) => {

  // useEffect is acting like the old componentWillReceive method in React classes
  useEffect(() => {
  }, [props.dispositions]);

  return (
      <DataTable value={props.dispositions}>
        <Column field="callReason" header="Call Reason"></Column>
        <Column field="callResolution" header="Call Resolution"></Column>
        <Column field="escalationReason" header="Escalation Reason"></Column>
        <Column field="escalationTo" header="Escalation To"></Column>
        <Column field="remarks" header="Remarks"></Column>
        <Column field="lastModifiedDate" header="Last Modified"></Column>
      </DataTable>
  )
}
