import React, {Component} from 'react';
import {screens} from './helpers';

import Final from './Final';

import {incrementGame} from '../../../../actions';
import {games} from '../../../../helpers/games';
import {testing} from '../../../../helpers/testing';
import Title from './Title';
import Upload from './Upload';
import Caption from './Caption';
//import { requests } from '../../../../actions/requestTypes';



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


  receiveUpload = (image, playerIndex) => {
    let memes = this.state.memes.slice();
    memes.push({uploader: playerIndex, image, caption: null, captioner: null});
    this.setState({memes});
  }

  switchScreen = screen=> {
    if (screen===screens.intro) {
      this.init();
      return;
    }
    this.setState({screen});
  }

  playVoice = (filename, onFinish)=> {
    this.props.playAudio('audio', filename, onFinish);
  }

  render() {
    const {screen, players} = this.state;
    const {playAudio, playVideo, room} = this.props;
    const {switchScreen, playVoice, receiveUpload} = this;

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
          <Title lines={['Meme U']} />
        )
      case screens.upload:
        return (
          <div>
            <Upload {...props} receiveUpload={receiveUpload} />
            <Title lines={['Round One:','Upload']} />
          </div>
        )
      case screens.caption:
        return (
          <div>
            <Caption {...props} />
            <Title lines={['Round Two:','Caption']} />
          </div>
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