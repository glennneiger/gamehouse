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

    // ask host (player[0]) if play again
    let {code} = this.props;
    inputRequest(code, requests.playAgain, null, [0]);
    watchForChange(code, 'players/0/input', this.handleReceiveInput);
  }

  handleReceiveInput = async data=>{
    let playAgain = await data.toJSON();
    if(playAgain===null) return;

    receiveSubmission(this.props.code, 0);

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