import React, { Component } from 'react';

import Audio from './computer/Audio';
import Video from './computer/VideoBackground';

import Landing from './computer/Landing';
import NewRoom from './computer/NewRoom';
import Lobby from './computer/Lobby';
import StoryTime from './computer/games/storytime/Index';
import Speakeasy from './computer/games/speakeasy/Index';

import {createNewRoom, watchForChange, deleteRoom, removeWatcher, watchForChangeInPlayers, getValue} from '../actions';

import {games} from '../helpers/games';


class Computer extends Component {

  constructor(props) {
    super(props);

    this.state={
      game: games.landing,
      gameSelection: 0,
      players: [],
      code: '',
      sound: '',
      onSoundFinish: ()=>{},
      music: '',
      preloadedMusic: '',
      video: '',
      preloadedVideo: '',
      hostIndex: 0
    };

  }

  onUnload = ()=> {
    const {code} = this.state;
    if (code) {
      deleteRoom(code);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onUnload);
  }
  componentDidMount() {
    window.addEventListener("beforeunload", this.onUnload);

    this.init();
  }

  init = ()=> {
    const {code} = this.state;
    if (code) {
      removeWatcher(code, 'game');
      removeWatcher(code, 'players');
    }
    this.setState({
      game: games.landing,
      gameSelection: 0,
      players: [],
      code: '',
      sound: 'stop',
      onSoundFinish: ()=>{},
      music: 'stop',
      preloadedMusic: 'newroom',
      video: 'home',
      preloadedVideo: 'newroom'
    });
  };


  switchGame = game=> {
    this.setState({game});
    this.stopSound();

    if (game===games.newRoom) {
      this.createRoom();
    }
  }

  createRoom = ()=> {
    let code = this.generateCode();
    
    this.setState({code});

    createNewRoom(code);
    watchForChangeInPlayers(code, this.updatePlayers);
    watchForChange(code, 'game', this.updateGame);
  }

  generateCode = ()=> {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      return "TEST";
    }
    let code = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const censored = ['TEST','FUCK','SHIT','DICK','COCK','CUNT','BOOB','SLUT','TWAT','NIGG'];

    while (true) {
      code = "";
      for (let i = 0; i < 4; i++) {
        code += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      if (!censored.includes(code)) break;
    } 
    return code;
  }

  //callback function. Called anytime host selects a game 
  updateGame = game=> {
    if (game===null) return;
    if (game===games.landing) {
      this.init();
    } else {
      this.setState({game});  
    }
  }

  
  //callback function. Called anytime a new player joins or leaves the room
  updatePlayers = async (data, type /* 'added' or 'removed' */)=> {
    const player = await data.toJSON();
    if (player===null) return;

    let {players} = this.state;

    //player joins 
    if (type==='added') {
      players.push(player);

    //player leaves
    } else {
      //if the host leaves, who is the new host?
      if (player.index===this.state.hostIndex) {
        const data = await getValue(this.state.code, 'host/index');
        const hostIndex = await data.toJSON();
        this.setState({hostIndex});
      }
      players = players.filter(el=>el.index !== player.index);
    }
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

  stopSound = ()=> {
    const onSoundFinish = ()=> {};
    this.playAudio('sound', 'stop', onSoundFinish);
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

    const {switchGame, playAudio, playVideo, preloadMusic, preloadVideo, stopSound} = this;
    const room = this.state;
    const props = {room, switchGame, playAudio, playVideo, preloadMusic, preloadVideo, stopSound}

    switch (this.state.game) {

      case games.newRoom:
        return <NewRoom {...props} />

      case games.gameRoom:
        return <Lobby {...props} selection={room.gameSelection} selectGame={gameSelection=>this.setState({gameSelection})} />

      case games.storyTime:
        return <StoryTime {...props} />

      case games.speakEasy:
        return <Speakeasy {...props} />
    
      default:
        return <Landing switchGame={this.switchGame} useAsDevice={this.props.useAsDevice} />
    }
  }
}

export default Computer;
