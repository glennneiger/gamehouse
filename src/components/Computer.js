import React, { Component } from 'react';

import Audio from './computer/Audio';
import Video from './computer/VideoBackground';

import Landing from './computer/Landing';
import NewRoom from './computer/NewRoom';
import GameRoom from './computer/GameRoom';
import StoryTime from './computer/games/storytime/Index';

import {createNewRoom, watchForChange} from '../actions';

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
      onSoundFinish: ()=>{},
      music: '',
      preloadedMusic: '',
      video: '',
      preloadedVideo: ''
    };

  }

  componentDidMount() {
    this.setState({video: 'home', preloadedMusic: 'newroom', preloadedVideo: 'newroom'});
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
    watchForChange(code, 'game', this.updateGame);
  }

  generateCode = ()=> {
    let code = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
    for (var i = 0; i < 4; i++) {
      code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return code;
  }

  //callback function. Called anytime a new player joins the room (is added to the database) 
  updateGame = async data=> {
    let game = await data.toJSON();
    this.setState({game});
  }

  //callback function. Called anytime VIP selects a game
  updatePlayers = async data=> {
    let newPlayer = await data.toJSON(); //players are stored as an object
    let {players} = this.state;
    players.push(newPlayer);
    this.setState({players});
  }

  playAudio = (type, audio, onSoundFinish)=> {
    //plays music or sound fx
    if (type==='music') {
      this.setState({music: audio});
    } else {
      let callback = ()=>{};
      if (onSoundFinish) callback = onSoundFinish;
      this.setState({sound: audio, onSoundFinish: callback});
    }
  }

  preloadMusic = music=> {
    this.setState({preloadedMusic: music})
  }

  playVideo = video=> {
    this.setState({video});
  }

  preloadVideo = video=> {
    this.setState({preloadedVideo: video})
  }

  clearAudio = async ()=>{
    await this.setState({sound: null})
  }

  render() {
    return (
      <div>
        <Audio sound={this.state.sound} music={this.state.music} preload={this.state.preloadedMusic} clearAudio={this.clearAudio} callback={this.state.onSoundFinish} />
        <Video video={this.state.video} preload={this.state.preloadedVideo} />
        {this.renderContent()}
      </div>
    )
  }

  renderContent() {
    switch (this.state.game) {
      case games.newRoom:
        return (
          <NewRoom room={this.state} playAudio={this.playAudio} playVideo={this.playVideo} preloadMusic={this.preloadMusic} preloadVideo={this.preloadVideo} />
        )
      case games.gameRoom:
        return (
          <GameRoom room={this.state} playAudio={this.playAudio} playVideo={this.playVideo} preloadMusic={this.preloadMusic} preloadVideo={this.preloadVideo} />
        )
      case games.storyTime:
        return (
          <StoryTime room={this.state} switchGame={this.switchGame} playAudio={this.playAudio} playVideo={this.playVideo} preloadMusic={this.preloadMusic} preloadVideo={this.preloadVideo} />
        )
      default:
        return (
          <Landing switchGame={this.switchGame} useAsDevice={this.props.useAsDevice} />
        );
    }
  }
}

export default Computer;
