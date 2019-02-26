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
      screen: games.JoinRoom, 
      requestMessage: '' //any special message that comes in with an input request
    }

  }

  updateGame = data=> {
    const {game, request} = data.toJSON();
    if (game !== this.state.game) {
      this.setState({screen: game});
    } else if (request) {
      this.setState({screen: request.requestType, requestMessage: request.requestMessage});
    }
  }

  setRoomCode = code=> {
    this.setState({code});
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
    switch (this.state.game) {
      case games.gameRoom:
        return (
          <SelectGame vip={this.state.vip} code={this.state.code} />
        )
      case games.joinRoom:
        return (
          <JoinRoom setRoomCode = {this.setRoomCode} code={this.state.code} setVip={()=>this.setState({vip:true})} />
        )
      case requests.storyTime.writeLine:
        return (
          <StoryTimeWriteLine prompt={this.state.requestMessage} />
        )
      default:
        return (
          <div></div>
        )
     }
  }
}

export default Device;

