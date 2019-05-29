import React, { Component } from 'react';

import Media from './other/Media';
import Loading from './other/Loading';

import NewRoom from './lobby/NewRoom';
import Lobby from './lobby/Lobby';
import StoryTime from './games/storytime/Index';
import Speakeasy from './games/speakeasy/Index';
import Artist from './games/artist/Index';

import {createNewRoom, watchForChange, deleteRoom, removeWatcher, watchForChangeInPlayers, getValue} from '../../actions';

import {games, gameMediaFiles} from '../../helpers/games';
import Meme from './games/meme/Index';


class Computer extends Component {

  constructor(props) {
    super(props);

    this.state={
      loading: true,
      game: games.newRoom,
      gameSelection: 0,
      players: [],
      code: '',
      onSoundFinish: null,
      music: '',
      preloadedMusic: '',
      hostIndex: 0,
      mediaFiles: {
        folder: null,
        video: {files: [], current: null}, 
        music: {files: [], current: null},
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
      audio: {files: gameMediaFiles[game].audio, current: null},
      music: {files: gameMediaFiles[game].music, current: null}
    }
    this.setState({mediaFiles});
  }


  switchGame = game=> {
    this.setState({game});
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
  updatePlayers = async (player, type /* 'added' or 'removed' */)=> {
    const getNewHost = async ()=> {
      const hostIndex = await getValue(this.state.code, 'host/index');
      this.setState({hostIndex});
    }

    let {players} = this.state;

    //player joins 
    if (type==='added') {
      players.push(player);

    //player leaves
    } else {
      //if the host leaves, who is the new host?
      if (player.index===this.state.hostIndex) {
        getNewHost();
      }
      players = players.filter(el=>el.index !== player.index);
    }
    this.setState({players});
  }


  playAudio = (type, audio, onSoundFinish)=> {
    //plays music or sound fx

    let {mediaFiles} = this.state;

    if (type==='music') {
      mediaFiles.music.current = audio; 
      this.setState({mediaFiles});
    } else {
      let callback = null;
      if (onSoundFinish) callback = onSoundFinish;
      mediaFiles.audio.current = audio; 
      this.setState({mediaFiles, onSoundFinish: callback});
    }
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

  render() {
    const {video, music, audio, folder} = this.state.mediaFiles;
    return (
      <div className="game-display">
        <Media 
          videos={video.files} 
          musics={music.files} 
          audios={audio.files} 
          folder={folder} 
          curVideo={video.current} 
          curMusic={music.current} 
          curAudio={audio.current} 
          handleFinishLoading={()=>this.setState({loading: false})}  
          callback={this.state.onSoundFinish}
        />
        {this.renderContent()}
      </div>
    )
  }

  renderContent() {
    if (this.state.loading) return <Loading />

    const {switchGame, playAudio, playVideo, preloadMusic, preloadVideo} = this;
    const {game, gameSelection, players, code, hostIndex} = this.state;
    const room = {game, gameSelection, players, code, hostIndex};
    const props = {room, switchGame, playAudio, playVideo, preloadMusic, preloadVideo}

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

      case games.meme:
        return <Meme {...props} />
    
      default:
        return null
    }
  }
}

export default Computer;
