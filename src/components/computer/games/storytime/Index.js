import React, {Component} from 'react';

import Intro from './Intro';
import Read from './Read';

export const screens = {
  intro: 'intro',
  read: 'read',
  rules: 'rules',
  next: 'next',
  write: 'write',
  winner: 'winner',
  scores: 'scores',
  final: 'final'
}

const storyStarts = [
  'a little boy named Chuck, who lived in a cabin in the woods with his grandmother',
  'a mouse named Whiskers who loved peanut butter',
  'a princess named Victoria who lived in a castle',
  'a frog named Hopper who lived in a swamp',
  'a fairy named Belinda who could grant wishes',
  'a dog named Fluffy who lived in a house in the suburbs',
  'a dog named Max who lived on a farm'
]

class StoryTime extends Component {

  constructor(props) {
    super(props);

    this.state=({
      screen: screens.intro,
      story: []
    });
  }

  componentDidMount(){
    this.props.playAudio('music', 'storytime');
    let rnd = Math.floor(Math.random() * storyStarts.length);
    let firstLine = `Once upon a time, there was ${storyStarts[rnd]}.`;
    this.setState({story:[firstLine]});
  }

  switchScreen = screen=> {
    this.setState({screen});
  }

  render() {
    switch (this.state.screen) {
      case screens.intro:
        return (
          <Intro switchScreen={this.switchScreen} />
        )
      case screens.read:
        return (
          <Read switchScreen={this.switchScreen} story={this.state.story.join(' ')}/>
        )
        default:
        return (
          <div></div>
        )
    }
    
  }
}

export default StoryTime;