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
    const {players, code, hostIndex}= this.props.room;
    players.forEach(async player=>{
      if (player.index===hostIndex) {
        await closeRequest(code, player.index);
        watchForChange(code, `players/${hostIndex}/input`, input=>this.handleReceiveCommand(input));
      } else {
        closeRequest(code, player.index);
      }
    });

  }

  componentWillUnmount() {
    const {code, hostIndex} = this.props.room;
    closeRequest(code, hostIndex);
  }

  handleReceiveCommand = input=> {
    if (!input) return;
    const {key} = input.message;
    let {games} = this.state;
    let {selection, selectGame} = this.props;
    
    if (key==='select') {
      const numPlayers = this.props.room.players.length;
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

  openGame = ()=> {
    const {games} = this.state;
    const {selection} = this.props;
    const {code, hostIndex} = this.props.room;
    closeRequest(code, hostIndex);
    selectGame(code, games[selection].id);
  }

  render() {
    const {games} = this.state;
    const {selection} = this.props;
    const {players, code} = this.props.room;
    return (
      <div className="Lobby">
        <div className="row v-85">
          <div className="left">
          <img  className="logo" src="./assets/img/logo.svg" alt="Party House" />
            <GameSelector games={games} selection={selection} />
          </div>
          <div className="right">
            <div className="room-code">{code}</div>
            <GameDisplay games={games} selection={selection} />
          </div>
        </div>
        <div className="row v-15 grid">
          <PlayerGrid players={players} rows={1} hideNames={true}/>
        </div>
      </div>
    )    
  }
} 