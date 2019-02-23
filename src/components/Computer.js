import React, { Component } from 'react';

import Audio from './computer/Audio';
import Landing from './computer/Landing';
import NewRoom from './computer/NewRoom';
import GameRoom from './computer/GameRoom';
import StoryTime from './computer/games/storytime/Index';

import {createNewRoom} from '../actions';

import {games} from '../actions/games';


class Computer extends Component {

  constructor(props) {
    super(props);

    this.state={
      game: games.landing,
      players: [],
      open: false,
      code: '',
      sound: '',
      music: ''
    };

  }

  switchGame = game=> {
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

  playAudio = (type, audio)=> {
    //plays music or sound fx
    let player = '';
    if (type==='music') {
      this.setState({music: audio});
      player = document.getElementById("musicPlayer");
      player.volume = .6; 
    } else {
      this.setState({sound: audio});
      player = document.getElementById("soundPlayer"); 
    }
    player.load();
    player.play();
  }

  render() {
    return (
      <div>
        <Audio sound={this.state.sound} music={this.state.music} />
        {this.renderContent()}
      </div>
    )
  }

  renderContent() {
    switch (this.state.game) {
      case games.newRoom:
        return (
          <NewRoom room={this.state} playAudio={this.playAudio} />
        )
      case games.gameRoom:
        return (
          <GameRoom room={this.state} playAudio={this.playAudio} />
        )
      case games.storyTime:
        return (
          <StoryTime room={this.state} playAudio={this.playAudio} />
        )
      default:
        return (
          <Landing switchGame = {this.switchGame} useAsDevice={this.props.useAsDevice} />
        );
    }
  }
}

export default Computer;
