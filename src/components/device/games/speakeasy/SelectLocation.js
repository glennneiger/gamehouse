


import  React, {Component} from 'react';

import {sendInput} from '../../../../actions';
import {requests} from '../../../../actions/requestTypes';

export default class Speakeasy extends Component {

  handleSelectLocation = location => {
    const {type} = this.props.request;
    const {code, playerIndex} = this.props;
    if (type===requests.speakeasy.newLocation) {
      sendInput(code, playerIndex, location, true);
      this.props.handleSubmit();
    }
  }

  render() {
    const availLocations = Object.values(this.props.request.message);
    const names = [
      "Joe's Diner",
      "Krazy Kat",
      "Pickle Club",
      "Connie's Inn",
      "Rosie's Cafe",
      "Lucky Lou's",
      "21 Club",
      "Gallagher's Steakhouse",
      "Abby Lounge"
    ];      
    let options = [];
    availLocations.forEach(location => {
      options.push(<div className="btn" key={location} onClick={()=>this.handleSelectLocation(location)}>{names[location]}</div>)
    });

    return <div className="Speakeasy column">
      <div className="font-large">Select Location:</div>
      {options}
    </div>
  }
}
