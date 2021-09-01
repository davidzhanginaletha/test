import {SearchBar} from '../search/SearchBar';
import {AccountDetails} from './AccountDetails';
import {RemediationsAndPreviousCalls} from './RemediationsAndPreviousCalls';
import {Disposition} from './Disposition';
import {Card} from 'primereact/card';

export const CallCentre = () => {
  return (
      <Card>
        <div className="p-grid">
          <div className="p-col-12">
            <SearchBar/>
          </div>
        </div>
        <div className="p-grid">
          <div className="p-col-3">
            <AccountDetails/>
          </div>
          <div className={"p-col-9"}>
            <div className="p-grid">
              <div className={"p-col"}>
                <RemediationsAndPreviousCalls/>
              </div>
            </div>
            <div className="p-grid">
              <div className={"p-col"}>
                <Disposition/>
              </div>
            </div>
          </div>
        </div>
      </Card>
  )
}
