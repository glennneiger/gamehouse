import React, {Component} from 'react';
import {screens} from './helpers';

import Breakdowns from './Breakdowns';
import Final from './Final';
import Intro from './Intro';
import Map from './Map';
import Owner from './Owner';
import Rounds from './Rounds';


export default class Speakeasy extends Component {


  switchScreen = screen=> {
    if (screen===screens.intro) {
      this.init();
      return;
    }
    this.setState({screen});
  }
  playVoice = (filename, onFinish)=> {
    this.props.playAudio('audio',`seakeasy/${filename}`, onFinish);
  }

  render() {
    const {turn} = this.state;
    const {playAudio, playVideo, preloadMusic, preloadVideo} = this.props;
    const {switchScreen, playVoice} = this;
    const props = {
      switchScreen,
      turn,
      playVideo,
      playVoice,
      playAudio,
      preloadVideo,
      preloadMusic
    }

    switch (this.state.screen) {
      case screens.breakdowns:
        return (
          <Breakdowns 
            {...props}
          />
        )
      case screens.final:
        return (
          <Final 
            {...props}
          />
        )
      case screens.intro:
        return (
          <Intro 
            {...props}
          />
        )
      case screens.map:
        return (
          <Map 
            {...props}
          />
        )
      case screens.owner:
        return (
          <Owner 
            {...props}
          />
        )
        case screens.rounds:
          return (
            <Rounds 
              {...props}
            />
          )
        default:
          return null;
    }
  }
}