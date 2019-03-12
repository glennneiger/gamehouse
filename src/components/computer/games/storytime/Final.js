import React, {Component} from 'react';

import {inputRequest, watchForChange, receiveSubmission} from '../../../../actions';
import {requests} from '../../../../actions/requestTypes';
import {games} from '../../../../actions/games';
import {screens} from './helpers';

class Final extends Component {

  componentDidMount() {
    this.props.playVideo('storytime/final');
    this.props.playAudio('music', 'storytime/final');
    this.props.preloadVideo('storytime/intro');
    this.props.preloadMusic('storytime/main');

    // ask host (player[hostIndex]) if play again
    let {code, hostIndex} = this.props;
    inputRequest(code, requests.playAgain, null, [hostIndex]);
    watchForChange(code, `players/${hostIndex}/input`, this.handleReceiveInput);
  }

  handleReceiveInput = async data=>{
    let playAgain = await data.toJSON();
    if(playAgain===null) return;

    receiveSubmission(this.props.code, this.props.hostIndex);

    if (playAgain) {
      this.props.switchScreen(screens.intro);
    } else {
      // go back to lobby
      this.props.switchGame(games.gameRoom);
    }
  }

  render() {
    return (
      <div className="StoryTime">
        <div className="center-screen">
          <div className="story-text">
            {this.props.story}
          </div>
        </div>
      </div>
    )
  }
}

export default Final;