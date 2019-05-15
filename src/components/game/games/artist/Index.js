import React, {Component} from 'react';
import {screens} from './helpers';

import Final from './Final';
import Rounds from './Rounds';
import Present from './Present';

import {incrementGame} from '../../../../actions';
import {games} from '../../../../helpers/games';
import {testing} from '../../../../helpers/testing';
import {shuffle} from '../../../../helpers/functions';


const title = games.artist;


export default class Speakeasy extends Component {

  constructor(props) {
    super(props);
    this.state={
      players: [],
      screen: screens.intro,
      playerOrder: [], // e.g. [0, 4, 6, 2, 9] player 0 passes to 4, 4 passes to 6 ... 9 passes to 0
      roundContent: [] // roundContent[round][playerIndex] = string
    }
  }

  componentDidMount() {
    this.init();
  }
  
  init = ()=> { 
    const {playAudio, playVideo, preloadMusic, room} = this.props;
    playAudio('music', `${title}/0`);
    playVideo('intro');

    let next = ()=>this.switchScreen(screens.rounds);

    this.playVoice('intro/0', next);

    preloadMusic(`${title}/1`);

    const players = room.players.slice();

    const playerIndices = players.map(player=>player.index);
    const playerOrder = shuffle(playerIndices);

    this.setState({
      screen: screens.intro,
      players,
      playerOrder,
      roundContent: []
    });

    incrementGame(title);
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

  prevPlayer = playerIndex => {
    const {playerOrder} = this.state;
    let index = playerOrder.indexOf(playerIndex);
    index===0 ? index = playerOrder.length-1 : index--;
    return playerOrder[index];
  }

  recordContent = content=> {
    let roundContent = this.state.roundContent.slice();
    roundContent.push(content);
    this.setState({roundContent});
  }

  render() {
    const {screen, players, roundContent, playerOrder} = this.state;
    const {playAudio, preloadMusic, room} = this.props;
    const {playVoice, prevPlayer, recordContent} = this;

    if (!room.players.length) room.players=testing.players;

    const props = {
      room,
      roundContent,
      playVoice,
      playAudio,
      preloadMusic,
      players,
      recordContent,
      playerOrder,
      title
    }

    switch (screen) {
      case screens.rounds:
        return (
          <Rounds
            {...props}
            prevPlayer={prevPlayer}
            nextScreen={()=>this.setState({screen: screens.present})}
          />
        )
      case screens.present:
        return (
          <Present
            {...props}
            nextScreen={()=>this.setState({screen: screens.final})}
          />
        )
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