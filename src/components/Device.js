import React, { Component } from 'react';

import JoinRoom from './device/JoinRoom';
import SelectGame from './device/SelectGame';
import PlayAgain from './device/PlayAgain';
import StoryTimeWriteLine from './device/StoryTimeWriteLine';
import StoryTimeVote from './device/StoryTimeVote';

import Ad from './device/Ad';

import Logo from './device/Logo';

import {watchForChange} from '../actions';
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

  setRoom = (code, playerIndex)=> {
    this.setState({code, playerIndex});
    watchForChange(code, 'game', this.updateGame);
    watchForChange(code, `players/${playerIndex}/request`, this.updateRequest);
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
      case requests.storyTime.vote:
        return (
          <StoryTimeVote options={this.state.requestMessage} code={this.state.code} playerIndex={this.state.playerIndex} handleSubmit={()=>this.setState({screen: games.storyTime})}/>
        )
      case requests.playAgain:
        return (
          <PlayAgain code={this.state.code} />
        )
      default:
        return (
          <Ad />
        )
     }
  }
}

export default Device;

