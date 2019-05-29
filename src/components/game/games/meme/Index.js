import React, {Component} from 'react';
import {screens, assignCaptionersToMemes} from './helpers';

import Final from './Final';

import {incrementGame, inputRequest} from '../../../../actions';
import {games} from '../../../../helpers/games';
import {testing} from '../../../../helpers/testing';
import Title from './Title';
import Caption from './Caption';
import Vote from './Vote';
import { requests } from '../../../../actions/requestTypes';



const title = games.meme; 

class Meme {
  constructor(index, uploader, image) {
    this.index = index;
    this.uploader = uploader;
    this.image = image;
    this.caption = null;
    this.captioner = null;
    this.votes = 0;
    this.bonusVotes = 0;
  }
}


export default class MemeGame extends Component {

  constructor(props) {
    super(props);
    this.state={
      players: [],
      screen: screens.intro,
      memes: [],
      points: {} // playerIndex => points
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

    let points = {};
    const players = this.props.room.players.slice();
    players.forEach(player=>{
      points[player.index] = 0;
    })

    this.setState({
      screen: screens.intro,
      players,
      points
    });

    incrementGame(title);
  }
  
  startUploadRound =()=> {

    const receiveUpload = (input, playerIndex) => {
      let memes = this.state.memes.slice();
      const images = input.message;
      const numPlayers = this.state.players.length;
      for (let i=0; i<2; i++) {
        let meme = new Meme(memes.length, playerIndex, images[i]);
        memes.push(meme);
      }
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
    const memesReceived = input.message;
    for (let i=0; i<2; i++) {
      if (memesReceived[i]) {
        memes[memesReceived[i].index].caption = memesReceived[i].caption;
      }
    }
    this.setState({memes});
    const captionsReceived = memes.filter(meme=>meme.caption !== null);
    if (captionsReceived.length===this.state.players.length*2) {
      this.switchScreen(screens.vote);
    }
  }

  recordVote = (memeIndex, bonusRound) => {
    if (!memeIndex && memeIndex!==0) return;
    let memes = this.state.memes.slice();
    const increment = bonusRound ? 'bonusVotes' : 'votes';
    memes[memeIndex][increment]++;
    this.setState({memes});
  }

  addPoints = (playerIndex, pointsToAdd) => {
    let {points} = this.state;
    points[playerIndex] += pointsToAdd;
    this.setState({points});
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
    const {switchScreen, playVoice, receiveCaption, recordVote, addPoints} = this;

    if (!room.players.length) room.players=testing.players;

    const props = {
      room,
      switchScreen,
      playVideo,
      playVoice,
      playAudio,
      players,
      memes
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
            <Caption {...props} receiveCaption={receiveCaption} />
            <div>
              <Title lines={['Round Two:','Caption']} />
            </div>
          </div>
        )
      case screens.vote:
        return (
          <Vote {...props} recordVote={recordVote} addPoints={addPoints} />
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