import React, {Component} from 'react';
import {screens} from './helpers';

import Final from './Final';

import {incrementGame} from '../../../../actions';
import {games} from '../../../../helpers/games';
import {testing} from '../../../../helpers/testing';
//import { requests } from '../../../../actions/requestTypes';


const title = games.artist; //CHANGE


export default class Title extends Component {

  constructor(props) {
    super(props);
    this.state={
      players: [],
      turn: -1,
      screen: screens.intro,
    }
  }

  componentDidMount() {
    this.init();
  }
  
  init = ()=> { 
    this.props.playAudio('music', '0');
    this.props.playVideo('intro');

    let next = ()=>this.switchScreen(screens.final);

    this.playVoice('intro/0', next);

    const players = this.props.room.players.slice();

    this.setState({
      turn: 0, 
      screen: screens.intro,
      players
    });

    incrementGame(title);
  }


  nextTurn = ()=> {
    let {turn} = this.state;
    turn++;
    this.setState({turn});
  }

  switchScreen = screen=> {
    if (screen===screens.intro) {
      this.init();
      return;
    }
    this.setState({screen});
  }

  playVoice = (filename, onFinish)=> {
    this.props.playAudio('audio',`${title}/${filename}`, onFinish);
  }

  render() {
    const {turn, screen, players} = this.state;
    const {playAudio, playVideo, room} = this.props;
    const {switchScreen, playVoice} = this;

    if (!room.players.length) room.players=testing.players;

    const props = {
      room,
      switchScreen,
      turn,
      playVideo,
      playVoice,
      playAudio,
      players
    }

    switch (screen) {
      case screens.final:
        return (
          <Final
            {...props}
          />
        )
        default:
          return null;
    }
  }
}