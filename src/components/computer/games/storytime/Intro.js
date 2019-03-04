import React, {Component} from 'react';
import {screens} from './helpers';

class Intro extends Component {

  componentDidMount() {
    this.props.preloadVideo('storytime/read00');

    this.props.playVoice('intro/0', this.nextScreen);
  }

  nextScreen = ()=> {
    this.props.switchScreen(screens.read);
  }
  
  render() {
    return (
      <div></div>
    )
  }
}

export default Intro;