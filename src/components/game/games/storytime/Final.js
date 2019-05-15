import React, {Component} from 'react';

import {inputRequest} from '../../../../actions';
import {requests} from '../../../../actions/requestTypes';
import {games} from '../../../../helpers/games';
import {screens} from './helpers';

class Final extends Component {

  componentDidMount() {
    this.props.playVideo('final');
    this.props.playAudio('music', 'storytime/final');
    this.props.preloadMusic('storytime/main');

    // ask host (player[hostIndex]) if play again
    const {code, hostIndex} = this.props;
    inputRequest(code, requests.playAgain, null, [hostIndex], this.handleReceiveInput);
  }

  handleReceiveInput = input=>{
    if (input.message===true) { //playAgain
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