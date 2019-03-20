import React, {Component} from 'react';

import {sendInput, selectGame} from '../../../actions';
import {games} from '../../../helpers/games';

export default class PlayAgain extends Component {

  respond = playAgain=> {
    const {code, playerIndex, handleSubmit} = this.props;
    handleSubmit();
    sendInput(code, playerIndex, playAgain, true);
    if (!playAgain) {
      selectGame(code, games.gameRoom);
    }
  }

  render() {
    return (
      <div className="column">
        <div className="font-large header">Play Again?</div>
        <div className="row">
          <div className="btn btn-half" onClick={()=>this.respond(true)}>Yes</div>
          <div className="btn btn-half" onClick={()=>this.respond(false)}>No</div>
        </div>
      </div>
    )
  }
}