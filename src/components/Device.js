import React, { Component } from 'react';

import JoinRoom from './device/JoinRoom';
import SelectGame from './device/SelectGame';
import StoryTimeWriteLine from './device/StoryTimeWriteLine';

import Logo from './device/Logo';

import {connectToRoom} from '../actions';
import {games} from '../actions/games';
import {requests} from '../actions/requestTypes';

class Device extends Component {

  constructor(props) {
    super(props);

    this.state = {
      vip: false, 
      code: '',  //room code
      playerIndex: 0,
      screen: games.newRoom, 
      requestMessage: '' //any special message that comes in with an input request
    }

  }

  updateGame = async data=> {
    const {game, players} = await data.toJSON();
    let request = '';
    if (players[this.state.playerIndex].request) {
      request = players[this.state.playerIndex].request;
    }
    if (!request && game !== this.state.screen) {
      this.setState({screen: game});
    } else if (request && request.requestType !== this.state.screen) {
      this.setState({screen: request.requestType, requestMessage: request.requestMessage});
    }
  }

  setRoom = (code, playerIndex)=> {
    this.setState({code, playerIndex});
    connectToRoom(code, this.updateGame);
  }

  render() {
    return (
      <div>
        <Logo />
        {this.renderContent()}
      </div>
    )
  }

  renderContent = ()=> {
    switch (this.state.screen) {
      case games.gameRoom:
        return (
          <SelectGame vip={this.state.vip} code={this.state.code} />
        )
      case games.newRoom:
        return (
          <JoinRoom setRoom = {this.setRoom} code={this.state.code} setVip={()=>this.setState({vip:true})} />
        )
      case requests.storyTime.writeLine:
        return (
          <StoryTimeWriteLine prompt={this.state.requestMessage} code={this.state.code} playerIndex={this.state.playerIndex} handleSubmit={()=>this.setState({screen: games.storyTime})}/>
        )
      default:
        return (
          <div></div>
        )
     }
  }
}

export default Device;

