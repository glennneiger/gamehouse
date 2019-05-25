import React, {Component} from 'react';

import {inputRequest, closeRequest} from '../../../../actions/';
import {requests} from '../../../../actions/requestTypes';
import {screens} from './helpers';

import Timer from '../../other/Timer';

export default class Caption extends Component {

  constructor(props) {
    super(props);
    this.state = {
      startTimer: false,
      captionsReceived: 0
    }
  }


  componentDidMount() {

    const openRound = ()=> {
      const receiveCaption = input => {
        this.props.receiveCaption(input);
        let {captionsReceived} = this.state;
        captionsReceived++;
        this.setState({captionsReceived});
        if (captionsReceived===this.props.players.length*2) {
          this.setState({startTimer:false});
          this.props.switchScreen(screens.vote);
        }
      }

      const {players, room, memes} = this.props;

      let memesToSendToPlayer = {};
      memes.forEach((meme, i)=>{
        const {captioner} = meme;
        if (!memesToSendToPlayer[captioner]) {
          memesToSendToPlayer[captioner] = [];
        }
        memesToSendToPlayer[captioner].push({image: meme.image, index: i});
      });
  
      players.forEach(player => {
        inputRequest(room.code, requests.meme.caption, memesToSendToPlayer[player.index], player.index, receiveCaption);
      });

      this.setState({startTimer:true});
    }

    this.props.playAudio('music', '2');
    this.props.playVideo('caption');
    this.props.playVoice('caption/0', openRound);
  }


  timeOut() {
    const {switchScreen, room, players} = this.props;
    players.forEach(player=>{
      closeRequest(room.code, player.index);
    })
    switchScreen(screens.vote);
  }

  render() {
    return <Timer seconds={90} startTimer={this.state.startTimer} onFinish={this.timeOut} code={this.props.room.code} />;
  }
}