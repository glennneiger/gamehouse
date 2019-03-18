import React, {Component} from 'react';
import {screens} from './helpers';

import Breakdown from './Breakdown';
import Final from './Final';
import Intro from './Intro';
import Map from './Map';
import Slides from './Slides';
import Owner from './Owner';
import Rounds from './Rounds';

import {incrementGame, inputRequest} from '../../../../actions';
import {games} from '../../../../helpers/games';
import {testing} from '../../../../helpers/testing';
import { requests } from '../../../../actions/requestTypes';


export default class Speakeasy extends Component {

  constructor(props) {
    super(props);
    this.state={
      turn: -1, // -1=rules. 0=set up (who's who). 1=first turn
      screen: screens.intro,
      successes: [],
      owner: null, //index
      agents: [], //indices,
      availableLocations: [], // location indices. set in init()
      location: null // index current location of speakeasy
    }
  }

  componentDidMount() {
    this.init();
  }
  
  init = ()=> { 
    this.props.playAudio('music', 'speakeasy/0');
    this.props.playVideo('speakeasy/intro');

    let {turn} = this.state;
    let next;
    if (turn===-1) { //turn is -1 if you just loaded game from lobby. 
      const next2 = ()=> {this.switchScreen(screens.breakdown)};
      next = ()=> {this.playVoice('intro/1', next2);};
    } else { // turn is > -1 if you're restarting the game to play again.
      turn=0; // in which case, no need to explain the rules again. Skip to turn 0 (first turn)
      next = ()=> {this.switchScreen(screens.map)};
    }
    this.playVoice('intro/0', next);

    this.props.preloadMusic('speakeasy/happy0');
    this.props.preloadVideo('speakeasy/back');

    this.setState({
      turn, 
      screen: screens.intro,
      successes: [],
      availableLocations: [0,1,2,3,4,5,6,7,8]
    });

    incrementGame(games.speakEasy);
  }

  assignOwner = ()=> {
    const {players} = this.props.room;
    const owner = Math.floor(Math.random()*players.length);
    this.setState({owner});
    return owner;
  }

  requestNewLocation = ()=> {
    const {room} = this.props;
    const {owner, availableLocations} = this.state;
    inputRequest(room, requests.speakeasy.newLocation, availableLocations, owner, this.setNewLocation);
  }
  setNewLocation = input => {
    const location = input.message;
    this.setState({location});
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
    this.props.playAudio('audio',`speakeasy/${filename}`, onFinish);
  }

  render() {
    const {turn, successes, screen, owner} = this.state;
    const {playAudio, playVideo, preloadMusic, preloadVideo, room} = this.props;
    const {switchScreen, playVoice, assignOwner, nextTurn, requestNewLocation} = this;

    if (!room.players.length) room.players=testing.players;

    const props = {
      room,
      switchScreen,
      turn,
      playVideo,
      playVoice,
      playAudio,
      preloadVideo,
      preloadMusic,
      successes,
      owner
    }

    switch (screen) {
      case screens.breakdown:
        return (
          <Breakdown
            {...props}
          />
        )
      case screens.final:
        return (
          <Final 
            {...props}
          />
        )
      case screens.intro:
        return (
          <Intro 
            {...props}
          />
        )
      case screens.slides:
        return (
          <Slides 
            {...props}
            nextTurn = {nextTurn}
          />
        )
      case screens.map:
        return (
          <Map 
            {...props}
            requestNewLocation={requestNewLocation}
          />
        )
      case screens.owner:
        return (
          <Owner 
            {...props}
            assignOwner={assignOwner}
          />
        )
        case screens.rounds:
          return (
            <Rounds 
              {...props}
            />
          )
        default:
          return null;
    }
  }
}