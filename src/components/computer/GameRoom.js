import React, {Component} from 'react';

export default class GameRoom extends Component {
  componentDidMount() {
    this.props.playVideo('lobby');
    this.props.playAudio('music','lobby');
    this.props.preloadVideo('storytime/intro');
    this.props.preloadMusic('storytime/0');
  }
  render() {
    return (
      <div></div>
    )    
  }
} 