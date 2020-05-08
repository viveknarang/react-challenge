import React from 'react';
import './App.css';
import axios from 'axios';
const { v4: uuidv4 } = require('uuid');

// Replace the below url with: "https://api.spacexdata.com/v3/launches"
const url = "http://localhost:5000/launches"

function sortByMissionName(sortOnWho) {
    sortOnWho.sort((a, b) => a.mission_name.localeCompare(b.mission_name));
}

function renderView(data, heading) {

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
                    <td width="200px"><img src={item.links.mission_patch} alt="Mission Patch" width="100px" height="100px"/></td>
                    <td width="300px">{item.details}</td>
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
            console.log(this.state.failedMissions);
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
                    {renderView(this.state.successfulMissions, "Successful Missions")}
                    {renderView(this.state.failedMissions, "Failed Missions")}
              </div>
            ):(
                <span>Loading data please wait ...</span>  
            )}
      </React.Fragment>
    );
  }

}

export default App;
