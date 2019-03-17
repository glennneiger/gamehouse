import React, {Component} from 'react';
import {gameDetails} from './helpers/games';
import {receiveSubmission, watchForChange, removeWatcher, selectGame} from '../../actions';

import GameSelector from './GameSelector';
import GameDisplay from './GameDisplay';
import PlayerGrid from './PlayerGrid';


export default class Lobby extends Component {

  constructor(props) {
    super(props);

    this.state = {
      games: gameDetails
    }
  }

  componentDidMount() {
    const {selection} = this.props;
    const {games} = this.state;

    this.props.stopSound();
    this.props.playVideo('lobby');
    this.props.playAudio('music','lobby');
    this.preload(games[selection]);

    const {code, hostIndex} = this.props.room;
    watchForChange(code, `players/${hostIndex}/input`, data=>this.handleReceiveCommand(data));
  }

  componentWillUnmount() {
    const {code, hostIndex} = this.props.room;
    removeWatcher(code, `players/${hostIndex}/input`);
  }

  preload = game=> {
    const {id} = game;
    this.props.preloadVideo(`${id}/intro`);
    this.props.preloadMusic(`${id}/0`);
  }

  handleReceiveCommand = async data=> {
    const input = await data.toJSON();
    if (!input) return;
    const {key} = input;
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
      this.preload(games[selection]);
    }
  }

  openGame = ()=> {
    const {games} = this.state;
    const {selection} = this.props;
    const {code, hostIndex} = this.props.room;
    receiveSubmission(code, hostIndex);
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