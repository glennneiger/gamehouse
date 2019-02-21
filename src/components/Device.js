import React, { Component } from 'react';

import JoinRoom from './device/JoinRoom';
import SelectGame from './device/SelectGame';

import {connectToRoom} from '../actions';
import {games} from '../actions/games';

class Device extends Component {

  constructor(props) {
    super(props);

    this.state = {vip: false, code: '', game: games.JoinRoom}

  }

  updateGame = data=> {
    const game = data.toJSON().game;
    this.setState({game});
  }

  setRoomCode = code=> {
    this.setState({code});
    connectToRoom(code, this.updateGame);
  }

  render() {
    switch (this.state.game) {
      case games.gameRoom:
        return (
          <SelectGame vip={this.state.vip} code={this.state.code} />
        )
      default:
        return (
          <JoinRoom setRoomCode = {this.setRoomCode} code={this.state.code} setVip={()=>this.setState({vip:true})} />
        );
     }
  }
}

export default Device;

