import React, { Component } from 'react';

import Audio from './media/Audio';
import Video from './media/VideoBackground';
import Loading from './media/Loading';

import NewRoom from './lobby/NewRoom';
import Lobby from './lobby/Lobby';
import StoryTime from './games/storytime/Index';
import Speakeasy from './games/speakeasy/Index';
import Artist from './games/artist/Index';

import {createNewRoom, watchForChange, deleteRoom, removeWatcher, watchForChangeInPlayers, getValue} from '../../actions';

import {games, gameMediaFiles} from '../../helpers/games';


class Computer extends Component {

  constructor(props) {
    super(props);

    this.state={
      loading: true,
      game: games.newRoom,
      gameSelection: 0,
      players: [],
      code: '',
      sound: '',
      onSoundFinish: null,
      music: '',
      preloadedMusic: '',
      hostIndex: 0,
      mediaFiles: {
        folder: null,
        video: {files: [], current: null}, 
        audio: {files: [], current: null}
      }
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
    const {code} = this.state;
    if (code) {
      deleteRoom(code);
      removeWatcher(code, 'game');
      removeWatcher(code, 'players');
    }
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.onUnload);
    this.createRoom();
  }

  loadMediaFiles = game=> {
    let mediaFiles = {
      folder: game,
      video: {files: gameMediaFiles[game].video, current: null}, 
      audio: {files: gameMediaFiles[game].audio, current: null}
    }
    console.log(game);
    console.log(mediaFiles.video.files);
    this.setState({mediaFiles});
  }


  switchGame = game=> {
    this.setState({game});
    this.stopSound();
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
      this.props.history.push('/');
    } else {
      this.setState({game, loading: true});
      this.loadMediaFiles(game);  
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
        const hostIndex = await getValue(this.state.code, 'host/index');
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
      let callback = null;
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
    let {mediaFiles} = this.state;
    mediaFiles.video.current = video; 
    this.setState({mediaFiles});
  }

  preloadVideo = video=> {
    this.setState({preloadedVideo: video})
  }

  clearAudio = async ()=>{
    await this.setState({sound: null})
  }

  handleFinishLoadingMedia = () => {
    this.setState({loading: false});
  }

  render() {
    const {video, folder} = this.state.mediaFiles;
    return (
      <div className="game-display">
        <Audio sound={this.state.sound} music={this.state.music} preload={this.state.preloadedMusic} clearAudio={this.clearAudio} callback={this.state.onSoundFinish} />
        <Video files={video.files} folder={folder} curVideo={video.current} handleFinishLoading={this.handleFinishLoadingMedia} />
        {this.renderContent()}
      </div>
    )
  }

  renderContent() {
    if (this.state.loading) return <Loading />

    const {switchGame, playAudio, playVideo, preloadMusic, preloadVideo, stopSound} = this;
    const {game, gameSelection, players, code, hostIndex} = this.state;
    const room = {game, gameSelection, players, code, hostIndex};
    const props = {room, switchGame, playAudio, playVideo, preloadMusic, preloadVideo, stopSound}

    switch (game) {

      case games.newRoom:
        return <NewRoom {...props} />

      case games.gameRoom:
        return <Lobby {...props} selection={room.gameSelection} selectGame={gameSelection=>this.setState({gameSelection})} />

      case games.storyTime:
        return <StoryTime {...props} />

      case games.speakEasy:
        return <Speakeasy {...props} />

      case games.artist:
        return <Artist {...props} />

      // case games.dankU:
      //   return <DankU {...props} />
    
      default:
        return null
    }
  }
}

export default Computer;
