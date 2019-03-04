import React, {Component} from 'react';

import Intro from './Intro';
import Read from './Read';
import Next from './Next';
import Write from './Write';
import Winner from './Winner';
import Final from './Final';

import {shuffle} from './helpers';

import {storyStarts, screens, getWritersPerTurn, getPrompt} from './helpers';

class StoryTime extends Component {

  constructor(props) {
    super(props);
    let prompt = getPrompt(0);
    this.state=({
      screen: screens.intro,
      story: [],
      turn: 0,
      writers: [],
      prompt,
      winner: {}
    });
  }

  componentDidMount(){

    // this.testing();

    this.props.playAudio('music', 'storytime/0');
    this.props.playVideo('storytime/intro');
    this.props.preloadMusic('storytime/1');

    const rnd = Math.floor(Math.random() * storyStarts.length);
    const firstLine = `Once upon a time, there was ${storyStarts[rnd]}.`;

    const numPlayers = this.props.room.players.length;
    const writersPerTurn = getWritersPerTurn(numPlayers); 
    const writers = this.selectWriters(writersPerTurn);

    this.setState({writers, story:[firstLine]});
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

  selectWriters = writersPerTurn=> {
    // this will determine every writer for every turn (2-4 writers per turn, 8 turns per game)
    let writers = []; //array of arrays [turn][player] 
    const {players} = this.props.room;
  
    // All players are shuffled and added to queue. 
    // As players are taken out of queue, they're added to holding to be used again 
    // When queue gets low, players in holding are reshuffled and added back to queue
    let queue = shuffle(players);
    let holding = []; 
  
    for (let turn = 0; turn < 8; turn++) { //this algorithm works flawlessly!
      writers.push([]); // this array represents one turn. we will fill this array with players 
      let numWriters = writersPerTurn[turn];
      if (queue.length < numWriters) { //if queue is too low to fill turn 
        writers[turn] = queue; // add whatever is in the queue to turn
        const stillNeedToAdd = numWriters - queue.length; // We still need to add this many more
        queue = shuffle(holding).concat(queue); //new queue = shuffle holding, and add to end what we just used
        holding = queue.slice(0, stillNeedToAdd); // add the players we're about to take from queue to holding
        writers[turn] = writers[turn].concat(holding); // add these players to turn
        queue = queue.slice(stillNeedToAdd, queue.length); // take them out of queue 
      } else {
        writers[turn] = queue.slice(0, numWriters);
        holding = holding.concat(writers[turn]);
        queue = queue.slice(numWriters, queue.length);
      }
    }
    return writers;
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
    this.setState({screen});
  }

  playVoice = (filename, onFinish)=> {
    this.props.playAudio('audio',`storytime/${filename}`, onFinish);
  }
  playMusic = filename=> {
    this.props.playAudio('music',`storytime-${filename}`)
  }

  render() {
    switch (this.state.screen) {
      case screens.intro:
        return (
          <Intro 
            switchScreen={this.switchScreen} 
            playVoice={this.playVoice}
            preloadVideo={this.props.preloadVideo}
          />
        )
      case screens.read:
        return (
          <Read 
            switchScreen={this.switchScreen} 
            story={this.state.story.join(' ')} 
            turn={this.state.turn}
            playVideo={this.props.playVideo}
            playVoice={this.playVoice}
            playAudio={this.props.playAudio}
            preloadVideo={this.props.preloadVideo}
            preloadMusic={this.props.preloadMusic}
          />
        )
      case screens.next:
        return (
          <Next 
            switchScreen={this.switchScreen} 
            writers={this.state.writers[this.state.turn]} 
            turn={this.state.turn} 
            prompt={this.state.prompt}
            playVideo={this.props.playVideo}
            playVoice={this.playVoice}
            preloadVideo={this.props.preloadVideo}
          />
        )
      case screens.write:
        return (
          <Write 
            switchScreen={this.switchScreen} 
            writers={this.state.writers[this.state.turn]} 
            story={this.state.story.join(' ')} 
            turn={this.state.turn} 
            prompt={this.state.prompt}
            room={this.props.room}
            declareWinner={this.declareWinner}
            playVideo={this.props.playVideo}
            playVoice={this.playVoice}
            preloadVideo={this.props.preloadVideo}
          />
        )
      case screens.winner:
        return (
          <Winner 
            turn={this.state.turn} 
            switchScreen={this.switchScreen} 
            winner={this.state.winner}
            winningText={this.state.story[this.state.story.length-1]}
            nextTurn={this.nextTurn}
            playVideo={this.props.playVideo}
            playVoice={this.playVoice}
            preloadVideo={this.props.preloadVideo}
          />
        )
      case screens.final:
        return (
          <Final 
            playVideo={this.props.playVideo}
            playVoice={this.playVoice}
            playAudio={this.props.playAudio}
            preloadVideo={this.props.preloadVideo}
            preloadMusic={this.props.preloadMusic}
            story={this.state.story.join(' ')} 
          />
        )
        default:
        return (
          <div></div>
        )
    }
    
  }
}

export default StoryTime;