import React, {Component} from 'react';
import Video from './VideoBackground';

export default class GameRoom extends Component {
  componentDidMount() {
    this.props.playAudio('music','lobby');
  }
  render() {
    return (
      <Video video='gameroom' />
    )    
  }
} 