import React, {Component} from 'react';

import {screens} from './helpers';

import {games} from '../../../../helpers/games';
import {inputRequest} from '../../../../actions/';
import {requests} from '../../../../actions/requestTypes';

export default class Final extends Component {


  componentDidMount() {

    const {code, hostIndex} = this.props;
    // ask host (player[hostIndex]) if play again
    inputRequest(code, requests.playAgain, null, hostIndex, this.handleReceiveInput);

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
      <div className="Game Final">
        <div className="v-80"></div>
        <div className="v-20" id="play-again">Play Again?</div>
      </div>
    )
  }
}