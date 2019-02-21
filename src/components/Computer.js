import React, { Component } from 'react';

import Landing from './computer/Landing';
import NewRoom from './computer/NewRoom';
import GameRoom from './computer/GameRoom';

import {createNewRoom} from '../actions';

import {games} from '../actions/games';


class Computer extends Component {

  constructor(props) {
    super(props);

    this.state={
      game: games.landing,
      players: [],
      open: false,
      code: ''
    };

    this.switchGame = this.switchGame.bind(this);
  }

  switchGame(game) {
    this.setState({game});

    if (game===games.newRoom) {
      this.createRoom();
    }
  }

  createRoom = ()=> {
    let code = this.generateCode();
    
    this.setState({code});

    createNewRoom(code, this.updatePlayers);
  }

  generateCode = ()=> {
    let code = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
    for (var i = 0; i < 4; i++) {
      code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return code;
  }

  //callback function. Called anytime a new player joins the room (is added to the database) OR VIP selects a game
  updatePlayers = data=> {
    let room = data.toJSON();
    let playersObj = room.players; //players are stored as an object
    let {open, game} = room;

    if (!playersObj) {
      return;
    }
    let players = []; //convert obj to arr
    for (let i = 0; i < 10; i++) {
      if (playersObj[i]) {
        players.push(playersObj[i]);
      } else {
        i=10;
      }
    }
    this.setState({players, open, game});
  }

  render() {
    switch (this.state.game) {
      case games.newRoom:
        return (
          <NewRoom room={this.state} />
        )
      case games.gameRoom:
        return (
          <GameRoom room={this.state} />
        )
      default:
        return (
          <Landing switchGame = {this.switchGame} />
        );
     }
  }
}

export default Computer;
