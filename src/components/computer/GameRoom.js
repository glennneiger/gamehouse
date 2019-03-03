import React, {Component} from 'react';

export default class GameRoom extends Component {
  componentDidMount() {
    this.props.playVideo('lobby');
    this.props.playAudio('music','lobby');
  }
  render() {
    return (
      <div></div>
    )    
  }
} 