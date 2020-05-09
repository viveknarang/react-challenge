import React from 'react';
const { v4: uuidv4 } = require('uuid');

var List = (props) => {

    if (props.data.length === 0) throw new Error("renderView receiving empty data array.");

    return(
      <div>
          <hr/>
          <h1>{props.heading}</h1>
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
                      { !props.data[0].launch_success ? <th>Launch Failure Reasons</th>:<th></th> }
                  </tr>
                </thead>
                <tbody>
          {props.data.map((item) => {
            
              return (<tr key={uuidv4()}>
                    <td>{item.flight_number}</td>
                    <td width="200px">{item.mission_name}</td>
                    <td width="200px">{item.launch_year}</td>
                    <td width="200px">{item.launch_date_local}</td>
                    <td width="200px">{item.launch_site.site_name_long}</td>
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

export default List;