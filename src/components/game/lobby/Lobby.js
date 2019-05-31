import React, {Component} from 'react';
import {gameDetails} from '../../../helpers/games';
import {watchForChange, closeRequest, selectGame} from '../../../actions';

import GameSelector from './GameSelector';
import GameDisplay from './GameDisplay';
import PlayerGrid from '../other/PlayerGrid';


export default class Lobby extends Component {

  constructor(props) {
    super(props);

    this.state = {
      games: gameDetails
    }
  }

  componentDidMount() {

    this.props.playVideo('0');
    this.props.playAudio('music','0');

    // close any open requests, in case we left a game with requests open
    const {players, code}= this.props.room;
    players.forEach(player=>{
      closeRequest(code, player.index);
    });

    watchForChange(code, 'menu', input=>this.handleReceiveCommand(input));
  }

  componentWillUnmount() {
    const {code, hostIndex} = this.props.room;
    closeRequest(code, hostIndex);
  }


  handleReceiveCommand = input=> {
    if (!input) return;
    const {key} = input;
    let {games} = this.state;
    let {selection, selectGame} = this.props;
    
    if (key==='select') {
      this.attemptToOpenGame();
    } else {
      if (key==='down') {
        selection++;
        if (selection===games.length) selection=0;
      } else if (key==='up') {
        selection--;
        if (selection===-1) selection=games.length-1;
      } 
      selectGame(selection);
    }
  }

  //see if there's enough players, then openGame if there is
  attemptToOpenGame = ()=> {
    const numPlayers = this.props.room.players.length;
    const {games} = this.state;
    const {selection} = this.props;
    const {min, max} = games[selection];
    if (numPlayers < min || numPlayers > max) {
      //too few or too many players 
      let playerCount = document.querySelector('.player-count');
      if (playerCount) {
        playerCount.classList.remove('fade');
        playerCount.classList.add('red');
        setTimeout(()=>{
          playerCount.classList.add('fade');
          playerCount.classList.remove('red');
        }, 900);
      }
    } else {
      this.openGame();
    }  
  }

  openGame = ()=> {
    const {games} = this.state;
    const {selection} = this.props;
    const {code, hostIndex} = this.props.room;
    closeRequest(code, hostIndex);
    selectGame(code, games[selection].id);
  }

  render() {
    const {games} = this.state;
    const {selection, selectGame} = this.props;
    const {players, code} = this.props.room;
    return (
      <div className="Lobby">

        <div className="row v-20">
          <div className="top-left">
            <div>Room Code:</div>
            <div className="room-code">{code}</div>
          </div>
          <div className="top-center">
            Join at partyhouse.tv!
          </div>
          <div className="top-right">
            <img  className="logo" src="./assets/img/logo.svg" alt="Party House" />
          </div>
        </div>

        <div className="row v-55">

          <div className="left">
            <GameSelector games={games} selection={selection} previewGame={selectGame} selectGame={this.attemptToOpenGame}/>
          </div>
          <div className="right">
            <GameDisplay games={games} selection={selection} />
          </div>

        </div>
        <div className="v-5"></div>
        <div className="row v-15 grid">
          <PlayerGrid players={players} rows={1} hideNames={true}/>
        </div>
      </div>
    )    
  }
} 


/*

<div className="left">
<img  className="logo" src="./assets/img/logo.svg" alt="Party House" />
  <GameSelector games={games} selection={selection} previewGame={selectGame} selectGame={this.attemptToOpenGame}/>
</div>
<div className="right">
  <div className="room-code">{code}</div>
  <GameDisplay games={games} selection={selection} />
</div>

*/