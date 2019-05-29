


import  React, {Component} from 'react';

import {sendInput} from '../../../../actions';
import {requests} from '../../../../actions/requestTypes';

export default class Speakeasy extends Component {

  constructor(props) {
    super(props);
    this.state = {
      displayIndex: null,
      found: false
    }
    /*
      displayIndex:
        0 - Make Selection 
        1 - You have been invited 
        2 - You have found || not found
    */

    this.locationNames = [
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
  }

  componentDidMount() {
    //set correct display index
    let displayIndex = 0;
    let found = null;
    const {type} = this.props.request;
    if (type===requests.speakeasy.whereToGo) {
      const {invited, alreadyFound} = this.props.request.message;
      if (invited) {
        displayIndex = 1;
      } else if (alreadyFound) {
        displayIndex = 2;
        found=true;
      }
    }
    this.setState({displayIndex, found});
  }

  renderContent = displayIndex=> {
    switch (displayIndex) {
      case 0:
        return this.renderSelectionScreen();
      case 1:
        return this.renderInvitationScreen();
      case 2:
        return this.renderFoundScreen();
      default:
        return null;
    }
  }

  renderSelectionScreen = ()=> {

    const handleSelectLocation = location => {
      const {type} = this.props.request;
      const {code, playerIndex, request} = this.props;
  
      if (type===requests.speakeasy.newLocation) { // choose where speakeasy is
  
        sendInput(code, playerIndex, request, location, true);
        this.props.handleSubmit();
  
      } else { // try to find speakeasy
  
        const {correctLocation} = this.props.request.message;
        const found = location===correctLocation;
        this.setState({displayIndex: 2, found}); 
  
      }
    }
    const availableLocations = Object.values(this.props.request.message.availableLocations);
    let options = [];
    availableLocations.forEach(location => {
      options.push(<div className="btn" key={location} onClick={()=>handleSelectLocation(location)}>{this.locationNames[location]}</div>)
    });
    return <div className="column">
      <div className="font-large header">Select Location:</div>
      {options}
    </div>
  }

  renderInvitationScreen = ()=> {
    const {correctLocation} = this.props.request.message;

    return <div className="column">
      <div className="caption no-padding">You have been invited to</div>
      <div className="font-large header">{`${this.locationNames[correctLocation]}!`}</div>
      <div className="btn" onClick={()=>this.setState({displayIndex: 2, found: true})}>Accept</div>
    </div>

  }

  renderFoundScreen = ()=> {
    // see if found 
    const {found} = this.state;
    const {isAgent} = this.props.request.message;

    const {code, playerIndex, request} = this.props;

    const handleClickOK = ()=> {  
      sendInput(code, playerIndex, request, {found}, true);
      this.props.handleSubmit();
    }
    const handleRaid = raid=> {  
      sendInput(code, playerIndex, request.type, {found, raid}, true);
      this.props.handleSubmit();
    }

    const ok = <div onClick={handleClickOK} className="btn">OK</div>

    const raid = <div className="column">
      <div className="font-large header">Raid?</div>
      <div className="row">
        <div className="btn btn-half" onClick={()=>handleRaid(true)}>Yes</div>
        <div className="btn btn-half" onClick={()=>handleRaid(false)}>No</div>
      </div>
    </div>



    return <div className="column">
      <div className="font-large header">{found ? 'Welcome!' : 'Sorry!'}</div>
      <div className="caption">{found ? 'You have found the speakeasy!' : 'Nothing to see here!' }</div>
      {(isAgent && found) ? raid : ok}
    </div>
  
  }

  render() {

    return <div className="Speakeasy SelectLocation column">
      {this.renderContent(this.state.displayIndex)}
    </div>
  }
}


/*
request

 type: 
  newLocation || whereToGo

 message:

  if newLocation:
    {availableLocations (array)} 

  if whereToGo:
    {availableLocations (array), correctLocation (int), invited (bool), alreadyFound (bool), isAgent (bool)}
*/



  /*
  input (what to send back) if whereToGo = {
    found: boolean  // did they find it? null if they already found it 
    raid: boolean  // do they choose to raid it? null if they're not an agent
  }
  */