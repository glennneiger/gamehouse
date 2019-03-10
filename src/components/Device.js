import React, { Component } from 'react';

import JoinRoom from './device/JoinRoom';
import SelectGame from './device/SelectGame';
import PlayAgain from './device/PlayAgain';
import StoryTimeWriteLine from './device/StoryTimeWriteLine';
import StoryTimeVote from './device/StoryTimeVote';
import LeaveParty from './device/LeaveParty';

import Ad from './device/Ad';

import Logo from './device/Logo';

import {watchForChange, getValue} from '../actions';
import {games} from '../actions/games';
import {requests} from '../actions/requestTypes';

class Device extends Component {

  constructor(props) {
    super(props);

    this.state = {
      vip: false,  // are you the VIP 
      vipName: '',
      entered: false, // have you entered room 
      code: '',  //room code
      playerIndex: 0,
      screen: games.newRoom, 
      requestMessage: '', //any special message that comes in with an input request,
      showLeaveMenu: false
    }

  }

  componentDidMount() {
    //this class will turn body bg color white instead of black
    document.querySelector('body').classList.add('device');

    // see if player is already in room (if they refreshed browser)
    const roomCode = localStorage.getItem('roomCode');
    if (roomCode) {
      this.refreshGame(roomCode);
    }
  }

  // called if a player refreshes browser
  refreshGame = async (code)=> {
    const playerIndex = localStorage.getItem('playerIndex');
    const vipName = localStorage.getItem('vipName');

    this.setRoom(code, playerIndex, vipName);

    let data = await getValue(code, `players/${playerIndex}/request`);
    const request = await data.toJSON();
    console.log(request);
    if (request) {
      this.setState({screen: request.requestType, requestMessage: request.requestMessage});
    } else {
      data = await getValue(code, 'game');
      const game = await data.toJSON();
      console.log(game);
      this.setState({screen: game});
    }
  }

  updateGame = async data=> {
    const game = await data.toJSON();
    this.setState({screen: game});
  }

  updateRequest = async data=> {
    const request = await data.toJSON();
    if (!request) {
      return;
    }
    this.setState({screen: request.requestType, requestMessage: request.requestMessage});
  }

  setRoom = (code, playerIndex, vipName)=> {
    const vip = playerIndex===0; 
    this.setState({code, playerIndex, entered: true, vipName, vip});
    watchForChange(code, 'game', this.updateGame);
    watchForChange(code, `players/${playerIndex}/request`, this.updateRequest);

    // save roomCode and playerIndex in localStorage 
    // in case a player refreshes browser, it can automatically go back into room
    localStorage.setItem('roomCode', code);
    localStorage.setItem('playerIndex', playerIndex);
    localStorage.setItem('vipName', vipName);
  }

  handleClickLeave = showLeaveMenu=> {
    this.setState({showLeaveMenu});
  }

  handleLeaveRoom = ()=> {
    localStorage.clear();
    this.setState({
      vip: false,
      vipName: '',
      entered: false,
      code: '', 
      playerIndex: 0,
      screen: 'thank-you', 
      requestMessage: '',
      showLeaveMenu: false
    });
  }

  render() {
    return (
      <div>
        <Logo />
        {this.renderContent()}
        <LeaveParty entered = {this.state.entered} handleClickLeave={this.handleClickLeave} handleLeaveRoom={this.handleLeaveRoom} clicked={this.state.showLeaveMenu} />
      </div>
    )
  }

  renderContent = ()=> {
    const {vip, code, entered, vipName, requestMessage, playerIndex, screen, showLeaveMenu} = this.state;
    
    if (showLeaveMenu) return null;

    switch (screen) {
      case games.gameRoom:
        return (
          <SelectGame vip={vip} code={code} />
        )
      case games.newRoom:
        return (
          <JoinRoom setRoom = {this.setRoom} code={code} entered={entered} vipName={vipName} />
        )
      case requests.storyTime.writeLine:
        return (
          <StoryTimeWriteLine prompt={requestMessage} code={code} playerIndex={playerIndex} handleSubmit={()=>this.setState({screen: games.storyTime})}/>
        )
      case requests.storyTime.vote:
        return (
          <StoryTimeVote options={requestMessage} code={code} playerIndex={playerIndex} handleSubmit={()=>this.setState({screen: games.storyTime})}/>
        )
      case requests.playAgain:
        return (
          <PlayAgain code={code} />
        )
      case 'thank-you':
        return (
          <div className="column">
            <p>Thank you for playing!</p>
            <Ad />
            <div className="btn" onClick={()=>this.setState({screen: games.newRoom})}>Join New Game</div>
          </div>
        )
      default:
        return (
          <Ad />
        )
     }
  }
}

export default Device;

