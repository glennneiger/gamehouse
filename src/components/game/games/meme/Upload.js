import React, {Component} from 'react';

import {inputRequest, closeRequest} from '../../../../actions/';
import {requests} from '../../../../actions/requestTypes';
import {screens} from './helpers';

import Timer from '../../other/Timer';

export default class Upload extends Component {

  constructor(props) {
    super(props);
    this.state = {
      startTimer: false
    }
  }


  componentDidMount() {

    const openRound = ()=> {
      const {players, room} = this.props;
  
      players.forEach(player => {
        inputRequest(room.code, requests.meme.upload, null, player.index, this.props.receiveUpload);
      });

      this.setState({startTimer:true});
    }

    this.props.playAudio('music', '1');
    this.props.playVideo('upload');
    this.props.playVoice('upload/0', openRound);
  }

  timeOut() {
    const {switchScreen, room, players} = this.props;
    players.forEach(player=>{
      closeRequest(room.code, player.index);
    })
    switchScreen(screens.caption);
  }

  render() {
    return <Timer seconds={120} startTimer={this.state.startTimer} onFinish={this.timeOut} code={this.props.room.code} />;
  }
}