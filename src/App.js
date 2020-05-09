import React from 'react';
import './App.css';
import axios from 'axios';
const { v4: uuidv4 } = require('uuid');

const url = "https://api.spacexdata.com/v3/launches"

const headerSuccessfulMissions = "Successful Missions"
const headerFailedMissions = "Failed Missions"
const errorNoDataForSuccessfulMissions = "No data available for successful missions ..."
const errorNoDataForFailedMissions = "No data available for failed missions ..."
const errorProblemGettingData = "Problem getting data from the endpoint ..."
const messageLoadingData = "Loading data please wait ..." 

function sortByMissionName(sortOnWho) {
    sortOnWho.sort((a, b) => a.mission_name.localeCompare(b.mission_name));
}

function renderView(data, heading) {

    if (data.length === 0) throw new Error("renderView receiving empty data array.");

    return(
      <div>
          <hr/>
          <h1>{heading}</h1>
          <br/>
          <br/>
          <table>
                <thead>
                  <tr>
                      <th>Flight number</th>
                      <th>Mission Name</th>
                      <th>Launch Year</th>
                      <th>Launch Date</th>
                      <th>Launch Site</th>
                      <th>Mission Patch Image</th>
                      <th>Mission Details</th>
                      { !data[0].launch_success ? <th>Launch Failure Reasons</th>:<th></th> }
                  </tr>
                </thead>
                <tbody>
          {data.map((item) => {
            
              return (<tr key={uuidv4()}>
                    <td>{item.flight_number}</td>
                    <td width="200px">{item.mission_name}</td>
                    <td width="200px">{item.launch_year}</td>
                    <td width="200px">{item.launch_date_local}</td>
                    <td width="200px">{item.launch_site.site_name}</td>
                    <td width="200px">{ item.links.mission_patch !== null ?<img src={item.links.mission_patch} alt="Mission Patch" width="100px" height="100px"/> : ""}</td>
                    <td width="300px">{item.details}</td>
                    { !item.launch_success && item.launch_failure_details !== undefined ? <td width="300px">{item.launch_failure_details.reason}</td>:<td></td> }
              </tr>)

          })}
               </tbody>
          </table>
      </div>
    )

}

class App extends React.Component {

  state = {
    loading: true,
    successfulMissions: [],
    failedMissions: [],
    issueWithEndPoint: false,
  }

  componentDidMount() {
      this.setState({loading: true});
      axios.get(url).then((response) => {
            this.setState({successfulMissions : response.data.filter((item) => item.launch_success)})
            this.setState({failedMissions : response.data.filter((item) => !item.launch_success)})
            sortByMissionName(this.state.successfulMissions);
            sortByMissionName(this.state.failedMissions);
            this.setState({loading: false});
      }).catch((message) => {
            this.setState({issueWithEndPoint: true});
      });      
  }

  render() {
    return (
      <React.Fragment>
        {!this.state.loading ? (
          <div>
               { this.state.successfulMissions.length !== 0 ? renderView(this.state.successfulMissions, headerSuccessfulMissions) : <div>{errorNoDataForSuccessfulMissions}</div>}
               { this.state.failedMissions.length !== 0 ? renderView(this.state.failedMissions, headerFailedMissions) : <div>{errorNoDataForFailedMissions}</div>}
          </div>
        ):(  
          <span>{ this.state.issueWithEndPoint ? errorProblemGettingData : messageLoadingData }</span>  
        )}
      </React.Fragment>
    );
  }

}

export default App;
