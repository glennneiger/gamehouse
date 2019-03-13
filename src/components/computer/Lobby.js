import React, {Component} from 'react';
import {gameDetails} from '../../actions/games';

import GameSelector from './GameSelector';
import GameDisplay from './GameDisplay';
import PlayerGrid from './PlayerGrid';

export default class Lobby extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selection: 0,
      games: gameDetails
    }
  }

  componentDidMount() {
    const folder = this.state.games[0].folder;
    this.props.playVideo('lobby');
    this.props.playAudio('music','lobby');
    this.props.preloadVideo(`${folder}/intro`);
    this.props.preloadMusic(`${folder}/0`);
  }

  render() {
    const {games, selection} = this.state;
    const {players, code} = this.props.room;
    return (
      <div className="Lobby">
        <div className="row top">
          <div className="left">
          <img  className="logo" src="./assets/img/logo.svg" alt="Party House" />
            <GameSelector games={games} selection={selection} />
          </div>
          <div className="right">
            <div className="room-code">{code}</div>
            <GameDisplay games={games} selection={selection} />
          </div>
        </div>
        <div className="row bottom">
          <PlayerGrid players={players} />
        </div>
      </div>
    )    
  }
} 