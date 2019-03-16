import React, {Component} from 'react';

import Read from './Read';
import Next from './Next';
import Write from './Write';
import Winner from './Winner';
import Final from './Final';

import {selectWriters} from './helpers';

import {getStoryStart, screens, getWritersPerTurn, getPrompt} from './helpers';


import {incrementGame} from '../../../../actions'
import {games} from '../../../../actions/games'

class StoryTime extends Component {

  constructor(props) {
    super(props);
    this.state=({
      screen: screens.intro,
      story: [],
      turn: 0,
      writers: [],
      prompt: '',
      winner: {}
    });
  }


  componentDidMount() {
    this.init();
  }

  init = ()=> { //called when intro is mounted
    const {players} = this.props.room;
    if (!players) this.testing();
    
    this.props.playAudio('music', 'storytime/0');
    this.props.playVideo('storytime/intro');

    const next = ()=> {this.switchScreen(screens.read)};
    this.playVoice('intro/0', next);

    this.props.preloadMusic('storytime/1');
    this.props.preloadVideo('storytime/read00');

    const storyStart = getStoryStart();
    const firstLine = `Once upon a time, there was ${storyStart}.`;

    const numPlayers = players.length;
    const writersPerTurn = getWritersPerTurn(numPlayers); 
    const writers = selectWriters(writersPerTurn, players);
    const prompt = getPrompt(0);
    this.setState({
      writers, 
      story:[firstLine],
      turn: 0, 
      prompt,
      winner: {},
      screen: screens.intro,
    });

    incrementGame(games.storyTime);
  }


  testing = ()=> {
    this.props.room.players = [
      {name: 'Jacob', img: 0},
      {name: 'Brandon', img: 2},
      {name: 'Luis', img: 3},
      {name: 'Karen', img: 4},
      {name: 'Tasheda', img: 5},
      {name: 'Frankie', img: 6},
      {name: 'Ethan', img: 7},
      {name: 'Amy', img: 8},
      {name: 'Jon', img: 9},
      {name: 'Stephen', img: 10}
    ]
  }


  declareWinner = (winner, winningText)=> {
    let {story, prompt} = this.state;

    winningText = winningText.trim();

    // add period at end if needed
    let punctuation = ['.','!','?',';','"',];
    if (!punctuation.includes(winningText.charAt(winningText.length-1))) {
      winningText += '.';
    }

    let newPrompt = getPrompt(story.length);

    story.push(`${prompt}, ${winningText}`);

    this.setState({story, prompt: newPrompt, winner});
  }

  nextTurn = ()=> {
    let {turn} = this.state;
    turn++;
    this.setState({turn});
  };

  switchScreen = screen=> {
    if (screen===screens.intro) {
      this.init();
      return;
    }
    this.setState({screen});
  }

  playVoice = (filename, onFinish)=> {
    this.props.playAudio('audio',`storytime/${filename}`, onFinish);
  }
  playMusic = filename=> {
    this.props.playAudio('music',`storytime-${filename}`)
  }

  render() {

    const {switchScreen, playVoice} = this;
    const {playVideo, playAudio, preloadVideo, preloadMusic, room, switchGame} = this.props;
    const {turn, writers, prompt, story, winner} = this.state;
    const props = {switchScreen, playVoice, playVideo, playAudio, preloadVideo, preloadMusic, turn}

    switch (this.state.screen) {
      case screens.read:
        return (
          <Read 
            story={this.state.turn>0 ? this.state.story.join(' ') : this.state.story[0] + ' And every day,'} 
            {...props}
          />
        )
      case screens.next:
        return (
          <Next 
            writers={writers[turn]} 
            prompt={prompt}
            {...props}
          />
        )
      case screens.write:
        return (
          <Write 
            writers={writers[turn]} 
            story={story.join(' ')} 
            prompt={prompt}
            room={room}
            declareWinner={this.declareWinner}
            {...props}
          />
        )
      case screens.winner:
        return (
          <Winner 
            winner={winner}
            winningText={story[story.length-1]}
            nextTurn={this.nextTurn}
            {...props}
          />
        )
      case screens.final:
        return (
          <Final 
            story={story.join(' ')} 
            code={room.code}
            switchGame={switchGame}
            hostIndex={room.hostIndex}
            {...props}
          />
        )
        default:
          return null;
    }
    
  }
}

export default StoryTime;