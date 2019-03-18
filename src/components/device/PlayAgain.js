import React, {Component} from 'react';

import {sendInput, selectGame} from '../../actions';
import {games} from '../../helpers/games';

export default class PlayAgain extends Component {

  respond = playAgain=> {
    const {code, playerIndex} = this.props;
    sendInput(code, playerIndex, playAgain, true);
    if (!playAgain) {
      selectGame(code, games.gameRoom);
    }
  }

  render() {
    return (
      <div className="column">
        <p>Play Again?</p>
        <div className="btn" onClick={()=>this.respond(true)}>Yes</div>
        <div className="btn" onClick={()=>this.respond(false)}>No</div>
      </div>
    )
  }
}