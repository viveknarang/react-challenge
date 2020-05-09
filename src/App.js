import React from 'react';
import './App.css';
import axios from 'axios';
import List from './components/List';
import Message from './components/Message';

const url = "https://api.spacexdata.com/v3/launchesXXX"

const headerSuccessfulMissions = "Successful Missions"
const headerFailedMissions = "Failed Missions"
const errorNoDataForSuccessfulMissions = "No data available for successful missions ..."
const errorNoDataForFailedMissions = "No data available for failed missions ..."
const errorProblemGettingData = "Problem getting data from the endpoint ..."
const messageLoadingData = "Loading data please wait ..." 

function sortByMissionName(sortOnWho) {
    sortOnWho.sort((a, b) => a.mission_name.localeCompare(b.mission_name));
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
               { this.state.successfulMissions.length !== 0 ? <List data={this.state.successfulMissions} heading={headerSuccessfulMissions}/> : <Message message={errorNoDataForSuccessfulMissions}/>}
               { this.state.failedMissions.length !== 0 ? <List data={this.state.failedMissions} heading={headerFailedMissions}/> : <Message message={errorNoDataForFailedMissions}/>}
          </div>
        ):(  
          <span>{ this.state.issueWithEndPoint ? <Message message={errorProblemGettingData}/> : <Message message={messageLoadingData}/>}</span>  
        )}
      </React.Fragment>
    );
  }

}

export default App;
