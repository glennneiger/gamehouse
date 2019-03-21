import React, {Component} from 'react';

import Read from './Read';
import Next from './Next';
import Write from './Write';
import Winner from './Winner';
import Final from './Final';

import {getStoryStart, screens, getWritersPerTurn, getPrompt, selectWriters} from './helpers';


import {incrementGame} from '../../../../actions'
import {games} from '../../../../helpers/games'

class StoryTime extends Component {

  constructor(props) {
    super(props);
    this.state=({
      screen: screens.intro,
      story: [],
      turn: 0,
      writers: [],
      prompt: '',
      winner: {},
      restart: false
    });
  }


  componentDidMount() {
    this.init();
  }

  init = ()=> { 
    const {players} = this.props.room;
    
    this.props.playAudio('music', 'storytime/0');
    this.props.playVideo('storytime/intro');

    const next = ()=> {this.switchScreen(screens.read)};
    
    let restart = false;
    let voice = 0; 
    if (this.state.turn > 0) {
      voice = 1; //shorter intro if you're restarting the game
      restart = true;
    }
    this.playVoice(`intro/${voice}`, next);

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
      restart
    });

    incrementGame(games.storyTime);
  }


  declareWinner = (winner, winningText)=> {
    let {story, prompt, turn} = this.state;

    winningText = winningText.trim();

    // add period at end if needed
    let punctuation = ['.','!','?',';','"',];
    if (!punctuation.includes(winningText.charAt(winningText.length-1))) {
      winningText += '.';
    }


    story.push(`${prompt}, ${winningText}`);

    if (turn < 7) prompt = getPrompt(story.length-1);

    this.setState({story, prompt, winner});
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
        let winningText = story[story.length-1];
        if (turn===7) {
          winningText = winningText.slice(31);
          winningText = winningText.charAt(0).toUpperCase() + winningText.slice(1);
        }
        return (
          <Winner 
            winner={winner}
            winningText={winningText}
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