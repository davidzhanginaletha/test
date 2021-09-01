import {useState, useEffect} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import _ from 'lodash';
import log from 'loglevel';

export const FlexFieldTable = (props) => {
  const [columns, setColumns] = useState([]);

  // useEffect is acting like the old componentWillReceive method in React classes
  useEffect(() => {
    log.debug(props.flexfields);
    // Pick out the keyXX entries from the first row of data.
    const keys = _.keys(_.pickBy(props.flexfields[0], (value, key) => {
      // Match based on fieldXX where XX is 01, 02, etc. Note that different panels have different keys
      // and they may not be in order.
      return /^field\d\d$/.test(key);
    }))
        .sort()
    log.debug(keys);
    setColumns(keys)
  }, [props.flexfields]);

  return (
      <DataTable key={props.group} value={props.flexfields}>
        {
          columns.map(col => (
              <Column key={col} field={col} header={props.flexfields[0][`${col}label`]}/>
          ))
        }
      </DataTable>
  )
}
