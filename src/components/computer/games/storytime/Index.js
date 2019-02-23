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
  'there was a little boy named Chuck, who lived in a cabin in the woods with his grandmother','there was a mouse named Whiskers who loved peanut butter','there was a princess named Victoria who lived in a castle'
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
    let rnd = Math.floor(Math.random() * storyStarts.length);
    let firstLine = `Once upon a time, ${storyStarts[rnd]}.`;
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
          <Read switchScreen={this.switchScreen} story={this.state.story}/>
        )
        default:
        return (
          <div></div>
        )
    }
    
  }
}

export default StoryTime;