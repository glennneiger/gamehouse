import React, {Component} from 'react';
import {screens, assignCaptionersToMemes} from './helpers';

import Final from './Final';

import {incrementGame, inputRequest} from '../../../../actions';
import {games} from '../../../../helpers/games';
import {testing} from '../../../../helpers/testing';
import Title from './Title';
import Caption from './Caption';
import { requests } from '../../../../actions/requestTypes';



const title = games.meme; 


export default class Meme extends Component {

  constructor(props) {
    super(props);
    this.state={
      players: [],
      screen: screens.intro,
      memes: []
    }
  }

  componentDidMount() {
    this.init();
  }
  
  init = ()=> { 
    this.props.playAudio('music', '0');
    this.props.playVideo('intro');

    let next = ()=>this.switchScreen(screens.upload);

    this.playVoice('intro/0', next);

    const players = this.props.room.players.slice();

    this.setState({
      screen: screens.intro,
      players
    });

    incrementGame(title);
  }

  
  startUploadRound =()=> {

    const receiveUpload = (input, playerIndex) => {
      let memes = this.state.memes.slice();
      const image = input.message;
      const numPlayers = this.state.players.length;
      memes.push({uploader: playerIndex, image, caption: null, captioner: null});
      this.setState({memes});
      if (memes.length === numPlayers *2) {
        const {players} = this.state;
        memes = assignCaptionersToMemes(memes, players);
        this.setState({memes});
        this.switchScreen(screens.caption);
      }
    }

    const openRound = ()=> {
      const {room} = this.props;
      const {players} = this.state;
  
      players.forEach(player => {
        inputRequest(room.code, requests.meme.upload, null, player.index, receiveUpload);
      });
    }

    this.props.playAudio('music', '1');
    this.props.playVideo('upload');
    this.playVoice('upload/0', openRound);
  }


  receiveCaption = (input) => {
    let memes = this.state.memes.slice();
    const memeReceived = input.message;
    memes[memeReceived.index].caption = memeReceived.caption;
    this.setState({memes});
  }



  switchScreen = screen=> {
    if (screen===screens.intro) {
      this.init();
      return;
    } else if (screen===screens.upload) {
      this.startUploadRound();
    }
    this.setState({screen});
  }

  playVoice = (filename, onFinish)=> {
    this.props.playAudio('audio', filename, onFinish);
  }

  render() {
    const {screen, players, memes} = this.state;
    const {playAudio, playVideo, room} = this.props;
    const {switchScreen, playVoice, receiveCaption} = this;

    if (!room.players.length) room.players=testing.players;

    const props = {
      room,
      switchScreen,
      playVideo,
      playVoice,
      playAudio,
      players
    }

    switch (screen) {
      case screens.intro:
        return (
          <Title lines={['Dank U']} />
        )
      case screens.upload:
        return (
          <div id="upload">
            <Title lines={['Round One:','Upload']} />
          </div>
        )
      case screens.caption:
        return (
          <div id="caption">
            <Caption {...props} memes={memes} receiveCaption={receiveCaption} />
            <div>
              <Title lines={['Round Two:','Caption']} />
            </div>
          </div>
        )
      case screens.vote:
        return (
          <Title lines={['Round Three:','Vote']} />
        )
      case screens.final:
        return (
          <Final
            {...props}
          />
        )
        default:
          return null;
    }
  }
}